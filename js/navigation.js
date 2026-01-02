(() => {
  const navbar = document.querySelector(".navbar");
  const backToTopButton = document.querySelector(".back-to-top");
  const navbarCollapse = document.querySelector("#navbarNav");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarLinks = document.querySelectorAll(".navbar .nav-link");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const smoothScrollState = {
    current: window.scrollY,
    target: window.scrollY,
    rafId: null,
  };

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
    if (!smoothScrollState.rafId) {
      smoothScrollState.current = window.scrollY;
      smoothScrollState.target = window.scrollY;
    }
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

  const clampScrollTarget = (value) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(value, maxScroll));
  };

  const animateSmoothScroll = () => {
    smoothScrollState.current += (smoothScrollState.target - smoothScrollState.current) * 0.12;

    if (Math.abs(smoothScrollState.target - smoothScrollState.current) < 0.5) {
      smoothScrollState.current = smoothScrollState.target;
    }

    window.scrollTo(0, smoothScrollState.current);

    if (smoothScrollState.current === smoothScrollState.target) {
      smoothScrollState.rafId = null;
      return;
    }

    smoothScrollState.rafId = window.requestAnimationFrame(animateSmoothScroll);
  };

  const handleWheel = (event) => {
    if (!finePointer.matches || prefersReducedMotion.matches) return;
    event.preventDefault();
    smoothScrollState.target = clampScrollTarget(
      smoothScrollState.target + event.deltaY * 1.1
    );

    if (!smoothScrollState.rafId) {
      smoothScrollState.rafId = window.requestAnimationFrame(animateSmoothScroll);
    }
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
})();
