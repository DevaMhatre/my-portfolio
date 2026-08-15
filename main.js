document.addEventListener("DOMContentLoaded", function () {
  // Setup Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with .fade-in-section
  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });

  // Mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // ── Content-detail mode (Simple / Technical) ────────────────────────
  // Visible, persistent toggle — unlike the dev-mode easter egg below,
  // this is meant to be found and used by every visitor: recruiters get
  // plain-English impact, engineers/managers can flip to see the
  // architecture-level detail behind the same work.
  (function initContentMode() {
    var STORAGE_KEY = "contentMode";
    var toggle = document.getElementById("mode-toggle");
    if (!toggle) return;

    var buttons = toggle.querySelectorAll(".mode-btn");

    function applyMode(mode) {
      document.documentElement.classList.toggle("mode-technical", mode === "technical");
      buttons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.dataset.mode === mode));
      });
    }

    var saved = localStorage.getItem(STORAGE_KEY) === "technical" ? "technical" : "simple";
    applyMode(saved); // sync buttons with the class the inline head script already applied

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.dataset.mode;
        localStorage.setItem(STORAGE_KEY, mode);
        applyMode(mode);
      });
    });
  })();

  // ── Hidden "Developer Options" trigger ──────────────────────────────
  // Tap the nav logo 7 times in quick succession — same trick as tapping
  // the build number on Android — to reveal a link to the architecture
  // write-up. Nothing is persisted: refresh the page and it's hidden
  // again, taps required from scratch every time.
  (function initDevModeEasterEgg() {
    var REQUIRED_TAPS = 7;
    var TAP_RESET_MS = 1500;
    var TOAST_DURATION_MS = 1600;

    var brand = document.getElementById("brand-logo");
    var devNavItem = document.getElementById("dev-nav-item");
    var toastEl = document.getElementById("dev-toast");
    if (!brand || !devNavItem || !toastEl) return;

    var tapCount = 0;
    var lastTapTime = 0;
    var toastTimer = null;
    var unlocked = false;

    function showToast(message, isSuccess) {
      clearTimeout(toastTimer);
      toastEl.textContent = message;
      toastEl.classList.toggle("is-success", !!isSuccess);
      toastEl.classList.add("is-visible");
      toastTimer = setTimeout(function () {
        toastEl.classList.remove("is-visible");
      }, TOAST_DURATION_MS);
    }

    brand.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (unlocked) return;

      var now = Date.now();
      if (now - lastTapTime > TAP_RESET_MS) {
        tapCount = 0;
      }
      lastTapTime = now;
      tapCount += 1;

      var remaining = REQUIRED_TAPS - tapCount;

      if (remaining === 0) {
        unlocked = true;
        devNavItem.hidden = false;
        showToast("🏛 Developer mode unlocked", true);
        tapCount = 0;
      } else if (remaining > 0 && remaining <= 3) {
        showToast(
          remaining === 1
            ? "You are now 1 tap away from developer mode"
            : "You are now " + remaining + " taps away from developer mode"
        );
      }
    });
  })();
});
