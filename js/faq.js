(function (window, document) {
  "use strict";

  function domReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  domReady(function () {
    var items = document.querySelectorAll(".faq-item");
    var input = document.getElementById("faqSearch");
    var catSel = document.getElementById("faqCategory");
    if (!items.length || !input) return;

    function norm(s) {
      return (s || "").toLowerCase();
    }

    function apply() {
      var q = norm(input.value);
      var cat = catSel ? norm(catSel.value) : "";
      items.forEach(function (el) {
        var btn = el.querySelector(".accordion-button");
        var body = el.querySelector(".accordion-body");
        var text = norm((btn && btn.textContent) + " " + (body && body.textContent));
        var okQ = !q || text.indexOf(q) !== -1;
        var dc = el.getAttribute("data-category") || "";
        var okC = !cat || norm(dc) === cat;
        el.style.display = okQ && okC ? "" : "none";
      });
    }

    input.addEventListener("input", apply);
    if (catSel) catSel.addEventListener("change", apply);
  });
})(window, document);
