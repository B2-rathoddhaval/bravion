// Bravion International – product catalogue (shared by all pages, no backend)
// Nothing is sold online: every product opens a WhatsApp enquiry to the owner.

const WHATSAPP_NUMBER = "919974742545"; // country code + number, no "+" or spaces

const unsplash = (id, w = 600) => `https://images.unsplash.com/${id}?w=${w}&q=70`;
// local paths ("assets/...") are used as-is, anything else is an Unsplash photo id
const img = (src, w = 600) => (src.startsWith("assets/") ? src : unsplash(src, w));
const mango = (n) => `assets/img/mango/ml-${String(n).padStart(2, "0")}.jpg`;
const shoe = (file) => encodeURI(`assets/img/shoes/${file}.jpeg`); // file names contain spaces

const CATEGORIES = [
  { slug: "jackets", name: "Leather Jackets", short: "Jackets", desc: "Biker, bomber and classic cuts in premium leather – made to your size and colour.", banner: "photo-1511280303142-0051e93baeeb" },
  { slug: "bags", name: "Bags", short: "Bags", desc: "Totes, satchels and shoulder bags – every design can be made in the colour you choose.", banner: mango(4) },
  { slug: "purses", name: "Purses & Wallets", short: "Purses", desc: "Wallets and long purses with clean edges and smart storage, customised for you.", banner: mango(15) },
  { slug: "shoes", name: "Shoes", short: "Shoes", desc: "Loafers, derbies and boots in genuine leather – made to order in your colour.", banner: shoe("Blue Horsebit Loafers") },
  { slug: "jute-bags", name: "Jute Bags", short: "Jute Bags", desc: "Natural, strong and reusable jute bags – any size, colour and print, with your logo. Bulk orders welcome.", banner: "photo-1758708536099-9f46dc81fffc" },
];

// p(id, code, name, cat, material, color, image, hoverImage, extra)
const p = (id, code, name, cat, material, color, image, image2, extra = {}) =>
  ({ id, code, name, cat, material, color, img: img(image), img2: image2 ? img(image2) : null, ...extra });

// Mango Leather catalogue – 20 products from the PDF (photos in assets/img/mango)
const m = (n, name, cat, color, desc, extra) =>
  p(100 + n, `ML-${String(n).padStart(2, "0")}`, name, cat, "Mango Leather", color, mango(n), null, { desc, eco: true, featured: true, ...extra });

// Jute bags – sample photos until real ones are added (same four types as the home page section)
const j = (n, name, image, desc) =>
  p(300 + n, `BR-JB${String(n).padStart(2, "0")}`, name, "jute-bags", "Jute", "Natural", image, null, { desc, badge: "Jute" });

// Shoes – s(n, name, colour, photo file name in assets/img/shoes, extra)
const s = (n, name, color, file, extra) =>
  p(200 + n, `BR-S${String(n).padStart(2, "0")}`, name, "shoes", "Genuine Leather", color, shoe(file), null, extra);

const PRODUCTS = [
  m(1, "Structured Everyday Tote", "bags", "Mint", "A spacious tote with long shoulder handles and adjustable side details."),
  m(2, "Minimal Shoulder Bag", "bags", "Blush Pink", "A streamlined shoulder bag with a zip-top closure and a detachable crossbody strap."),
  m(3, "Compact Fold Wallet", "purses", "Green", "A compact wallet with a structured front tab and neat stitched detailing."),
  m(4, "Classic Structured Tote", "bags", "Brown", "A refined everyday tote with rounded top handles and a simple, structured profile."),
  m(5, "Vertical Quilted Tote", "bags", "Tan", "A tall tote with vertical panel stitching, top handles and a detachable shoulder strap."),
  m(6, "Zip-Top Shoulder Bag", "bags", "Blue", "A compact shoulder bag with a smooth curved profile, zip closure and metal strap fittings."),
  m(7, "Two-Tone Structured Tote", "bags", "Pink & Brown", "A modern tote featuring contrasting body and trim, with sturdy top handles."),
  m(8, "Textured Mini Top-Handle Bag", "bags", "Maroon", "A small top-handle handbag with a flap front, textured finish and decorative metal detail."),
  m(9, "Rounded Zip-Top Handbag", "bags", "Light Pink", "A rounded top-handle handbag with a zip closure and contrast detailing."),
  m(10, "Mini Crossbody Saddle Bag", "bags", "Red", "A compact saddle-style bag with a flap closure and an adjustable shoulder strap."),
  m(11, "Croc-Embossed Top-Handle Satchel", "bags", "Emerald Green", "A structured satchel with a flap front, embossed texture and decorative top-handle hardware."),
  m(12, "Vertical Panel Tote", "bags", "Cream", "A spacious tote with vertical stitched panels and rounded top handles."),
  m(13, "Croc-Embossed Flap Satchel", "bags", "Purple", "A structured flap satchel with an embossed finish, magnetic-style closure and interior zip pocket."),
  m(14, "Croc-Embossed Flap Satchel", "bags", "Mustard", "A compact structured satchel with an embossed finish and a curved flap closure."),
  m(15, "Snap-Closure Long Wallet", "purses", "Green", "A long wallet with a fold-over flap and snap-button closure."),
  m(16, "Decorative Top-Handle Satchel", "bags", "White", "A structured handbag with a distinctive ornamental handle detail and front flap."),
  m(17, "Croc-Embossed Flap Satchel", "bags", "Wine Red", "A structured satchel with a textured finish, flap closure and visible interior compartments."),
  m(18, "Croc-Embossed Flap Satchel", "bags", "Beige", "A structured flap satchel with an embossed finish and a visible interior zip pocket."),
  m(19, "Zip-Around Long Wallet", "purses", "Black", "A slim long wallet with a full-length zip-around closure."),
  m(20, "Croc-Embossed Top-Handle Satchel", "bags", "Ivory", "A compact satchel with an embossed finish, curved flap and decorative top-handle hardware."),

  // Jackets (sample photos until real product photos are added)
  p(1, "BR-J01", "Classic Biker Jacket", "jackets", "Genuine Leather", "Black", "photo-1727515192207-3dc860bfd773", "photo-1727515546577-f7d82a47b51d", { featured: true }),
  p(2, "BR-J02", "Bomber Leather Jacket", "jackets", "Genuine Leather", "Black", "photo-1520975954732-35dd22299614", "photo-1675877879221-871aa9f7c314", { featured: true }),
  p(3, "BR-J03", "Rider Leather Jacket", "jackets", "Genuine Leather", "Black", "photo-1521223890158-f9f7c3d5d504", "photo-1727518154538-59e7dc479f8f"),
  p(4, "BR-J04", "Women's Moto Jacket", "jackets", "Genuine Leather", "Black", "photo-1511280303142-0051e93baeeb", "photo-1602370463198-086436840055"),
  p(5, "BR-J05", "Cropped Leather Jacket", "jackets", "Genuine Leather", "Black", "photo-1602370463198-086436840055", "photo-1511280303142-0051e93baeeb"),
  p(6, "BR-J06", "Vintage Racer Jacket", "jackets", "Genuine Leather", "Black", "photo-1675877879221-871aa9f7c314", "photo-1520975954732-35dd22299614"),

  // Jute bags
  j(1, "Jute Shopping Bag", "photo-1787074656306-67d69f3d8576", "Everyday carry bag with strong handles."),
  j(2, "Jute Tote Bag", "photo-1768734837394-182f596e84ac", "Roomy tote in natural or dyed jute."),
  j(3, "Printed & Logo Jute Bag", "photo-1758708536099-9f46dc81fffc", "Your brand or event printed on jute."),
  j(4, "Jute Pouch & Gift Bag", "photo-1541191662729-433a58fb02f2", "Drawstring pouch for gifts and packaging."),

  // Shoes
  s(1, "Blue Horsebit Loafers", "Blue", "Blue Horsebit Loafers", { featured: true }),
  s(2, "Black Horsebit Loafers", "Black", "Black Horsebit Loafers", { featured: true }),
  s(3, "Burgundy Lace-Up Dress Shoes", "Burgundy", "Burgundy Lace-Up Dress Shoes", { featured: true }),
  s(4, "Burgundy Monk Strap Loafers", "Burgundy", "Burgundy Monk Strap Loafers"),
  s(5, "Two-Tone Derby Shoes", "Burgundy & White", "Chelsea boots"), // the two file names are swapped
  s(6, "Chelsea Boots", "Black", "Two-tone derby shoes"),
  s(7, "Brown Embossed Tassel Loafers", "Brown", "Brown Embossed Tassel Loafers"),
  s(8, "Navy Tassel Loafers", "Navy", "Navy Tassel Loafers"),
  s(9, "Black Penny Loafers", "Black", "Black Penny Loafers"),
  s(10, "Penny Loafers", "Navy", "Penny Loafers"),
];

const catName = (slug) => (CATEGORIES.find((c) => c.slug === slug) || {}).name || "";

// ---------- WhatsApp enquiry ----------
const waURL = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

function waProductURL(pr) {
  // a photo link only helps once the site is online (not when opened from disk)
  const photo = location.protocol.startsWith("http") ? new URL(pr.img, location.href).href : "";
  return waURL([
    "Hello Bravion, I am interested in this product:",
    "",
    `*${pr.name}*`,
    `Code: ${pr.code}`,
    `Category: ${catName(pr.cat)}`,
    `Material: ${pr.material}`,
    `Colour shown: ${pr.color}`,
    ...(photo ? [`Photo: ${photo}`] : []),
    "",
    "Please share details about customisation and colour options.",
  ].join("\n"));
}

const WA_ICON = `<svg viewBox="0 0 24 24"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2z"/></svg>`;

function productCard(pr, i = 0) {
  const href = waProductURL(pr);
  return `
    <article class="product" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <div class="product__media">
        <a href="${href}" target="_blank" rel="noopener" class="product__imgs" aria-label="Enquire about ${pr.name} on WhatsApp">
          <img src="${pr.img}" alt="${pr.name}" loading="lazy">
          ${pr.img2 ? `<img class="product__img2" src="${pr.img2}" alt="" loading="lazy">` : ""}
        </a>
        ${pr.eco ? `<span class="badge badge--eco">Mango Leather</span>` : pr.badge ? `<span class="badge badge--eco">${pr.badge}</span>` : ""}
        <a href="${href}" target="_blank" rel="noopener" class="quick-add">${WA_ICON} Enquire<span class="quick-add__more">on WhatsApp</span></a>
      </div>
      <div class="product__body">
        <div class="product__cat">${catName(pr.cat)} · ${pr.code}</div>
        <h3 class="product__name"><a href="${href}" target="_blank" rel="noopener">${pr.name}</a></h3>
        <div class="product__custom">Shown in ${pr.color} · Customisable in any colour</div>
      </div>
    </article>`;
}
