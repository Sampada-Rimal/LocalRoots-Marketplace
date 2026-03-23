/* LocalRoots – super simple cart using localStorage */
(function(){
  const KEY = 'lr_cart';

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  };
  const write = (list) => localStorage.setItem(KEY, JSON.stringify(list));

  const updateBadge = () => {
    const els = document.querySelectorAll('.cart-count');
    const items = read();
    const totalQty = items.reduce((s,i)=> s + (i.qty||1), 0);
    els.forEach(el => el.textContent = totalQty);
  };

  const addItem = ({id, name, price, image, qty=1}) => {
    if(!id) return;
    const items = read();
    const existing = items.find(i => i.id === id);
    if(existing){ existing.qty = (existing.qty || 1) + qty; }
    else { items.push({id, name, price, image, qty}); }
    write(items); updateBadge(); toast(`${name} added to cart`);
  };

  const removeItem = (id) => { write(read().filter(i => i.id !== id)); updateBadge(); };
  const setQty = (id, qty) => {
    const q = Math.max(1, parseInt(qty||1,10));
    const items = read().map(i => i.id===id ? {...i, qty:q} : i);
    write(items); updateBadge();
  };
  const clear = () => { write([]); updateBadge(); };
  const total = () => read().reduce((s,i)=> s + i.price * (i.qty||1), 0);
  const fmt = (n) => (n || 0).toLocaleString(undefined, {style:'currency', currency:'USD'});

  const toast = (msg) => {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999;opacity:.98";
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 1400);
  };

  // Render helpers for cart.html
  const renderCartTable = () => {
    const tableBody = document.querySelector('#cart-rows');
    const subEl = document.querySelector('#subtotal');
    TheTotal = document.querySelector('#grandtotal');
    if(!tableBody) return;

    const items = read();
    tableBody.innerHTML = '';
    if(items.length === 0){
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#64748b">Your cart is empty.</td></tr>`;
    } else {
      for(const i of items){
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="row">
              <img src="${i.image||''}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb">
              <div><strong>${i.name}</strong><div class="small">${i.id}</div></div>
            </div>
          </td>
          <td class="price">${fmt(i.price)}</td>
          <td><input class="input qty" type="number" min="1" value="${i.qty||1}" data-id="${i.id}"></td>
          <td class="price">${fmt((i.qty||1) * i.price)}</td>
          <td class="row"><button class="btn btn-ghost rmv" data-id="${i.id}">Remove</button></td>
        `;
        tableBody.appendChild(tr);
      }
    }
    const sub = total();
    const delivery = items.length ? 5 : 0; // flat example delivery
    subEl.textContent = fmt(sub);
    TheTotal.textContent = fmt(sub + delivery);

    // wire qty & remove
    tableBody.querySelectorAll('.qty').forEach(inp=>{
      inp.addEventListener('change', e => { setQty(inp.dataset.id, e.target.value); renderCartTable(); });
    });
    tableBody.querySelectorAll('.rmv').forEach(btn=>{
      btn.addEventListener('click', () => { removeItem(btn.dataset.id); renderCartTable(); });
    });
  };

  // expose globally
  window.Cart = { addItem, removeItem, setQty, clear, read, total, fmt, updateBadge, renderCartTable };

  // init at load
  document.addEventListener('DOMContentLoaded', updateBadge);
})();
    