/* navbar-fix.js — Runs immediately, forces navbar to stay fixed at top */
(function () {
  "use strict";

  var NAVBAR_SEL = ".site-navbar";
  var FIXED_STYLES = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    width: "100%",
    zIndex: "9999",
  };

  function applyFixed() {
    var nav = document.querySelector(NAVBAR_SEL);
    if (!nav) return;

    /* Apply each property with !important via setProperty */
    nav.style.setProperty("position", "fixed", "important");
    nav.style.setProperty("top", "0px", "important");
    nav.style.setProperty("left", "0px", "important");
    nav.style.setProperty("right", "0px", "important");
    nav.style.setProperty("width", "100%", "important");
    nav.style.setProperty("z-index", "9999", "important");

    /* Remove any filter from body/html that can break position:fixed */
    document.body && document.body.style.removeProperty("filter");
    document.body && document.body.style.removeProperty("will-change");
    document.body && document.body.style.removeProperty("transform");
    document.documentElement && document.documentElement.style.removeProperty("filter");
    document.documentElement && document.documentElement.style.removeProperty("transform");
  }

  /* 1. Run immediately (body may not exist yet — DOM runs after head) */
  if (document.body) {
    applyFixed();
  }

  /* 2. Run on DOMContentLoaded */
  document.addEventListener("DOMContentLoaded", function () {
    applyFixed();

    /* 3. Watch for any DOM changes that might reset our styles */
    if (window.MutationObserver) {
      var mo = new MutationObserver(applyFixed);
      var nav = document.querySelector(NAVBAR_SEL);
      if (nav) {
        mo.observe(nav, { attributes: true, attributeFilter: ["style", "class"] });
      }
      /* Also watch body for filter/transform changes */
      mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    }
  });

  /* 4. Re-apply on every scroll */
  window.addEventListener("scroll", applyFixed, { passive: true });

  /* 5. Re-apply on resize */
  window.addEventListener("resize", applyFixed, { passive: true });

  /* 6. Safety net: run every 500ms for first 5 seconds */
  var count = 0;
  var interval = setInterval(function () {
    applyFixed();
    count++;
    if (count >= 10) clearInterval(interval);
  }, 500);
})();
