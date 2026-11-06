/* =====================================================================
   THE RAWAN | Script 3: Side menu panels (Rawan Estate + Kayen)
   Fills the panel inside the side menu that navigation.js builds.

   FILE MAP (search for the section name to jump there)
     SECTION 1  Content: text, images, units   <-- most edits happen here
     SECTION 2  Styles
     SECTION 3  Small helpers
     SECTION 4  Rawan Estate panel
     SECTION 5  Kayen panel
     SECTION 6  Connect to the side menu

   Colours and fonts such as var(--gold) come from the top of SECTION 3 in navigation.js.

   3DVISTA RULES
     3DVista injects this file as an escaped string, which strips every
     backslash and every line break. So in this file:
       - never use backslashes
       - end every statement with a semicolon
       - only use slash-star comments like this one, never double-slash
   ===================================================================== */
(function () {
  'use strict';

  /* =================================================================
     SECTION 1. CONTENT
     ================================================================= */
  const IMG = 'https://raw.githubusercontent.com/virtual-sudo/The-Rawan-/main/';

  const CONTENT = {
    /* Where "Inquire Now" and the unit cards lead when no other script handles
       the rw:inquire event: a contact page URL, a form link, or mailto: / tel:.
       A unit's own href wins over this. Leave empty to do nothing. */
    inquireUrl: '',

    /* "Rawan Estate" in the side menu */
    overview: {
      image: IMG + 'bg.png',
      imageLabel: 'Entrance',
      intro: 'The Rawan is designed to sustain how you live, so your imagination continues to spark the way you live.',

      pillarsTitle: 'The way of life',
      pillars: [
        { title: 'Everyday discovery', text: 'Wellness, dining, retail, and coworking woven into daily movement.' },
        { title: 'Shared exploration', text: 'Walkable, people-centered spaces that invite interaction.' },
        { title: 'Nature that inspires', text: 'Green corridors and open spaces make nature part of life.' },
        { title: 'Open to more', text: 'New experiences keep everyday life curious and open.' }
      ],

      galleryTitle: 'Gallery',
      gallery: [
        { image: IMG + 'WATERFALL%20OASIS.png', label: 'Waterfall Oasis' },
        { image: IMG + 'bg.png', label: 'Entrance' }
      ],

      cta: {
        title: 'Experience The Rawan',
        text: 'Discover master planned living in Cebu City. Connect with our estate specialists today.',
        button: 'Inquire Now'
      }
    },

    /* "Kayen" in the side menu. Add a photo by filling in image, like the gallery above. */
    units: [
      { name: 'Studio',    size: 'Size to be confirmed', image: '', href: '' },
      { name: '1 Bedroom', size: 'Size to be confirmed', image: '', href: '' },
      { name: '2 Bedroom', size: 'Size to be confirmed', image: '', href: '' },
      { name: '3 Bedroom', size: 'Size to be confirmed', image: '', href: '' }
    ]
  };

  const STAR = `
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 2C50 34 66 50 98 50C66 50 50 66 50 98C50 66 34 50 2 50C34 50 50 34 50 2Z"/>
    </svg>`;

  const ARROW_RIGHT = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>`;


  /* =================================================================
     SECTION 2. STYLES
     ================================================================= */
  const CSS = `
    #rw-panel {
      --coral: #F28361;
      --peach: #F3AE8E;
      --line-faint: #C0B17725;
      scrollbar-width: thin;
      scrollbar-color: rgba(248, 247, 242, .15) rgba(255, 255, 255, .03);
    }
    #rw-panel::-webkit-scrollbar { width: 3px; }
    #rw-panel::-webkit-scrollbar-track { background: rgba(255, 255, 255, .03); }
    #rw-panel::-webkit-scrollbar-thumb { background: rgba(248, 247, 242, .15); border-radius: 2px; }
    #rw-panel::-webkit-scrollbar-thumb:hover { background: rgba(248, 247, 242, .35); }

    /* Everything in a panel fades up, one item after another */
    #rw-panel > * { animation: rw-fade-up .5s var(--ease) both; }
    @keyframes rw-fade-up { from { opacity: 0; transform: translateY(8px); } }
    @keyframes rw-fade { from { opacity: 0; } }


    /* ---------- Shared: headings and images ---------- */
    #rw-panel h4 {
      font: 400 15px var(--serif); letter-spacing: .1em; text-transform: uppercase; color: var(--gold);
    }
    #rw-panel .rw-section { display: flex; align-items: center; gap: 12px; margin: 26px 0 6px; }
    #rw-panel .rw-section::after { content: ""; flex: 1; height: 1px; background: var(--line-faint); }

    #rw-panel .rw-image {
      position: relative; display: grid; place-items: center; overflow: hidden;
      aspect-ratio: 16 / 10; border-radius: 10px;
      background: linear-gradient(135deg, #4d4c66, var(--ink));
      border: 1px dashed #C0B17750;
      transition: border-color .3s ease;
    }
    #rw-panel .rw-image.is-tall { aspect-ratio: 4 / 5; }
    #rw-panel .rw-image.has-photo { border: 0; }
    #rw-panel .rw-image img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      opacity: 0;
      transition: opacity .5s ease, transform .8s var(--ease);
    }
    #rw-panel .rw-image img.is-loaded { opacity: 1; }

    #rw-panel .rw-placeholder {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      color: var(--gold); font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
    }
    #rw-panel .rw-placeholder svg { width: 24px; opacity: .7; }


    /* ---------- Rawan Estate panel ---------- */
    #rw-panel .rw-intro { margin: 16px 0 4px; font-size: 14px; font-weight: 300; line-height: 1.7; }

    #rw-panel .rw-pillar { display: flex; gap: 14px; padding: 14px 0; border-top: 1px solid var(--line-faint); }
    #rw-panel .rw-section + .rw-pillar { border-top: 0; }
    #rw-panel .rw-pillar b { font: 400 18px var(--serif); color: var(--gold); font-variant-numeric: tabular-nums; }
    #rw-panel .rw-pillar h5 { font-size: 13px; font-weight: 700; letter-spacing: .04em; }
    #rw-panel .rw-pillar p { margin-top: 3px; font-size: 12.5px; line-height: 1.55; opacity: .8; }

    #rw-panel .rw-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }

    #rw-panel .rw-overview-cta {
      margin-top: 28px; padding: 20px; border-radius: 12px;
      background: rgba(255, 255, 255, .02);
      border: 1px solid #C0B17735;
      display: flex; flex-direction: column; gap: 12px;
    }
    #rw-panel .rw-overview-cta p { font-size: 12.5px; line-height: 1.6; opacity: .85; }

    #rw-panel .rw-btn-orange {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      width: 100%; height: 44px; margin-top: 4px; padding: 0 20px;
      border: 0; border-radius: 22px; cursor: pointer;
      background: var(--coral); color: var(--ink);
      font: 700 12px/1 var(--sans); letter-spacing: .1em; text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(242, 131, 97, .25);
      transition: transform .2s ease, background-color .2s ease, box-shadow .2s ease;
    }
    #rw-panel .rw-btn-orange svg { width: 16px; height: 16px; transition: transform .25s var(--ease); }
    #rw-panel .rw-btn-orange:active { transform: scale(.98); background: var(--peach); }


    /* ---------- Kayen panel ---------- */
    #rw-panel .rw-unit {
      position: relative; padding: 16px; border-radius: 10px;
      background: rgba(255, 255, 255, .02);
      border: 1px solid var(--line-faint);
      cursor: pointer;
      transition: background-color .25s ease, border-color .25s ease, transform .16s ease;
    }
    #rw-panel .rw-unit + .rw-unit { margin-top: 14px; }
    #rw-panel .rw-unit:active { transform: scale(.995); }

    #rw-panel .rw-unit-info { margin-top: 12px; }
    #rw-panel .rw-unit-info small {
      display: block; margin-bottom: 4px;
      font-size: 10px; letter-spacing: .14em; opacity: .5; font-variant-numeric: tabular-nums;
    }
    #rw-panel .rw-unit-info p { margin-top: 4px; font-size: 12px; opacity: .7; }


    /* ---------- Hover effects: only on devices with a real mouse ---------- */
    @media (hover: hover) and (pointer: fine) {
      #rw-panel .rw-btn-orange:hover {
        background: var(--peach);
        box-shadow: 0 10px 28px rgba(242, 131, 97, .38);
      }
      #rw-panel .rw-btn-orange:hover svg { transform: translateX(4px); }
      #rw-panel .rw-unit:hover { background: rgba(192, 177, 119, .05); border-color: #C0B17760; }
      #rw-panel .rw-unit:hover .rw-image img { transform: scale(1.03); }
    }


    /* ---------- Reduced motion: fade only ---------- */
    @media (prefers-reduced-motion: reduce) {
      #rw-panel > * { animation: rw-fade .2s ease both !important; }
      #rw-panel .rw-image img { transition: opacity .3s ease; }
    }
  `;


  /* =================================================================
     SECTION 3. SMALL HELPERS
     ================================================================= */
  const doc = document;

  function el(tag, className, html) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function textEl(tag, className, text) {
    const node = el(tag, className);
    node.textContent = text;
    return node;
  }

  function twoDigits(i) {
    return (i < 9 ? '0' : '') + (i + 1);
  }

  function placeholder(label) {
    const box = el('div', 'rw-placeholder', STAR);
    box.appendChild(textEl('span', null, label));
    return box;
  }

  /* A photo that fades in once loaded, or a labelled placeholder when there is no photo */
  function imageFrame(src, label, extraClass) {
    const frame = el('div', 'rw-image' + (src ? ' has-photo' : '') + (extraClass ? ' ' + extraClass : ''));

    if (!src) {
      frame.appendChild(placeholder(label));
      return frame;
    }

    const img = el('img');
    img.alt = label;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onload = () => img.classList.add('is-loaded');
    img.onerror = () => {
      frame.classList.remove('has-photo');
      frame.textContent = '';
      frame.appendChild(placeholder(label));
    };
    img.src = src;
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
    frame.appendChild(img);
    return frame;
  }

  /* Tells other scripts about the inquiry (they can call preventDefault() to take over),
     otherwise opens the unit's href or CONTENT.inquireUrl */
  function inquire(detail, href) {
    const event = new CustomEvent('rw:inquire', { detail: detail, cancelable: true });
    doc.dispatchEvent(event);

    const url = href || CONTENT.inquireUrl;
    if (event.defaultPrevented || !url) return;

    if (/^(mailto|tel):/i.test(url)) window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  }


  /* =================================================================
     SECTION 4. RAWAN ESTATE PANEL
     ================================================================= */
  function pillarRow(pillar, i) {
    return el('div', 'rw-pillar', `
      <b>${twoDigits(i)}</b>
      <div>
        <h5>${pillar.title}</h5>
        <p>${pillar.text}</p>
      </div>
    `);
  }

  function gallery(items) {
    const grid = el('div', 'rw-gallery');
    items.forEach((item) => grid.appendChild(imageFrame(item.image, item.label, 'is-tall')));
    return grid;
  }

  function inquireBox(cta) {
    const box = el('div', 'rw-overview-cta', `
      <h4>${cta.title}</h4>
      <p>${cta.text}</p>
      <button type="button" class="rw-btn-orange"><span>${cta.button}</span>${ARROW_RIGHT}</button>
    `);
    box.querySelector('button').onclick = () => inquire({ source: 'overview' });
    return box;
  }

  function renderOverview(container) {
    const about = CONTENT.overview;

    container.appendChild(imageFrame(about.image, about.imageLabel));
    container.appendChild(textEl('p', 'rw-intro', about.intro));

    container.appendChild(textEl('h4', 'rw-section', about.pillarsTitle));
    about.pillars.forEach((pillar, i) => container.appendChild(pillarRow(pillar, i)));

    container.appendChild(textEl('h4', 'rw-section', about.galleryTitle));
    container.appendChild(gallery(about.gallery));

    container.appendChild(inquireBox(about.cta));
  }


  /* =================================================================
     SECTION 5. KAYEN PANEL
     ================================================================= */
  function unitCard(unit, i) {
    const total = CONTENT.units.length;

    const card = el('div', 'rw-unit');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View details for ' + unit.name);

    card.appendChild(imageFrame(unit.image, unit.name));
    card.appendChild(el('div', 'rw-unit-info', `
      <small>${twoDigits(i)} / ${twoDigits(total - 1)}</small>
      <h4>${unit.name}</h4>
      <p>${unit.size}</p>
    `));

    card.onclick = () => inquire({ unit: unit }, unit.href);
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    };
    return card;
  }

  function renderUnits(container) {
    CONTENT.units.forEach((unit, i) => container.appendChild(unitCard(unit, i)));
  }


  /* =================================================================
     SECTION 6. CONNECT TO THE SIDE MENU
     navigation.js fires rw:open whenever a panel is opened. Each panel is built
     once, then the same elements are put back on every open, so images stay
     loaded and the fade-in still replays.
     To add a panel: write a render function, add it here, and add a row with
     the same key to MENU in navigation.js.
     ================================================================= */
  const PANELS = { overview: renderOverview, units: renderUnits };
  const builtPanels = {};
  let stylesAdded = false;

  function addStylesOnce() {
    if (stylesAdded) return;
    stylesAdded = true;
    const style = el('style');
    style.textContent = CSS;
    doc.head.appendChild(style);
  }

  function buildPanel(key) {
    const holder = doc.createDocumentFragment();
    PANELS[key](holder);

    /* Each item starts its fade slightly after the one before */
    Array.from(holder.children).forEach((child, i) => {
      child.style.animationDelay = (80 + Math.min(i * 45, 360)) + 'ms';
    });
    return Array.from(holder.children);
  }

  doc.addEventListener('rw:open', (e) => {
    const key = e.detail.panel;
    if (!PANELS[key]) return;

    addStylesOnce();
    if (!builtPanels[key]) builtPanels[key] = buildPanel(key);
    builtPanels[key].forEach((node) => e.detail.container.appendChild(node));
  });

})();
