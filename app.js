/* ============================================================
   ANS – Power Equipment Website
   Pure vanilla JavaScript – no frameworks, no CDNs, no AJAX
   ============================================================ */

(function () {
  'use strict';

  // ------------------------------------------------------------
  // EDITABLE DATA
  // ------------------------------------------------------------
  const PRODUCTS = [
    {
      id: "Power Transformers",
      ico: "⚡",
      d: "High-capacity oil-immersed units for substations, utilities and heavy industry.",
      f: [
        "Up to 100 MVA / 220 kV class",
        "Low loss CRGO core design",
        "ONAN / ONAF cooling",
        "Tested to IS / IEC standards"
      ]
    },
    {
      id: "Distribution Transformers",
      ico: "🔌",
      d: "Reliable units for power distribution networks, plants and commercial sites.",
      f: [
        "16 kVA to 2500 kVA",
        "Oil-filled and dry-type options",
        "Energy-efficient star-rated designs",
        "Custom voltage and vector groups"
      ]
    },
    {
      id: "CRGO Laminations",
      ico: "🧲",
      d: "Precision cut electrical steel laminations for transformer and reactor cores.",
      f: [
        "Step-lap and standard cutting",
        "Multiple grades and thicknesses",
        "Burr-controlled, low core loss",
        "Cut to customer drawings"
      ]
    },
    {
      id: "Bobbins",
      ico: "🧵",
      d: "Insulating bobbins and coil formers built for dimensional accuracy.",
      f: [
        "Pressboard and moulded options",
        "Custom sizes and winding slots",
        "High dielectric strength",
        "Bulk supply with consistent quality"
      ]
    },
    {
      id: "Mounting Accessories",
      ico: "🔩",
      d: "Complete range of fittings and mounting hardware for transformers.",
      f: [
        "Clamps, channels and brackets",
        "Bushings, tap changers and fittings",
        "Breathers, gauges and valves",
        "Galvanised and painted finishes"
      ]
    }
  ];

  const INFRA = [
    ["🏭", "Manufacturing Bay", "Large covered bays with heavy-duty cranes for core assembly and tanking."],
    ["✂️", "Lamination Cutting Line", "CNC slitting and cut-to-length lines for accurate, burr-free laminations."],
    ["🌀", "Winding Section", "Dedicated winding machines for LV and HV coils with controlled tension."],
    ["🔥", "Vapour Phase Drying", "Moisture removal and vacuum oil filling for long-life insulation."],
    ["🧪", "Testing Laboratory", "In-house routine and type testing: ratio, impedance, loss and insulation."],
    ["📦", "Stores & Dispatch", "Organised raw material stores and safe packing for pan-India delivery."]
  ];

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(k => {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(c => node.appendChild(c));
    return node;
  }

  // Local storage (safe)
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // ------------------------------------------------------------
  // RENDER: PRODUCT CARDS
  // ------------------------------------------------------------
  function productCard(p) {
    const card = el('div', { class: 'card' });

    card.appendChild(el('div', { class: 'ico grad', text: p.ico }));
    card.appendChild(el('h3', { text: p.id }));
    card.appendChild(el('p',  { text: p.d }));

    const ul = el('ul');
    p.f.forEach(x => ul.appendChild(el('li', { text: x })));
    card.appendChild(ul);

    const btn = el('button', { class: 'btn grad', text: 'Enquire Now' });
    btn.addEventListener('click', () => {
      preSelectedProduct = p.id;
      navigate('Enquiry');
    });
    card.appendChild(btn);

    return card;
  }

  function renderProducts() {
    const homeGrid  = $('#homeProducts');
    const allGrid   = $('#allProducts');

    if (homeGrid) {
      homeGrid.innerHTML = '';
      PRODUCTS.forEach(p => homeGrid.appendChild(productCard(p)));
    }
    if (allGrid) {
      allGrid.innerHTML = '';
      PRODUCTS.forEach(p => allGrid.appendChild(productCard(p)));
    }
  }

  // ------------------------------------------------------------
  // RENDER: INFRASTRUCTURE
  // ------------------------------------------------------------
  function renderInfra() {
    const grid = $('#infraGrid');
    if (!grid) return;
    grid.innerHTML = '';

    INFRA.forEach(i => {
      const card = el('div', { class: 'card' });
      card.appendChild(el('div', { class: 'ico grad', text: i[0] }));
      card.appendChild(el('h3', { text: i[1] }));
      card.appendChild(el('p',  { text: i[2] }));
      grid.appendChild(card);
    });
  }

  // ------------------------------------------------------------
  // NAVIGATION
  // ------------------------------------------------------------
  let preSelectedProduct = '';

  function navigate(page) {
    // Tabs
    $$('.tab').forEach(t => {
      t.classList.toggle('act', t.dataset.nav === page);
    });

    // Pages
    $$('.page').forEach(p => p.classList.remove('act'));
    const target = $('#page-' + page);
    if (target) target.classList.add('act');

    // Close mobile menu
    $('#tabs').classList.remove('open');

    // Scroll top
    window.scrollTo({ top: 0 });

    // Reset & preselect enquiry chips
    if (page === 'Enquiry') prepareChips(preSelectedProduct);
  }

  // Wire up any element with data-nav attribute
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-nav]');
    if (!trigger) return;
    e.preventDefault();
    navigate(trigger.dataset.nav);
  });

  // Burger menu
  const burger = $('#burger');
  if (burger) {
    burger.addEventListener('click', () => {
      $('#tabs').classList.toggle('open');
    });
  }

  // ------------------------------------------------------------
  // THEME PICKER & MODE TOGGLE
  // ------------------------------------------------------------
  const themeBtn = $('#themeBtn');
  const themePop = $('#themePop');
  const modeBtn  = $('#modeBtn');

  let theme = store.get('ans-theme') || 'amber';
  let mode  = store.get('ans-mode')  ||
              (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode  = mode;
    store.set('ans-theme', theme);
    store.set('ans-mode',  mode);

    // Highlight active theme swatch
    $$('#themePop button').forEach(b => {
      b.classList.toggle('on', b.dataset.theme === theme);
    });

    // Toggle icon
    if (modeBtn) modeBtn.textContent = (mode === 'dark') ? '☀️' : '🌙';
  }

  if (themeBtn && themePop) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themePop.classList.toggle('open');
    });

    themePop.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      theme = btn.dataset.theme;
      applyTheme();
      themePop.classList.remove('open');
    });

    document.addEventListener('click', () => themePop.classList.remove('open'));
  }

  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      mode = (mode === 'dark') ? 'light' : 'dark';
      applyTheme();
    });
  }

  // ------------------------------------------------------------
  // ENQUIRY FORM
  // ------------------------------------------------------------
  let selectedProducts = [];

  function prepareChips(preselect) {
    const wrap = $('#chips');
    if (!wrap) return;

    selectedProducts = preselect ? [preselect] : [];
    wrap.innerHTML = '';

    PRODUCTS.forEach(p => {
      const chip = el('button', {
        type: 'button',
        class: 'chip' + (selectedProducts.includes(p.id) ? ' on' : ''),
        text: p.id
      });
      chip.addEventListener('click', () => {
        if (selectedProducts.includes(p.id)) {
          selectedProducts = selectedProducts.filter(x => x !== p.id);
          chip.classList.remove('on');
        } else {
          selectedProducts.push(p.id);
          chip.classList.add('on');
        }
      });
      wrap.appendChild(chip);
    });

    // Reset form
    $('#formErr').textContent = '';
    $('#formOk').hidden = true;
    $('#enquiryForm').hidden = false;
    preSelectedProduct = '';
  }

  const form = $('#enquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = $('#fName').value.trim();
      const company = $('#fCompany').value.trim();
      const email   = $('#fEmail').value.trim();
      const phone   = $('#fPhone').value.trim();
      const qty     = $('#fQty').value.trim();
      const spec    = $('#fSpec').value.trim();
      const msg     = $('#fMsg').value.trim();
      const errBox  = $('#formErr');

      errBox.textContent = '';

      if (!name || !phone || !/^\S+@\S+\.\S+$/.test(email)) {
        errBox.textContent = 'Please enter your name, phone and a valid email.';
        return;
      }
      if (selectedProducts.length === 0) {
        errBox.textContent = 'Please select at least one product.';
        return;
      }

      // Build mailto body
      const body = encodeURIComponent(
        'Name: '     + name    + '\n' +
        'Company: '  + company + '\n' +
        'Phone: '    + phone   + '\n' +
        'Products: ' + selectedProducts.join(', ') + '\n' +
        'Quantity: ' + qty     + '\n' +
        'Specs: '    + spec    + '\n\n' +
        msg
      );
      const subject = encodeURIComponent('Enquiry: ' + selectedProducts.join(', '));

      // Show success
      $('#formOk').hidden = false;
      form.hidden = true;
      $('#okTitle').textContent = 'Thank you, ' + name + '!';
      $('#okText').textContent  = 'Your enquiry for ' + selectedProducts.join(', ') +
                                  ' is ready. Send it to our team by email to complete.';
      $('#mailLink').href = 'mailto:sales@ans.com?subject=' + subject + '&body=' + body;
    });
  }

  // ------------------------------------------------------------
  // INIT
  // ------------------------------------------------------------
  function init() {
    // Year in footer
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    // Render dynamic content
    renderProducts();
    renderInfra();
    prepareChips();

    // Apply saved theme / mode
    applyTheme();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();