(() => {
  const contactForm = document.querySelector("#contactForm");
  const botField = document.querySelector("#website");
  const formStartTime = Date.now();
  const submitButton = contactForm?.querySelector("button[type='submit']");

  if (!contactForm) return;

  const emailConfig = {
    serviceId: "service_cglw2gm",
    templateId: "template_dkvl05j",
    publicKey: "SgowLeMIqAxlzBs7s",
  };

  const t = (key, vars) => window.siteI18n?.t(key, vars) ?? key;

  const formFields = {
    nombre: {
      labelKey: "form.fields.nombre",
      validator: (value) => value.trim().length >= 2,
    },
    correo: {
      labelKey: "form.fields.correo",
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    },
    telefono: {
      labelKey: "form.fields.telefono",
      validator: (value) => /^[0-9+\\s()-]{7,}$/.test(value.trim()),
    },
    proyecto: {
      labelKey: "form.fields.proyecto",
      validator: (value) => value.trim() !== "",
    },
    mensaje: {
      labelKey: "form.fields.mensaje",
      validator: (value) => value.trim().length >= 10,
    },
    terminos: {
      labelKey: "form.fields.terminos",
      validator: (value, element) => element.checked,
    },
  };

  const toggleFieldState = (element, isValid) => {
    if (!element) return;
    element.classList.toggle("is-invalid", !isValid);
    element.classList.toggle("is-valid", isValid);
  };

  const validateField = (fieldId) => {
    const config = formFields[fieldId];
    const element = document.querySelector(`#${fieldId}`);
    if (!config || !element) return true;
    const isValid = config.validator(element.value, element);
    toggleFieldState(element, isValid);
    return isValid;
  };

  if (typeof emailjs !== "undefined") {
    emailjs.init(emailConfig.publicKey);
  }

  Object.keys(formFields).forEach((fieldId) => {
    const element = document.querySelector(`#${fieldId}`);
    if (!element) return;
    const eventName =
      element.type === "checkbox" || element.tagName === "SELECT" ? "change" : "input";
    element.addEventListener(eventName, () => validateField(fieldId));
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errors = [];
    const elapsed = Date.now() - formStartTime;

    if (botField && botField.value.trim() !== "") {
      swal({
        title: t("form.alert.bot.title"),
        text: t("form.alert.bot.text"),
        icon: "error",
        button: t("form.alert.bot.button"),
      });
      return;
    }

    if (elapsed < 2000) {
      swal({
        title: t("form.alert.speed.title"),
        text: t("form.alert.speed.text"),
        icon: "warning",
        button: t("form.alert.speed.button"),
      });
      return;
    }

    Object.keys(formFields).forEach((fieldId) => {
      const isValid = validateField(fieldId);
      if (!isValid) {
        errors.push(t(formFields[fieldId].labelKey));
      }
    });

    if (errors.length > 0) {
      swal({
        title: t("form.alert.errors.title"),
        text: t("form.alert.errors.text", { fields: errors.join(", ") }),
        icon: "warning",
        button: t("form.alert.errors.button"),
      });
      return;
    }

    swal({
      title: t("form.alert.sending.title"),
      text: t("form.alert.sending.text"),
      icon: "info",
      buttons: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    });

    if (typeof emailjs === "undefined") {
      swal({
        title: t("form.alert.emailUnavailable.title"),
        text: t("form.alert.emailUnavailable.text"),
        icon: "error",
        button: t("form.alert.emailUnavailable.button"),
      });
      return;
    }

    if (submitButton) submitButton.disabled = true;

    try {
      const templateParams = {
        nombre: document.querySelector("#nombre")?.value.trim() ?? "",
        empresa: document.querySelector("#empresa")?.value.trim() ?? "",
        correo: document.querySelector("#correo")?.value.trim() ?? "",
        telefono: document.querySelector("#telefono")?.value.trim() ?? "",
        proyecto: document.querySelector("#proyecto")?.value.trim() ?? "",
        mensaje: document.querySelector("#mensaje")?.value.trim() ?? "",
        reply_to: document.querySelector("#correo")?.value.trim() ?? "",
      };

      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      swal({
        title: t("form.alert.success.title"),
        text: t("form.alert.success.text"),
        icon: "success",
        button: t("form.alert.success.button"),
      });
      contactForm.reset();
      Object.keys(formFields).forEach((fieldId) => {
        const element = document.querySelector(`#${fieldId}`);
        if (element) {
          element.classList.remove("is-valid", "is-invalid");
        }
      });
    } catch (error) {
      swal({
        title: t("form.alert.failure.title"),
        text: t("form.alert.failure.text"),
        icon: "error",
        button: t("form.alert.failure.button"),
      });
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
})();
