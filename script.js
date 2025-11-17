/* script.js — Botões Gourmet Premium (estilo 1)
   Use imagens PNG nas paths: images/dish1.png, images/dish2.png, ... images/drink1.png etc.
   WhatsApp: abre conversa com o número +55 21 97579-9735 (formato wa.me).
*/

const WHATS_PHONE = "5521965781487";

// Dados — edite preços/textos aqui
const dishes = [
  { id:1, name:"Nhoque de Aipim com Carne Seca", desc:"Arroz, Feijão, Farofa, Macarrão. Fritas ou Legumes", sizes:[{label:"Grande 750ml", price:23.00, promo:true},{label:"Pequena", price:21.00}], img:"nhoque.jpg" },
  { id:2, name:"Strogonoff de Frango", desc:"Arroz branco, Batata palha ou fritas", sizes:[{label:"Grande 750ml", price:21.00, promo:true},{label:"Pequena", price:19.00}], img:"strog_fg.jpg" },
  { id:3, name:"Contra Filé Acebolado", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Único", price:25.00}], img:"cf_ac.jpg" },
  { id:4, name:"Filé de Frango à Parmegiana", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Grande 750ml", price:21.00, promo:true},{label:"Pequena", price:19.00}], img:"fil_f_parm.jpg" },
  { id:5, name:"Filé de Frango à Milanesa", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Grande 750ml", price:18.00, promo:true},{label:"Pequena", price:16.00}], img:"fg_mil.jpg" },
  { id:6, name:"Filé de Frango Grelhado/Acebolado", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Grande 750ml", price:18.00, promo:true},{label:"Pequena", price:16.00}], img:"fgo_grel.jpg" }
];

const drinks = [
  { id:101, name:"Coca-Cola 2L", price:12.00, img:"coca_2.jpg" },
  { id:102, name:"Coca-Cola Lata 350ml", price:6.00, img:"coca350.jpg" },
  { id:103, name:"Coca-Cola 600ml", price:8.00, img:"coca600.jpg" },
  { id:104, name:"Guaraná Antarctica 1L", price:7.00, img:"antarc_1l.jpg" },
  { id:105, name:"Guaraná Leão / Guaracamp", price:3.00, img:"guaracamp.jpg" },
  { id:106, name:"Água Mineral 500ml sem gás", price:2.50, img:"agua_s_gas.jpg" },
  { id:107, name:"Água Mineral 500ml com gás", price:3.00, img:"agua_c_gas.jpg" }
];

let cart = []; // {key, type, id, name, size, qty, unitPrice, promo}

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = v => "R$ " + v.toFixed(2).replace(".",",");

// Toast
function showToast(txt, time=2200){
  const t = $("#toast");
  t.textContent = txt;
  t.classList.remove("hidden");
  clearTimeout(t._to);
  t._to = setTimeout(()=> t.classList.add("hidden"), time);
}

// Render menu
function renderMenu(){
  const dishesEl = $("#dishes");
  dishesEl.innerHTML = "";
  dishes.forEach(d => {
    const card = document.createElement("div"); card.className = "card";
    const imgWrap = document.createElement("div"); imgWrap.className = "img";
    const imgEl = document.createElement("img"); imgEl.alt = d.name;
    imgEl.src = d.img; // PNG path; if missing, shows broken — you will replace PNGs
    imgWrap.appendChild(imgEl);

    const content = document.createElement("div"); content.className = "content";
    const title = document.createElement("h4"); title.textContent = d.name;
    const desc = document.createElement("p"); desc.className = "desc"; desc.textContent = d.desc;

    // controls
    const controls = document.createElement("div"); controls.className = "controls";
    const select = document.createElement("select"); select.className = "sizeSelect";
    d.sizes.forEach((s, idx) => {
      const op = document.createElement("option");
      op.value = idx;
      op.textContent = `${s.label} — ${fmt(s.price)}`;
      select.appendChild(op);
    });

    const qty = document.createElement("input"); qty.type = "number"; qty.min = "1"; qty.value = "1"; qty.className = "qtyInput";
    const addBtn = document.createElement("button"); addBtn.className = "btn-gourmet"; addBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>Adicionar`;

    controls.appendChild(select); controls.appendChild(qty); controls.appendChild(addBtn);

    content.appendChild(title); content.appendChild(desc); content.appendChild(controls);

    card.appendChild(imgWrap); card.appendChild(content);
    dishesEl.appendChild(card);

    addBtn.addEventListener("click", () => {
      const sizeIdx = +select.value;
      const size = d.sizes[sizeIdx];
      const q = Math.max(1, parseInt(qty.value) || 1);
      addToCart({
        key: `dish-${d.id}-${size.label}`,
        type: "dish", id: d.id, name: d.name, size: size.label,
        qty: q, unitPrice: size.price, promo: !!size.promo
      });
      showToast("Item adicionado ao pedido");
    });
  });

  // Render drinks
  const drinksEl = $("#drinks");
  drinksEl.innerHTML = "";
  drinks.forEach(dr => {
    const card = document.createElement("div"); card.className = "card";
    const imgWrap = document.createElement("div"); imgWrap.className = "img";
    const imgEl = document.createElement("img"); imgEl.alt = dr.name; imgEl.src = dr.img;
    imgWrap.appendChild(imgEl);

    const content = document.createElement("div"); content.className = "content";
    const title = document.createElement("h4"); title.textContent = dr.name;
    const desc = document.createElement("p"); desc.className = "desc"; desc.textContent = fmt(dr.price);

    const controls = document.createElement("div"); controls.className = "controls";
    const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="qtyInput";
    const addBtn = document.createElement("button"); addBtn.className="btn-gourmet"; addBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>Adicionar`;
    controls.appendChild(qty); controls.appendChild(addBtn);

    content.appendChild(title); content.appendChild(desc); content.appendChild(controls);
    card.appendChild(imgWrap); card.appendChild(content);
    drinksEl.appendChild(card);

    addBtn.addEventListener("click", () => {
      const q = Math.max(1, parseInt(qty.value) || 1);
      addToCart({
        key: `drink-${dr.id}`,
        type: "drink", id: dr.id, name: dr.name, size: null,
        qty: q, unitPrice: dr.price, promo:false
      });
      showToast("Bebida adicionada ao pedido");
    });
  });
}

// Cart logic
function addToCart(item){
  const exists = cart.find(c => c.key === item.key);
  if(exists) exists.qty += item.qty;
  else cart.push(Object.assign({}, item));
  renderCart();
}

function removeItem(key){
  cart = cart.filter(i => i.key !== key);
  renderCart();
}

function changeQty(key, newQty){
  const it = cart.find(i=>i.key===key);
  if(!it) return;
  it.qty = Math.max(1, newQty);
  renderCart();
}

function renderCart(){
  const el = $("#cartItems");
  el.innerHTML = "";
  let subtotal = 0;
  cart.forEach(it => {
    const row = document.createElement("div"); row.className = "cart-item";
    const left = document.createElement("div"); left.className = "left";
    const thumb = document.createElement("div"); thumb.className = "mini-thumb";
    thumb.textContent = it.type==="dish" ? (it.size || "PRATO") : "BEB";
    const title = document.createElement("div"); title.innerHTML = `<strong>${it.name}</strong><div class="small muted">${it.size ? it.size : ""}</div>`;
    left.appendChild(thumb); left.appendChild(title);

    const ctr = document.createElement("div"); ctr.className = "controls-qty";
    const minus = document.createElement("button"); minus.className = "qty-btn"; minus.textContent = "−";
    const qty = document.createElement("div"); qty.textContent = it.qty; qty.style.minWidth="28px"; qty.style.textAlign="center"; qty.style.fontWeight="700";
    const plus = document.createElement("button"); plus.className = "qty-btn"; plus.textContent = "+";
    const rem = document.createElement("button"); rem.className = "qty-btn"; rem.textContent = "Remover";
    ctr.appendChild(minus); ctr.appendChild(qty); ctr.appendChild(plus); ctr.appendChild(rem);

    const right = document.createElement("div"); right.innerHTML = `<strong>${fmt(it.unitPrice * it.qty)}</strong>`;

    row.appendChild(left); row.appendChild(ctr); row.appendChild(right);
    el.appendChild(row);

    minus.addEventListener("click", ()=> changeQty(it.key, it.qty - 1));
    plus.addEventListener("click", ()=> changeQty(it.key, it.qty + 1));
    rem.addEventListener("click", ()=> removeItem(it.key));

    subtotal += it.unitPrice * it.qty;
  });

  const delivery = 0.00; // conforme informado: sem taxa
  const grand = subtotal + delivery;

  $("#subtotal").textContent = fmt(subtotal);
  $("#delivery").textContent = fmt(delivery);
  $("#grandTotal").textContent = fmt(grand);
}

// WhatsApp message
function sendWhats(){
  if(cart.length === 0){ alert("Seu carrinho está vazio."); return; }
  const lines = [];
  lines.push("Olá! Gostaria de fazer o pedido:");
  lines.push("");
  cart.forEach(it => {
    const s = it.size ? ` (${it.size})` : "";
    lines.push(`- ${it.qty} x ${it.name}${s} = ${fmt(it.unitPrice * it.qty)}`);
  });
  // promoção
  if(cart.some(i=>i.promo && i.qty>0)){
    lines.push("");
    lines.push("Observação: Elegível para promoção GUARACAMP grátis (750ml).");
  }
  lines.push("");
  lines.push("Total: " + $("#grandTotal").textContent);
  lines.push("");
  lines.push("Nome: ");
  lines.push("Endereço: ");
  lines.push("Pagamento: (à vista / cartão / ticket)");

  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${WHATS_PHONE}?text=${text}`;
  window.open(url, "_blank");
}

// Clear cart
function clearCart(){
  if(!confirm("Deseja limpar todo o pedido?")) return;
  cart = [];
  renderCart();
}

// Modal promo
function setupModal(){
  const modal = $("#promoModal");
  $("#openPromo").addEventListener("click", ()=> modal.classList.remove("hidden"));
  $("#closePromo").addEventListener("click", ()=> modal.classList.add("hidden"));
  $("#modalOk").addEventListener("click", ()=> modal.classList.add("hidden"));
}

// Init
function init(){
  renderMenu();
  renderCart();
  setupModal();

  $("#sendWhats").addEventListener("click", sendWhats);
  $("#clearCart").addEventListener("click", clearCart);
}

window.addEventListener("DOMContentLoaded", init);
