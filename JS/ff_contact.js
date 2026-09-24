const contactForm = document.querySelector('#contact-email-form');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const fields = new FormData(contactForm);
  const name = String(fields.get('name') || '').trim();
  const email = String(fields.get('email') || '').trim();
  const phone = String(fields.get('phone') || '').trim();
  const message = String(fields.get('message') || '').trim();
  const subject = `Furever Fluffy inquiry from ${name}`;
  const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;
  window.location.href = `mailto:info@fureverfluffy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
