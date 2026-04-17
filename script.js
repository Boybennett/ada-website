/* ─────────────────────────────────────────────
   KarKutz — Main JavaScript
───────────────────────────────────────────── */


/* ── Navbar: add blur + gold underline on scroll ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ── Mobile menu toggle ── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
const bOpen     = document.getElementById('burger-open');
const bClose    = document.getElementById('burger-close');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileNav.classList.toggle('hidden', !menuOpen);
  bOpen.classList.toggle('hidden', menuOpen);
  bClose.classList.toggle('hidden', !menuOpen);
});

function closeNav() {
  menuOpen = false;
  mobileNav.classList.add('hidden');
  bOpen.classList.remove('hidden');
  bClose.classList.add('hidden');
}


/* ── Scroll reveal: fade-up elements as they enter the viewport ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── Portfolio filter pills ── */
document.querySelectorAll('.fpill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fpill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.f;
    document.querySelectorAll('.pi').forEach(item => {
      const visible = filter === 'all' || item.dataset.c === filter;
      item.style.opacity       = visible ? '1'    : '0.12';
      item.style.pointerEvents = visible ? ''     : 'none';
    });
  });
});


/* ── Booking: time slot picker ── */
function pickSlot(el) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('chosenTime').value = el.textContent.trim();
}


/* ── Booking: set minimum selectable date to today ── */
document.getElementById('bdate').min = new Date().toISOString().split('T')[0];


/* ── Booking: submit → open WhatsApp with pre-filled message ── */
function submitBooking(e) {
  e.preventDefault();

  const time = document.getElementById('chosenTime').value;
  if (!time) {
    alert('Please select a preferred time slot.');
    return;
  }

  const name    = document.getElementById('bname').value.trim();
  const phone   = document.getElementById('bphone').value.trim();
  const email   = document.getElementById('bemail').value.trim();
  const service = document.getElementById('bservice').value;
  const date    = document.getElementById('bdate').value;
  const notes   = document.getElementById('bnotes').value.trim();

  /* Format date to a readable string without timezone shift */
  let dateFormatted = 'Not specified';
  if (date) {
    const [y, m, d] = date.split('-');
    dateFormatted = new Date(+y, +m - 1, +d).toLocaleDateString('en-NG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  const lines = [
    '👋 *New Booking — KarKutz*',
    '',
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
  ];
  if (email) lines.push(`*Email:* ${email}`);
  lines.push(
    '',
    `*Service:* ${service}`,
    `*Date:* ${dateFormatted}`,
    `*Time:* ${time}`,
  );
  if (notes) lines.push('', `*Notes:* ${notes}`);
  lines.push('', '_Sent via karkutz.ng booking form_');

  const waURL = `https://wa.me/2348101837353?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(waURL, '_blank');

  document.getElementById('bform').classList.add('hidden');
  document.getElementById('bsuccess').classList.remove('hidden');
}


/* ── Booking: reset form to initial state ── */
function resetForm() {
  document.getElementById('bform').reset();
  document.getElementById('bform').classList.remove('hidden');
  document.getElementById('bsuccess').classList.add('hidden');
  document.getElementById('chosenTime').value = '';
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
}
