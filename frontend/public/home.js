/* eslint-disable */
// Content schema contract for homepage-driven sections.
const CONTENT_SCHEMA = {
  notices: ["title", "date"],
  events: ["title", "location", "day", "month"],
  departments: ["title", "subtitle", "icon"],
  quickLinks: ["label", "href"],
  heroLinks: ["label", "href"],
  gallery: ["group", "cover", "photos"],
};
const getRootPrefix = () => {
  const scriptEl = document.querySelector('script[src*="home.js"]');
  if (scriptEl) {
    const src = scriptEl.getAttribute('src');
    const match = src.match(/^(.*)home\.js/);
    if (match) return match[1];
  }
  return "";
};
const ROOT_PREFIX = getRootPrefix();
const LINK_READY_MODE = true;
const AQI_POLL_INTERVAL_MS = 15 * 60 * 1000;
const BHUBANESWAR_COORDS = { lat: 20.2961, lon: 85.8245 };
const AQI_CACHE_KEY = "outr_live_aqi_v1";

const FALLBACK_CONTENT_DATA = {
  meta: { lastUpdated: {} },
  notices: [],
  events: [],
  departments: [],
  quickLinks: [],
  heroLinks: [],
  gallery: [],
  footer: {
    identity: {
      logo: "https://outr.ac.in/public/uploads/logo_4.png",
      line1: "Odisha University of",
      line2: "Technology and Research",
      address: ["Techno Campus, Ghatikia", "Bhubaneswar, Odisha - 751029", "India"],
      phone: "0674-2725223",
      email: "registrar@outr.ac.in",
      social: [],
    },
    columns: { quickLinks: [], academics: [], contact: [] },
    aqi: { value: "--", status: "Unavailable", location: "Bhubaneswar" },
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.5!2d85.776639!3d20.275845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7f9d486f7c3%3A0xde71ead59307dcca!2sOdisha%20University%20of%20Technology%20and%20Research!5e0!3m2!1sen!2sin!4v1710000000000",
    copyright: "© 2025 Odisha University of Technology and Research. All Rights Reserved.",
  },
};
let contentData = null;
let liveAqiData = null;
let aqiLoading = true;

function formatUpdatedDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getLastUpdated(key) {
  return contentData?.meta?.lastUpdated?.[key] || "";
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureContentShape(raw) {
  const safe = raw && typeof raw === "object" ? raw : {};
  return {
    ...FALLBACK_CONTENT_DATA,
    ...safe,
    meta: {
      ...FALLBACK_CONTENT_DATA.meta,
      ...(safe.meta || {}),
      lastUpdated: {
        ...FALLBACK_CONTENT_DATA.meta.lastUpdated,
        ...(safe.meta?.lastUpdated || {}),
      },
    },
    notices: ensureArray(safe.notices),
    events: ensureArray(safe.events),
    departments: ensureArray(safe.departments),
    quickLinks: ensureArray(safe.quickLinks),
    heroLinks: ensureArray(safe.heroLinks),
    gallery: ensureArray(safe.gallery),
    footer: {
      ...FALLBACK_CONTENT_DATA.footer,
      ...(safe.footer || {}),
      identity: {
        ...FALLBACK_CONTENT_DATA.footer.identity,
        ...(safe.footer?.identity || {}),
        address: ensureArray(safe.footer?.identity?.address),
        social: ensureArray(safe.footer?.identity?.social),
      },
      columns: {
        quickLinks: ensureArray(safe.footer?.columns?.quickLinks),
        academics: ensureArray(safe.footer?.columns?.academics),
        contact: ensureArray(safe.footer?.columns?.contact),
      },
      aqi: {
        ...FALLBACK_CONTENT_DATA.footer.aqi,
        ...(safe.footer?.aqi || {}),
      },
    },
  };
}

function renderFreshnessBadges() {
  const noticeNode = document.getElementById("notice-last-updated");
  const eventsNode = document.getElementById("events-last-updated");
  const noticesDate = formatUpdatedDate(getLastUpdated("notices"));
  const eventsDate = formatUpdatedDate(getLastUpdated("events"));
  if (noticeNode) {
    noticeNode.innerHTML = noticesDate ? `<span data-i18n="common.lastUpdated">Last updated</span>: ${noticesDate}` : "";
  }
  if (eventsNode) {
    eventsNode.innerHTML = eventsDate ? `<span data-i18n="common.lastUpdated">Last updated</span>: ${eventsDate}` : "";
  }
}

function validateContentSchema(data, schema) {
  Object.entries(schema).forEach(([section, keys]) => {
    if (!Array.isArray(data[section])) {
      console.warn(`Schema warning: '${section}' is not an array.`);
      return;
    }
    data[section].forEach((item, idx) => {
      keys.forEach((key) => {
        if (!(key in item)) {
          console.warn(`Schema warning: '${section}[${idx}]' missing '${key}'.`);
        }
      });
    });
  });
  const footer = data.footer;
  if (!footer || typeof footer !== "object") {
    console.warn("Schema warning: 'footer' object missing.");
    return;
  }
  if (!footer.identity || !footer.columns || !footer.aqi) {
    console.warn("Schema warning: footer missing one of identity/columns/aqi.");
  }
  if (!footer.columns?.quickLinks || !footer.columns?.academics || !footer.columns?.contact) {
    console.warn("Schema warning: footer columns are incomplete.");
  }
}

function normalizeHref(href) {
  if (!href || href.trim() === "") return "#";
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  if (!LINK_READY_MODE && href !== "#about" && href !== "#hero" && href !== "#notices" && href !== "#footer" && href !== "social.html") {
    return "#";
  }
  if (href.startsWith("#")) {
    if (ROOT_PREFIX && href !== "#") {
      return `${ROOT_PREFIX}index.html${href}`;
    }
    return href;
  }
  return ROOT_PREFIX + href;
}

async function loadHomeContent() {
  const lang = localStorage.getItem("outr_ui_language_v1") || "en";
  const langSuffix = lang === "en" ? "" : `_${lang}`;
  try {
    let res = await fetch(`${ROOT_PREFIX}data/home${langSuffix}.json`, { cache: "no-store" });
    if (!res.ok && lang !== "en") {
      res = await fetch(`${ROOT_PREFIX}data/home.json`, { cache: "no-store" });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const homeData = await res.json();
    contentData = ensureContentShape(homeData);
  } catch (err) {
    console.warn("Falling back to in-file content data because data/home.json could not be loaded:", err);
    contentData = ensureContentShape(FALLBACK_CONTENT_DATA);
  }
}

function getAqiStatus(aqi) {
  if (aqi <= 50) return { label: "Good", color: "#16a34a" };
  if (aqi <= 100) return { label: "Moderate", color: "#ca8a04" };
  if (aqi <= 150) return { label: "Poor", color: "#dc2626" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#9f1239" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#6b21a8" };
  return { label: "Hazardous", color: "#7f1d1d" };
}

async function fetchLiveAQI() {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${BHUBANESWAR_COORDS.lat}&longitude=${BHUBANESWAR_COORDS.lon}&current=us_aqi,pm2_5`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`AQI HTTP ${res.status}`);
  const json = await res.json();
  const current = json?.current;
  if (!current || typeof current.us_aqi !== "number") throw new Error("AQI payload missing us_aqi");
  if (!Number.isFinite(current.us_aqi)) throw new Error("AQI payload has non-finite us_aqi");
  const status = getAqiStatus(current.us_aqi);
  return {
    value: String(Math.round(current.us_aqi)),
    status: status.label,
    statusColor: status.color,
    location: `PM2.5 ${typeof current.pm2_5 === "number" ? `· ${current.pm2_5.toFixed(1)} ug/m3` : ""} · Bhubaneswar`,
    updatedAt: Date.now(),
  };
}

function loadAqiFromCache() {
  try {
    const raw = localStorage.getItem(AQI_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.value || !parsed.status) return null;
    return parsed;
  } catch (err) {
    console.warn("Failed to parse AQI cache.", err);
    return null;
  }
}

function saveAqiToCache(aqi) {
  try {
    localStorage.setItem(AQI_CACHE_KEY, JSON.stringify(aqi));
  } catch (err) {
    console.warn("Failed to save AQI cache.", err);
  }
}

async function refreshLiveAQI(shouldRerender = false) {
  try {
    liveAqiData = await fetchLiveAQI();
    saveAqiToCache(liveAqiData);
    aqiLoading = false;
    if (shouldRerender) renderFooter();
  } catch (err) {
    aqiLoading = false;
    console.warn("Live AQI unavailable, using fallback AQI.", err);
    if (shouldRerender) renderFooter();
  }
}

function renderQuickLinks() {
  const root = document.getElementById("quick-links");
  if (!root) return;
  root.innerHTML = contentData.quickLinks
    .map(
      (link) =>
        `<a href="${normalizeHref(link.href)}" class="px-[18px] py-[7px] border border-[rgba(212,175,55,0.45)] rounded-md text-[12.5px] font-medium text-[var(--accent)] whitespace-nowrap no-underline transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" data-i18n="home.quicklink.${link.label.replace(/\s+/g, '')}">${link.label}</a>`,
    )
    .join("");
}

function renderHeroLinks() {
  const root = document.getElementById("hero-featured-links");
  if (!root || !contentData.heroLinks) return;
  root.innerHTML = contentData.heroLinks
    .map(
      (link) =>
        `<a href="${normalizeHref(link.href)}" class="px-[22px] py-[11px] rounded-lg font-semibold text-[13.5px] no-underline transition-all duration-200 ${
          link.primary
            ? "bg-[var(--accent)] text-[var(--primary)] hover:bg-[#ebd575] shadow-[0_6px_20px_rgba(212,175,55,0.25)] hover:-translate-y-1"
            : "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm hover:-translate-y-1"
        }" data-i18n="home.heroLink.${link.label.replace(/\s+/g, '')}">${link.label}</a>`
    )
    .join("");
}

function renderTicker() {
  const track = document.getElementById("ticker-track");
  if (!track || !contentData.notices) return;
  const recent = contentData.notices.slice(0, 5);
  if (recent.length === 0) {
    const bar = document.getElementById("ticker-bar");
    if(bar) bar.style.display = "none";
    return;
  }
  const itemsHtml = recent.map(n => `<a href="#notices" class="text-white hover:underline whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white rounded px-1">${n.title}</a>`).join('');
  track.innerHTML = itemsHtml + itemsHtml;
}

function renderNotices() {
  const root = document.getElementById("notice-list");
  if (!root) return;
  if (!contentData.notices || contentData.notices.length === 0) {
    root.innerHTML = `<div class="py-8 text-center text-[var(--muted)] text-[13px] font-medium" data-i18n="empty.notices">No active notices at this time.</div>`;
    return;
  }
  root.innerHTML = contentData.notices
    .map(
      (n) => `
      <div class="py-[11px] border-b border-dashed border-[#e2e8f0] cursor-pointer transition-colors duration-200 hover:text-[var(--secondary)] last:border-b-0">
        <div class="[font-size:13.5px] [font-weight:500]">${n.title}${n.tag ? ` <span class="badge-new">${n.tag}</span>` : ""}</div>
        <div class="[font-size:11px] [color:var(--muted)] [margin-top:3px]">${n.date}</div>
      </div>`,
    )
    .join("");
}

function renderEvents() {
  const root = document.getElementById("events-list");
  if (!root) return;
  if (!contentData.events || contentData.events.length === 0) {
    root.innerHTML = `<div class="py-10 text-center bg-white rounded-xl border border-[#e8eef4] text-[var(--muted)] text-[13px] font-medium" data-i18n="empty.events">No upcoming events scheduled.</div>`;
    return;
  }
  root.innerHTML = contentData.events
    .map(
      (e) => `
      <div class="bg-white rounded-xl [padding:16px] flex [gap:14px] [border:1px_solid_#e8eef4] [transition:all_0.2s] hover:[box-shadow:0_8px_28px_rgba(11,60,93,0.1)] hover:[border-color:#bdd4eb]">
        <div class="text-center rounded-lg [padding:10px_14px] [min-width:56px]" style="background:${e.color}">
          <div class="text-white font-bold [font-size:1.2rem] [line-height:1]">${e.day}</div>
          <div class="[color:rgba(255,255,255,0.65)] [font-size:10px] [margin-top:2px]">${e.month}</div>
        </div>
        <div>
          <div class="font-semibold [font-size:13.5px] [color:var(--text)]">${e.title}</div>
          <div class="[font-size:12px] [color:var(--muted)] [margin-top:4px]">${e.location}</div>
        </div>
      </div>`,
    )
    .join("");
}

function renderGallery() {
  const root = document.getElementById("gallery-grid");
  if (!root || !contentData.gallery?.length) return;
  root.innerHTML = contentData.gallery
    .slice(0, 5)
    .map((album, idx) => {
      const isHero = idx === 0;
      const wrapperClass = isHero
        ? "g-item g-item-hero [grid-column:span_2] [grid-row:span_2] [height:324px]"
        : "g-item [height:156px]";
      const count = album.photos?.length || 0;
      return `<div class="${wrapperClass}" data-album-idx="${idx}" role="button" tabindex="0" aria-label="Open ${album.group} album">
        <img src="${album.cover}" alt="${album.group}" loading="lazy" class="w-full h-full [object-fit:cover]" onerror="this.onerror=null;this.style.display='none';this.parentElement.insertAdjacentHTML('afterbegin','<div class=\\'g-fill\\' style=\\'background:linear-gradient(135deg,#0B3C5D,#1f5a8a);width:100%;height:100%\\'></div>')" />
        <div class="g-overlay">
          <div class="g-album-info">
            <span class="g-label">${album.group}</span>
            <span class="g-count">${count} photo${count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>`;
    })
    .join("");
  initGalleryLightbox();
}

function initGalleryLightbox() {
  // Create lightbox modal if not exists
  let lb = document.getElementById("gallery-lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.id = "gallery-lightbox";
    lb.className = "gallery-lb";
    lb.innerHTML = `
      <div class="gallery-lb-backdrop"></div>
      <div class="gallery-lb-container">
        <div class="gallery-lb-header">
          <div class="gallery-lb-title"></div>
          <button class="gallery-lb-close" aria-label="Close gallery">&times;</button>
        </div>
        <div class="gallery-lb-body">
          <button class="gallery-lb-nav gallery-lb-prev" aria-label="Previous photo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div class="gallery-lb-img-wrap">
            <img class="gallery-lb-img" src="" alt="" />
            <div class="gallery-lb-caption"></div>
          </div>
          <button class="gallery-lb-nav gallery-lb-next" aria-label="Next photo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
          </button>
        </div>
        <div class="gallery-lb-thumbs"></div>
        <div class="gallery-lb-counter"></div>
      </div>
    `;
    document.body.appendChild(lb);

    // Close handlers
    lb.querySelector(".gallery-lb-backdrop").addEventListener("click", closeLightbox);
    lb.querySelector(".gallery-lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".gallery-lb-prev").addEventListener("click", () => navigateLightbox(-1));
    lb.querySelector(".gallery-lb-next").addEventListener("click", () => navigateLightbox(1));

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    });
  }

  let currentAlbum = null;
  let currentIdx = 0;

  function openLightbox(albumIdx, photoIdx = 0) {
    currentAlbum = contentData.gallery[albumIdx];
    if (!currentAlbum || !currentAlbum.photos?.length) return;
    currentIdx = photoIdx;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".gallery-lb-title").textContent = currentAlbum.group;
    renderThumbs();
    showPhoto(currentIdx);
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function showPhoto(idx) {
    if (!currentAlbum) return;
    const photos = currentAlbum.photos;
    currentIdx = ((idx % photos.length) + photos.length) % photos.length;
    const photo = photos[currentIdx];
    lb.querySelector(".gallery-lb-img").src = photo.image;
    lb.querySelector(".gallery-lb-img").alt = photo.label;
    lb.querySelector(".gallery-lb-caption").textContent = photo.label;
    lb.querySelector(".gallery-lb-counter").textContent = `${currentIdx + 1} / ${photos.length}`;
    // Update active thumb
    lb.querySelectorAll(".gallery-lb-thumb").forEach((t, i) => {
      t.classList.toggle("active", i === currentIdx);
    });
    // Hide nav if only 1 photo
    lb.querySelector(".gallery-lb-prev").style.display = photos.length <= 1 ? "none" : "";
    lb.querySelector(".gallery-lb-next").style.display = photos.length <= 1 ? "none" : "";
  }

  function navigateLightbox(delta) {
    if (!currentAlbum) return;
    showPhoto(currentIdx + delta);
  }

  function renderThumbs() {
    const strip = lb.querySelector(".gallery-lb-thumbs");
    if (!currentAlbum) return;
    strip.innerHTML = currentAlbum.photos
      .map((p, i) => `<img class="gallery-lb-thumb ${i === currentIdx ? 'active' : ''}" src="${p.image}" alt="${p.label}" data-idx="${i}" />`)
      .join("");
    strip.querySelectorAll(".gallery-lb-thumb").forEach(t => {
      t.addEventListener("click", () => showPhoto(parseInt(t.dataset.idx)));
    });
  }

  function openFullGallery() {
    // Merge all photos from all albums into one virtual album
    const allPhotos = [];
    contentData.gallery.forEach(album => {
      (album.photos || []).forEach(p => {
        allPhotos.push({ image: p.image, label: `${p.label} — ${album.group}` });
      });
    });
    if (!allPhotos.length) return;
    currentAlbum = { group: "All Photos", photos: allPhotos };
    currentIdx = 0;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".gallery-lb-title").textContent = "All Photos";
    renderThumbs();
    showPhoto(0);
  }

  // Attach click to album covers
  document.querySelectorAll("#gallery-grid [data-album-idx]").forEach(card => {
    const handler = () => openLightbox(parseInt(card.dataset.albumIdx));
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") handler(); });
  });

  // Attach "View Full Gallery" button
  const fullBtn = document.getElementById("view-full-gallery");
  if (fullBtn) fullBtn.addEventListener("click", openFullGallery);
}

function renderFooter() {
  const grid = document.getElementById("footer-grid");
  const bottom = document.getElementById("footer-bottom-bar");
  if (!grid) return;
  const fallbackFooter = FALLBACK_CONTENT_DATA.footer;
  const rawFooter = contentData?.footer || {};
  const f = {
    identity: {
      ...fallbackFooter.identity,
      ...(rawFooter.identity || {}),
      address: Array.isArray(rawFooter.identity?.address)
        ? rawFooter.identity.address
        : fallbackFooter.identity.address,
      social: Array.isArray(rawFooter.identity?.social)
        ? rawFooter.identity.social
        : fallbackFooter.identity.social,
    },
    columns: {
      quickLinks: Array.isArray(rawFooter.columns?.quickLinks)
        ? rawFooter.columns.quickLinks
        : fallbackFooter.columns.quickLinks,
      academics: Array.isArray(rawFooter.columns?.academics)
        ? rawFooter.columns.academics
        : fallbackFooter.columns.academics,
      contact: Array.isArray(rawFooter.columns?.contact)
        ? rawFooter.columns.contact
        : fallbackFooter.columns.contact,
    },
    aqi: {
      ...fallbackFooter.aqi,
      ...(rawFooter.aqi || {}),
    },
    map: rawFooter.map || fallbackFooter.map,
    copyright: rawFooter.copyright || fallbackFooter.copyright,
  };
  const fallbackAqi = f?.aqi || FALLBACK_CONTENT_DATA.footer.aqi;
  const cachedAqi = loadAqiFromCache();
  const aqi = {
    value: fallbackAqi?.value ?? "--",
    status: fallbackAqi?.status ?? "Unavailable",
    location: fallbackAqi?.location ?? "Bhubaneswar",
    ...(cachedAqi || {}),
    ...(liveAqiData || {}),
  };
  const aqiBadgeColor =
    liveAqiData?.statusColor || cachedAqi?.statusColor || "#dc2626";
  
  const aqiSourceKey = liveAqiData ? "footer.source.live" : cachedAqi ? "footer.source.cached" : aqiLoading ? "footer.source.loading" : "footer.source.fallback";
  const aqiSource = liveAqiData ? "Live" : cachedAqi ? "Cached" : aqiLoading ? "Loading" : "Fallback";
  const footerUpdated = formatUpdatedDate(getLastUpdated("footer"));
  const aqiUpdated = liveAqiData?.updatedAt
    ? new Date(liveAqiData.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  
  const aqiDisplayValue = aqiLoading && !liveAqiData && !cachedAqi ? "--" : aqi.value || "--";
  
  const aqiDisplayStatusKey = aqiLoading && !liveAqiData && !cachedAqi ? "footer.status.loading" : `footer.status.${(aqi.status || "Unavailable").toLowerCase()}`;
  const aqiDisplayStatus = aqiLoading && !liveAqiData && !cachedAqi ? "Loading..." : aqi.status || "Unavailable";
  
  const aqiDisplayLocationKey = aqiLoading && !liveAqiData && !cachedAqi ? "footer.location.fetching" : "";
  const aqiDisplayLocation = aqiLoading && !liveAqiData && !cachedAqi ? "Fetching live AQI for Bhubaneswar" : aqi.location || "Bhubaneswar";

  const linkClass =
    "block text-[14px] text-[#8ca8c0] no-underline mb-2 transition-colors duration-200 hover:text-[var(--accent)]";
  const titleClass =
    "text-[15px] font-semibold text-white mb-[14px] pb-2 border-b border-[rgba(212,175,55,0.28)]";
  const socialSvgs = {
    facebook: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.203 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.822a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.258 5.635zM16.99 20.25h1.832L7.382 3.864H5.405l11.585 16.386z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.258 5.635zM16.99 20.25h1.832L7.382 3.864H5.405l11.585 16.386z"/></svg>',
  };

  const renderColumn = (title, links) =>
    `<div class="flex flex-col items-center lg:items-start text-center lg:text-left"><div class="${titleClass} inline-block">${title}</div>${links
      .map((l) => `<a href="${normalizeHref(l.href)}" class="${linkClass}">${l.label}</a>`)
      .join("")}</div>`;

  grid.innerHTML = `
    <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
      <div class="flex items-center justify-center lg:justify-start [gap:16px] [margin-bottom:18px]">
        <img src="${f.identity.logo}" alt="OUTR" class="[height:76px] [width:auto]" />
        <div class="text-left">
          <div class="text-white font-bold [font-size:16px] [line-height:1.4]">${f.identity.line1}</div>
          <div class="text-white font-bold [font-size:16px] [line-height:1.4]">${f.identity.line2}</div>
        </div>
      </div>
      <p class="[font-size:14px] [line-height:1.9] [color:#8ca8c0] [margin-top:8px]">${f.identity.address.join("<br />")}</p>
      <div class="[margin-top:12px] [line-height:1.9]">
        <div class="[font-size:13.5px] [color:#8ca8c0]">&#128222; ${f.identity.phone}</div>
        <div class="[font-size:13.5px] [color:#8ca8c0]">&#9993; ${f.identity.email}</div>
      </div>
      <div class="flex justify-center lg:justify-start [gap:10px] [margin-top:18px]">
        ${f.identity.social
          .map(
            (s) =>
              `<a href="${normalizeHref(s.href)}" target="_blank" rel="noopener noreferrer" class="footer-social-link [width:40px] [height:40px] rounded-full [border:1px_solid_rgba(255,255,255,0.12)] flex items-center justify-center [color:#8ca8c0] no-underline [transition:all_0.2s] hover:bg-white/10 hover:text-white hover:scale-105">${socialSvgs[(s.icon || "").toLowerCase()] || ""}</a>`,
          )
          .join("")}
      </div>
    </div>
    ${renderColumn("Quick Links", f.columns.quickLinks)}
    ${renderColumn("Contact", f.columns.contact)}
    <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
      <div class="${titleClass} inline-block" data-i18n="footer.bhubaneswarLive">Bhubaneswar Live</div>
      <div class="aqi-box [margin-bottom:12px] w-full max-w-[280px]">
        <div class="flex justify-between items-center [margin-bottom:7px]">
          <span class="[font-size:12px] [color:#8ca8c0]" data-i18n="footer.aqiLabel">Air Quality Index</span>
          <span class="[font-size:12px] text-white [padding:3px_10px] [border-radius:999px] font-semibold" style="background:${aqiBadgeColor}" data-i18n="${aqiDisplayStatusKey}">${aqiDisplayStatus}</span>
        </div>
        <div class="[font-size:2.5rem] font-bold text-white [line-height:1] text-left">${aqiDisplayValue}</div>
        <div class="[font-size:12px] [color:#8ca8c0] [margin-top:4px] text-left" ${aqiDisplayLocationKey ? `data-i18n="${aqiDisplayLocationKey}"` : ""}>${aqiDisplayLocation}</div>
        <div class="[font-size:11px] [color:#94a3b8] [margin-top:6px] text-left"><span data-i18n="footer.sourceLabel">Source:</span> <span data-i18n="${aqiSourceKey}">${aqiSource}</span>${aqiUpdated ? ` · ${aqiUpdated}` : ""}</div>
        ${footerUpdated ? `<div class="[font-size:10.5px] [color:#8ca8c0] [margin-top:4px] text-left"><span data-i18n="common.lastUpdated">Last updated</span>: ${footerUpdated}</div>` : ""}
      </div>
      <div class="rounded-lg overflow-hidden [height:130px] w-full max-w-[280px] lg:max-w-full">
        <iframe src="${f.map}" width="100%" height="130" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="[border:0] [filter:invert(90%)_hue-rotate(180deg)]"></iframe>
      </div>
    </div>
  `;

  if (bottom) {
    bottom.innerHTML = `<div class="max-w-7xl mx-auto px-5 py-5 flex [flex-wrap:wrap] justify-between items-center [gap:8px]"><div class="[font-size:13px] [color:#94a3b8]">${f.copyright}</div></div>`;
  }
  if (window.reapplyTranslations) window.reapplyTranslations();
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchFilters = document.getElementById("search-filters");
  const searchClose = document.getElementById("search-close");
  const searchBar = document.getElementById("search-bar");
  const searchBtn = document.getElementById("search-btn");
  const searchLive = document.getElementById("search-live-region");
  if (!searchInput || !searchResults || !searchClose || !searchBar || !searchBtn || !searchFilters) return;
  const announceSearchStatus = (message) => {
    if (!searchLive) return;
    searchLive.textContent = "";
    requestAnimationFrame(() => {
      searchLive.textContent = message;
    });
  };
  const focusSearchInput = () => {
    const doFocus = () => {
      searchInput.focus({ preventScroll: true });
      searchInput.select();
    };
    requestAnimationFrame(doFocus);
    setTimeout(doFocus, 80);
    setTimeout(doFocus, 180);
  };
  const closeSearchPanel = () => {
    searchBar.classList.remove("open");
    searchResults.style.display = "none";
    searchFilters.style.display = "none";
    searchInput.value = "";
    activeQuery = "";
    setActiveFilter("all");
  };

  const RECENT_KEY = "outr_search_recent_v1";
  const departmentsSectionVisible = !!document.querySelector("#departments:not(.hidden)");
  const index = [
    ...contentData.quickLinks.map((x) => ({ title: x.label, subtitle: "Quick Link", href: x.href, category: "quickLinks", weight: 70 })),
    ...contentData.notices.map((x) => ({ title: x.title, subtitle: `Notice · ${x.date}`, href: "#notices", category: "notices", weight: 85 })),
    ...contentData.events.map((x) => ({ title: x.title, subtitle: `Event · ${x.location}`, href: "#notices", category: "events", weight: 90 })),
    ...(departmentsSectionVisible
      ? contentData.departments.map((x) => ({ title: x.title, subtitle: "Department", href: "#departments", category: "departments", weight: 55 }))
      : []),
    { title: "Hero Section", subtitle: "Section · Highlights and calls to action", href: "#hero", category: "sections", weight: 88 },
    { title: "About OUTR", subtitle: "Section · University profile", href: "#about", category: "sections", weight: 95 },
    { title: "Leadership Message", subtitle: "Section · Vice-Chancellor and Chancellor", href: "#leadership", category: "sections", weight: 82 },
    { title: "Notice Board", subtitle: "Section · Latest updates", href: "#notices", category: "sections", weight: 90 },
    { title: "Campus Stats", subtitle: "Section · Students, faculty, departments", href: "#stats", category: "sections", weight: 70 },
    { title: "Gallery", subtitle: "Section · Campus life", href: "#gallery", category: "sections", weight: 78 },
    { title: "Recruiters", subtitle: "Section · Industry partners", href: "#recruiters", category: "sections", weight: 74 },
    { title: "Contact and Footer", subtitle: "Section · Address, links, and AQI", href: "#footer", category: "sections", weight: 80 },
    { title: "OUTR Campus Map", subtitle: "Map · Open Google Maps location", href: "https://maps.google.com/?q=Odisha+University+of+Technology+and+Research", category: "contact", weight: 96, external: true },
    { title: "Social Media Hub", subtitle: "Connect · Official handles", href: "social.html", category: "contact", weight: 72 },
    // --- NAV: About ---
    { title: "About OUTR", subtitle: "Nav · About → Overview & history", href: "OUTR website/about.html", category: "sections", weight: 95 },
    { title: "Vision and Mission", subtitle: "Nav · About → Core values & goals", href: "OUTR website/mission&vission.html", category: "sections", weight: 80 },
    { title: "Accreditation", subtitle: "Nav · About → NAAC, NBA, UGC recognition", href: "OUTR website/about.html#accreditation", category: "sections", weight: 78 },
    // --- NAV: Academic ---
    { title: "Academic", subtitle: "Nav · Academic section", href: departmentsSectionVisible ? "#departments" : "#about", category: "sections", weight: 85 },
    { title: "Committees", subtitle: "Nav · Academic → Academic boards & groups", href: "administration/SA_commitee.html", category: "sections", weight: 70 },
    { title: "Syllabus", subtitle: "Nav · Academic → UG and PG course syllabi", href: "OUTR website/courses/scs/UGcourses.html", category: "sections", weight: 72 },
    { title: "Academic Calendar", subtitle: "Nav · Academic → Schedule & important dates", href: "#", category: "sections", weight: 74 },
    // --- NAV: Academic → Departments (Schools) ---
    ...(departmentsSectionVisible
      ? [
          { title: "School of Computer Sciences", subtitle: "Nav · Departments → CSE · IT · MCA · AI&ML", href: "OUTR website/schools/scs.html", category: "departments", weight: 90 },
          { title: "School of Mechanical Sciences", subtitle: "Nav · Departments → ME · R&AI · IEM · D&D", href: "OUTR website/schools/sms.html", category: "departments", weight: 88 },
          { title: "School of Infrastructure & Planning", subtitle: "Nav · Departments → Civil · B.Arch · B.Plan · WRE", href: "OUTR website/schools/sIp.html", category: "departments", weight: 86 },
          { title: "School of Electronic Sciences", subtitle: "Nav · Departments → ECE · EIE · VLSI · ICE", href: "OUTR website/schools/sElectronics.html", category: "departments", weight: 88 },
          { title: "School of Electrical Sciences", subtitle: "Nav · Departments → Electrical Engineering", href: "OUTR website/schools/sElectricals.html", category: "departments", weight: 84 },
          { title: "School of Basic Sciences & Humanities", subtitle: "Nav · Departments → Physics, Chemistry, Maths, English", href: "OUTR website/schools/sbsh.html", category: "departments", weight: 80 },
          { title: "Biotechnology Department", subtitle: "Nav · Departments → Biotech & Life Sciences", href: "OUTR website/schools/btd.html", category: "departments", weight: 78 },
          { title: "Textile Engineering Department", subtitle: "Nav · Departments → Textile & Fiber Engineering", href: "OUTR website/schools/ted.html", category: "departments", weight: 76 },
        ]
      : []),
    // --- NAV: Administration ---
    { title: "VC Desk", subtitle: "Nav · Administration → Vice-Chancellor's message", href: "administration/Vcdesk.html", category: "sections", weight: 88 },
    { title: "Board of Management", subtitle: "Nav · Administration → Governance board", href: "administration/BOM.html", category: "sections", weight: 82 },
    { title: "Dean", subtitle: "Nav · Administration → Dean of the university", href: "administration/Dean.html", category: "sections", weight: 80 },
    { title: "HODs", subtitle: "Nav · Administration → Heads of Departments", href: "administration/HOD.html", category: "sections", weight: 78 },
    { title: "Anti-Ragging", subtitle: "Nav · Administration → Anti-ragging committee", href: "administration/Antiragging.html", category: "sections", weight: 76 },
    { title: "Academic Council", subtitle: "Nav · Administration → Academic council members", href: "administration/AR_commitee.html", category: "sections", weight: 74 },
    { title: "Students Grievance", subtitle: "Nav · Administration → Grievance redressal", href: "administration/L_commitee.html", category: "sections", weight: 74 },
    { title: "Controller of Exam", subtitle: "Nav · Administration → Examination controller", href: "administration/COE.html", category: "sections", weight: 72 },
    { title: "Students Committee", subtitle: "Nav · Administration → Student representation", href: "administration/SA_commitee.html", category: "sections", weight: 70 },
    { title: "SC/ST Committee", subtitle: "Nav · Administration → SC/ST welfare committee", href: "administration/SA_commitee.html", category: "sections", weight: 70 },
    // --- NAV: Student ---
    { title: "Event", subtitle: "Nav · Student → Fests & campus activities", href: "#notices", category: "sections", weight: 80 },
    { title: "Society / Clubs", subtitle: "Nav · Student → Join student organizations", href: "administration/SA_commitee.html", category: "sections", weight: 78 },
    { title: "Hostels", subtitle: "Nav · Student → Accommodation details", href: "Student and Event/Hostel/hostel.html", category: "sections", weight: 76 },
    { title: "Campus Life", subtitle: "Nav · Student → Experience life at OUTR", href: "Student and Event/Campus_Facilities/CampusLife.html", category: "sections", weight: 74 },
    // --- NAV: Contact ---
    { title: "Address & Map", subtitle: "Nav · Contact → Techno Campus, Ghatikia, BBSR", href: "OUTR website/location.html", category: "contact", weight: 82 },
    { title: "Phone & Email", subtitle: "Nav · Contact → Get in touch with us", href: "OUTR website/location.html", category: "contact", weight: 80 },
    // --- SERVICES ACADEMIC PORTAL & SUB-DESKS ---
    { title: "Services Academic Portal Hub", subtitle: "Portal · Access student clearance, warden, admin, and staff dashboards", href: "/?view=portal", category: "portal", weight: 99 },
    { title: "Warden Portal / Hostel Desk", subtitle: "Portal · Hostel check-ins, allocations, student registers, and warden controls", href: "/?view=warden", category: "portal", weight: 98 },
    { title: "Student Clearance Tracker", subtitle: "Portal · Submit clearance requests, view clearance pipeline, and track files", href: "/?view=auth&role=student", category: "portal", weight: 98 },
    { title: "Exam Controller Portal & Grade Cards", subtitle: "Portal · Input and issue student semester results, GPA statistics, and grade cards", href: "/?view=auth&role=controller", category: "portal", weight: 98 },
    { title: "Issue Admit Cards & Tickets", subtitle: "Portal · Issue scheduled exams, print high-fidelity candidate admit cards", href: "/?view=auth&role=controller", category: "portal", weight: 97 },
    { title: "View My Semester Results", subtitle: "Portal · Query real-time grade sheets, pass/fail status, and GPA", href: "/?view=auth&role=student", category: "portal", weight: 96 },
    { title: "Download My Admit Card", subtitle: "Portal · Access official candidates admit card and print A4 tickets", href: "/?view=auth&role=student", category: "portal", weight: 96 },
    { title: "Administrator Portal Control Desk", subtitle: "Portal · Admin system statistics, role allocation, and database status", href: "/?view=auth&role=admin", category: "portal", weight: 95 },
    { title: "Advisor Clearance Desk", subtitle: "Portal · Staff advisors verify academic records and clear student tracks", href: "/?view=auth&role=adviser", category: "portal", weight: 90 },
    { title: "Head of School (HOS) Clearance Desk", subtitle: "Portal · School heads verify and issue dynamic clearances", href: "/?view=auth&role=hos", category: "portal", weight: 90 },
    { title: "Deans Clearance Desks", subtitle: "Portal · Deans perform final clearance review and authorize graduation", href: "/?view=auth&role=dean_pga", category: "portal", weight: 90 },
  ];
  let activeFilter = "all";
  let currentItems = [];
  let activeQuery = "";

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const getRecentSearches = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const saveRecentSearch = (term) => {
    const value = term.trim();
    if (!value) return;
    const merged = [value, ...getRecentSearches().filter((x) => x.toLowerCase() !== value.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(merged));
  };

  // 1. Initialize Fuse.js for approximate matching
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 1.0 },
      { name: 'subtitle', weight: 0.5 }
    ],
    threshold: 0.4,       // 0.0 is perfect match, 1.0 is mismatch
    distance: 100,        // Proximity of matches
    ignoreLocation: true, // Matches regardless of position in the string
    findAllMatches: true
  };

  const fuse = new Fuse(index, fuseOptions);

  // 2. Debouncing implementation to save CPU resources
  let debounceTimeoutId = null;
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => func(...args), delay);
    };
  };

  function getFilteredIndex(query) {
    if (!query) return [];
    
    // Fuzzy matching query execution
    const fuseResults = fuse.search(query);

    return fuseResults
      .map(result => ({
        ...result.item,
        score: result.score
      }))
      .filter((item) => {
        const filterMatch = activeFilter === "all" || item.category === activeFilter;
        if (!filterMatch) return false;

        // Keep existing DOM element scroll validation intact
        const isNavItem = item.subtitle.startsWith("Nav ·");
        if (!isNavItem && (!item.href || item.href === "#")) return false;
        if (!isNavItem && item.href.startsWith("#") && item.href !== "#" && !document.querySelector(item.href)) return false;
        return true;
      });
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const tokens = query.trim().split(/\s+/);
    let highlighted = text;
    
    tokens.forEach(token => {
      const safe = escapeRegExp(token);
      if (!safe || safe.length < 2) return;
      highlighted = highlighted.replace(
        new RegExp(`(${safe})`, "ig"), 
        '<mark class="bg-[#fde68a] text-[#1e293b] px-[1px] rounded">$1</mark>'
      );
    });
    
    return highlighted;
  }

  function getCategoryLabel(category) {
    const labels = {
      quickLinks: "Quick Link",
      notices: "Notice",
      events: "Event",
      departments: "Department",
      sections: "Section",
      contact: "Contact",
      portal: "Services Portal",
    };
    return labels[category] || "Result";
  }

  function renderRecentSearches() {
    const recent = getRecentSearches();
    if (recent.length === 0) {
      searchResults.innerHTML = `
        <div class="[font-size:12px] [color:#64748b]" data-i18n="search.empty">Type at least 2 characters to search sections, map, events, and links.</div>
        <div class="[font-size:11px] [color:#94a3b8] [margin-top:6px]" data-i18n="search.hint">Hint: ↑ ↓ navigate, Enter open, Esc close</div>
      `;
      searchResults.style.display = "flex";
      searchFilters.style.display = "block";
      announceSearchStatus("No recent searches. Type at least two characters to search.");
      if (window.reapplyTranslations) window.reapplyTranslations();
      return;
    }
    searchResults.innerHTML = `
      <div class="flex items-center justify-between [margin-bottom:6px]">
        <span class="[font-size:11px] font-semibold [color:#94a3b8]" data-i18n="search.recent">Recent searches</span>
        <button type="button" id="search-clear-recent" class="[font-size:11px] text-[#64748b] hover:text-[#0B3C5D]" data-i18n="search.clear">Clear</button>
      </div>
      ${recent
        .map(
          (term) =>
            `<button type="button" data-recent-term="${term.replace(/"/g, "&quot;")}" class="text-left [font-size:13px] [color:#0B3C5D] [padding:7px] [border-radius:6px] hover:[background:#f8fafc]">${term}</button>`,
        )
        .join("")}
    `;
    searchResults.style.display = "flex";
    searchFilters.style.display = "block";
    announceSearchStatus(`Showing ${recent.length} recent searches.`);
    if (window.reapplyTranslations) window.reapplyTranslations();
  }

  function setActiveFilter(filter) {
    activeFilter = filter;
    searchFilters.querySelectorAll("[data-filter]").forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle("bg-[#0B3C5D]", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("border-[#0B3C5D]", isActive);
      btn.classList.toggle("text-[#1e293b]", !isActive);
    });
    const q = searchInput.value.trim().toLowerCase();
    if (q.length >= 2) renderResults(getFilteredIndex(q), q);
  }

  function renderResults(items, query = "") {
    activeQuery = query;
    currentItems = items.slice(0, 8);
    if (items.length === 0) {
      const suggestions = [
        { title: "About OUTR", href: "#about" },
        { title: "Notice Board", href: "#notices" },
        { title: "Campus Map", href: "https://maps.google.com/?q=Odisha+University+of+Technology+and+Research", external: true },
      ];
      searchResults.innerHTML = `
        <div class="[font-size:12px] [color:#64748b]"><span data-i18n="search.noResults">No results found for</span> "${query}".</div>
        <div class="[font-size:11px] [color:#94a3b8] [margin-top:4px]" data-i18n="search.tryThese">Try one of these:</div>
        ${suggestions
          .map((s) => {
            const attrs = s.external ? ' target="_blank" rel="noopener noreferrer"' : "";
            return `<a href="${s.href}"${attrs} class="flex items-center justify-between [padding:8px] [border-radius:6px] [margin-top:4px] hover:[background:#f8fafc] no-underline"><span class="[font-size:13px] [color:#0B3C5D] font-semibold">${s.title}</span><span class="[font-size:10px] px-2 py-[2px] rounded-full [background:#eff6ff] [color:#1f5a8a] font-semibold" data-i18n="search.suggestionBadge">Suggestion</span></a>`;
          })
          .join("")}
        <div class="[font-size:11px] [color:#94a3b8] [margin-top:6px]" data-i18n="search.hint">Hint: ↑ ↓ navigate, Enter open, Esc close</div>
      `;
      searchResults.style.display = "flex";
      searchFilters.style.display = "block";
      announceSearchStatus(`No results found for ${query}.`);
      if (window.reapplyTranslations) window.reapplyTranslations();
      return;
    }
    searchResults.innerHTML = currentItems
      .map((item) => {
        const title = highlightMatch(item.title, query);
        const subtitle = highlightMatch(item.subtitle, query);
        const targetAttrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        const badge = getCategoryLabel(item.category);
        return `<a href="${normalizeHref(item.href)}"${targetAttrs} class="flex flex-col [padding:8px] [border-radius:6px] hover:[background:#f8fafc] [transition:all_0.2s] no-underline"><span class="flex items-center justify-between [gap:8px]"><span class="[color:#0B3C5D] font-semibold [font-size:14px]">${title}</span><span class="[font-size:10px] px-2 py-[2px] rounded-full [background:#eff6ff] [color:#1f5a8a] font-semibold">${badge}</span></span><span class="[color:#64748b] [font-size:12px]">${subtitle}</span></a>`;
      })
      .join("");
    searchResults.style.display = "flex";
    searchFilters.style.display = "block";
    announceSearchStatus(`${currentItems.length} search results shown for ${query}.`);
    searchResults.insertAdjacentHTML(
      "beforeend",
      `<div class="[font-size:11px] [color:#94a3b8] [margin-top:4px]">Hint: ↑ ↓ navigate, Enter open, Esc close</div>`,
    );
    const first = searchResults.querySelector("a");
    if (first) first.dataset.active = "true";
  }

  function handleResultAction(item) {
    if (!item) return;
    saveRecentSearch(activeQuery || item.title);
  }

  function closeFromKeyboard() {
    searchBar.classList.remove("open");
    searchResults.style.display = "none";
    searchFilters.style.display = "none";
    searchInput.value = "";
    activeQuery = "";
    setActiveFilter("all");
  }

  function getResultLinks() {
    return Array.from(searchResults.querySelectorAll("a"));
  }

  function moveActiveResult(delta) {
    const items = getResultLinks();
    if (items.length === 0) return null;
    let idx = items.findIndex((el) => el.dataset.active === "true");
    if (idx < 0) idx = 0;
    items[idx].dataset.active = "false";
    idx = (idx + delta + items.length) % items.length;
    items[idx].dataset.active = "true";
    items[idx].focus();
    return { items, idx };
  }

  searchResults.addEventListener("click", (e) => {
    const clearBtn = e.target.closest("#search-clear-recent");
    if (clearBtn) {
      localStorage.removeItem(RECENT_KEY);
      renderRecentSearches();
      return;
    }
    const recentBtn = e.target.closest("[data-recent-term]");
    if (recentBtn) {
      const term = recentBtn.getAttribute("data-recent-term") || "";
      searchInput.value = term;
      const q = term.toLowerCase();
      renderResults(getFilteredIndex(q), q);
      return;
    }
    const clickedLink = e.target.closest("a");
    if (!clickedLink) return;
    const links = Array.from(searchResults.querySelectorAll("a"));
    const idx = links.indexOf(clickedLink);
    if (idx >= 0) handleResultAction(currentItems[idx]);
  });

  const handleSearchInput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) {
      clearTimeout(debounceTimeoutId);
      if (searchBar.classList.contains("open")) renderRecentSearches();
      else searchResults.style.display = "none";
      searchFilters.style.display = searchBar.classList.contains("open") ? "block" : "none";
      return;
    }
    renderResults(getFilteredIndex(q), q);
  };

  const debouncedSearchInput = debounce(handleSearchInput, 85);

  searchInput.addEventListener("input", (e) => {
    if (e.target.value.trim().length < 2) {
      handleSearchInput(e);
    } else {
      debouncedSearchInput(e);
    }
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = getResultLinks();
    if (items.length === 0) return;
    let idx = items.findIndex((el) => el.dataset.active === "true");
    if (idx < 0) idx = 0;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActiveResult(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActiveResult(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleResultAction(currentItems[idx]);
      items[idx].click();
    } else if (e.key === "Escape") {
      closeFromKeyboard();
    }
  });

  searchResults.addEventListener("keydown", (e) => {
    if (!searchBar.classList.contains("open")) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActiveResult(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActiveResult(-1);
    } else if (e.key === "Enter") {
      const items = getResultLinks();
      if (items.length === 0) return;
      const idx = items.findIndex((el) => el.dataset.active === "true");
      if (idx < 0) return;
      e.preventDefault();
      handleResultAction(currentItems[idx]);
      items[idx].click();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeFromKeyboard();
      focusSearchInput();
    }
  });

  searchBtn.addEventListener("click", () => {
    searchBar.classList.add("open");
    searchFilters.style.display = "block";
    if (searchInput.value.trim().length < 2) renderRecentSearches();
    focusSearchInput();
  });
  searchFilters.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => setActiveFilter(btn.dataset.filter));
  });
  searchClose.addEventListener("click", closeSearchPanel);
  document.addEventListener("click", (e) => {
    if (!searchBar.classList.contains("open")) return;
    if (searchBar.contains(e.target) || searchBtn.contains(e.target)) return;
    closeSearchPanel();
  });
  setActiveFilter("all");
}

function setupComingSoonLinks() {
  const METRICS_KEY = "outr_coming_soon_clicks_v1";
  const placeholders = document.querySelectorAll('a[href="#"]:not([data-allow-placeholder="true"])');
  placeholders.forEach((link) => {
    // Exclude dropdown parent category toggles in navigation
    if (link.classList.contains("nav-link") || link.closest(".nav-item")?.querySelector(".dropdown")) {
      return;
    }
    link.classList.add("coming-soon-link");
    if (!link.hasAttribute("title")) link.setAttribute("title", "Coming soon");
    if (!link.hasAttribute("aria-label")) {
      const base = link.textContent?.trim() || "This link";
      link.setAttribute("aria-label", `${base} (coming soon)`);
    }
    link.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        const label = link.getAttribute("data-i18n") || link.textContent?.trim() || "unknown";
        const metrics = JSON.parse(localStorage.getItem(METRICS_KEY) || "{}");
        metrics[label] = (metrics[label] || 0) + 1;
        localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
      } catch (err) {
        console.warn("Could not persist coming-soon telemetry.", err);
      }
    });
    link.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") e.preventDefault();
    });
  });
}

function setupKnownLinks() {
  const linkMap = {
    "nav.vision.title": "OUTR website/mission&vission.html",
    "nav.accreditation.title": "OUTR website/about.html",
    "nav.committees": "administration/SA_commitee.html",
    "nav.syllabus.title": "OUTR website/courses/scs/UGcourses.html",
    "nav.calendar.title": "#",
    "nav.student.event": "#notices",
    "nav.student.society": "administration/SA_commitee.html",
    "nav.student.hostels": "Student and Event/Hostel/hostel.html",
    "nav.student.campus": "Student and Event/Campus_Facilities/CampusLife.html",
  };
  Object.entries(linkMap).forEach(([key, href]) => {
    document.querySelectorAll(`a[data-i18n="${key}"]`).forEach((a) => {
      a.setAttribute("href", normalizeHref(href));
    });
  });
}

function setupDropdownKeyboard() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("focusin", () => item.classList.add("open"));
    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget)) item.classList.remove("open");
    });
    item.addEventListener("keydown", (e) => {
      const focusable = Array.from(item.querySelectorAll("a, button, input, [tabindex]:not([tabindex='-1'])"));
      if (focusable.length === 0) return;
      const index = focusable.indexOf(document.activeElement);

      if (e.key === "Escape") {
        item.classList.remove("open");
        if (focusable[0]) focusable[0].focus();
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (index + 1) % focusable.length;
        focusable[nextIndex].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (index - 1 + focusable.length) % focusable.length;
        focusable[prevIndex].focus();
      } else if (e.key === "Enter" || e.key === " ") {
        if (index === 0 && focusable[0].tagName !== "A") {
          item.classList.toggle("open");
          e.preventDefault();
        }
      }
    });
  });
}

function setupSafeLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    a.setAttribute("rel", "noopener noreferrer");
  });
}

function setupRecruiterLinks() {
  const recruiterUrlMap = {
    tcs: "https://www.tcs.com/",
    infosys: "https://www.infosys.com/",
    wipro: "https://www.wipro.com/",
    "hcl tech": "https://www.hcltech.com/",
    "tech mahindra": "https://www.techmahindra.com/",
    capgemini: "https://www.capgemini.com/",
    cognizant: "https://www.cognizant.com/",
    "l&t": "https://www.larsentoubro.com/",
    nalco: "https://nalcoindia.com/",
    sail: "https://www.sail.co.in/",
    ongc: "https://www.ongcindia.com/",
    amazon: "https://www.amazon.jobs/",
    ntpc: "https://www.ntpc.co.in/",
    bhel: "https://www.bhel.com/",
  };

  document.querySelectorAll("#recruiters .marquee-track > div > div").forEach((pill) => {
    if (pill.tagName.toLowerCase() === "a") return;
    const company = pill.textContent.trim();
    const url = recruiterUrlMap[company.toLowerCase()];
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = `${pill.className.replace('inline-block', '')} inline-flex items-center no-underline`;
    const domain = new URL(url).hostname.replace('www.', '');
    link.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" alt="${company} logo" class="w-4 h-4 object-contain mr-[8px]" /><span>${company}</span>`;
    link.setAttribute("aria-label", `Visit ${company} official website`);
    pill.replaceWith(link);
  });
}

function setupBtt() {
  const btt = document.getElementById("btt");
  if (!btt) return;
  btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    btt.classList.toggle("on", window.scrollY > 200);
  }, { passive: true });
}

async function initLanguageSwitcher() {
  const switcher = document.getElementById("lang-switcher");
  const btn = document.getElementById("lang-btn");
  const menu = document.getElementById("lang-menu");
  const currentLabel = document.getElementById("lang-current-label");
  const mobileSelect = document.getElementById("mobile-lang-select");
  if (!switcher || !btn || !menu || !currentLabel) return;

  const STORAGE_KEY = "outr_ui_language_v1";
  const options = Array.from(menu.querySelectorAll(".lang-option"));
  const valid = new Set(["en", "hi", "od"]);
  const i18nCache = {};

  const closeMenu = () => {
    switcher.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    switcher.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  };

  const applyTranslations = async (lang) => {
    try {
      if (!i18nCache[lang]) {
        const res = await fetch(`${ROOT_PREFIX}data/i18n/${lang}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        i18nCache[lang] = await res.json();
      }
      if (!i18nCache["en"]) {
        const resEn = await fetch(`${ROOT_PREFIX}data/i18n/en.json`);
        if (resEn.ok) i18nCache["en"] = await resEn.json();
      }
    } catch (e) {
      console.warn("Failed to load language pack:", e);
      return;
    }

    const dict = i18nCache[lang] || {};
    const fallbackDict = i18nCache["en"] || {};

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const translated = dict[key] || fallbackDict[key];
      if (!translated) return;
      if (translated.includes("<br")) el.innerHTML = translated;
      else el.textContent = translated;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const value = dict[key] || fallbackDict[key];
      if (value) el.setAttribute("placeholder", value);
    });
  };

  window.reapplyTranslations = () => {
    const current = document.documentElement.getAttribute("lang") || "en";
    applyTranslations(current);
  };

  const setLanguage = async (lang) => {
    const finalLang = valid.has(lang) ? lang : "en";
    const active = options.find((o) => o.dataset.lang === finalLang) || options[0];
    options.forEach((o) => {
      const isActive = o === active;
      o.classList.toggle("active", isActive);
      o.setAttribute("aria-checked", isActive ? "true" : "false");
    });
    currentLabel.textContent = active.dataset.label || "EN";
    document.documentElement.setAttribute("lang", finalLang);
    localStorage.setItem(STORAGE_KEY, finalLang);
    if (mobileSelect) mobileSelect.value = finalLang;
    
    // 1. Translate all static HTML nodes with data-i18n attributes
    await applyTranslations(finalLang);

    // 2. Fetch the corresponding dynamic JSON translation data (home_hi.json, home_od.json, or home.json)
    await loadHomeContent();

    // 3. Re-render all dynamic layouts instantly with translated data
    renderTicker();
    renderFreshnessBadges();
    renderQuickLinks();
    renderNotices();
    renderEvents();
    renderGallery();
    renderFooter();
    setupSearch(); // Rebuild search index in target language!
  };

  await setLanguage(localStorage.getItem(STORAGE_KEY) || "en");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (switcher.classList.contains("open")) closeMenu();
    else openMenu();
  });

  options.forEach((option) => {
    option.addEventListener("click", async () => {
      const newLang = option.dataset.lang || "en";
      const currentLang = localStorage.getItem(STORAGE_KEY) || "en";
      if (newLang !== currentLang) {
        await setLanguage(newLang);
      }
      closeMenu();
      btn.focus();
    });
  });

  if (mobileSelect) {
    mobileSelect.addEventListener("change", async (e) => {
      const newLang = e.target.value;
      const currentLang = localStorage.getItem(STORAGE_KEY) || "en";
      if (newLang !== currentLang) {
        await setLanguage(newLang);
      }
    });
  }

  switcher.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      btn.focus();
      return;
    }
    if (!switcher.classList.contains("open")) return;
    const idx = options.findIndex((o) => o.classList.contains("active"));
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = options[(idx + 1) % options.length];
      next.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = options[(idx - 1 + options.length) % options.length];
      prev.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      const focused = document.activeElement;
      if (focused && focused.classList.contains("lang-option")) {
        e.preventDefault();
        focused.click();
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!switcher.contains(e.target)) closeMenu();
  });
}

function initHomeInteractions() {
  const langs = [
    "Odisha University of Technology and Research",
    "ओडिशा प्रौद्योगिकी एवं अनुसंधान विश्वविद्यालय",
    "ଓଡ଼ିଶା ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ଏବଂ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ",
  ];
  let li = 0;
  const ln = document.getElementById("logo-name");
  if (ln) {
    setInterval(() => {
      ln.style.opacity = "0";
      ln.style.transform = "translateY(-7px)";
      setTimeout(() => {
        li = (li + 1) % langs.length;
        ln.textContent = langs[li];
        ln.style.opacity = "1";
        ln.style.transform = "translateY(0)";
      }, 450);
    }, 4500);
  }
}

function initNavbarScroll() {
  const topBar = document.getElementById("top-bar");
  const navbar = document.getElementById("navbar");
  const searchSvg = document.querySelector("#search-btn svg");
  if (!navbar) return;
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY > 80;
      navbar.classList.toggle("scrolled", scrolled);
      if (topBar) topBar.classList.toggle("hide", scrolled);
      if (searchSvg) searchSvg.setAttribute("stroke", scrolled ? "#0B3C5D" : "white");
    },
    { passive: true },
  );
}

function initActiveNav() {
  const sectionEls = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  if (sectionEls.length === 0 || navLinks.length === 0) return;
  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.dataset.section === id));
      });
    },
    { rootMargin: "-120px 0px -60% 0px" },
  );
  sectionEls.forEach((s) => navObs.observe(s));
}

function initReveal() {
  const revealObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.1 },
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
}

function initStats() {
  function counter(el, target, suffix) {
    if (!el) return;
    let v = 0;
    const step = target / (1800 / 16);
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      el.textContent = Math.floor(v).toLocaleString() + (v >= target ? suffix : "");
      if (v >= target) clearInterval(t);
    }, 16);
  }
  const statsSection = document.getElementById("stats");
  if (!statsSection) return;
  const statsObs = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      counter(document.getElementById("s-students"), 12000, "+");
      counter(document.getElementById("s-faculty"), 300, "+");
      counter(document.getElementById("s-depts"), 8, "");
      counter(document.getElementById("s-years"), 44, "+");
      statsObs.disconnect();
    },
    { threshold: 0.3 },
  );
  statsObs.observe(statsSection);
}

function initMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-overlay");

  function openMenu() {
    if (!mobileMenu || !mobileOverlay) return;
    mobileMenu.style.right = "0px";
    mobileOverlay.style.opacity = "1";
    mobileOverlay.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!mobileMenu || !mobileOverlay) return;
    mobileMenu.style.right = "-100%";
    mobileOverlay.style.opacity = "0";
    mobileOverlay.style.pointerEvents = "none";
    document.body.style.overflow = "auto";
  }

  // Use event delegation on document to avoid timing issues
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#mobile-btn");
    const closeBtn = e.target.closest("#mob-close");
    const overlay = e.target.closest("#mobile-overlay");
    const navLink = e.target.closest("#mobile-menu a");

    if (btn) { openMenu(); return; }
    if (closeBtn) { closeMenu(); return; }
    if (overlay) { closeMenu(); return; }
    if (navLink) {
      const href = navLink.getAttribute("href") || "";
      if (href !== "#" && href !== "") closeMenu();
    }
  });
}

async function initHome() {
  await loadHomeContent();
  liveAqiData = loadAqiFromCache();
  aqiLoading = !liveAqiData;
  validateContentSchema(contentData, CONTENT_SCHEMA);
  renderTicker();
  renderFreshnessBadges();
  // renderHeroLinks(); // Disabled temporarily per user request
  renderQuickLinks();
  renderNotices();
  renderEvents();
  renderGallery();
  renderFooter();
  setupSearch();
  setupDropdownKeyboard();
  setupSafeLinks();
  setupKnownLinks();
  setupComingSoonLinks();
  setupRecruiterLinks();
  setupBtt();
  initHomeInteractions();
  await initLanguageSwitcher();
  initNavbarScroll();
  initActiveNav();
  initReveal();
  initStats();
  initMobileMenu();
  refreshLiveAQI(true);
  let aqiIntervalId = setInterval(() => {
    refreshLiveAQI(true);
  }, AQI_POLL_INTERVAL_MS);

  // Pause AQI polling when tab is hidden, resume when visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(aqiIntervalId);
    } else {
      refreshLiveAQI(true);
      aqiIntervalId = setInterval(() => refreshLiveAQI(true), AQI_POLL_INTERVAL_MS);
    }
  });

  // Handle redirect searches from sub-pages
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    const searchBtn = document.getElementById("search-btn");
    const searchBar = document.getElementById("search-bar");
    const searchInput = document.getElementById("search-input");
    if (searchBtn && searchBar && searchInput) {
      searchBar.classList.add("open");
      searchInput.value = searchQuery;
      setTimeout(() => {
        searchInput.focus({ preventScroll: true });
        searchInput.select();
      }, 150);
      searchInput.dispatchEvent(new Event('input'));
    }
  }
}

initHome();
