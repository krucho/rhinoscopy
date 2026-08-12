(() => {
  const nativeInteractionExceptions = "input, textarea, [contenteditable='true'], [data-selectable], a[href^='tel:'], a[href^='mailto:']";
  const shouldKeepNativeInteraction = target => target instanceof Element
    && Boolean(target.closest(nativeInteractionExceptions));

  ["contextmenu", "selectstart", "dragstart"].forEach(eventName => {
    document.addEventListener(eventName, event => {
      if (!shouldKeepNativeInteraction(event.target)) event.preventDefault();
    }, { capture: true });
  });

  const current = document.body.dataset.page;
  document.querySelectorAll(".app-nav__item").forEach(link => {
    const active = link.dataset.page === current;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  document.querySelectorAll("[data-back]").forEach(button => {
    button.addEventListener("click", event => {
      if (history.length > 1 && document.referrer.startsWith(location.origin)) {
        event.preventDefault();
        history.back();
      }
    });
  });

  const tabs = document.querySelectorAll("[data-day]");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    const update = () => {
      tabs.forEach(item => {
        const selected = item === tab;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      document.querySelectorAll("[data-day-panel]").forEach(panel => {
        panel.hidden = panel.dataset.dayPanel !== tab.dataset.day;
      });
    };
    document.startViewTransition ? document.startViewTransition(update) : update();
  }));

  let target = null;
  if (location.hash) {
    try {
      target = document.querySelector(location.hash);
    } catch {
      // Ignora hashes externos que no sean selectores CSS válidos.
    }
  }
  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      target.classList.add("is-highlighted");
      setTimeout(() => target.classList.remove("is-highlighted"), 4200);
    });
  }

  document.querySelectorAll("[data-prototype-action]").forEach(action => {
    action.addEventListener("click", event => {
      event.preventDefault();
      let toast = document.querySelector(".app-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "app-toast";
        toast.setAttribute("role", "status");
        document.body.append(toast);
      }
      toast.textContent = "Acción simulada para probar la interacción";
      toast.classList.add("is-visible");
      clearTimeout(window.__appToastTimer);
      window.__appToastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
    });
  });
})();
