// Mobile nav toggle
const navToggleButton = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggleButton && siteNav) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scroll on internal links
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (target.matches('a[href^="#"]')) {
    const id = target.getAttribute('href');
    if (!id) return;
    const section = document.querySelector(id);
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (siteNav && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggleButton?.setAttribute('aria-expanded', 'false');
      }
    }
  }
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Form handler: open email/WhatsApp/SMS and submit to Google Sheets if configured
const form = document.querySelector('form.form');
if (form) {
  form.addEventListener('submit', () => {
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const summary = `Hello, I am ${name || 'Unknown'}%0A` +
    //   `Phone: ${encodeURIComponent(phone)}%0A` +
      `Concern: ${encodeURIComponent(message)}` +
      `Please call me back on ${encodeURIComponent(phone)}`;

    // // Email
    // const mailto = `mailto:divyadonpati@gmail.com?subject=${encodeURIComponent('Callback Request - Sriji Seva Sansthan')}&body=${summary}`;
    // window.open(mailto, '_blank');

    // WhatsApp (international format without +)
    const waNumber = '918639560047';
    const wa = `https://wa.me/${waNumber}?text=${summary}`;
    window.open(wa, '_blank');

    // // SMS intent (best-effort; support varies by platform)
    // const sms = `sms:+918639560047?&body=${summary}`;
    // window.open(sms, '_blank');

    // Google Sheets via Apps Script (optional if meta configured)
    const endpoint = document.querySelector('meta[name="sheet-endpoint"]')?.getAttribute('content')?.trim();
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message, submittedAt: new Date().toISOString() })
      }).catch(() => { /* network errors ignored in no-cors */ });
    }

    alert('Thank you!');
    form.reset();
  });
}

