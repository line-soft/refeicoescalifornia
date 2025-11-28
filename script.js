/* script.js — Botões Gourmet Premium (estilo 1)
   Use imagens PNG nas paths: images/dish1.png, images/dish2.png, ... images/drink1.png etc.
   WhatsApp: abre conversa com o número +55 21 97579-9735 (formato wa.me).
*/

const WHATS_PHONE = "5521990674897";

// Dados — edite preços/textos aqui
const dishes = [
  { id:1, name:"Nhoque de Aipim com Carne Seca", desc:"Arroz, Feijão, Farofa, Macarrão. Fritas ou Legumes", sizes:[{label:"Grande 750ml", price:23.00, promo:true},{label:"Pequena", price:21.00}], img:"nhoque.jpg" },
  { id:2, name:"Strogonoff de Frango", desc:"Arroz branco, Batata palha ou fritas", sizes:[{label:"Grande 750ml", price:21.00, promo:true},{label:"Pequena", price:19.00}], img:"strog_fg.jpg" },
  { id:3, name:"Contra Filé Acebolado", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Único", price:25.00}], img:"cf_ac.jpg" },
  { id:4, name:"Filé de Frango à Parmegiana", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Grande 750ml", price:21.00, promo:true},{label:"Pequena", price:19.00}], img:"fil_f_parm.jpg" },
  { id:5, name:"Filé de Frango à Milanesa", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Grande 750ml", price:18.00, promo:true},{label:"Pequena", price:16.00}], img:"fg_mil.jpg" },
  { id:6, name:"Filé de Frango Grelhado", desc:"Arroz, Feijão, Farofa, Macarrão", sizes:[{label:"Grande 750ml", price:18.00, promo:true},{label:"Pequena", price:16.00}], img:"fgo_grel.jpg" }
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
// === CARD EXATO IGUAL À IMAGEM ===
const card = document.createElement("div");
card.className = "card";

// IMAGEM
const imgWrap = document.createElement("div");
imgWrap.className = "img";
const imgEl = document.createElement("img");
imgEl.alt = d.name;
imgEl.src = d.img;
imgWrap.appendChild(imgEl);

// CONTEÚDO
const content = document.createElement("div");
content.className = "content";

// TÍTULO
const title = document.createElement("h4");
title.textContent = d.name;

// DESCRIÇÃO
const desc = document.createElement("p");
desc.className = "desc";
desc.textContent = d.desc;

// CONTROLES (IGUAL A IMAGEM)
const controls = document.createElement("div");
controls.className = "controls controls-premium";

// 🔘 CHECKBOX TAMANHOS
const sizeBox = document.createElement("div");
sizeBox.className = "size-box";

d.sizes.forEach((s, idx) => {
  const opt = document.createElement("label");
  opt.className = "size-option";

  const radio = document.createElement("input");
  radio.type = "checkbox";
  radio.name = `size-${d.id}`;
  radio.dataset.index = idx;

  const text = document.createElement("span");
  text.textContent = `${s.label} — ${fmt(s.price)}`;

  opt.appendChild(radio);
  opt.appendChild(text);
  sizeBox.appendChild(opt);

  // Só 1 pode ser selecionado
  radio.addEventListener("change", () => {
    [...sizeBox.querySelectorAll("input")].forEach(r => {
      if (r !== radio) r.checked = false;
    });
  });
});

// QUANTIDADE
const qtyBox = document.createElement("div");
qtyBox.className = "qty-box";

const minus = document.createElement("button");
minus.className = "qty-btn minus";
minus.textContent = "-";

const qtyTxt = document.createElement("span");
qtyTxt.className = "qty-number";
qtyTxt.textContent = "1";

const plus = document.createElement("button");
plus.className = "qty-btn plus";
plus.textContent = "+";

qtyBox.appendChild(minus);
qtyBox.appendChild(qtyTxt);
qtyBox.appendChild(plus);

// BOTÃO ADICIONAR
const addBtn = document.createElement("button");
addBtn.className = "btn-add-premium";
addBtn.innerHTML = `
  <svg class="icon" viewBox="0 0 24 24">
    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
  </svg>
  Adicionar
`;

controls.appendChild(sizeBox);
controls.appendChild(qtyBox);
controls.appendChild(addBtn);

content.appendChild(title);
content.appendChild(desc);
content.appendChild(controls);

card.appendChild(imgWrap);
card.appendChild(content);
dishesEl.appendChild(card);

// EVENTOS (FUNCIONANDO)
minus.addEventListener("click", () => {
  qtyTxt.textContent = Math.max(1, +qtyTxt.textContent - 1);
});

plus.addEventListener("click", () => {
  qtyTxt.textContent = +qtyTxt.textContent + 1;
});

addBtn.addEventListener("click", () => {
  const chosen = [...sizeBox.querySelectorAll("input")].find(c => c.checked);
  if (!chosen) return showToast("Selecione um tamanho");

  const size = d.sizes[chosen.dataset.index];
  const qty = +qtyTxt.textContent;

  addToCart({
    key: `dish-${d.id}-${size.label}`,
    type: "dish",
    id: d.id,
    name: d.name,
    size: size.label,
    qty,
    unitPrice: size.price,
    promo: !!size.promo
  });

  showToast("Item adicionado ao pedido");
});

  });

 // Render drinks
const drinksEl = $("#drinks");
drinksEl.innerHTML = "";
drinks.forEach(dr => {

  const card = document.createElement("div");
  card.className = "card";

  const imgWrap = document.createElement("div");
  imgWrap.className = "img";

  const imgEl = document.createElement("img");
  imgEl.alt = dr.name;
  imgEl.src = dr.img;
  imgWrap.appendChild(imgEl);

  const content = document.createElement("div");
  content.className = "content";

  const title = document.createElement("h4");
  title.textContent = dr.name;

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = fmt(dr.price);


  // ======================================================
  // QUANTIDADE - + (ESQUERDA) E BOTÃO ADICIONAR (DIREITA)
  // ======================================================
  const actionRow = document.createElement("div");
  actionRow.style.display = "flex";
  actionRow.style.alignItems = "center";
  actionRow.style.justifyContent = "space-between";
  actionRow.style.marginTop = "10px";

  // --- Caixa de quantidade
  const qtyBox = document.createElement("div");
  qtyBox.className = "qty-box";
  qtyBox.style.display = "flex";
  qtyBox.style.alignItems = "center";
  qtyBox.style.gap = "8px";

  const minus = document.createElement("button");
  minus.className = "qty-btn minus";
  minus.textContent = "-";

  const qtyTxt = document.createElement("span");
  qtyTxt.className = "qty-number";
  qtyTxt.textContent = "1";

  const plus = document.createElement("button");
  plus.className = "qty-btn plus";
  plus.textContent = "+";

  qtyBox.appendChild(minus);
  qtyBox.appendChild(qtyTxt);
  qtyBox.appendChild(plus);


  // --- Botão ADICIONAR (igual ao original, sem mexer no estilo)
  const addBtn = document.createElement("button");
  addBtn.className = "btn-gourmet";
  addBtn.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
    </svg>Adicionar
  `;

  // Monta a linha com quantidade à esquerda e botão à direita
  actionRow.appendChild(qtyBox);
  actionRow.appendChild(addBtn);


  // ======================================================
  // MONTA O CARD
  // ======================================================
  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(actionRow);

  card.appendChild(imgWrap);
  card.appendChild(content);

  drinksEl.appendChild(card);


  // ======================================================
  // EVENTOS
  // ======================================================
  minus.addEventListener("click", () => {
    qtyTxt.textContent = Math.max(1, +qtyTxt.textContent - 1);
  });

  plus.addEventListener("click", () => {
    qtyTxt.textContent = +qtyTxt.textContent + 1;
  });

  addBtn.addEventListener("click", () => {
    const q = +qtyTxt.textContent;

    addToCart({
      key: `drink-${dr.id}`,
      type: "drink",
      id: dr.id,
      name: dr.name,
      size: null,
      qty: q,
      unitPrice: dr.price,
      promo: false
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

  const pickup = $("#pickupCheck") ? $("#pickupCheck").checked : false;
  const name = $("#userName") ? $("#userName").value.trim() : "";
  const address = $("#userAddress") ? $("#userAddress").value.trim() : "";
  const payment = $("#userPayment") ? $("#userPayment").value.trim() : "";
  const change = $("#userChange") ? $("#userChange").value.trim() : "";
  const time = $("#userTime") ? $("#userTime").value.trim() : "";

  // validações: nome sempre obrigatório; se não for retirada, endereço e forma de pagamento obrigatórios
  if(!name){
    alert("Por favor informe seu nome.");
    return;
  }
  if(!pickup && (!address || !payment)){
    alert("Por favor preencha Endereço e Forma de pagamento (ou marque Retirar no local).");
    return;
  }
  if(!pickup && payment === "Dinheiro" && change === ""){
    // opcional: permitir vazio, mas aqui alertamos para trocar se desejar
    // vou deixar não obrigatório — removi este bloqueio para não incomodar o usuário
  }

  const lines = [];
  lines.push("Olá! Gostaria de fazer o pedido:");
  lines.push("");

  cart.forEach(it => {
    const s = it.size ? ` (${it.size})` : "";
    lines.push(`- ${it.qty} x ${it.name}${s} = ${fmt(it.unitPrice * it.qty)}`);
  });

  if(cart.some(i=>i.promo && i.qty>0)){
    lines.push("");
    lines.push("Elegível à promoção GUARACAMP grátis.");
  }

  lines.push("");
  lines.push("Total: " + $("#grandTotal").textContent);
  lines.push("");
  lines.push("— Dados do Cliente —");
  lines.push(`Nome: ${name}`);

  if(pickup){
    lines.push("Retirada no local: SIM");
  } else {
    lines.push(`Endereço: ${address}`);
    if(time) lines.push(`Horário previsto: ${time}`);
  }

  if(payment) lines.push(`Pagamento: ${payment}`);
  if(!pickup && payment === "Dinheiro" && change) lines.push(`Troco para: ${change}`);

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
  // proteções: só adiciona listeners se os elementos existirem
  if($("#openPromo")) $("#openPromo").addEventListener("click", ()=> modal.classList.remove("hidden"));
  if($("#closePromo")) $("#closePromo").addEventListener("click", ()=> modal.classList.add("hidden"));
  if($("#modalOk")) $("#modalOk").addEventListener("click", ()=> modal.classList.add("hidden"));
}

// Init
function init(){
  renderMenu();
  renderCart();
  setupModal();
  setupPickupToggle();

  $("#sendWhats").addEventListener("click", sendWhats);
  $("#clearCart").addEventListener("click", clearCart);
}






// ---- Corrigida: apenas desabilita os campos de entrega (não apaga valores) ----
function setupPickupToggle(){
  const pickup = document.getElementById("pickupCheck");
  if (!pickup) return;

  const userAddress = document.getElementById("userAddress");
  const userChange  = document.getElementById("userChange");
  const userTime    = document.getElementById("userTime");

  function aplicarEstado() {
    const retirar = pickup.checked;

    // Ao retirar no local:
    // ❌ Desabilita endereço
    userAddress.disabled = retirar;
    userAddress.style.opacity = retirar ? "0.6" : "1";

    // ✔ Troco continua habilitado
    userChange.disabled = false;
    userChange.style.opacity = "1";

    // ✔ Horário previsto continua habilitado
    userTime.disabled = false;
    userTime.style.opacity = "1";
  }

  aplicarEstado();
  pickup.addEventListener("change", aplicarEstado);
}





window.addEventListener("DOMContentLoaded", init);





