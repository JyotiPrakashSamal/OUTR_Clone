/* 
  Odisha University of Technology and Research
  Unified Navigation & Footer Dynamic Loader (V2 - High Fidelity Recovery)
  
  This loader dynamically injects the exact, identical navigation header, 
  mobile drawer overlay, SVG symbols sprite sheet, and footer onto all sub-pages recursively.
  All relative paths are fully normalized to absolute paths starting with "/" to ensure 
  perfect routing regardless of nested subdirectories.
*/

(function() {
  const runLoader = () => {
    // 1. Inject Head Resources (Tailwind, style.css, and Google Fonts)
    injectHeadResources();

    // 2. Inject SVG Sprite Sheet
    injectSvgSpriteSheet();

    // 3. Inject Navigation Header (Top Bar + Navbar)
    injectHeader();

    // 4. Inject Mobile Drawer & Overlay
    injectMobileMenu();

    // 5. Inject Footer & Back-to-Top Button
    injectFooter();

    // 6. Initialize Scroll Listeners & Interactive Behaviors
    initInteractiveBehaviors();

    // 7. Force Tailwind JIT compilation on dynamic elements to resolve loading race conditions
    if (window.tailwind) {
      window.tailwind.process();
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.tailwind) {
          window.tailwind.process();
          clearInterval(interval);
        } else if (attempts > 50) {
          clearInterval(interval);
        }
      }, 30);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runLoader);
  } else {
    runLoader();
  }

  // Dynamically appends stylesheets, scripts, and typography rules in head
  function injectHeadResources() {
    const head = document.head || document.getElementsByTagName("head")[0];

    // Inject body padding offset & protect unified components from stylesheet pollution
    const styleOffset = document.createElement("style");
    styleOffset.innerHTML = `
      body {
        padding-top: 110px !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
        padding-bottom: 0px !important;
        margin: 0px !important;
      }
      
      /* Scoped typography overrides for the unified navbar and footer */
      #top-bar, #navbar, #mobile-menu, #footer, #btt {
        font-family: 'DM Sans', sans-serif !important;
      }
      #top-bar *, #navbar *, #mobile-menu *, #footer *, #btt * {
        font-family: 'DM Sans', sans-serif !important;
      }
      
      /* Playfair Display font-family for brand name and major headings */
      #navbar .logo-text, #footer .logo-text, #footer h4 {
        font-family: 'Playfair Display', serif !important;
      }
      #navbar .logo-text *, #footer .logo-text * {
        font-family: 'Playfair Display', serif !important;
      }
      
      /* Scoped resets to shield unified elements from local sub-page stylesheet tag styles */
      #top-bar a, #navbar a, #mobile-menu a, #footer a {
        text-decoration: none !important;
      }
      #footer ul {
        list-style-type: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #footer li {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Smooth transitions for multi-lingual logo cycle */
      #logo-name {
        transition: opacity 0.45s ease, transform 0.45s ease !important;
        display: block !important;
      }

      /* Force absolute pixel sizing to prevent sub-page rem-scaling pollution */
      #top-bar a, #top-bar span {
        font-size: 11px !important;
      }
      #navbar .logo-text {
        font-size: 15px !important;
        line-height: 1.2 !important;
      }
      #navbar .logo-sub {
        font-size: 9px !important;
        line-height: 1.2 !important;
      }
      #navbar .nav-link {
        font-size: 12px !important;
      }
      #navbar .dropdown .dd-title {
        font-size: 13px !important;
      }
      #navbar .dropdown .dd-sub {
        font-size: 10.5px !important;
      }
      #footer h4 {
        font-size: 14px !important;
      }
      #footer a, #footer p, #footer span, #footer li {
        font-size: 12px !important;
      }
      #footer #dynamic-aqi-value {
        font-size: 14px !important;
      }
      #mobile-menu a, #mobile-menu span, #mobile-menu summary {
        font-size: 15px !important;
      }
      #mobile-menu details a {
        font-size: 13.5px !important;
      }
    `;
    head.appendChild(styleOffset);

    // Tailwind CSS Client Compiler (Dual compatibility fallback)
    if (!document.querySelector('script[src*="tailwindcss.com"]')) {
      const tailwindScript = document.createElement("script");
      tailwindScript.src = "https://cdn.tailwindcss.com";
      head.appendChild(tailwindScript);
    }

    // Google Fonts Preconnects & Typography Sheets (Playfair Display & DM Sans)
    if (!document.querySelector('link[href*="family=Playfair+Display"]')) {
      const preconnect1 = document.createElement("link");
      preconnect1.rel = "preconnect";
      preconnect1.href = "https://fonts.googleapis.com";
      head.appendChild(preconnect1);

      const preconnect2 = document.createElement("link");
      preconnect2.rel = "preconnect";
      preconnect2.href = "https://fonts.gstatic.com";
      preconnect2.crossOrigin = "anonymous";
      head.appendChild(preconnect2);

      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
      head.appendChild(fontLink);
    }

    // Absolute link to core stylesheet style.css
    if (!document.querySelector('link[href$="/style.css"]') && !document.querySelector('link[href="style.css"]')) {
      const coreCss = document.createElement("link");
      coreCss.rel = "stylesheet";
      coreCss.href = "/style.css";
      head.appendChild(coreCss);
    }
  }

  // Appends all SVG vector icon symbol definitions at the top of body
  function injectSvgSpriteSheet() {
    if (document.getElementById("svg-icon-sprite")) return;

    const div = document.createElement("div");
    div.id = "svg-icon-sprite";
    div.style.display = "none";
    div.innerHTML = `
      <svg width="0" height="0" class="hidden">
        <defs>
          <symbol id="icon-1" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></symbol>
          <symbol id="icon-2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></symbol>
          <symbol id="icon-3" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></symbol>
          <symbol id="icon-4" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></symbol>
          <symbol id="icon-5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></symbol>
          <symbol id="icon-6" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></symbol>
          <symbol id="icon-7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></symbol>
          <symbol id="icon-8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /></symbol>
          <symbol id="icon-9" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></symbol>
          <symbol id="icon-10" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></symbol>
          <symbol id="icon-11" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></symbol>
          <symbol id="icon-12" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3" /><path d="M6 22V17a6 6 0 0112 0v5" /></symbol>
          <symbol id="icon-13" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></symbol>
          <symbol id="icon-14" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></symbol>
          <symbol id="icon-15" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></symbol>
          <symbol id="icon-16" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></symbol>
          <symbol id="icon-17" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a2 2 0 012-2.18h3" /></symbol>
          <symbol id="icon-18" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></symbol>
          <symbol id="icon-19" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></symbol>
          <symbol id="icon-20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></symbol>
          <symbol id="icon-21" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></symbol>
          <symbol id="icon-22" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></symbol>
          <symbol id="icon-23" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></symbol>
          <symbol id="icon-24" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></symbol>
          <symbol id="icon-25" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></symbol>
          <symbol id="icon-26" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7-7 7" /></symbol>
          <symbol id="icon-27" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></symbol>
          <symbol id="icon-28" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 3v1zm10 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" /></symbol>
          <symbol id="icon-29" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3" /><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" /></symbol>
          <symbol id="icon-30" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" /><path d="M3 21a9 9 0 0118 0" /></symbol>
          <symbol id="icon-31" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6" /></symbol>
        </defs>
      </svg>
    `;
    document.body.insertBefore(div, document.body.firstChild);
  }

  // Prepend or replace the unified header navigation
  function injectHeader() {
    if (document.getElementById("navbar")) return;

    // Build the header HTML string mimicking home.html perfectly but with absolute paths
    const headerHtml = `
      <!-- TOP UTILITY BAR -->
      <div id="top-bar">
        <div class="max-w-7xl mx-auto px-5 w-full flex justify-between items-center select-none font-sans">
          <div class="flex gap-5">
            <a href="#" class="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">Careers</a>
            <a href="#" class="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">RTI</a>
            <a href="/administration/pic_officers.html" class="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">PIC Officers</a>
            <a href="http://placement.cet.edu.in/" target="_blank" rel="noopener noreferrer" class="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">Placement</a>
          </div>
          <div class="flex gap-5">
            <a href="https://www.cet.edu.in/" target="_blank" rel="noopener noreferrer" class="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">Old Website</a>
            <span class="text-blue-200 text-[11px]">✉️ registrar@outr.ac.in</span>
          </div>
        </div>
      </div>

      <!-- MAIN NAVBAR -->
      <nav id="navbar" class="flex flex-col font-sans select-none scrolled" style="top: 34px;">
        <div class="nav-bar-inner">
          <div class="max-w-7xl mx-auto px-5 flex items-center justify-between">
            <!-- Brand Logo + Identity -->
            <a href="/home.html" class="flex items-center gap-3 group text-left focus:outline-none cursor-pointer no-underline">
              <div class="w-12 h-12 rounded-full flex items-center justify-center border border-[#d4af37]/30 bg-[#0b3c5d]/5 transition-colors">
                <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Logo" class="w-8 h-8 object-contain" />
              </div>
              <div class="flex flex-col">
                <span id="logo-name" class="font-serif font-bold text-sm md:text-base tracking-wide leading-none text-[#0b3c5d] group-hover:text-[#d4af37] logo-text" style="color:#0b3c5d;">Odisha University of Technology and Research</span>
                <span class="text-[8.5px] font-bold tracking-widest uppercase mt-1 logo-sub" style="color:#64748b;">Bhubaneswar, Odisha</span>
              </div>
            </a>

            <!-- Desktop nav links -->
            <div class="hidden lg:flex items-center gap-7" id="nav-links">
              <a href="/home.html" class="text-xs font-bold text-[#0b3c5d] hover:text-[#d4af37] transition-colors no-underline nav-link" style="color:#0b3c5d;">Home</a>

              <!-- About Dropdown -->
              <div class="nav-item relative">
                <button class="text-xs font-bold text-[#0b3c5d] hover:text-[#d4af37] transition-colors flex items-center gap-1 focus:outline-none cursor-pointer nav-link" style="color:#0b3c5d;">
                  About <span class="text-[7px]">▼</span>
                </button>
                <div class="dropdown">
                  <div class="flex flex-col gap-2">
                    <a href="/OUTR website/about.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-2"></use></svg></div>
                      <div>
                        <div class="dd-title">About OUTR</div>
                        <div class="dd-sub">History &amp; overview</div>
                      </div>
                    </a>
                    <a href="/OUTR website/mission&vission.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-3"></use></svg></div>
                      <div>
                        <div class="dd-title">Vision and Mission</div>
                        <div class="dd-sub">Core values &amp; goals</div>
                      </div>
                    </a>
                    <a href="/OUTR website/schools.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-4"></use></svg></div>
                      <div>
                        <div class="dd-title">Accreditation</div>
                        <div class="dd-sub">NAAC, NBA, UGC recognition</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Academic Dropdown -->
              <div class="nav-item relative">
                <button class="text-xs font-bold text-[#0b3c5d] hover:text-[#d4af37] transition-colors flex items-center gap-1 focus:outline-none cursor-pointer nav-link" style="color:#0b3c5d;">
                  Academic <span class="text-[7px]">▼</span>
                </button>
                <div class="dropdown wide">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <p class="[font-size:10.5px] font-semibold [color:#94a3b8] [letter-spacing:0.1em] [text-transform:uppercase] [margin-bottom:10px] [padding:0_4px]">Schools &amp; Departments</p>
                      <div class="grid grid-cols-1 gap-1 max-h-[280px] overflow-y-auto pr-1">
                        <a href="/OUTR website/schools/scs.html" class="dd-card">
                          <div class="dd-icon [background:#eff6ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-2"></use></svg></div>
                          <div class="dd-title [font-size:12px]">School of Computer Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sms.html" class="dd-card">
                          <div class="dd-icon [background:#fff7ed]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-9"></use></svg></div>
                          <div class="dd-title [font-size:12px]">School of Mechanical Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sIp.html" class="dd-card">
                          <div class="dd-icon [background:#f0fdf4]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-10"></use></svg></div>
                          <div class="dd-title [font-size:12px]">School of Infrastructure &amp; Planning</div>
                        </a>
                        <a href="/OUTR website/schools/sElectronics.html" class="dd-card">
                          <div class="dd-icon [background:#fff1f2]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-11"></use></svg></div>
                          <div class="dd-title [font-size:12px]">School of Electronic Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sElectricals.html" class="dd-card">
                          <div class="dd-icon [background:#fffbeb]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-12"></use></svg></div>
                          <div class="dd-title [font-size:12px]">School of Electrical Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sbsh.html" class="dd-card">
                          <div class="dd-icon [background:#f5f3ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-13"></use></svg></div>
                          <div class="dd-title [font-size:12px]">School of Basic Sciences &amp; Humanities</div>
                        </a>
                        <a href="/OUTR website/schools/btd.html" class="dd-card">
                          <div class="dd-icon [background:#ecfdf5]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-14"></use></svg></div>
                          <div class="dd-title [font-size:12px]">Biotechnology Department</div>
                        </a>
                        <a href="/OUTR website/schools/ted.html" class="dd-card">
                          <div class="dd-icon [background:#fff0f6]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-15"></use></svg></div>
                          <div class="dd-title [font-size:12px]">Textile Engineering Department</div>
                        </a>
                      </div>
                    </div>
                    <div class="border-l border-slate-100 pl-4">
                      <p class="[font-size:10.5px] font-semibold [color:#94a3b8] [letter-spacing:0.1em] [text-transform:uppercase] [margin-bottom:10px] [padding:0_4px]">Other Academic Boards</p>
                      <div class="flex flex-col gap-2">
                        <a href="/administration/SA_commitee.html" class="dd-card">
                          <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-6"></use></svg></div>
                          <div>
                            <div class="dd-title">Committees</div>
                            <div class="dd-sub">Academic boards &amp; groups</div>
                          </div>
                        </a>
                        <a href="/OUTR website/courses/scs/UGcourses.html" class="dd-card">
                          <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-7"></use></svg></div>
                          <div>
                            <div class="dd-title">Syllabus</div>
                            <div class="dd-sub">UG and PG course syllabi</div>
                          </div>
                        </a>
                        <a href="#" class="dd-card">
                          <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-2"></use></svg></div>
                          <div>
                            <div class="dd-title">Academic Calendar</div>
                            <div class="dd-sub">Schedule &amp; important dates</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Administration Dropdown -->
              <div class="nav-item relative">
                <button class="text-xs font-bold text-[#0b3c5d] hover:text-[#d4af37] transition-colors flex items-center gap-1 focus:outline-none cursor-pointer nav-link" style="color:#0b3c5d;">
                  Administration <span class="text-[7px]">▼</span>
                </button>
                <div class="dropdown wide">
                  <p class="[font-size:10.5px] font-semibold [color:#94a3b8] [letter-spacing:0.1em] [text-transform:uppercase] [margin-bottom:10px] [padding:0_4px]">Administration &amp; Governance</p>
                  <div class="grid grid-cols-2 gap-2">
                    <a href="/?view=vc-desk" class="dd-card">
                      <div class="dd-icon [background:#eff6ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-2"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">VC Desk</div>
                    </a>
                    <a href="/?view=bom" class="dd-card">
                      <div class="dd-icon [background:#fff7ed]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-13"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">Board of Management</div>
                    </a>
                    <a href="/administration/Dean.html" class="dd-card">
                      <div class="dd-icon [background:#f0fdf4]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-4"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">Dean</div>
                    </a>
                    <a href="/administration/HOD.html" class="dd-card">
                      <div class="dd-icon [background:#fff1f2]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-5"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">HODs</div>
                    </a>
                    <a href="/?view=antiragging" class="dd-card">
                      <div class="dd-icon [background:#fffbeb]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-6"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">Anti-Ragging</div>
                    </a>
                    <a href="/administration/AR_commitee.html" class="dd-card">
                      <div class="dd-icon [background:#f5f3ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-7"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">Academic Council</div>
                    </a>
                    <a href="/administration/L_commitee.html" class="dd-card">
                      <div class="dd-icon [background:#ecfdf5]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-16"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">Students Grievance</div>
                    </a>
                    <a href="/?view=coe-desk" class="dd-card">
                      <div class="dd-icon [background:#fff0f6]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-17"></use></svg></div>
                      <div class="dd-title [font-size:12.5px]">Controller of Exam</div>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Student Dropdown -->
              <div class="nav-item relative">
                <button class="text-xs font-bold text-[#0b3c5d] hover:text-[#d4af37] transition-colors flex items-center gap-1 focus:outline-none cursor-pointer nav-link" style="color:#0b3c5d;">
                  Student <span class="text-[7px]">▼</span>
                </button>
                <div class="dropdown">
                  <div class="flex flex-col gap-2">
                    <a href="#notices" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-2"></use></svg></div>
                      <div>
                        <div class="dd-title">Event</div>
                        <div class="dd-sub">Fests &amp; campus activities</div>
                      </div>
                    </a>
                    <a href="/administration/SA_commitee.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-1"></use></svg></div>
                      <div>
                        <div class="dd-title">Society / Clubs</div>
                        <div class="dd-sub">Join student organizations</div>
                      </div>
                    </a>
                    <a href="/Student and Event/Hostel/hostel.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-2"></use></svg></div>
                      <div>
                        <div class="dd-title">Hostels</div>
                        <div class="dd-sub">Accommodation details</div>
                      </div>
                    </a>
                    <a href="/Student and Event/Campus_Facilities/CampusLife.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-3"></use></svg></div>
                      <div>
                        <div class="dd-title">Campus Life</div>
                        <div class="dd-sub">Experience life at OUTR</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Contact Dropdown -->
              <div class="nav-item relative">
                <button class="text-xs font-bold text-[#0b3c5d] hover:text-[#d4af37] transition-colors flex items-center gap-1 focus:outline-none cursor-pointer nav-link" style="color:#0b3c5d;">
                  Contact <span class="text-[7px]">▼</span>
                </button>
                <div class="dropdown">
                  <div class="flex flex-col gap-2">
                    <a href="/OUTR website/location.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-16"></use></svg></div>
                      <div>
                        <div class="dd-title">Address &amp; Map</div>
                        <div class="dd-sub">Techno Campus, Ghatikia, BBSR</div>
                      </div>
                    </a>
                    <a href="#footer" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-17"></use></svg></div>
                      <div>
                        <div class="dd-title">Phone &amp; Email</div>
                        <div class="dd-sub">Get in touch with us</div>
                      </div>
                    </a>
                    <a href="/social.html" class="dd-card">
                      <div class="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" stroke-width="2"><use href="#icon-18"></use></svg></div>
                      <div>
                        <div class="dd-title">Social Media Hub</div>
                        <div class="dd-sub">Follow us on all platforms</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Header Right: Search + Hamburger -->
            <div class="flex items-center gap-2 relative">
              <button id="search-btn" class="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Search">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0b3c5d" stroke-width="2">
                  <use href="#icon-20"></use>
                </svg>
              </button>
              <button id="mobile-btn" class="lg:hidden p-2 text-[#0b3c5d]" aria-label="Open mobile menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <use href="#icon-21"></use>
                </svg>
              </button>
            </div>
          </div>
          <!-- Search bar -->
          <div id="search-bar">
            <form action="#" class="search-shell w-full flex items-center gap-3 relative" id="search-form">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
                <use href="#icon-20"></use>
              </svg>
              <input id="search-input" type="text" placeholder="Search departments, courses, notices, faculty…"
                class="flex-1 outline-none [font-size:13.5px] [color:#1e293b] bg-transparent" />
              <button id="search-close" type="button" aria-label="Close search"
                class="[color:#94a3b8] cursor-pointer bg-none border-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <use href="#icon-22"></use>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </nav>
    `;

    // Replaces placeholders or prepends header
    const placeholder = document.getElementById("navbar-placeholder") || 
                        document.querySelector('div[id="navbar"]');
                        
    if (placeholder) {
      placeholder.outerHTML = headerHtml;
    } else {
      const topBarPlaceholder = document.getElementById("top-bar");
      if (topBarPlaceholder) topBarPlaceholder.remove();
      
      const body = document.body;
      const range = document.createRange();
      const fragment = range.createContextualFragment(headerHtml);
      body.insertBefore(fragment, body.firstChild);
    }
  }

  // Prepend Mobile Drawer Overlay & mobile-menu exactly mimicking home.html
  function injectMobileMenu() {
    if (document.getElementById("mobile-menu")) return;

    const mobileMenuHtml = `
      <!-- MOBILE MENU OVERLAY & PANEL -->
      <div id="mobile-overlay" style="position:fixed;inset:0;background:rgba(11,60,93,0.6);backdrop-filter:blur(4px);z-index:950;opacity:0;pointer-events:none;transition:opacity 0.3s"></div>
      <div id="mobile-menu" style="position:fixed;top:0;right:-100%;width:100%;max-width:320px;height:100vh;background:white;z-index:960;transition:all 0.3s;box-shadow:-10px 0 40px rgba(0,0,0,0.15);display:flex;flex-direction:column;font-family:'DM Sans',sans-serif;">
        <div id="mob-header" style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:#0B3C5D;flex-shrink:0;min-height:60px;position:sticky;top:0;z-index:10">
          <div style="display:flex;align-items:center;gap:12px">
            <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Logo" style="height:32px;width:auto" />
            <div style="color:white;font-weight:600;font-size:14px;line-height:1.3">OUTR<br />Bhubaneswar</div>
          </div>
          <button id="mob-close" style="display:flex;align-items:center;justify-content:center;padding:8px;background:#D4AF37;border:none;border-radius:8px;cursor:pointer;color:white;transition:background 0.2s" aria-label="Close mobile menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-left">
          <a href="/home.html" class="text-[17px] font-medium text-[#1E293B] no-underline">Home</a>
          <div class="h-px w-full bg-slate-200"></div>

          <details class="group">
            <summary class="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
              <span>About OUTR</span>
              <svg class="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-1"></use></svg>
            </summary>
            <div class="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
              <a href="/OUTR website/about.html" class="text-[15px] text-slate-600 no-underline">About OUTR</a>
              <a href="/OUTR website/mission&vission.html" class="text-[15px] text-slate-600 no-underline">Vision and Mission</a>
              <a href="/OUTR website/schools.html" class="text-[15px] text-slate-600 no-underline">Accreditation</a>
            </div>
          </details>
          <div class="h-px w-full bg-slate-200"></div>

          <details class="group">
            <summary class="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
              <span>Academic</span>
              <svg class="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-1"></use></svg>
            </summary>
            <div class="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
              <a href="/OUTR website/schools.html" class="text-[15px] text-slate-600 no-underline">Schools &amp; Departments</a>
              <a href="/administration/SA_commitee.html" class="text-[15px] text-slate-600 no-underline">Committees</a>
              <a href="/OUTR website/courses/scs/UGcourses.html" class="text-[15px] text-slate-600 no-underline">Syllabus</a>
            </div>
          </details>
          <div class="h-px w-full bg-slate-200"></div>

          <details class="group">
            <summary class="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
              <span>Administration</span>
              <svg class="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-1"></use></svg>
            </summary>
            <div class="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
              <a href="/?view=vc-desk" class="text-[15px] text-slate-600 no-underline">VC Desk</a>
              <a href="/?view=bom" class="text-[15px] text-slate-600 no-underline">Board of Management</a>
              <a href="/administration/Dean.html" class="text-[15px] text-slate-600 no-underline">Dean</a>
              <a href="/administration/HOD.html" class="text-[15px] text-slate-600 no-underline">HODs</a>
              <a href="/?view=antiragging" class="text-[15px] text-slate-600 no-underline">Anti-Ragging</a>
              <a href="/administration/AR_commitee.html" class="text-[15px] text-slate-600 no-underline">Academic Council</a>
              <a href="/administration/L_commitee.html" class="text-[15px] text-slate-600 no-underline">Students Grievance</a>
              <a href="/?view=coe-desk" class="text-[15px] text-slate-600 no-underline">Controller of Exam</a>
            </div>
          </details>
          <div class="h-px w-full bg-slate-200"></div>

          <details class="group">
            <summary class="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
              <span>Student</span>
              <svg class="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-1"></use></svg>
            </summary>
            <div class="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
              <a href="#notices" class="text-[15px] text-slate-600 no-underline">Event</a>
              <a href="/administration/SA_commitee.html" class="text-[15px] text-slate-600 no-underline">Society / Clubs</a>
              <a href="/Student and Event/Hostel/hostel.html" class="text-[15px] text-slate-600 no-underline">Hostels</a>
              <a href="/Student and Event/Campus_Facilities/CampusLife.html" class="text-[15px] text-slate-600 no-underline">Campus Life</a>
            </div>
          </details>
          <div class="h-px w-full bg-slate-200"></div>

          <details class="group">
            <summary class="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
              <span>Contact &amp; Map</span>
              <svg class="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-1"></use></svg>
            </summary>
            <div class="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
              <a href="/OUTR website/location.html" class="text-[15px] text-slate-600 no-underline">Address &amp; Map</a>
              <a href="#footer" class="text-[15px] text-slate-600 no-underline">Phone &amp; Email</a>
              <a href="/social.html" class="text-[15px] text-slate-600 no-underline">Social Media Hub</a>
            </div>
          </details>
          <div class="h-px w-full bg-slate-200"></div>

          <a href="https://ojee.nic.in/" class="inline-flex items-center justify-center bg-[#0B3C5D] text-white py-3 px-4 rounded-lg font-semibold text-sm no-underline">Apply Now 2025</a>
        </div>
      </div>
    `;

    const placeholder = document.getElementById("mobile-menu-placeholder");
    if (placeholder) {
      placeholder.outerHTML = mobileMenuHtml;
    } else {
      const range = document.createRange();
      const fragment = range.createContextualFragment(mobileMenuHtml);
      document.body.appendChild(fragment);
    }
  }

  // Append or replace the unified footer
  function injectFooter() {
    if (document.getElementById("footer")) return;

    const footerHtml = `
      <!-- FOOTER -->
      <footer id="footer" class="[background:#0a2940] [color:#94a3b8] font-sans py-16 px-5 mt-20 select-none">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-12">
          <!-- Identity -->
          <div>
            <div class="flex items-center gap-3.5 mb-6 text-white text-left">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Logo" class="w-7.5 h-7.5 object-contain" />
              </div>
              <div class="flex flex-col">
                <span class="font-serif font-bold text-sm tracking-wide leading-none">Odisha University of</span>
                <span class="font-serif font-bold text-sm tracking-wide leading-none text-[#d4af37] mt-1">Technology and Research</span>
              </div>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed mb-4 text-left">
              Techno Campus, Ghatikia, Mahalaxmi Vihar<br/>
              Bhubaneswar, Odisha - 751029, India<br/>
              📞 Office Phone: 0674-2386075 | 0674-2386182<br/>
              ✉️ Email: registrar@outr.ac.in
            </p>
          </div>

          <!-- Quick Links -->
          <div class="text-left">
            <h4 class="font-serif font-bold text-sm text-white mb-6 uppercase tracking-wider pl-0.5 border-b border-[#d4af37]/20 pb-2">Quick Links</h4>
            <ul class="space-y-3.5 p-0 m-0 list-none">
              <li><a href="/home.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">Home Desk</a></li>
              <li><a href="/OUTR website/about.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">About OUTR</a></li>
              <li><a href="/OUTR website/mission&vission.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">Vision &amp; Mission</a></li>
              <li><a href="/social.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">Social Media Hub</a></li>
            </ul>
          </div>

          <!-- Academics -->
          <div class="text-left">
            <h4 class="font-serif font-bold text-sm text-white mb-6 uppercase tracking-wider pl-0.5 border-b border-[#d4af37]/20 pb-2">Academics</h4>
            <ul class="space-y-3.5 p-0 m-0 list-none">
              <li><a href="/OUTR website/schools.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">8 Schools Desk</a></li>
              <li><a href="/OUTR website/courses/scs/UGcourses.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">UG/PG Course Syllabus</a></li>
              <li><a href="/?view=coe-desk" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">Controller of Exam</a></li>
              <li><a href="/Student and Event/Hostel/hostel.html" class="text-xs text-slate-400 hover:text-white transition-colors no-underline">Hostels Allocation</a></li>
            </ul>
          </div>

          <!-- Live AQI Info -->
          <div class="text-left">
            <h4 class="font-serif font-bold text-sm text-white mb-6 uppercase tracking-wider pl-0.5 border-b border-[#d4af37]/20 pb-2">Live Weather & AQI</h4>
            <div class="bg-white/5 rounded-xl border border-white/10 p-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🌱</span>
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Air Quality (AQI)</div>
                  <div id="dynamic-aqi-value" class="text-sm font-bold text-emerald-400 mt-0.5">38 &bull; Good</div>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 leading-relaxed mt-2.5 mb-0">Live sensor reports from Techno Campus, Ghatikia.</p>
            </div>
          </div>
        </div>

        <!-- Copyright Bottom -->
        <div class="max-w-7xl mx-auto border-t border-white/5 pt-8 text-center text-xs text-slate-500">
          © 2025 Odisha University of Technology and Research. All Rights Reserved. &bull; Bhubaneswar, Odisha
        </div>
      </footer>

      <!-- Back to top button -->
      <button id="btt" aria-label="Back to top" class="fixed bottom-6 right-6 z-[800] bg-[#d4af37] text-[#0b3c5d] hover:bg-[#bca02b] w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all opacity-0 pointer-events-none scale-90 duration-300">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    `;

    const placeholder = document.getElementById("footer-placeholder") || 
                        document.querySelector('footer[id="footer"]');

    if (placeholder) {
      placeholder.outerHTML = footerHtml;
    } else {
      const range = document.createRange();
      const fragment = range.createContextualFragment(footerHtml);
      document.body.appendChild(fragment);
    }

    fetchLiveAQILoader();
  }

  function fetchLiveAQILoader() {
    const aqiEl = document.getElementById("dynamic-aqi-value");
    if (!aqiEl) return;

    const cacheKey = "outr_live_aqi_v1";
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 15 * 60 * 1000) {
          updateAqiUI(parsed.value, parsed.status, parsed.color);
          return;
        }
      } catch (e) {}
    }

    // Fetch live from Open-Meteo
    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=20.2644&longitude=85.8081&current=us_aqi")
      .then(res => res.json())
      .then(data => {
        const usAqi = data?.current?.us_aqi;
        if (typeof usAqi === "number") {
          const valueStr = String(Math.round(usAqi));
          let statusStr = "Good";
          let colorHex = "#10b981"; // emerald-400

          if (usAqi <= 50) {
            statusStr = "Good";
            colorHex = "#10b981";
          } else if (usAqi <= 100) {
            statusStr = "Moderate";
            colorHex = "#f59e0b"; // yellow-400
          } else if (usAqi <= 150) {
            statusStr = "Poor";
            colorHex = "#f97316"; // orange-400
          } else if (usAqi <= 200) {
            statusStr = "Unhealthy";
            colorHex = "#f43f5e"; // rose-400
          } else if (usAqi <= 300) {
            statusStr = "Very Unhealthy";
            colorHex = "#a855f7"; // purple-400
          } else {
            statusStr = "Hazardous";
            colorHex = "#ef4444"; // red-500
          }

          updateAqiUI(valueStr, statusStr, colorHex);

          // Save to localStorage
          localStorage.setItem(cacheKey, JSON.stringify({
            value: valueStr,
            status: statusStr,
            color: colorHex.startsWith("#") ? (colorHex === "#10b981" ? "text-emerald-400" : colorHex === "#f59e0b" ? "text-yellow-400" : colorHex === "#f97316" ? "text-orange-400" : colorHex === "#f43f5e" ? "text-rose-400" : colorHex === "#a855f7" ? "text-purple-400" : "text-red-500") : colorHex,
            timestamp: Date.now()
          }));
        }
      })
      .catch(err => {
        console.warn("Unable to load live AQI:", err);
      });

    function updateAqiUI(val, status, color) {
      if (color.startsWith("text-")) {
        color = color === "text-emerald-400" ? "#10b981" : color === "text-yellow-400" ? "#f59e0b" : color === "text-orange-400" ? "#f97316" : color === "text-rose-400" ? "#f43f5e" : color === "text-purple-400" ? "#a855f7" : "#ef4444";
      }
      aqiEl.style.color = color;
      aqiEl.innerHTML = `${val} &bull; ${status}`;
    }
  }

  // Handle Hamburger Drawer transitions, caret drop-downs, language selections, and scroll triggers
  function initInteractiveBehaviors() {
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileOverlay = document.getElementById("mobile-overlay");
    const topBar = document.getElementById("top-bar");
    const navbar = document.getElementById("navbar");
    const searchSvg = document.querySelector("#search-btn svg");
    const bttBtn = document.getElementById("btt");

    // Initialize solid navbar scrolling animations
    if (navbar) {
      navbar.classList.add("scrolled");
      navbar.style.transition = "top 0.35s ease, background 0.35s ease, box-shadow 0.35s ease";
      
      // Keep search stroke consistent
      if (searchSvg) searchSvg.setAttribute("stroke", "#0B3C5D");

      // Bind scroll listeners
      window.addEventListener("scroll", () => {
        const scrolled = window.scrollY > 40;
        if (topBar) {
          if (scrolled) {
            topBar.classList.add("hide");
            navbar.style.top = "0px";
          } else {
            topBar.classList.remove("hide");
            navbar.style.top = "34px";
          }
        }

        // Back to top button triggers
        if (bttBtn) {
          if (window.scrollY > 400) {
            bttBtn.classList.remove("opacity-0", "pointer-events-none", "scale-90");
            bttBtn.classList.add("opacity-100", "scale-100");
          } else {
            bttBtn.classList.remove("opacity-100", "scale-100");
            bttBtn.classList.add("opacity-0", "pointer-events-none", "scale-90");
          }
        }
      }, { passive: true });
    }

    if (bttBtn) {
      bttBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Mobil hamburger overlay action delegation
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

    // Search toggle behaviors on sub-pages
    const searchBtn = document.getElementById("search-btn");
    const searchCloseBtn = document.getElementById("search-close");
    const searchBar = document.getElementById("search-bar");
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");

    if (searchBtn && searchBar && searchInput) {
      searchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        searchBar.classList.toggle("open");
        if (searchBar.classList.contains("open")) {
          setTimeout(() => {
            searchInput.focus();
          }, 100);
        }
      });
    }

    if (searchCloseBtn && searchBar) {
      searchCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        searchBar.classList.remove("open");
      });
    }

    // Close search on click outside
    document.addEventListener("click", (e) => {
      if (searchBar && searchBar.classList.contains("open")) {
        if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
          searchBar.classList.remove("open");
        }
      }
    });

    // Close search on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchBar) {
        searchBar.classList.remove("open");
      }
    });

    // Form submit redirect
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `/home.html?search=${encodeURIComponent(query)}`;
        }
      });
    }

    // Logo name cycling transitions in 3 languages
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
})();
