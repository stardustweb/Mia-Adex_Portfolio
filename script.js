/* ==========================================================
   MIA ADEX — PORTFOLIO SCRIPT
   ========================================================== */
(() => {
  "use strict";

  /* ----------------------------------------------------------
     1. CLOUDINARY VIDEO LIBRARY
     Change CLOUD_NAME or any entry below to update the site.
     ---------------------------------------------------------- */
  const CLOUD_NAME = "rxbec9rl";

  function cldVideo(version, publicId, transform = "q_auto:good,f_mp4") {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transform}/v${version}/${publicId}.mp4`;
  }
  function cldPoster(version, publicId, width = 900, second = 1) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_${second},q_auto:good,f_jpg,w_${width}/v${version}/${publicId}.jpg`;
  }

  // Raw library (version + public id per clip).
  const RAW = {
    v01: { version: "1789077811", id: "VID-20260910-WA0166" },
    v02: { version: "1789079592", id: "VID-20260910-WA0159" },
    v03: { version: "1789079589", id: "VID-20260910-WA0157" },
    v04: { version: "1789079635", id: "VID-20260910-WA0153" },
    v05: { version: "1789079581", id: "VID-20260910-WA0156" },
    v06: { version: "1789079624", id: "VID-20260910-WA0151" },
    v07: { version: "1789079620", id: "VID-20260910-WA0160" },
    v08: { version: "1789079616", id: "VID-20260910-WA0148" },
    v09: { version: "1789079593", id: "VID-20260910-WA0155" },
    v10: { version: "1789079622", id: "VID-20260910-WA0149" }
  };

  /* ----------------------------------------------------------
     2. PROJECT DATA
     featured: true -> shown in Featured Work row
     hero: true -> used as the hero showreel + final CTA texture
     Titles/categories use neutral, honest descriptions.
     ---------------------------------------------------------- */
  const projects = [
    { num: "01", key: "v01", title: "The Morning Hook",  category: "social",     type: "AI UGC · Social Ad" },
    { num: "02", key: "v02", title: "Everyday Ritual",   category: "product",    type: "AI UGC · Product Ad", featured: true },
    { num: "03", key: "v03", title: "Wellness in Motion",category: "social",     type: "AI UGC · Social Ad" },
    { num: "04", key: "v04", title: "A Better Routine",  category: "lifestyle",  type: "Lifestyle · Concept Project", featured: true },
    { num: "05", key: "v05", title: "Daily Detail",      category: "ugc",        type: "AI UGC · Concept Project" },
    { num: "06", key: "v06", title: "Soft Sell",         category: "social",     type: "AI UGC · Social Ad" },
    { num: "07", key: "v07", title: "Open Air",          category: "commercial", type: "Cinematic · Concept Project", featured: true },
    { num: "08", key: "v08", title: "Real Talk",         category: "social",     type: "AI UGC · Social Ad" },
    { num: "09", key: "v09", title: "Product Story",     category: "ugc",        type: "AI UGC · Concept Project", hero: true },
    { num: "10", key: "v10", title: "Modern Beauty",     category: "product",    type: "AI UGC · Product Ad", featured: true }
  ];

  projects.forEach(p => {
    const raw = RAW[p.key];
    p.video  = cldVideo(raw.version, raw.id);
    p.poster = cldPoster(raw.version, raw.id, 900, 1);
  });

  const heroProject   = projects.find(p => p.hero) || projects[0];
  const featuredList  = projects.filter(p => p.featured);
  const moreList      = projects.filter(p => !p.featured && !p.hero);
  const feedPicks     = [projects[8], projects[1], projects[2]]; // variety for vertical feed mock

  /* ----------------------------------------------------------
     3. HERO + FINAL CTA VIDEO ASSIGNMENT
     ---------------------------------------------------------- */
  const heroVideoEl = document.getElementById("heroVideo");
  if (heroVideoEl) {
    heroVideoEl.poster = cldPoster(RAW[heroProject.key].version, RAW[heroProject.key].id, 1600, 1);
    heroVideoEl.src = heroProject.video;
    heroVideoEl.play().catch(() => { /* autoplay may be blocked; poster remains visible */ });
  }

  const ctaVideoEl = document.querySelector(".cta-video");
  if (ctaVideoEl) {
    const ctaSource = projects.find(p => p.key === "v05") || projects[4];
    ctaVideoEl.src = ctaSource.video;
    ctaVideoEl.play().catch(() => {});
  }

  /* ----------------------------------------------------------
     4. NAV — scrolled state + mobile overlay menu
     ---------------------------------------------------------- */
  const navEl = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    navEl.classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });

  const menuBtn   = document.getElementById("menuBtn");
  const menuClose = document.getElementById("menuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu.querySelectorAll(".mobile-link, .mobile-cta");

  function openMenu() {
    mobileMenu.classList.add("open");
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuClose.focus();
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.focus();
  }
  menuBtn.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  mobileLinks.forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMenu();
  });

  /* ----------------------------------------------------------
     5. SCROLL REVEALS
     ---------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  revealItems.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     6. RENDER PROJECT CARDS (featured / more)
     ---------------------------------------------------------- */
  function projectCardHTML(p, index) {
    return `
    <article class="project-card reveal" data-category="${p.category}" data-index="${index}" tabindex="0" role="button" aria-label="Open project ${p.title}">
      <div class="project-media">
        <img src="${p.poster}" alt="${p.title} — preview frame" loading="lazy">
        <video muted loop playsinline preload="none" data-src="${p.video}"></video>
      </div>
      <div class="project-scrim"></div>
      <span class="project-num">${p.num} / ${String(projects.length).padStart(2,"0")}</span>
      <span class="project-play" aria-hidden="true"></span>
      <div class="project-info">
        <p class="project-title">${p.title}</p>
        <p class="project-cat">${p.type}</p>
      </div>
    </article>`;
  }

  const featuredGrid = document.getElementById("featuredGrid");
  const moreGrid = document.getElementById("moreGrid");

  featuredGrid.innerHTML = featuredList.map(p => projectCardHTML(p, projects.indexOf(p))).join("");
  moreGrid.innerHTML = moreList.map(p => projectCardHTML(p, projects.indexOf(p))).join("");

  // Re-observe newly injected reveal elements
  document.querySelectorAll(".project-card.reveal").forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     7. FEED GRID (vertical 9:16 previews)
     ---------------------------------------------------------- */
  const feedGrid = document.getElementById("feedGrid");
  const feedLabels = ["TikTok", "Instagram Reels", "Facebook"];
  feedGrid.innerHTML = feedPicks.map((p, i) => `
    <div class="feed-item reveal">
      <img src="${p.poster}" alt="${p.title} vertical preview" loading="lazy">
      <div class="feed-item-scrim"></div>
      <span class="feed-item-label">${feedLabels[i] || "Social"}</span>
    </div>
  `).join("");
  document.querySelectorAll(".feed-item.reveal").forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     8. SERVICES LIST
     ---------------------------------------------------------- */
  const services = [
    ["AI UGC Video Ads", "Natural, social-native product stories with a believable human presence."],
    ["AI Product Advertisements", "Product-led visuals composed for attention and clarity."],
    ["Product Demonstrations", "Clear visual sequences that make value easy to understand."],
    ["Unboxing Videos", "Tactile first-look narratives designed for short-form platforms."],
    ["Lifestyle Advertisements", "Products placed inside relatable, aspirational moments."],
    ["AI Spokesperson Videos", "Direct-to-camera creative with confident, natural delivery."],
    ["TikTok / Reels Ads", "Fast, vertical creative built around a strong hook."],
    ["Short-Form Promotional Videos", "Compact concepts shaped for modern attention spans."],
    ["Cinematic Product Commercials", "Elevated product worlds with considered light and composition."],
    ["Video Ad Concepts & Scripts", "The hook, structure and words before production begins."]
  ];
  const serviceList = document.getElementById("serviceList");
  serviceList.innerHTML = services.map((s, i) => `
    <li class="service-item reveal">
      <span class="service-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="service-name">${s[0]}</span>
      <span class="service-desc">${s[1]}</span>
    </li>
  `).join("");
  document.querySelectorAll(".service-item.reveal").forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     9. VIDEO HOVER PREVIEW + LAZY / VIEWPORT PLAYBACK
     - Desktop: hover plays a muted preview
     - All devices: video only receives a src once its card
       is near the viewport (lazy), and pauses once it scrolls
       out of view so multiple clips are never playing at once.
     ---------------------------------------------------------- */
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cardVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const video = card.querySelector("video");
      if (!video) return;
      if (entry.isIntersecting) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
      } else {
        video.pause();
        card.classList.remove("playing");
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".project-card").forEach(card => {
    cardVideoObserver.observe(card);
    const video = card.querySelector("video");

    function playPreview() {
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      video.currentTime = 0;
      video.play().then(() => card.classList.add("playing")).catch(() => {});
    }
    function stopPreview() {
      video.pause();
      card.classList.remove("playing");
    }

    if (!isCoarsePointer) {
      card.addEventListener("mouseenter", playPreview);
      card.addEventListener("mouseleave", stopPreview);
      card.addEventListener("focus", playPreview);
      card.addEventListener("blur", stopPreview);
    }

    card.addEventListener("click", () => openLightbox(Number(card.dataset.index)));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(Number(card.dataset.index));
      }
    });
  });

  /* ----------------------------------------------------------
     10. FILTERS
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const value = btn.dataset.filter;
      document.querySelectorAll(".project-card").forEach(card => {
        const show = value === "all" || card.dataset.category === value;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ----------------------------------------------------------
     11. LIGHTBOX VIEWER
     ---------------------------------------------------------- */
  const lightbox      = document.getElementById("lightbox");
  const lbVideo        = document.getElementById("lightboxVideo");
  const lbTitle        = document.getElementById("lbTitle");
  const lbCategory     = document.getElementById("lbCategory");
  const lbCurrent      = document.getElementById("lbCurrent");
  const lbTotal        = document.getElementById("lbTotal");
  const lbClose        = document.getElementById("lbClose");
  const lbPrev         = document.getElementById("lbPrev");
  const lbNext         = document.getElementById("lbNext");
  const lbPlayPauseBtn = document.getElementById("lbPlayPause");
  const lbMuteBtn      = document.getElementById("lbMute");
  const lbFullscreenBtn= document.getElementById("lbFullscreen");
  const lbProgressBar  = document.getElementById("lbProgressBar");

  let currentIndex = 0;
  lbTotal.textContent = String(projects.length).padStart(2, "0");

  function loadLightboxProject(index) {
    currentIndex = (index + projects.length) % projects.length;
    const p = projects[currentIndex];
    lbVideo.pause();
    lbVideo.src = p.video;
    lbVideo.poster = p.poster;
    lbVideo.muted = true;
    lbMuteBtn.textContent = "Unmute";
    lbVideo.play().catch(() => {});
    lbTitle.textContent = p.title;
    lbCategory.textContent = `${p.num} — ${p.type}`;
    lbCurrent.textContent = p.num;
    lbProgressBar.style.width = "0%";
  }

  function openLightbox(index) {
    loadLightboxProject(index);
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
    lbClose.focus();
  }
  function closeLightbox() {
    lbVideo.pause();
    lbVideo.removeAttribute("src");
    lbVideo.load();
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
  }

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lbPrev.addEventListener("click", () => loadLightboxProject(currentIndex - 1));
  lbNext.addEventListener("click", () => loadLightboxProject(currentIndex + 1));

  lbPlayPauseBtn.addEventListener("click", () => {
    if (lbVideo.paused) { lbVideo.play(); lbPlayPauseBtn.querySelector(".icon-pause").style.opacity = 0; }
    else { lbVideo.pause(); lbPlayPauseBtn.querySelector(".icon-pause").style.opacity = 1; }
  });
  lbMuteBtn.addEventListener("click", () => {
    lbVideo.muted = !lbVideo.muted;
    lbMuteBtn.textContent = lbVideo.muted ? "Unmute" : "Mute";
  });
  lbFullscreenBtn.addEventListener("click", () => {
    if (lbVideo.requestFullscreen) lbVideo.requestFullscreen();
  });
  lbVideo.addEventListener("timeupdate", () => {
    if (lbVideo.duration) {
      lbProgressBar.style.width = `${(lbVideo.currentTime / lbVideo.duration) * 100}%`;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") loadLightboxProject(currentIndex - 1);
    if (e.key === "ArrowRight") loadLightboxProject(currentIndex + 1);
  });

  // Basic swipe support on mobile
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) loadLightboxProject(currentIndex - 1);
      else loadLightboxProject(currentIndex + 1);
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     12. CUSTOM CURSOR (subtle, desktop only)
     ---------------------------------------------------------- */
  if (!isCoarsePointer && window.matchMedia("(hover: hover)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "cursor-dot";
    document.body.appendChild(cursor);

    window.addEventListener("mousemove", (e) => {
      cursor.classList.add("active");
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    document.querySelectorAll("a, button, .project-card").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
    });
  }

})();
