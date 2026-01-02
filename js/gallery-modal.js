(() => {
  const projectModal = document.getElementById("projectModal");
  if (!projectModal) {
    return;
  }

  const modalTitle = projectModal.querySelector(".modal-title");
  const modalDescription = projectModal.querySelector(".project-modal__description");
  const carouselElement = projectModal.querySelector("#projectModalCarousel");
  const carouselIndicators = carouselElement?.querySelector(".carousel-indicators");
  const carouselInner = carouselElement?.querySelector(".carousel-inner");
  const beforeImage = projectModal.querySelector("[data-before]");
  const afterImage = projectModal.querySelector("[data-after]");
  const overlay = projectModal.querySelector(".before-after__overlay");
  const divider = projectModal.querySelector(".before-after__line");
  const handle = projectModal.querySelector(".before-after__handle");
  const rangeInput = projectModal.querySelector(".before-after__range");
  const frame = projectModal.querySelector(".before-after__frame");

  [beforeImage, afterImage].forEach((image) => {
    image?.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  });

  const updateBeforeAfter = (value) => {
    if (!overlay || !divider || !handle) {
      return;
    }
    const percentage = `${value}%`;
    overlay.style.width = percentage;
    divider.style.left = percentage;
    handle.style.left = percentage;
  };

  rangeInput?.addEventListener("input", (event) => {
    updateBeforeAfter(event.target.value);
  });

  let isDragging = false;

  const updateFromPointer = (event) => {
    if (!frame || !rangeInput) {
      return;
    }
    const rect = frame.getBoundingClientRect();
    const rawPosition = event.clientX - rect.left;
    const clampedPosition = Math.min(Math.max(rawPosition, 0), rect.width);
    const percentage = Math.round((clampedPosition / rect.width) * 100);
    rangeInput.value = percentage;
    updateBeforeAfter(percentage);
  };

  const startDrag = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    isDragging = true;
    frame?.setPointerCapture?.(event.pointerId);
    updateFromPointer(event);
  };

  const stopDrag = (event) => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    frame?.releasePointerCapture?.(event.pointerId);
  };

  handle?.addEventListener("pointerdown", startDrag);
  frame?.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }
    updateFromPointer(event);
  });
  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("pointercancel", stopDrag);

  projectModal.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    if (!trigger) {
      return;
    }

    const title = trigger.getAttribute("data-title") || "Proyecto destacado";
    const description = trigger.getAttribute("data-description") || "";
    const images = (trigger.getAttribute("data-images") || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const beforeSrc = trigger.getAttribute("data-before");
    const afterSrc = trigger.getAttribute("data-after");

    if (modalTitle) {
      modalTitle.textContent = title;
    }

    if (modalDescription) {
      modalDescription.textContent = description;
    }

    if (carouselIndicators && carouselInner) {
      carouselIndicators.innerHTML = "";
      carouselInner.innerHTML = "";

      images.forEach((src, index) => {
        const indicator = document.createElement("button");
        indicator.type = "button";
        indicator.dataset.bsTarget = "#projectModalCarousel";
        indicator.dataset.bsSlideTo = index;
        indicator.setAttribute("aria-label", `Slide ${index + 1}`);
        if (index === 0) {
          indicator.classList.add("active");
          indicator.setAttribute("aria-current", "true");
        }
        carouselIndicators.appendChild(indicator);

        const item = document.createElement("div");
        item.className = `carousel-item${index === 0 ? " active" : ""}`;

        const img = document.createElement("img");
        img.src = src;
        img.className = "d-block w-100";
        img.alt = `${title} - vista ${index + 1}`;
        item.appendChild(img);

        carouselInner.appendChild(item);
      });
    }

    if (beforeImage && beforeSrc) {
      beforeImage.src = beforeSrc;
    }

    if (afterImage && afterSrc) {
      afterImage.src = afterSrc;
    }

    if (rangeInput) {
      rangeInput.value = 50;
      updateBeforeAfter(50);
    }

    if (carouselElement && window.bootstrap?.Carousel) {
      const instance = window.bootstrap.Carousel.getOrCreateInstance(carouselElement);
      instance.to(0);
    }
  });
})();
