document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleProjectsBtn");
  const extraProjects = document.querySelectorAll(".extra-project");

  if (!toggleButton || extraProjects.length === 0) return;

  const translate = (key, fallback) => {
    if (window.siteI18n?.t) {
      return window.siteI18n.t(key);
    }
    return fallback;
  };

  const updateState = (expanded) => {
    extraProjects.forEach((project) => {
      project.classList.toggle("d-none", !expanded);
    });

    const key = expanded ? "gallery.showLess" : "gallery.showMore";
    toggleButton.dataset.i18n = key;
    toggleButton.textContent = translate(key, expanded ? "Ver menos" : "Ver más");
  };

  let expanded = false;

  toggleButton.addEventListener("click", () => {
    expanded = !expanded;
    updateState(expanded);
  });

  updateState(expanded);
});
