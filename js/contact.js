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
    var form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("contactStatus");
      if (status) {
        status.classList.remove("text-danger", "text-success");
        status.textContent = "Sending…";
      }
      function ok() {
        if (status) {
          status.classList.add("text-success");
          status.textContent = "Message received. Our smokehouse concierge will reply shortly.";
        }
        form.reset();
      }
      function fail() {
        if (status) {
          status.classList.add("text-danger");
          status.textContent = "Network issue — please try again.";
        }
      }
      fetch("data/products.json")
        .then(function (r) {
          if (!r.ok) throw new Error("bad");
          return r.json();
        })
        .then(ok)
        .catch(fail);
    });
  });
})(window, document);
