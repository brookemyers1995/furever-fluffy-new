(() => {
  const root = document.createElement('div');
  root.className = 'aries-widget';
  root.innerHTML = `
    <section class="aries-panel" id="aries-panel" aria-label="Chat with Aries" hidden>
      <header class="aries-heading"><span class="aries-mini" aria-hidden="true">🐶</span><div><strong>Aries the chat bot</strong><small>Furever Fluffy helper</small></div><button class="aries-close" type="button" aria-label="Close Aries chat">×</button></header>
      <div class="aries-messages" role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions text"><p class="aries-message aries-bot">Woof! I’m Aries. Ask me about grooming, prices, hours, or booking. 🐾</p></div>
      <div class="aries-quick"><button type="button" data-question="What are your hours?">Hours</button><button type="button" data-question="What grooming services and prices do you offer?">Services & prices</button><button type="button" data-question="How do I book an appointment?">Book a groom</button></div>
      <form class="aries-form"><label class="aries-sr" for="aries-input">Message Aries</label><input id="aries-input" name="message" maxlength="500" autocomplete="off" placeholder="Ask Aries a question…" required><button type="submit" aria-label="Send message">➤</button></form>
      <p class="aries-disclosure">AI assistant. Please avoid sharing personal or payment details. For urgent pet health concerns, contact a veterinarian.</p>
    </section>
    <button class="aries-launch" type="button" aria-label="Chat with Aries" aria-expanded="false" aria-controls="aries-panel">
      <svg class="aries-dog" viewBox="0 0 100 100" role="img" aria-label="Animated robot dog Aries"><path class="aries-ear left" d="M30 35 14 20 10 54 28 57Z"/><path class="aries-ear right" d="M70 35 86 20 90 54 72 57Z"/><rect x="21" y="25" width="58" height="56" rx="24" fill="#fff9ff" stroke="#593085" stroke-width="4"/><path d="M29 58Q50 78 71 58" fill="none" stroke="#de8ad5" stroke-width="3"/><circle class="aries-eye" cx="38" cy="50" r="5"/><circle class="aries-eye" cx="62" cy="50" r="5"/><path d="M46 62q4-5 8 0l-4 5Z" fill="#58307c"/><path d="M50 67q-4 6-10 1m10-1q4 6 10 1" fill="none" stroke="#58307c" stroke-width="2" stroke-linecap="round"/><path d="M45 24h10m-5 0v-8" stroke="#593085" stroke-width="3"/><circle cx="50" cy="13" r="4" fill="#ff50b5"/><circle cx="29" cy="39" r="3" fill="#52bdfa"/><circle cx="71" cy="39" r="3" fill="#52bdfa"/></svg><span>Ask Aries</span>
    </button>`;
  document.body.append(root);

  const launch = root.querySelector('.aries-launch');
  const panel = root.querySelector('.aries-panel');
  const close = root.querySelector('.aries-close');
  const form = root.querySelector('.aries-form');
  const input = root.querySelector('#aries-input');
  const messages = root.querySelector('.aries-messages');
  const history = [];
  let busy = false;

  function toggle(open) {
    panel.hidden = !open;
    launch.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else launch.focus();
  }
  function addMessage(content, kind) {
    const node = document.createElement('p');
    node.className = `aries-message aries-${kind}`;
    node.textContent = content;
    messages.append(node);
    messages.scrollTop = messages.scrollHeight;
    return node;
  }
  async function send(question) {
    if (busy || !question.trim()) return;
    const message = question.trim().slice(0, 500);
    addMessage(message, 'user');
    input.value = '';
    const pending = addMessage('Aries is thinking…', 'bot');
    busy = true;
    form.querySelector('button').disabled = true;
    try {
      const response = await fetch('/api/aries', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: [...history.slice(-10), {role: 'user', content: message}]})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Aries could not connect.');
      pending.textContent = data.reply;
      history.push({role: 'user', content: message}, {role: 'assistant', content: data.reply});
    } catch {
      pending.textContent = 'My chat connection is taking a nap. Please call (386) 215-5436, or try again shortly. 🐾';
    } finally {
      busy = false;
      form.querySelector('button').disabled = false;
      messages.scrollTop = messages.scrollHeight;
    }
  }
  launch.addEventListener('click', () => toggle(panel.hidden));
  close.addEventListener('click', () => toggle(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) toggle(false); });
  form.addEventListener('submit', event => { event.preventDefault(); send(input.value); });
  root.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => send(button.dataset.question)));
})();
