/**
 * Shree Bhramani Enterprise — Main JavaScript
 * Handles: Mobile Menu, Scroll Reveal, Back to Top, Product Modals,
 *          Contact Form, Quote Form (all connected to the backend API)
 */

'use strict';

// ============================================================
// CONFIG — change this to your deployed backend URL in production
// ============================================================
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api'; // Same-origin when deployed

// ============================================================
// Utility: Show a toast notification
// ============================================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 9999;
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const colors = {
        success: 'background: linear-gradient(135deg, #00598b, #002d46); color: white;',
        error:   'background: linear-gradient(135deg, #dc2626, #7f1d1d); color: white;',
        info:    'background: linear-gradient(135deg, #0284c7, #0c4a6e); color: white;'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        ${colors[type] || colors.success}
        padding: 14px 20px; border-radius: 10px;
        font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-width: 360px; pointer-events: all;
        transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    });

    // Animate out after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ============================================================
// Utility: Disable/enable a button during async operations
// ============================================================
function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.textContent = btn.dataset.originalText || 'Submit';
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
    }
}

// ============================================================
// API: Submit a form to the backend
// ============================================================
async function submitForm(endpoint, data) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Submission failed. Please try again.');
    return json;
}

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // Mobile Menu
    // ============================================================
    const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
    const mobileMenu     = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('span') : null;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
            mobileMenu.classList.toggle('flex', isHidden);
            if (mobileMenuIcon) mobileMenuIcon.textContent = isHidden ? 'close' : 'menu';
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
            }
        });
    }

    // ============================================================
    // Scroll Reveal Animation
    // ============================================================
    const reveal = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();

    // ============================================================
    // Back to Top Button
    // ============================================================
    const bttBtn = document.getElementById('back-to-top');
    if (bttBtn) {
        window.addEventListener('scroll', () => {
            bttBtn.classList.toggle('show', window.pageYOffset > 300);
        }, { passive: true });
        bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================================================
    // Product Specs Modal (Our_Printers.html)
    // ============================================================
    const modal    = document.getElementById('specs-modal');
    const closeBtn = document.getElementById('close-modal');
    const specBtns = document.querySelectorAll('.view-specs-btn');

    if (modal && closeBtn) {
        const openModal = (data) => {
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            set('modal-title', data.title);
            set('modal-category', data.category);
            set('modal-desc', data.desc);

            const img = document.getElementById('modal-image');
            if (img) img.src = data.image;

            const specsList = document.getElementById('modal-specs');
            if (specsList) {
                specsList.innerHTML = '';
                try {
                    const specs = typeof data.specs === 'string'
                        ? JSON.parse(data.specs.replace(/'/g, '"'))
                        : data.specs;
                    specs.forEach(spec => {
                        const li = document.createElement('li');
                        li.className = 'flex items-center gap-3 text-sm text-on-surface';
                        li.innerHTML = `<span class="material-symbols-outlined text-primary text-lg">check_circle</span> ${spec}`;
                        specsList.appendChild(li);
                    });
                } catch (e) { console.error('Error parsing specs:', e); }
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        specBtns.forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset)));
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // ============================================================
    // Contact Form (contact_us.html)
    // ============================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('[type="submit"]');
            setButtonLoading(submitBtn, true);

            try {
                const data = {
                    name:     contactForm.querySelector('[name="name"]')?.value.trim(),
                    company:  contactForm.querySelector('[name="company"]')?.value.trim(),
                    industry: contactForm.querySelector('[name="industry"]')?.value.trim(),
                    phone:    contactForm.querySelector('[name="phone"]')?.value.trim(),
                    email:    contactForm.querySelector('[name="email"]')?.value.trim(),
                    message:  contactForm.querySelector('[name="message"]')?.value.trim()
                };

                const result = await submitForm('contact', data);
                showToast(`✅ ${result.message}`, 'success');
                contactForm.reset();

            } catch (err) {
                showToast(`❌ ${err.message}`, 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }

    // ============================================================
    // Quote Form (CIJ_Printer_Detail.html & general quote forms)
    // ============================================================
    const quoteForms = document.querySelectorAll('.quote-form');
    quoteForms.forEach(quoteForm => {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = quoteForm.querySelector('[type="submit"]');
            setButtonLoading(submitBtn, true);

            try {
                const data = {
                    name:        quoteForm.querySelector('[name="name"]')?.value.trim(),
                    email:       quoteForm.querySelector('[name="email"]')?.value.trim(),
                    industry:    quoteForm.querySelector('[name="industry"]')?.value.trim(),
                    dailyOutput: quoteForm.querySelector('[name="dailyOutput"]')?.value.trim(),
                    product:     quoteForm.querySelector('[name="product"]')?.value.trim() ||
                                 document.querySelector('[data-product-name]')?.dataset.productName || '',
                    message:     quoteForm.querySelector('[name="message"]')?.value.trim()
                };

                const result = await submitForm('quote', data);
                showToast(`✅ ${result.message}`, 'success');
                quoteForm.reset();

            } catch (err) {
                showToast(`❌ ${err.message}`, 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    });

    // ============================================================
    // "Get Quote" buttons — open a quick quote modal or redirect
    // ============================================================
    document.querySelectorAll('.get-quote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById('quote-section') || document.getElementById('contact-form');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.location.href = 'contact_us.html';
            }
        });
    });

}); // end DOMContentLoaded
