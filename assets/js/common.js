// Bravion International – shared header, cart, wishlist and scroll effects (frontend only)

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Toast ----------
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("is-show"), 2200);
}

// ---------- WhatsApp: general enquiry links ([data-wa] holds the message) ----------
$$("[data-wa]").forEach((a) => {
  a.href = waURL(a.dataset.wa || "Hello Bravion, I would like to know more about your products and customisation options.");
  a.target = "_blank";
  a.rel = "noopener";
});

// ---------- Header: sticky shadow, search, mobile menu ----------
const header = $("#header");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 10), { passive: true });

$("#searchOpen").addEventListener("click", () => {
  $("#search").classList.add("is-open");
  $("#search input").focus();
});
$("#searchClose").addEventListener("click", () => $("#search").classList.remove("is-open"));
$("#search input").addEventListener("keydown", (e) => {
  // the shop page filters in place instead (see shop.js)
  if (e.key === "Enter" && e.target.value.trim() && !$(".shop-page")) location.href = "shop.html?q=" + encodeURIComponent(e.target.value.trim());
});

const nav = $("#nav");
const overlay = $("#overlay");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  overlay.classList.toggle("is-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
$("#menuOpen").addEventListener("click", () => setMenu(true));
$("#menuClose").addEventListener("click", () => setMenu(false));
overlay.addEventListener("click", () => {
  setMenu(false);
  document.dispatchEvent(new Event("overlay:close"));
});
$$(".nav a").forEach((a) =>
  a.addEventListener("click", (e) => {
    const mega = a.parentElement.classList.contains("has-mega");
    if (mega && matchMedia("(max-width: 1180px)").matches) {
      e.preventDefault();
      a.parentElement.classList.toggle("is-open");
      return;
    }
    setMenu(false);
  })
);
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setMenu(false);
    $("#search").classList.remove("is-open");
    document.dispatchEvent(new Event("overlay:close"));
  }
});

// ---------- Reveal on scroll ----------
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-visible");
    revealIO.unobserve(en.target);
  });
}, { threshold: 0.15 });

function reveal(selector) {
  $$(selector).forEach((el) => {
    el.classList.add("reveal");
    revealIO.observe(el);
  });
}

$("#year").textContent = new Date().getFullYear();
