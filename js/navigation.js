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

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    let targetScrollY = window.scrollY;
    let isAnimating = false;

    const getScrollLimit = () => document.documentElement.scrollHeight - window.innerHeight;

    const animateScroll = () => {
      const currentScrollY = window.scrollY;
      const distance = targetScrollY - currentScrollY;
      const step = distance * 0.12;
      if (Math.abs(distance) < 0.5) {
        isAnimating = false;
        return;
      }
      window.scrollTo({ top: currentScrollY + step });
      requestAnimationFrame(animateScroll);
    };

    window.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey) return;
        event.preventDefault();
        const delta = event.deltaY;
        const speedBoost = Math.min(2.4, Math.max(1.1, Math.abs(delta) / 40 + 0.9));
        targetScrollY = Math.min(
          getScrollLimit(),
          Math.max(0, targetScrollY + delta * speedBoost)
        );
        if (!isAnimating) {
          isAnimating = true;
          requestAnimationFrame(animateScroll);
        }
      },
      { passive: false }
    );
  }
})();
