function initSocialTabs() {
  const tabs = Array.from(document.querySelectorAll(".tab-btn"));
  const panels = Array.from(document.querySelectorAll(".platform-panel"));
  if (tabs.length === 0) return;

  tabs.forEach((tab, idx) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("tabindex", tab.classList.contains("active") ? "0" : "-1");
    tab.setAttribute("aria-selected", tab.classList.contains("active") ? "true" : "false");
    tab.dataset.index = String(idx);
  });

  function activate(targetBtn) {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });
    panels.forEach((p) => p.classList.remove("active"));
    targetBtn.classList.add("active");
    targetBtn.setAttribute("aria-selected", "true");
    targetBtn.setAttribute("tabindex", "0");
    const panel = document.getElementById(`panel-${targetBtn.dataset.target}`);
    if (panel) panel.classList.add("active");
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => activate(btn));
    btn.addEventListener("keydown", (e) => {
      const current = Number(btn.dataset.index);
      if (e.key === "ArrowRight") {
        const next = tabs[(current + 1) % tabs.length];
        next.focus();
        activate(next);
      } else if (e.key === "ArrowLeft") {
        const prev = tabs[(current - 1 + tabs.length) % tabs.length];
        prev.focus();
        activate(prev);
      } else if (e.key === "Home") {
        tabs[0].focus();
        activate(tabs[0]);
      } else if (e.key === "End") {
        tabs[tabs.length - 1].focus();
        activate(tabs[tabs.length - 1]);
      }
    });
  });
}

function hardenExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    a.setAttribute("rel", "noopener noreferrer");
  });
}

function setupEmbedFallbacks() {
  const linkedInFrame = document.getElementById("linkedin-embed-frame");
  const linkedInFallback = document.getElementById("linkedin-embed-fallback");
  const youtubeFrame = document.getElementById("youtube-embed-frame");
  const youtubeFallback = document.getElementById("youtube-embed-fallback");

  const attachTimeoutFallback = (frame, fallback, timeoutMs) => {
    if (!frame || !fallback) return;
    let loaded = false;
    frame.addEventListener("load", () => {
      loaded = true;
      fallback.classList.remove("show");
    });
    setTimeout(() => {
      if (loaded) return;
      fallback.classList.add("show");
    }, timeoutMs);
  };

  attachTimeoutFallback(linkedInFrame, linkedInFallback, 3500);
  attachTimeoutFallback(youtubeFrame, youtubeFallback, 4000);
}

initSocialTabs();
hardenExternalLinks();
setupEmbedFallbacks();
