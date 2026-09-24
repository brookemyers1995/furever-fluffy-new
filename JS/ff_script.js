const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.horizontal');menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',open);menuButton.textContent=open?'×':'☰'});
const portfolio=[
['Images/gallery-201809.jpg','A fresh groom for this black-and-white beauty.','Before and after groom of a black-and-white dog'],
['Images/gallery-201823.jpg','A sweet face and a tidy new look.','Before and after groom of a dark Shih Tzu'],
['Images/gallery-201836.jpg','A pretty-in-pink Yorkie transformation.','Before and after groom of a Yorkie in a pink bandana'],
['Images/gallery-201841.jpg','From shaggy sweetheart to fresh and fluffy.','Before and after groom of a small tan dog'],
['Images/gallery-201908.jpg','A golden glow-up with a smooth, brushed coat.','Before and after groom of a golden retriever'],
['Images/gallery-201630.jpg','A tiny fox-faced pup with a fresh finish.','Before and after groom of a small fluffy tan-and-white dog']
];
let current=0;const image=document.querySelector('#portfolioImage');const desc=document.querySelector('#imageDescription');const count=document.querySelector('#portfolioCount');const dots=document.querySelector('.carousel-dots');
function render(){if(!image)return;image.style.opacity='.2';setTimeout(()=>{image.src=portfolio[current][0];image.alt=portfolio[current][2];desc.textContent=portfolio[current][1];count.textContent=`${current+1} / ${portfolio.length}`;image.style.opacity='1'},130);[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===current))}
portfolio.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Show dog ${i+1}`);b.addEventListener('click',()=>{current=i;render()});dots?.appendChild(b)});document.querySelector('.carousel-arrow.next')?.addEventListener('click',()=>{current=(current+1)%portfolio.length;render()});document.querySelector('.carousel-arrow.prev')?.addEventListener('click',()=>{current=(current-1+portfolio.length)%portfolio.length;render()});render();
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
