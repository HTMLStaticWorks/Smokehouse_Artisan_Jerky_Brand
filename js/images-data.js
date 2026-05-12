/**
 * Local imagery from /imahe — use JerkyImages.url(i) for encoded paths.
 */
window.JerkyImages = (function () {
  var files = [
    "WhatsApp Image 2026-05-12 at 7.26.22 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.23 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.23 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.24 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.25 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.26 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.36 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.36 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.36 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.37 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.37 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.38 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.26.38 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.14 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.14 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.14 PM (3).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.14 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.15 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.15 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.15 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.16 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.16 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.16 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.17 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.17 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.17 PM (3).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.17 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.18 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.18 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.18 PM (3).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.18 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.19 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.19 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.19 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.20 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.20 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.20 PM (3).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.20 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.21 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.21 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.21 PM (3).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.21 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.22 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.22 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.22 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.23 PM (1).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.23 PM (2).jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.23 PM.jpeg",
    "WhatsApp Image 2026-05-12 at 7.27.24 PM.jpeg",
  ];

  function url(index) {
    var name = files[index % files.length];
    return "imahe/" + encodeURIComponent(name);
  }

  return { files: files, url: url, count: files.length };
})();
