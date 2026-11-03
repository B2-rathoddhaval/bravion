// Bravion International – contact page: the enquiry form is sent as a WhatsApp message

const form = $("#contactForm");
const catSelect = $("#fCategorySelect");
const productSelect = $("#fProductSelect");
const SIZED = ["jackets", "shoes"];

// ---------- Category + product dropdowns ----------
catSelect.insertAdjacentHTML("beforeend", CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join(""));

function fillProducts() {
  const cat = catSelect.value;
  const groups = CATEGORIES.filter((c) => !cat || c.slug === cat).map((c) => {
    const opts = PRODUCTS.filter((pr) => pr.cat === c.slug)
      .map((pr) => `<option value="${pr.code}">${pr.code} – ${pr.name} (${pr.color})</option>`).join("");
    return `<optgroup label="${c.name}">${opts}</optgroup>`;
  });
  productSelect.innerHTML = `<option value="">Any / not decided</option>` + groups.join("");
  $("#sizeField").hidden = !SIZED.includes(cat);
}

catSelect.addEventListener("change", fillProducts);
productSelect.addEventListener("change", () => {
  // picking a product also sets its category
  const pr = PRODUCTS.find((x) => x.code === productSelect.value);
  if (pr && catSelect.value !== pr.cat) {
    catSelect.value = pr.cat;
    fillProducts();
    productSelect.value = pr.code;
  }
});

// colour picker fills the text box (the text box can also be typed in)
form.colourPick.addEventListener("input", () => (form.colour.value = form.colourPick.value.toUpperCase()));

// ?product=ML-19 or ?cat=bags pre-selects from a link
const params = new URLSearchParams(location.search);
fillProducts();
if (params.get("cat") && CATEGORIES.some((c) => c.slug === params.get("cat"))) {
  catSelect.value = params.get("cat");
  fillProducts();
}
if (params.get("product")) {
  productSelect.value = params.get("product");
  productSelect.dispatchEvent(new Event("change"));
}

// ---------- Validation ----------
const digits = (s) => s.replace(/\D/g, "");
const checks = {
  name: (v) => v.trim().length >= 2,
  phone: (v) => digits(v).length >= 10 && digits(v).length <= 15,
  email: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  qty: (v) => +v >= 1,
  message: (v) => v.trim().length >= 3,
};

function validate(field) {
  const ok = checks[field.name](field.value);
  field.closest(".field").classList.toggle("is-invalid", !ok);
  return ok;
}

Object.keys(checks).forEach((name) =>
  form[name].addEventListener("input", () => form[name].closest(".field").classList.contains("is-invalid") && validate(form[name]))
);

// ---------- Build the WhatsApp message ----------
function buildMessage() {
  const v = (name) => form[name].value.trim();
  const opt = (value, text) => (value ? text : null); // optional line, left out when empty
  const pr = PRODUCTS.find((x) => x.code === v("product"));
  return [
    "*New enquiry from the Bravion website*",
    "",
    `*Name:* ${v("name")}`,
    `*Phone:* ${v("phone")}`,
    opt(v("email"), `*Email:* ${v("email")}`),
    opt(v("city"), `*City / Country:* ${v("city")}`),
    "",
    `*Enquiry type:* ${form.type.value}`,
    opt(v("category"), `*Category:* ${catName(v("category"))}`),
    opt(pr, pr && `*Product:* ${pr.name} (${pr.code}, shown in ${pr.color})`),
    opt(v("colour"), `*Preferred colour:* ${v("colour")}`),
    `*Quantity:* ${v("qty") || 1}`,
    opt(!$("#sizeField").hidden && v("size"), `*Size:* ${v("size")}`),
    "",
    "*Message:*",
    v("message"),
  ].filter((l) => l !== null).join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const bad = Object.keys(checks).filter((name) => !validate(form[name]));
  if (bad.length) {
    form[bad[0]].focus();
    toast("Please check the highlighted fields");
    return;
  }
  const url = waURL(buildMessage());
  $("#contactRetry").href = url;
  $("#contactDone").hidden = false;
  window.open(url, "_blank", "noopener");
});
