// Bravion International – home page only

// ---------- Featured products ----------
const featured = PRODUCTS.filter((pr) => pr.featured);

function renderProducts(filter = "all") {
  const list = featured.filter((pr) => filter === "all" || pr.cat === filter || (filter === "eco" && pr.eco));
  $("#products").innerHTML = list.map(productCard).join("");
}
renderProducts();

$$(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.toggle("is-active", t === tab));
    renderProducts(tab.dataset.filter);
    $("#products").scrollLeft = 0;
  })
);

const track = $("#products");
$(".carousel__btn--prev").addEventListener("click", () => (track.scrollLeft -= track.clientWidth * 0.8));
$(".carousel__btn--next").addEventListener("click", () => (track.scrollLeft += track.clientWidth * 0.8));

// ---------- Hero slider ----------
// The progress bar along the bottom drives the timing: when it finishes filling
// (CSS animation) the next slide comes in.
const slides = $$(".hero__slide");
const dots = $(".hero__dots");
const progress = $(".hero__progress span");
let current = 0;

slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Go to slide ${i + 1}`);
  b.addEventListener("click", () => go(i));
  dots.appendChild(b);
});
progress.addEventListener("animationend", () => go(current + 1));

function go(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle("is-active", k === current));
  $$("button", dots).forEach((d, k) => d.classList.toggle("is-active", k === current));
  progress.classList.remove("is-running");
  void progress.offsetWidth; // restart the fill animation
  progress.classList.add("is-running");
}
$(".hero__arrow--prev").addEventListener("click", () => go(current - 1));
$(".hero__arrow--next").addEventListener("click", () => go(current + 1));
go(0);

// ---------- Reveal + counters ----------
reveal(".section__head, .cat, .banner, .feature__grid > *, .value, .review, .cta__inner");

const countIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const end = +el.dataset.count;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1600, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))).toLocaleString("en-IN");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach((el) => countIO.observe(el));

// ---------- Newsletter (dummy) ----------
$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  $("#newsletterMsg").hidden = false;
});
