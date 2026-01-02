(() => {
  const navbar = document.querySelector(".navbar");
  const backToTopButton = document.querySelector(".back-to-top");
  const navbarCollapse = document.querySelector("#navbarNav");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarLinks = document.querySelectorAll(".navbar .nav-link");

  const updateNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };

  const updateBackToTop = () => {
    if (!backToTopButton) return;
    if (window.scrollY > 280) {
      backToTopButton.classList.add("is-visible");
    } else {
      backToTopButton.classList.remove("is-visible");
    }
  };

  const handleScroll = () => {
    updateNavbar();
    updateBackToTop();
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    let targetScroll = window.scrollY;
    let isAnimating = false;
    const scrollBoost = 1.2;
    const clampTarget = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    };
    const animateScroll = () => {
      const current = window.scrollY;
      const distance = targetScroll - current;
      if (Math.abs(distance) < 0.5) {
        window.scrollTo(0, targetScroll);
        isAnimating = false;
        return;
      }
      window.scrollTo(0, current + distance * 0.2);
      requestAnimationFrame(animateScroll);
    };

    window.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey) return;
        targetScroll += event.deltaY * scrollBoost;
        clampTarget();
        if (!isAnimating) {
          isAnimating = true;
          requestAnimationFrame(animateScroll);
        }
        event.preventDefault();
      },
      { passive: false }
    );
  }

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (navbarCollapse && navbarToggler && navbarLinks.length && window.bootstrap) {
    navbarLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (!navbarCollapse.classList.contains("show")) return;
        const collapse = bootstrap.Collapse.getInstance(navbarCollapse) ||
          new bootstrap.Collapse(navbarCollapse, { toggle: false });
        collapse.hide();
      });
    });
  }
})();
