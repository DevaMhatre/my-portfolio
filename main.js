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
});
//
