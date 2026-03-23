import './style.css';

/* ── Cursor ───────────────────────────────────────────── */
const c = document.getElementById('cur');
const r = document.getElementById('curR');
document.addEventListener('mousemove', e => {
  c.style.left = r.style.left = e.clientX + 'px';
  c.style.top  = r.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a,button,.gc,.tier').forEach(el => {
  el.addEventListener('mouseenter', () => { c.style.width = c.style.height = '20px'; r.style.width = r.style.height = '52px'; });
  el.addEventListener('mouseleave', () => { c.style.width = c.style.height = '10px'; r.style.width = r.style.height = '36px'; });
});

/* ── Nav scroll border ────────────────────────────────── */
window.addEventListener('scroll', () =>
  document.getElementById('nav').classList.toggle('sc', scrollY > 60)
);

/* ── Fade-up on scroll ────────────────────────────────── */
const obs = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fu').forEach(el => obs.observe(el));

/* ── Formspree config ─────────────────────────────────── */
// Sign up free at https://formspree.io → create a form → paste your ID below
const FORMSPREE_ID = 'YOUR_FORM_ID';

function formspreePost(data) {
  return fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/* ── Show inline error ────────────────────────────────── */
function showError(msg) {
  const existing = document.querySelector('.form-err');
  if (existing) existing.remove();
  const el = document.createElement('p');
  el.className = 'form-err';
  el.textContent = msg;
  el.style.cssText = 'font-size:.82rem;color:#9b3d2a;margin-top:.6rem;';
  return el;
}

/* ── Modal ────────────────────────────────────────────── */
let ci = {};

function openModal(title, desc) {
  ci = { title, desc };
  document.getElementById('mo-body').innerHTML = buildMo(title, desc);
  document.getElementById('mb').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeM() {
  document.getElementById('mb').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('mb').addEventListener('click', e => {
  if (e.target === document.getElementById('mb')) closeM();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeM();
});

function buildMo(t, d) {
  return `
  <p class="mo-tag">Enquire about this piece</p>
  <h3 class="mo-name">${t}</h3>
  <p class="mo-desc" style="margin-bottom:1.8rem">${d}</p>
  <div class="mo-div"></div>
  <p style="font-size:.82rem;color:var(--mid);line-height:1.7;margin-bottom:1.5rem">
    Tell me which format you'd like, any size preference, and I'll come back to you with availability and pricing.
  </p>
  <label class="ml">Your Name</label>
  <input type="text" class="mi" placeholder="Full name" id="m-n"/>
  <label class="ml">Email Address</label>
  <input type="email" class="mi" placeholder="your@email.com" id="m-e"/>
  <label class="ml">What are you interested in?</label>
  <select class="mi" id="m-t" style="appearance:none;cursor:pointer">
    <option value="" disabled selected>Select…</option>
    <option>Print of this piece</option>
    <option>Original artwork</option>
    <option>Not sure — tell me more</option>
  </select>
  <label class="ml">Preferred size (optional)</label>
  <input type="text" class="mi" placeholder="e.g. A3, 50×70cm" id="m-s"/>
  <label class="ml">Anything else?</label>
  <textarea class="mta" placeholder="Any questions, colour preferences, gifting notes…" id="m-msg" style="min-height:80px"></textarea>
  <button class="btn-pay" onclick="pay()">Send enquiry</button>`;
}

/* ── Gallery modal submit ─────────────────────────────── */
async function pay() {
  const n   = document.getElementById('m-n')?.value.trim();
  const e   = document.getElementById('m-e')?.value.trim();
  const t   = document.getElementById('m-t')?.value;
  const s   = document.getElementById('m-s')?.value.trim();
  const msg = document.getElementById('m-msg')?.value.trim();

  if (!n || !e) {
    const btn = document.querySelector('#mo-body .btn-pay');
    btn?.parentNode.insertBefore(showError('Please enter your name and email.'), btn);
    return;
  }

  const btn = document.querySelector('#mo-body .btn-pay');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  try {
    await formspreePost({ name: n, email: e, piece: ci.title, format: t || '', size: s, message: msg, _subject: `Gallery Enquiry: ${ci.title} — JB Designs` });
  } catch (err) {
    console.warn('Form submission error:', err);
  }

  document.getElementById('mo-body').innerHTML = `
  <div class="mo-ok">
    <div class="ok-mark">✦</div>
    <div class="ok-title">Enquiry sent!</div>
    <p class="ok-body">
      Thanks ${n}! I've received your enquiry about <em>${ci.title}</em> and will be in touch
      at <strong>${e}</strong> with pricing and availability.
    </p>
    <button class="btn-pay" style="margin-top:2rem;width:auto;padding:.9rem 2rem" onclick="closeM()">Close</button>
  </div>`;
}

/* ── Custom order form submit ─────────────────────────── */
async function sendCustomOrder() {
  const n  = document.getElementById('co-name')?.value.trim();
  const e  = document.getElementById('co-email')?.value.trim();
  const d  = document.getElementById('co-desc')?.value.trim();
  const t  = document.getElementById('co-type')?.value;
  const s  = document.getElementById('co-size')?.value.trim();
  const b  = document.getElementById('co-budget')?.value.trim();
  const dt = document.getElementById('co-date')?.value;

  if (!n || !e || !d) {
    alert('Please fill in your name, email and description.');
    return;
  }

  const btn = document.querySelector('[onclick="sendCustomOrder()"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    await formspreePost({ name: n, email: e, orderType: t || '', description: d, size: s, budget: b, deadline: dt, _subject: 'Custom Order Enquiry — JB Designs' });
  } catch (err) {
    console.warn('Form submission error:', err);
  }

  document.getElementById('co-ok').style.display = 'block';
  btn.textContent = 'Sent ✦';
}

/* ── Contact form submit ──────────────────────────────── */
async function sendCF() {
  const n = document.getElementById('cf-n').value.trim();
  const e = document.getElementById('cf-e').value.trim();
  const s = document.getElementById('cf-s').value.trim();
  const m = document.getElementById('cf-m').value.trim();

  if (!n || !e || !m) {
    alert('Please fill in all fields.');
    return;
  }

  const btn = document.querySelector('#contact .btn-send');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    await formspreePost({ name: n, email: e, subject: s, message: m, _subject: `Contact: ${s || 'General enquiry'} — JB Designs` });
  } catch (err) {
    console.warn('Form submission error:', err);
  }

  document.getElementById('cf-ok').style.display = 'block';
  btn.textContent = 'Sent ✦';
}

/* ── Expose to inline onclick handlers ───────────────── */
window.openModal = openModal;
window.closeM   = closeM;
window.pay      = pay;
window.sendCustomOrder = sendCustomOrder;
window.sendCF   = sendCF;
