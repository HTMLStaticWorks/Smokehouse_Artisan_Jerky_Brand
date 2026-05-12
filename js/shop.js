(function (window, document) {
  "use strict";

  var products = [];

  function domReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function cardHtml(p) {
    var img = window.JerkyImages ? JerkyImages.url(p.img) : "";
    var name = esc(p.name);
    var desc = esc(p.desc.substring(0, 90));
    return (
      '<div class="col-sm-6 col-xl-4">' +
      '  <article class="product-card float-card h-100 tilt-3d tilt-3d-inner" data-id="' +
      esc(p.id) +
      '">' +
      '    <div class="img-ratio">' +
      '      <img src="' +
      img +
      '" alt="' +
      name +
      '" loading="lazy" class="img-cover" />' +
      "    </div>" +
      '    <div class="p-4 text-center text-lg-start">' +
      '      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-start gap-2 mb-2">' +
      '        <h3 class="h5 mb-0">' +
      name +
      "</h3>" +
      '        <span class="small text-muted">' +
      esc(String(p.rating)) +
      " ★</span>" +
      "      </div>" +
      '      <p class="small text-muted mb-3">' +
      desc +
      "…</p>" +
      '      <div class="d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-stretch align-items-sm-center">' +
      '        <span class="fw-bold">$' +
      p.price.toFixed(2) +
      "</span>" +
      '        <div class="d-flex gap-2">' +
      '          <button type="button" class="btn btn-sm btn-brand-secondary quick-view magnetic-target" data-id="' +
      esc(p.id) +
      '">Quick view</button>' +
      '          <button type="button" class="btn btn-sm btn-brand-primary add-cart magnetic-target">Add</button>' +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </article>" +
      "</div>"
    );
  }

  function render(list) {
    var grid = document.getElementById("productGrid");
    if (!grid) return;
    var rowClass = "row g-4 justify-content-center " + (list.length % 3 === 1 ? "row-odd-center" : "");
    grid.className = rowClass;
    grid.innerHTML = list.map(cardHtml).join("");
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (e) {}
  }

  function filter(cat) {
    if (!cat || cat === "all") return products.slice();
    return products.filter(function (p) {
      return p.cat === cat;
    });
  }

  function openQuickView(id) {
    var p = products.find(function (x) {
      return x.id === id;
    });
    var bodyEl = document.getElementById("quickViewBody");
    if (!bodyEl) return;
    bodyEl.innerHTML = '<div class="text-center py-5 text-muted">Loading…</div>';
    var modalEl = document.getElementById("quickViewModal");
    if (modalEl && window.bootstrap && bootstrap.Modal) {
      var modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
    fetch("data/products.json")
      .then(function (r) {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then(function (data) {
        var item = data.find(function (x) {
          return x.id === id;
        });
        if (!item) item = p;
        if (!item) {
          bodyEl.innerHTML = '<p class="text-danger mb-0">Product unavailable.</p>';
          return;
        }
        var img = window.JerkyImages ? JerkyImages.url(item.img) : "";
        bodyEl.innerHTML =
          '<div class="row g-4 align-items-center">' +
          '<div class="col-md-6"><div class="img-ratio"><img src="' +
          img +
          '" class="img-cover" alt=""/></div></div>' +
          '<div class="col-md-6 center-sm text-lg-start">' +
          '<h3 class="h4">' +
          esc(item.name) +
          "</h3>" +
          '<p class="text-muted">' +
          esc(item.desc) +
          "</p>" +
          '<div class="d-flex flex-wrap gap-3 align-items-center justify-content-center justify-content-lg-start mb-3">' +
          '<span class="h5 mb-0">$' +
          item.price.toFixed(2) +
          "</span>" +
          '<span class="badge rounded-pill border border-secondary text-secondary">' +
          esc(item.cat) +
          "</span>" +
          "</div>" +
          '<div class="heat-meter mb-2 mx-auto mx-lg-0" style="max-width:220px"><div class="heat-meter-fill is-animated" style="--heat:' +
          item.heat +
          '%;"></div></div>' +
          '<small class="text-muted d-block mb-3">Heat index ' +
          item.heat +
          "/100</small>" +
          '<button type="button" class="btn btn-brand-primary magnetic-target">Add to cart</button>' +
          "</div></div>";
        try {
          if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
          }
        } catch (e2) {}
      })
      .catch(function () {
        bodyEl.innerHTML = '<p class="text-danger">Could not load product details.</p>';
      });
  }

  domReady(function () {
    var grid = document.getElementById("productGrid");
    if (!grid) return;

    fetch("data/products.json")
      .then(function (r) {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then(function (data) {
        products = data;
        render(products);
      })
      .catch(function () {
        grid.innerHTML = '<div class="col-12 text-center text-danger">Unable to load catalog. Use a local server (e.g. npx serve) so data/products.json can load.</div>';
      });

    document.body.addEventListener("click", function (e) {
      var filterBtn = e.target.closest("[data-filter]");
      if (filterBtn) {
        document.querySelectorAll("[data-filter]").forEach(function (b) {
          b.classList.remove("active", "btn-brand-primary");
          b.classList.add("btn-brand-secondary");
        });
        filterBtn.classList.remove("btn-brand-secondary");
        filterBtn.classList.add("btn-brand-primary", "active");
        render(filter(filterBtn.getAttribute("data-filter")));
        return;
      }
      var qv = e.target.closest(".quick-view");
      if (qv) {
        var qid = qv.getAttribute("data-id");
        if (qid) openQuickView(qid);
        return;
      }
      var add = e.target.closest(".add-cart");
      if (add) {
        var card = add.closest("[data-id]");
        var pid = card ? card.getAttribute("data-id") : null;
        if (window.console && pid) console.log("add to cart", pid);
      }
    });
  });
})(window, document);
