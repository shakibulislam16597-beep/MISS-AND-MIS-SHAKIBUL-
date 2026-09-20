/* ==========================================================================
   OUR SECRET - JAVASCRIPT
   Interactive logic for Floating Canvas Hearts, Live Relationship Counter,
   Theme Switching, Music Audio Player, Unified Lightbox Slideshow, Card Flipping,
   Love Letter Modals, Photo Deduplication, and Confetti Surprise.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure CONFIG is present
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG object is missing. Please ensure config.js is loaded.');
    return;
  }

  // Global tracker for seen photos across the whole site to guarantee no duplicates
  const globalSeenPhotos = new Set();

  /**
   * Deduplicates array of photos or photo objects so that every photo file/URL appears only once.
   * Also ensures photos used in timeline are not duplicated in gallery.
   */
  function deduplicatePhotos(list) {
    if (!Array.isArray(list)) return [];
    const unique = [];

    list.forEach(item => {
      const src = typeof item === 'string' ? item : (item.image || item.url || '');
      if (!src) return;

      // Normalize source string to avoid case/slash duplication
      const normalizedSrc = src.trim().toLowerCase();

      if (!globalSeenPhotos.has(normalizedSrc)) {
        globalSeenPhotos.add(normalizedSrc);
        unique.push(item);
      }
    });

    return unique;
  }

  // Combined Active Lightbox Items List
  let currentLightboxPhotos = [];
  let currentGalleryIndex = 0;
  let isPlayingMusic = false;

  /* ------------------------------------------------------------------------
     1. Initialize Text & Static Content from Config
     ------------------------------------------------------------------------ */
  function initTextContent() {
    // Brand Name
    const brandName = document.getElementById('brandName');
    if (brandName) brandName.textContent = CONFIG.names.coupleTitle;

    // Tagline & Hero
    const taglineText = document.getElementById('taglineText');
    if (taglineText) taglineText.textContent = CONFIG.tagline;

    const coupleNamesTitle = document.getElementById('coupleNamesTitle');
    if (coupleNamesTitle) {
      coupleNamesTitle.innerHTML = `${CONFIG.names.partner1} <span class="heart-icon">💕</span> ${CONFIG.names.partner2}`;
    }

    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.textContent = CONFIG.subtitle;

    const counterTitle = document.getElementById('counterTitle');
    if (counterTitle) counterTitle.textContent = CONFIG.hero.counterTitle;

    const counterSubnote = document.getElementById('counterSubnote');
    if (counterSubnote) counterSubnote.textContent = CONFIG.hero.counterSubtitle;

    const surpriseBtnLabel = document.getElementById('surpriseBtnLabel');
    if (surpriseBtnLabel) surpriseBtnLabel.textContent = CONFIG.surprise.buttonText;

    // Footer
    const footerMainText = document.getElementById('footerMainText');
    if (footerMainText) footerMainText.textContent = CONFIG.footer.text;

    const footerSubText = document.getElementById('footerSubText');
    if (footerSubText) footerSubText.textContent = CONFIG.footer.subtext;
  }

  /* ------------------------------------------------------------------------
     2. Live Relationship Counter
     ------------------------------------------------------------------------ */
  function initCounter() {
    const startDate = new Date(CONFIG.startDate);

    function updateCounter() {
      const now = new Date();
      let diffMs = now - startDate;

      if (diffMs < 0) {
        diffMs = 0;
      }

      // Exact elapsed time calculations
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      // Update DOM
      const elYears = document.getElementById('countYears');
      const elMonths = document.getElementById('countMonths');
      const elDays = document.getElementById('countDays');
      const elHours = document.getElementById('countHours');
      const elMinutes = document.getElementById('countMinutes');
      const elSeconds = document.getElementById('countSeconds');

      if (elYears) elYears.textContent = Math.max(0, years);
      if (elMonths) elMonths.textContent = Math.max(0, months);
      if (elDays) elDays.textContent = Math.max(0, days);
      if (elHours) elHours.textContent = String(Math.max(0, hours)).padStart(2, '0');
      if (elMinutes) elMinutes.textContent = String(Math.max(0, minutes)).padStart(2, '0');
      if (elSeconds) elSeconds.textContent = String(Math.max(0, seconds)).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  /* ------------------------------------------------------------------------
     3. Render Story Timeline (Photo-Only Cards)
     ------------------------------------------------------------------------ */
  function renderStoryTimeline() {
    const timelineContainer = document.getElementById('storyTimeline');
    if (!timelineContainer) return;

    let rawTimelineList = [];
    if (Array.isArray(CONFIG.timelinePhotos)) {
      rawTimelineList = CONFIG.timelinePhotos;
    } else if (Array.isArray(CONFIG.story)) {
      rawTimelineList = CONFIG.story.map(item => item.image || item.url || item);
    }

    // Apply strict deduplication
    const timelineList = deduplicatePhotos(rawTimelineList);

    if (timelineList.length === 0) {
      timelineContainer.innerHTML = '';
      return;
    }

    timelineContainer.innerHTML = timelineList.map((photoUrl, index) => {
      const src = typeof photoUrl === 'string' ? photoUrl : (photoUrl.image || photoUrl.url || '');
      return `
        <div class="timeline-item">
          <div class="timeline-dot"><i class="fas fa-heart"></i></div>
          <div class="timeline-card" data-timeline-index="${index}">
            <div class="timeline-img-wrapper">
              <img src="${src}" alt="Timeline Moment ${index + 1}" loading="lazy">
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Click handler to open Lightbox
    const cards = timelineContainer.querySelectorAll('.timeline-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-timeline-index'), 10);
        openLightbox(timelineList, index);
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Render Photo Gallery Grid
     ------------------------------------------------------------------------ */
  function renderGallery() {
    const galleryContainer = document.getElementById('photoGallery');
    if (!galleryContainer) return;

    let rawGalleryList = [];
    if (Array.isArray(CONFIG.galleryPhotos)) {
      rawGalleryList = CONFIG.galleryPhotos;
    } else if (Array.isArray(CONFIG.gallery)) {
      rawGalleryList = CONFIG.gallery;
    }

    // Apply strict deduplication across whole site
    const galleryList = deduplicatePhotos(rawGalleryList);

    if (galleryList.length === 0) {
      galleryContainer.innerHTML = '';
      return;
    }

    galleryContainer.innerHTML = galleryList.map((item, index) => {
      const src = typeof item === 'string' ? item : (item.url || item.image || '');
      const caption = typeof item === 'object' ? (item.caption || '') : '';
      const captionBn = typeof item === 'object' ? (item.captionBn || '') : '';

      return `
        <div class="gallery-card" data-gallery-index="${index}">
          <div class="gallery-img-box">
            <img src="${src}" alt="${caption || 'Memory Photo'}" loading="lazy">
            ${(caption || captionBn) ? `
              <div class="gallery-overlay">
                <div class="gallery-info">
                  <p class="gallery-caption">${caption}</p>
                  <p class="gallery-caption-bn">${captionBn}</p>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Click handler for Lightbox
    const cards = galleryContainer.querySelectorAll('.gallery-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-gallery-index'), 10);
        openLightbox(galleryList, index);
      });
    });
  }

  /* Unified Lightbox Modal Logic */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  function openLightbox(photosArray, index) {
    if (!photosArray || photosArray.length === 0) return;
    currentLightboxPhotos = photosArray;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = currentLightboxPhotos[currentGalleryIndex];
    if (!item) return;

    const src = typeof item === 'string' ? item : (item.url || item.image || '');
    const caption = typeof item === 'object' ? (item.caption || '') : '';
    const captionBn = typeof item === 'object' ? (item.captionBn || '') : '';

    lightboxImg.src = src;
    lightboxCaption.innerHTML = caption ? `${caption} ${captionBn ? `<br><small>${captionBn}</small>` : ''}` : '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + currentLightboxPhotos.length) % currentLightboxPhotos.length;
      updateLightboxContent();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % currentLightboxPhotos.length;
      updateLightboxContent();
    });
  }

  /* Keyboard Navigation for Lightbox */
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentGalleryIndex = (currentGalleryIndex - 1 + currentLightboxPhotos.length) % currentLightboxPhotos.length;
      updateLightboxContent();
    }
    if (e.key === 'ArrowRight') {
      currentGalleryIndex = (currentGalleryIndex + 1) % currentLightboxPhotos.length;
      updateLightboxContent();
    }
  });

  /* ------------------------------------------------------------------------
     5. Render Love Letters (Envelope Cards)
     ------------------------------------------------------------------------ */
  function renderLoveLetters() {
    const lettersGrid = document.getElementById('loveLettersGrid');
    if (!lettersGrid || !CONFIG.loveLetters) return;

    lettersGrid.innerHTML = CONFIG.loveLetters.map(letter => `
      <div class="envelope-card" data-id="${letter.id}">
        <div>
          <span class="envelope-tag"><i class="fas fa-heart"></i> Letter #${letter.id}</span>
          <h3 class="envelope-title">${letter.title}</h3>
          <p class="envelope-title-bn">${letter.titleBn || ''}</p>
          <p class="envelope-preview">${letter.preview}</p>
        </div>
        <div class="envelope-action">
          Open Letter <i class="fas fa-envelope-open"></i>
        </div>
      </div>
    `).join('');

    const cards = lettersGrid.querySelectorAll('.envelope-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        const letter = CONFIG.loveLetters.find(l => l.id === id);
        if (letter) openLetterModal(letter);
      });
    });
  }

  const letterModal = document.getElementById('letterModal');
  const letterClose = document.getElementById('letterClose');
  const letterOverlay = document.getElementById('letterOverlay');

  function openLetterModal(letter) {
    document.getElementById('letterModalTitle').textContent = letter.title;
    document.getElementById('letterModalDate').textContent = letter.date || '';
    document.getElementById('letterModalContent').textContent = letter.content;
    document.getElementById('letterModalContentBn').textContent = letter.contentBn || '';

    letterModal.classList.add('active');
    letterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLetterModal() {
    letterModal.classList.remove('active');
    letterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (letterClose) letterClose.addEventListener('click', closeLetterModal);
  if (letterOverlay) letterOverlay.addEventListener('click', closeLetterModal);

  /* ------------------------------------------------------------------------
     6. Render Reasons I Love You (3D Flip Cards)
     ------------------------------------------------------------------------ */
  function renderReasons() {
    const reasonsGrid = document.getElementById('reasonsGrid');
    if (!reasonsGrid || !CONFIG.reasons) return;

    reasonsGrid.innerHTML = CONFIG.reasons.map((item, index) => `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="reason-icon">${item.icon || '💖'}</div>
            <h3 class="reason-number">${item.front}</h3>
            <p class="reason-number-bn">${item.frontBn || ''}</p>
            <span class="flip-hint"><i class="fas fa-rotate"></i> Flip over</span>
          </div>
          <div class="flip-card-back">
            <p class="reason-text">${item.back}</p>
            <p class="reason-text-bn">${item.backBn || ''}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Toggle class on click for mobile devices
    const cards = reasonsGrid.querySelectorAll('.flip-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Render Promises Section
     ------------------------------------------------------------------------ */
  function renderPromises() {
    const promisesGrid = document.getElementById('promisesGrid');
    if (!promisesGrid || !CONFIG.promises) return;

    promisesGrid.innerHTML = CONFIG.promises.map(item => `
      <div class="promise-card">
        <span class="promise-icon">${item.icon || '🌸'}</span>
        <h3 class="promise-title">${item.title}</h3>
        <p class="promise-title-bn">${item.titleBn || ''}</p>
        <p class="promise-text">${item.text}</p>
        <p class="promise-text-bn">${item.textBn || ''}</p>
      </div>
    `).join('');
  }

  /* ------------------------------------------------------------------------
     8. Surprise Button & Modal with Confetti
     ------------------------------------------------------------------------ */
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const surpriseClose = document.getElementById('surpriseClose');
  const surpriseCloseBtn = document.getElementById('surpriseCloseBtn');
  const surpriseOverlay = document.getElementById('surpriseOverlay');

  function triggerSurprise() {
    document.getElementById('surpriseModalTitle').textContent = CONFIG.surprise.modalTitle;
    document.getElementById('surpriseModalMessageEn').textContent = CONFIG.surprise.message;
    document.getElementById('surpriseModalMessageBn').textContent = CONFIG.surprise.messageBn || '';

    surpriseModal.classList.add('active');
    surpriseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (typeof confetti === 'function') {
      const colors = CONFIG.surprise.confettiColors || ['#ffb6c1', '#ff69b4', '#ffffff'];
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
      }, 300);
    }
  }

  function closeSurpriseModal() {
    surpriseModal.classList.remove('active');
    surpriseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (surpriseBtn) surpriseBtn.addEventListener('click', triggerSurprise);
  if (surpriseClose) surpriseClose.addEventListener('click', closeSurpriseModal);
  if (surpriseCloseBtn) surpriseCloseBtn.addEventListener('click', closeSurpriseModal);
  if (surpriseOverlay) surpriseOverlay.addEventListener('click', closeSurpriseModal);

  /* ------------------------------------------------------------------------
     9. Audio Player / Background Music Toggle (Local File Support & Loop)
     ------------------------------------------------------------------------ */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  if (bgMusic && CONFIG.music && CONFIG.music.src) {
    bgMusic.src = CONFIG.music.src;
    bgMusic.loop = true; // Loop the audio continuously

    function playAudio() {
      bgMusic.play().then(() => {
        isPlayingMusic = true;
        if (musicToggle) musicToggle.classList.add('music-playing');
      }).catch(err => {
        console.log('Audio playback waiting for interaction or failed:', err);
      });
    }

    function pauseAudio() {
      bgMusic.pause();
      isPlayingMusic = false;
      if (musicToggle) musicToggle.classList.remove('music-playing');
    }

    if (musicToggle) {
      musicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop trigger from duplicate body listeners
        if (isPlayingMusic) {
          pauseAudio();
        } else {
          playAudio();
        }
      });
    }

    // Start playing on first tap or click anywhere on page (resolves browser autoplay policy)
    if (CONFIG.music.autoplayOnInteraction) {
      const handleFirstInteraction = () => {
        if (!isPlayingMusic && bgMusic.paused) {
          playAudio();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction, { once: true });
      document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    }
  }

  /* ------------------------------------------------------------------------
     10. Dark / Light Theme Switching
     ------------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ourSecretTheme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }
  }

  const savedTheme = localStorage.getItem('ourSecretTheme') || 'light';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  /* ------------------------------------------------------------------------
     11. Floating Canvas Particle Animation (Hearts & Sparkles)
     ------------------------------------------------------------------------ */
  function initHeartsCanvas() {
    const canvas = document.getElementById('heartsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    class HeartParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.symbol = Math.random() > 0.3 ? '💖' : '✨';
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y < -50) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new HeartParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ------------------------------------------------------------------------
     12. Execute All Inits
     ------------------------------------------------------------------------ */
  initTextContent();
  initCounter();
  renderStoryTimeline();
  renderGallery();
  renderLoveLetters();
  renderReasons();
  renderPromises();
  initHeartsCanvas();
});
