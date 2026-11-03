// Bravion International – shop / category listing page

const PAGE_SIZE = 12;
const MATERIALS = [...new Set(PRODUCTS.map((pr) => pr.material))];

// ---------- State (mirrored in the URL so links can be shared) ----------
const state = { cats: new Set(), materials: new Set(), sort: "featured", q: "", shown: PAGE_SIZE };

function readURL() {
  const u = new URLSearchParams(location.search);
  const list = (k) => (u.get(k) ? u.get(k).split(",") : []);
  state.cats = new Set(list("cat").filter((s) => CATEGORIES.some((c) => c.slug === s)));
  state.materials = new Set(list("material").filter((s) => MATERIALS.includes(s)));
  state.sort = u.get("sort") || "featured";
  state.q = u.get("q") || "";
}

function writeURL() {
  const u = new URLSearchParams();
  if (state.cats.size) u.set("cat", [...state.cats].join(","));
  if (state.materials.size) u.set("material", [...state.materials].join(","));
  if (state.sort !== "featured") u.set("sort", state.sort);
  if (state.q) u.set("q", state.q);
  const qs = u.toString();
  history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

// ---------- Filtering ----------
// `skip` leaves one facet out so its own option counts stay meaningful.
function matches(pr, skip) {
  if (skip !== "cat" && state.cats.size && !state.cats.has(pr.cat)) return false;
  if (skip !== "material" && state.materials.size && !state.materials.has(pr.material)) return false;
  if (state.q) {
    const hay = `${pr.name} ${pr.code} ${catName(pr.cat)} ${pr.material} ${pr.color}`.toLowerCase();
    if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
  }
  return true;
}

const SORTERS = {
  featured: (a, b) => PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b), // catalogue order: mango leather first
  "name-asc": (a, b) => a.name.localeCompare(b.name) || a.id - b.id,
  "name-desc": (a, b) => b.name.localeCompare(a.name) || a.id - b.id,
};

const results = () => PRODUCTS.filter((pr) => matches(pr)).sort(SORTERS[state.sort] || SORTERS.featured);
const countFor = (skip, test) => PRODUCTS.filter((pr) => matches(pr, skip) && test(pr)).length;

// ---------- Filter UI ----------
const checkbox = (group, value, label, checked, count) => `
  <label class="check${count ? "" : " is-empty"}">
    <input type="checkbox" data-group="${group}" value="${value}" ${checked ? "checked" : ""}>
    <span class="check__box"></span>${label}<small>${count}</small>
  </label>`;

function renderFacets() {
  $("#fCategory").innerHTML = CATEGORIES.map((c) =>
    checkbox("cat", c.slug, c.name, state.cats.has(c.slug), countFor("cat", (pr) => pr.cat === c.slug))).join("");

  $("#fMaterial").innerHTML = MATERIALS.map((m) =>
    checkbox("material", m, m, state.materials.has(m), countFor("material", (pr) => pr.material === m))).join("");
}

function renderChips() {
  const one = state.cats.size === 1 ? [...state.cats][0] : null;
  $("#catChips").innerHTML =
    `<button class="chip${state.cats.size ? "" : " is-active"}" data-cat="">All <small>${PRODUCTS.length}</small></button>` +
    CATEGORIES.map((c) => `<button class="chip${one === c.slug ? " is-active" : ""}" data-cat="${c.slug}">${c.short}
      <small>${PRODUCTS.filter((pr) => pr.cat === c.slug).length}</small></button>`).join("");
}

function renderHero() {
  const one = state.cats.size === 1 ? CATEGORIES.find((c) => state.cats.has(c.slug)) : null;
  const mangoOnly = !one && state.materials.size === 1 && state.materials.has("Mango Leather");
  if (state.q) {
    $("#collectionTitle").textContent = `Search: “${state.q}”`;
    $("#collectionDesc").textContent = "Results from across the Bravion collection.";
  } else if (mangoOnly) {
    $("#collectionTitle").textContent = "Mango Leather Collection";
    $("#collectionDesc").textContent = "Plant-based mango leather bags and wallets – every design can be made in any colour.";
  } else {
    $("#collectionTitle").textContent = one ? one.name : "All Products";
    $("#collectionDesc").textContent = one ? one.desc : "Explore the Bravion collection – every product can be customised in the colour you want.";
  }
  const banner = one ? one.banner : mangoOnly ? mango(11) : "photo-1553062407-98eeb64c6a62";
  // absolute URL: a relative one inside --bg would resolve against style.css
  $("#collectionHero").style.setProperty("--bg", `url('${new URL(img(banner, 1800), location.href).href}')`);
  $("#crumbCat").innerHTML = one ? `<span>/</span>${one.name}` : "";
  document.title = `${one ? one.name : mangoOnly ? "Mango Leather" : "Shop"} – Bravion International`;
}

// ---------- Active filter pills ----------
function renderActive() {
  const pills = [];
  state.cats.forEach((c) => pills.push(["cat", c, catName(c)]));
  state.materials.forEach((m) => pills.push(["material", m, m]));
  if (state.q) pills.push(["q", "", `“${state.q}”`]);

  $("#activeFilters").innerHTML = pills.length
    ? pills.map(([g, v, label]) => `<button class="pill" data-group="${g}" data-value="${v}">${label}<span aria-hidden="true">×</span></button>`).join("") +
      `<button class="pill pill--clear" data-group="all">Clear all</button>`
    : "";
  const badge = $("#filterBadge");
  badge.textContent = pills.length;
  badge.hidden = !pills.length;
}

$("#activeFilters").addEventListener("click", (e) => {
  const pill = e.target.closest(".pill");
  if (!pill) return;
  const { group, value } = pill.dataset;
  if (group === "all") return clearAll();
  if (group === "cat") state.cats.delete(value);
  if (group === "material") state.materials.delete(value);
  if (group === "q") state.q = "";
  update();
});

// ---------- Grid ----------
function renderGrid() {
  const list = results();
  const visible = list.slice(0, state.shown);
  $("#grid").innerHTML = visible.map(productCard).join("");
  $("#empty").hidden = list.length > 0;
  $("#more").hidden = list.length === 0;
  $("#resultCount").innerHTML = `Showing <strong>${visible.length}</strong> of <strong>${list.length}</strong> products`;
  $("#moreText").textContent = `You've viewed ${visible.length} of ${list.length} products`;
  $("#moreBar").style.width = list.length ? (visible.length / list.length) * 100 + "%" : "0";
  $("#loadMore").hidden = visible.length >= list.length;
  $("#applyCount").textContent = list.length;
}

$("#loadMore").addEventListener("click", () => {
  state.shown += PAGE_SIZE;
  renderGrid();
});

// ---------- Wiring ----------
function update() {
  state.shown = PAGE_SIZE;
  renderChips();
  renderHero();
  renderFacets();
  renderActive();
  renderGrid();
  writeURL();
}

function clearAll() {
  Object.assign(state, { cats: new Set(), materials: new Set(), q: "" });
  update();
}
$("#clearAll").addEventListener("click", clearAll);
$("#emptyClear").addEventListener("click", clearAll);

$("#filters").addEventListener("change", (e) => {
  const el = e.target;
  const g = el.dataset.group;
  if (g !== "cat" && g !== "material") return;
  const set = g === "cat" ? state.cats : state.materials;
  el.checked ? set.add(el.value) : set.delete(el.value);
  update();
});

$("#catChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.cats = new Set(chip.dataset.cat ? [chip.dataset.cat] : []);
  update();
  chip.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
});

$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  update();
});

$$(".view__btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".view__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    $("#grid").dataset.cols = btn.dataset.cols;
  })
);

// Mobile filter drawer
const filters = $("#filters");
const setFilters = (open) => {
  filters.classList.toggle("is-open", open);
  $("#overlay").classList.toggle("is-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
$("#filtersOpen").addEventListener("click", () => setFilters(true));
$("#filtersClose").addEventListener("click", () => setFilters(false));
$("#applyFilters").addEventListener("click", () => {
  setFilters(false);
  $(".toolbar").scrollIntoView({ behavior: "smooth" });
});
document.addEventListener("overlay:close", () => setFilters(false));

// Search box in the header filters this page directly
$("#search input").value = new URLSearchParams(location.search).get("q") || "";
$("#search input").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  state.q = e.target.value.trim();
  $("#search").classList.remove("is-open");
  update();
});

// ---------- Init ----------
readURL();
$("#sort").value = SORTERS[state.sort] ? state.sort : "featured";
update();
