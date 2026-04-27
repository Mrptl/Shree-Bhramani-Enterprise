/**
 * Shree Bhramani Enterprise - Main JavaScript
 * Handles: Mobile Menu, Scroll Reveal, Back to Top, and Product Modals
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('span') : null;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
            mobileMenu.classList.toggle('flex', isHidden);
            if (mobileMenuIcon) {
                mobileMenuIcon.textContent = isHidden ? 'close' : 'menu';
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100; // Trigger slightly earlier for better feel
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check on load

    // --- Back to Top Button ---
    const bttBtn = document.getElementById('back-to-top');
    if (bttBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                bttBtn.classList.add('show');
            } else {
                bttBtn.classList.remove('show');
            }
        });

        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Modal Logic (Specific to Products Page) ---
    const modal = document.getElementById('specs-modal');
    const closeBtn = document.getElementById('close-modal');
    const specBtns = document.querySelectorAll('.view-specs-btn');

    if (modal && closeBtn) {
        const openModal = (data) => {
            const modalTitle = document.getElementById('modal-title');
            const modalCategory = document.getElementById('modal-category');
            const modalImage = document.getElementById('modal-image');
            const modalDesc = document.getElementById('modal-desc');
            const specsList = document.getElementById('modal-specs');

            if (modalTitle) modalTitle.textContent = data.title;
            if (modalCategory) modalCategory.textContent = data.category;
            if (modalImage) modalImage.src = data.image;
            if (modalDesc) modalDesc.textContent = data.desc;
            
            if (specsList) {
                specsList.innerHTML = '';
                // Handle array or string data safely
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
                } catch (e) {
                    console.error("Error parsing specs data", e);
                }
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        specBtns.forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset));
        });

        closeBtn.addEventListener('click', closeModal);
        
        // Close on clicking the blurred overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
