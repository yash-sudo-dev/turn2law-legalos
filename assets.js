/* Turn2Law redesign · shared behaviour
   Theme tri-state (Auto / Light / Dark), set before first paint by the
   inline script in each page head. This file only wires interactions. */
(function () {
  var root = document.documentElement;

  /* ---- theme ---- */
  function applyTheme() {
    var pref = localStorage.getItem("t2l-theme") || "auto";
    var dark = pref === "dark" ||
      (pref === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
    root.dataset.themePref = pref;
  }
  applyTheme();

  /* follow the OS while in Auto */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if ((localStorage.getItem("t2l-theme") || "auto") === "auto") applyTheme();
  });

  document.querySelectorAll(".theme-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var order = ["auto", "light", "dark"];
      var cur = localStorage.getItem("t2l-theme") || "auto";
      var next = order[(order.indexOf(cur) + 1) % order.length];
      localStorage.setItem("t2l-theme", next);
      applyTheme();
      var lbl = btn.querySelector(".tlabel");
      if (lbl) lbl.textContent = next.charAt(0).toUpperCase() + next.slice(1);
      btn.setAttribute("aria-label", "Theme: " + next + ". Click to change.");
    });
  });

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  var mmenu = document.getElementById("mmenu");
  if (burger && mmenu) {
    burger.addEventListener("click", function () { mmenu.classList.toggle("open"); });
    mmenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) mmenu.classList.remove("open");
    });
  }

  /* ---- reveal on scroll ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- doc engine wizard tour ---- */
  var wiz = document.getElementById("wiz");
  if (wiz) {
    var steps = wiz.querySelectorAll(".wiz-step");
    var panels = wiz.querySelectorAll(".wiz-panel-body");
    var count = wiz.querySelector(".wiz-count");
    steps.forEach(function (s, i) {
      s.addEventListener("click", function () { show(i); });
    });
    function show(i) {
      steps.forEach(function (s, j) {
        s.classList.toggle("active", j === i);
        s.classList.toggle("done", j < i);
      });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
      if (count) count.textContent = "Step " + (i + 1) + " of " + steps.length;
    }
    var prev = wiz.querySelector(".wiz-prev"), next = wiz.querySelector(".wiz-next");
    var cur = 0;
    function curIdx() {
      for (var j = 0; j < steps.length; j++) if (steps[j].classList.contains("active")) return j;
      return 0;
    }
    if (prev) prev.addEventListener("click", function () { show(Math.max(0, curIdx() - 1)); });
    if (next) next.addEventListener("click", function () { show(Math.min(steps.length - 1, curIdx() + 1)); });
    show(0);
  }

  /* ---- resources filter ---- */
  var pills = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-cat]");
  if (pills.length && items.length) {
    pills.forEach(function (p) {
      p.addEventListener("click", function () {
        pills.forEach(function (x) { x.classList.remove("active"); });
        p.classList.add("active");
        var f = p.getAttribute("data-filter");
        items.forEach(function (it) {
          it.style.display = (f === "all" || it.getAttribute("data-cat").indexOf(f) !== -1) ? "" : "none";
        });
      });
    });
  }
})();
