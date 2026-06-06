/**
 * Odisha University of Technology and Research
 * Campus Bulletin Wall & Shoutout Space Interaction Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Select DOM Elements
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("bulletin-search");
  const wallContainer = document.getElementById("bulletin-wall-container");
  const bulletinForm = document.getElementById("bulletin-form");
  
  // Form Fields
  const bulletinTitle = document.getElementById("bulletin-title");
  const bulletinAuthor = document.getElementById("bulletin-author");
  const bulletinRole = document.getElementById("bulletin-role");
  const bulletinCategory = document.getElementById("bulletin-category");
  const bulletinContent = document.getElementById("bulletin-content");

  // Initial Seed Bulletins (Realistic, useful notices to avoid an empty board)
  const seedBulletins = [
    {
      id: "seed_1",
      title: "Alumni Mentorship Offer - CSE 2020 Batch",
      category: "alumni",
      author: "Rahul Senapati",
      role: "Alumni",
      content: "Hey juniors! I am currently working as a software engineer at Amazon, Bangalore. If anyone needs career tips, guidance regarding placements, or resume reviews, feel free to connect. Good luck with the end-terms!",
      time: "Jun 2, 2026"
    },
    {
      id: "seed_2",
      title: "Looking for Web Development Project Partners",
      category: "study",
      author: "Sonali Priyadarshini",
      role: "Student",
      content: "We are building an AI-based file tracking dashboard for our pre-final year project and need someone experienced in React/Vite. Let me know if you are interested in joining our group!",
      time: "Jun 1, 2026"
    },
    {
      id: "seed_3",
      title: "Registration for Zairza Technical Fest Open",
      category: "event",
      author: "Club Secretary",
      role: "Student",
      content: "The registration portal for XTASY and Zairza Tech Fest is now live! Events include robotics competitions, code-a-thons, and paper presentations. Scan the QR codes on the hostel boards to sign up.",
      time: "May 31, 2026"
    },
    {
      id: "seed_4",
      title: "Textile Engineering Lab Timings Updated",
      category: "general",
      author: "Prof. B. P. Dash",
      role: "Faculty",
      content: "Please note that the Textile Engineering lab hours have been extended from 4:30 PM to 6:00 PM on weekdays to help final year students with their project runs.",
      time: "May 30, 2026"
    },
    {
      id: "seed_5",
      title: "ECE Study Circles starting from Monday",
      category: "study",
      author: "Amit Kumar Roy",
      role: "Student",
      content: "Starting peer study circles for Smart Grid and Signal Processing this Monday in room B-201 from 5:00 PM. All ECE students struggling with Fourier Transforms are welcome to join.",
      time: "May 27, 2026"
    }
  ];

  // Load and merge LocalStorage items
  let localBulletins = JSON.parse(localStorage.getItem("outr_bulletins") || "[]");

  // Retroactive Migration: Convert relative timestamps ("Just now", "ago") in browser cache to standard calendar dates
  let localCacheUpdated = false;
  localBulletins = localBulletins.map((post) => {
    if (!post.time || post.time === "Just now" || post.time.includes("ago") || post.time.includes("now")) {
      post.time = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      localCacheUpdated = true;
    }
    return post;
  });
  if (localCacheUpdated) {
    localStorage.setItem("outr_bulletins", JSON.stringify(localBulletins));
  }
  
  // Complete collection of bulletins (user posts first, then seeds)
  let allBulletins = [...localBulletins, ...seedBulletins];

  // Render initially
  renderBulletins(allBulletins);

  // Handle async Lucide loading race conditions
  document.addEventListener("outr-unified-loader-ready", () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // States
  let activeFilter = "all";
  let searchQuery = "";

  // Apply Filter and Search Logic
  function applyFilterAndSearch() {
    const cards = document.querySelectorAll(".platform-card");
    cards.forEach((card) => {
      const category = card.dataset.category;
      const text = card.textContent.toLowerCase();
      
      const matchesFilter = activeFilter === "all" || category === activeFilter;
      const matchesSearch = text.includes(searchQuery.toLowerCase());

      if (matchesFilter && matchesSearch) {
        card.style.display = "inline-block";
        card.classList.remove("opacity-0", "scale-95");
      } else {
        card.style.display = "none";
        card.classList.add("opacity-0", "scale-95");
      }
    });
  }

  // Filter Button click handlers
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilterAndSearch();
    });
  });

  // Real-time search handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyFilterAndSearch();
    });
  }

  // Bulletin Form Submission
  if (bulletinForm) {
    bulletinForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = bulletinTitle.value.trim();
      const author = bulletinAuthor.value.trim();
      const role = bulletinRole.value;
      const category = bulletinCategory.value;
      const content = bulletinContent.value.trim();

      if (!title || !author || !content) return;

      const newBulletin = {
        id: "bulletin_" + Date.now(),
        title: title,
        author: author,
        role: role,
        category: category,
        content: content,
        time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      // Add to start of LocalStorage list
      localBulletins.unshift(newBulletin);
      localStorage.setItem("outr_bulletins", JSON.stringify(localBulletins));

      // Add to memory list
      allBulletins = [newBulletin, ...allBulletins];

      // Prepend to UI grid
      prependBulletinCard(newBulletin);

      // Reset form
      bulletinTitle.value = "";
      bulletinAuthor.value = "";
      bulletinContent.value = "";

      // Smart navigation to corresponding filter to make sure it shows
      if (activeFilter !== "all" && activeFilter !== category) {
        const filterButton = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (filterButton) filterButton.click();
      } else {
        applyFilterAndSearch();
      }
    });
  }

  function prependBulletinCard(post) {
    const cardHtml = createBulletinCardHtml(post);
    wallContainer.insertAdjacentHTML("afterbegin", cardHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function renderBulletins(posts) {
    wallContainer.innerHTML = ""; // Clear
    posts.forEach((post) => {
      const cardHtml = createBulletinCardHtml(post);
      wallContainer.insertAdjacentHTML("beforeend", cardHtml);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function createBulletinCardHtml(post) {
    // Determine visual style according to category
    let colorClasses = "bg-slate-50 border-slate-200/60";
    let icon = `<i data-lucide="volume-2" class="w-4 h-4 text-slate-600"></i>`;
    let badgeLabel = "General";
    let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";

    if (post.category === "alumni") {
      colorClasses = "bg-blue-50/40 border-blue-100/80";
      icon = `<i data-lucide="graduation-cap" class="w-4 h-4 text-blue-600"></i>`;
      badgeLabel = "Alumni Advice";
      badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
    } else if (post.category === "study") {
      colorClasses = "bg-emerald-50/30 border-emerald-100/70";
      icon = `<i data-lucide="users" class="w-4 h-4 text-emerald-600"></i>`;
      badgeLabel = "Study Group";
      badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else if (post.category === "event") {
      colorClasses = "bg-purple-50/30 border-purple-100/70";
      icon = `<i data-lucide="megaphone" class="w-4 h-4 text-purple-600"></i>`;
      badgeLabel = "Event Bulletin";
      badgeColor = "bg-purple-100 text-purple-800 border-purple-200";
    }

    return `
      <!-- Notice Bulletin Card -->
      <div class="masonry-item platform-card" data-category="${post.category}">
        <div class="glass-card rounded-2xl p-5 border flex flex-col ${colorClasses}">
          
          <!-- Card Header Info -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100/60 select-none">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                ${icon}
              </div>
              <div>
                <div class="text-xs font-bold text-slate-800">${post.author}</div>
                <div class="text-[9px] text-slate-400 font-bold uppercase">${post.role} · ${post.time}</div>
              </div>
            </div>
            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}">${badgeLabel}</span>
          </div>

          <!-- Card Content Body -->
          <div class="pt-4 flex-grow text-left">
            <h4 class="text-xs font-bold text-slate-800 mb-2">${post.title}</h4>
            <p class="text-xs text-slate-600 leading-relaxed font-medium">
              "${post.content}"
            </p>
          </div>

        </div>
      </div>
    `;
  }
});
