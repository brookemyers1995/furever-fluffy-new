(() => {
  'use strict';
  const TAG = 'fureverfluf0e-20';
  const KEY = 'furever-fluffy-shop-cart-v2';
  const MAX_ITEMS = 20;
  const cards = [...document.querySelectorAll('.product-card')];
  const catalog = new Map(cards.filter(c => c.querySelector('[data-add-asin]')).map(c => [c.dataset.asin, {name:c.querySelector('h3').textContent, category:c.dataset.category}]));
  const items = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const status = document.getElementById('cart-status');
  const checkout = document.getElementById('amazon-checkout');
  const search = document.getElementById('shop-search');
  const clear = document.getElementById('clear-cart');
  const result = document.getElementById('shop-results');
  if (!items || !checkout) return;
  let cart = new Map();
  let filter = 'all';
  let saved = true;
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(stored)) for (const row of stored) {
      if (!Array.isArray(row) || row.length !== 2) continue;
      const [asin, qty] = row;
      if (catalog.has(asin) && Number.isInteger(qty) && qty > 0 && qty <= 99 && (cart.has(asin) || cart.size < MAX_ITEMS)) cart.set(asin,qty);
    }
  } catch (_) { saved = false; }
  function say(message) {status.textContent = message;}
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify([...cart])); }
    catch (_) { saved=false; say('Your picks work for this visit, but this browser cannot save them.'); }
  }
  function button(text, label, handler) {
    const el=document.createElement('button'); el.type='button';el.textContent=text;el.setAttribute('aria-label',label);el.addEventListener('click',handler);return el;
  }
  function change(asin, delta) {
    const old = cart.get(asin) || 0;
    if (!old && cart.size >= MAX_ITEMS) {say('Amazon handoff supports up to 20 different products per batch. Send these picks first, then start another batch.');return;}
    const next = Math.max(0, Math.min(99, old + delta));
    if (next) cart.set(asin,next); else cart.delete(asin);
    persist(); render();
    if (saved) say(next ? `${catalog.get(asin).name}: ${next} selected.` : `${catalog.get(asin).name} removed.`);
  }
  function render() {
    items.replaceChildren();
    if (!cart.size) {const p=document.createElement('p');p.textContent='Your cart is waiting for a little tail-wagging joy.';items.append(p);}
    for (const [asin,qty] of cart) {
      const data=catalog.get(asin), row=document.createElement('div');row.className='cart-item';
      const a=document.createElement('a');a.href=`https://www.amazon.com/dp/${asin}?tag=${TAG}`;a.target='_blank';a.rel='sponsored noopener noreferrer';a.textContent=data.name;
      const controls=document.createElement('div');controls.className='cart-item-controls';
      const minus=button('−',`Decrease quantity of ${data.name}`,()=>change(asin,-1));
      const quantity=document.createElement('span');quantity.textContent=`Quantity: ${qty}`;
      const plus=button('+',`Increase quantity of ${data.name}`,()=>change(asin,1));plus.disabled=qty>=99;
      const remove=button('Remove',`Remove ${data.name}`,()=>{cart.delete(asin);persist();render();say(`${data.name} removed.`);});
      controls.append(minus,quantity,plus,remove);row.append(a,controls);items.append(row);
    }
    count.textContent=[...cart.values()].reduce((a,b)=>a+b,0);
    checkout.disabled=!cart.size;clear.disabled=!cart.size;
  }
  function applyFilter() {
    const needle=search.value.trim().toLocaleLowerCase();let shown=0;
    for (const card of cards) {
      const matches=(filter==='all'||card.dataset.category===filter)&&(!needle||card.querySelector('.product-content').textContent.toLocaleLowerCase().includes(needle));
      card.hidden=!matches;if(matches)shown++;
    }
    result.textContent=`${shown} of ${cards.length} picks${filter==='all'?'':` in ${filter}`}${needle?' matching your search':''}.`;
  }
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    filter=b.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(x=>{const active=x===b;x.classList.toggle('selected',active);x.setAttribute('aria-pressed',String(active));});
    applyFilter();
  }));
  search.addEventListener('input',applyFilter);
  document.querySelectorAll('[data-add-asin]').forEach(b=>b.addEventListener('click',()=>change(b.dataset.addAsin,1)));
  clear.addEventListener('click',()=>{cart.clear();persist();render();say('Your picks have been cleared.');});
  checkout.addEventListener('click',()=>{
    if (!cart.size) return;
    const url=new URL('https://www.amazon.com/gp/aws/cart/add.html');
    url.searchParams.set('AssociateTag',TAG);url.searchParams.set('tag',TAG);
    let i=1;
    for (const [asin,qty] of cart) {url.searchParams.set(`ASIN.${i}`,asin);url.searchParams.set(`Quantity.${i}`,String(qty));i++;}
    const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='sponsored noopener noreferrer';document.body.append(a);a.click();a.remove();
    say('Amazon has opened for review. If Amazon cannot accept the batch, use the individual product links in Your picks.');
  });
  render();applyFilter();
})();
