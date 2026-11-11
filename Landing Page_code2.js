/* ==========================================================================
   THE RAWAN · Script 2 of 3 · Editorial Landing Page + Onboarding

   Layout modes (picked from the real screen size, after 3DVista's phone zoom):
   - Landscape (default): star full height in the centre, notes left and right,
     giant wordmark across the bottom. This is the laptop look.
   - .short  (landscape under 560px tall: phones on their side, small windows):
     same composition, tighter bar, smaller notes and a height-capped wordmark.
   - .m      (any portrait screen, phone to tall monitor): one column -
     bar, star, wordmark, place, intro and button - sized with the screen width.
   Big screens scale up to a display-size cap.

   Typography: DM Sans for body & captions; Rawan Sans for display headlines.

   NOTE: 3DVista injects this script as an escaped string, which strips
   every backslash and every line break. Never use backslashes anywhere in
   this file, end every statement with a semicolon, and only use slash-star
   comments (a double-slash comment would swallow the rest of the file).
   ========================================================================== */
(function () {
  'use strict';

  /* 1. Settings ------------------------------------------------------------ */

  const IMAGE = 'https://raw.githubusercontent.com/virtual-sudo/The-Rawan-/main/WATERFALL%20OASIS.png';

  const SETTINGS = {
    logo: 'https://raw.githubusercontent.com/virtual-sudo/The-Rawan-/main/Rawan%20Logo%20-%20Full%20Color_The%20Rawan%20Logo%20H%20-%20Gold.png',
    partnerLogo: 'https://raw.githubusercontent.com/jiaseeds/artha-sondris/main/image%20(2).png',
    developerLogo: 'https://raw.githubusercontent.com/jiaseeds/artha_logo/main/arthaland-logo.png',
    image: IMAGE,
    focus: '50% 52%',
    zoom: 1.1,

    headline: ['Life', 'inspires', 'here.'],
    intro: 'A master planned estate in Cebu City where nature, community, and innovation connect.',
    place: 'Cebu City, Philippines',
    coordinates: '10.32° N · 123.89° E',
    creditLead: 'A Prestige Green Development by',
    creditName: 'Arthaland',
    button: 'Enter the tour',
  };

  const ONBOARDING = {
    eyebrow: 'How to explore',
    button: 'Explore The Rawan',
    look: {
      title: 'Perspective',
      mouse: 'Drag with your mouse or use the arrow keys to look around the estate.',
      touch: 'Drag with one finger to look around, and pinch to zoom in on the details.',
    },
    move: {
      title: 'Navigation',
      mouse: 'Select the glowing hotspots to move between spaces, or jump anywhere from the scene bar below.',
      touch: 'Tap the glowing hotspots to move between spaces, or swipe the scene bar below.',
    },
  };

  const REDUCED_MOTION = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Same stylesheet URL as Script 1, so DM Sans is only downloaded once */
  const FONTS = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&display=swap';
  const EASE_OUT = 'cubic-bezier(.215, .61, .355, 1)';
  const LUXE_EASE = 'cubic-bezier(.16, 1, .3, 1)';

  /* Layout thresholds (CSS px, after 3DVista's phone zoom is undone) */
  const SHORT_HEIGHT = 560;        /* landscape screens shorter than this use the compact layout */
  const WORD_MAX_VH = 0.18;        /* the wordmark never gets taller than 18% of the screen height */
  const WORD_MAX_PX = 140;         /* keeps the wordmark balanced on large displays */

  /* The intro and the "Enter the tour" transition are one camera move, played in two halves.
     Intro: the petals settle in like an aperture closing onto the view, and the words rise into place.
     Exit: the words lift away, the photo in the star melts into the live panorama, then the whole
     page - background, petals and all - flies through the star at full strength. Nothing fades:
     the panorama is revealed only because the opening grows until it covers the screen. How far to
     fly is worked out from the screen size, so it ends at the right moment on any screen.
     The onboarding waits until the panorama fills the screen, so it never covers the flight. */
  const EXIT_MS = 2200;            /* length of the flight through the star (longer = slower and more cinematic) */
  const ONBOARD_OVERLAP = 150;     /* the onboarding starts fading in this many ms before the flight is done */


  /* 2. Graphics & Icons --------------------------------------------------- */

  const svgUrl = (svg) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';

  const WINDOW_PATH =
    'M500 0A500 500 0 0 1 0 500A500 500 0 0 1 500 1000' +
    'A500 500 0 0 1 1000 500A500 500 0 0 1 500 0Z';
  const STAR_MASK = svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' preserveAspectRatio='none'><path d='${WINDOW_PATH}'/></svg>`);

  /* The star is a square with a quarter circle cut from each corner. The widest circle that fits
     inside it has a radius of 0.207 of the star's size (half the diagonal minus the cut). */
  const STAR_INNER_RADIUS = Math.SQRT2 / 2 - 0.5;

  const PETAL_PATHS = [
    'M500 0H330A540 540 0 0 1 0 500A500 500 0 0 0 500 0Z',
    'M1000 500V330A540 540 0 0 1 500 0A500 500 0 0 0 1000 500Z',
    'M500 1000H670A540 540 0 0 1 1000 500A500 500 0 0 0 500 1000Z',
    'M0 500V670A540 540 0 0 1 500 1000A500 500 0 0 0 0 500Z',
  ];
  const PETAL_MASK = svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' preserveAspectRatio='none'>` +
    PETAL_PATHS.map((d) => `<path d='${d}'/>`).join('') + '</svg>');

  const PETALS =
    '<svg class="petals" viewBox="0 0 1000 1000" aria-hidden="true">' +
    '<defs><linearGradient id="rwPetal" x1="0%" y1="100%" x2="0%" y2="0%">' +
      '<stop offset="0%" stop-color="#181A2B" stop-opacity=".97"/>' +
      '<stop offset="50%" stop-color="#23253C" stop-opacity=".9"/>' +
      '<stop offset="100%" stop-color="#3A3C59" stop-opacity=".8"/>' +
    '</linearGradient>' +
    '<linearGradient id="rwGold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="1000">' +
      '<stop offset="0%" stop-color="#F6E3A8"/>' +
      '<stop offset="28%" stop-color="#D4B574"/>' +
      '<stop offset="52%" stop-color="#9C7B3F"/>' +
      '<stop offset="76%" stop-color="#D9BC7C"/>' +
      '<stop offset="100%" stop-color="#F1DCA0"/>' +
    '</linearGradient></defs>' +
    '<g fill="url(#rwPetal)" stroke="url(#rwGold)" stroke-width="0.8" stroke-linejoin="round">' +
    PETAL_PATHS.map((d) => `<path vector-effect="non-scaling-stroke" d="${d}"/>`).join('') +
    '</g></svg>';

  const PATTERN_SCALE = 0.5;
  const PATTERN_W = 6400;
  const PATTERN_H = 3600;
  const PATTERN_SIZE = (PATTERN_W * PATTERN_SCALE) + 'px ' + (PATTERN_H * PATTERN_SCALE) + 'px';
  const PATTERN_CELL = 'M-28.03 -28.03h56.06v56.06h-56.06zM28.03 28.03A137.58 137.58 0 0 1 178.87 165.46M-28.03 28.03A137.58 137.58 0 0 0 122.81 165.46M28.03 28.03A154.17 154.17 0 0 1 122.81 165.46M28.03 28.03A154.17 154.17 0 0 0 122.81 165.46M28.03 -28.03A137.58 137.58 0 0 1 165.46 -178.87M28.03 28.03A137.58 137.58 0 0 0 165.46 -122.81M28.03 -28.03A154.17 154.17 0 0 1 165.46 -122.81M28.03 -28.03A154.17 154.17 0 0 0 165.46 -122.81';

  const PATTERN = (function () {
    const ax = 150.84, ay = 193.49;
    const tiles = [];
    for (let m = -30; m <= 30; m++) {
      for (let n = -30; n <= 30; n++) {
        const x = PATTERN_W / 2 + m * ax + n * ay;
        const y = PATTERN_H / 2 + m * ay - n * ax;
        if (x > -230 && x < PATTERN_W + 230 && y > -230 && y < PATTERN_H + 230) {
          tiles.push(`<use href='#c' x='${x.toFixed(1)}' y='${y.toFixed(1)}'/>`);
        }
      }
    }
    return svgUrl(
      `<svg xmlns='http://www.w3.org/2000/svg' ` +
      `width='${PATTERN_W * PATTERN_SCALE}' height='${PATTERN_H * PATTERN_SCALE}' viewBox='0 0 ${PATTERN_W} ${PATTERN_H}'>` +
      `<defs><path id='c' d='${PATTERN_CELL}'/></defs>` +
      `<g fill='none' stroke='#C0B177' stroke-width='1.2' opacity='.12'>${tiles.join('')}</g></svg>`);
  })();

  const line = (paths, width) => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width || 1.2}"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const STAR = '<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">' +
    '<path d="M50 2C50 34 66 50 98 50C66 50 50 66 50 98C50 66 34 50 2 50C34 50 50 34 50 2Z"/></svg>';

  const ICONS = {
    arrowRight: line('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    up: line('<path d="M12 18V6M7 11l5-5 5 5"/>'),
    down: line('<path d="M12 6v12M7 13l5 5 5-5"/>'),
    left: line('<path d="M18 12H6M11 7l-5 5 5 5"/>'),
    right: line('<path d="M6 12h12M13 7l5 5-5 5"/>'),
    cursor: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3l16 7.2-6.6 2.1L10.6 19z"/></svg>',
  };


  /* 3. Styles -------------------------------------------------------------- */

  const CSS = `
    #rwS, #rwO {
      --navy: #1F2133;
      --navy-deep: #121422;
      --ink: #2A2A38;
      --gold: #C9AE72;
      --gold-light: #E6CF96;
      --cream: #FAF8F5;
      --orange: #FF7052;
      --orange-hover: #FF5D3B;
      --text-soft: rgba(243, 240, 232, .86);
      --text-faint: rgba(243, 240, 232, .58);
      --rule: rgba(201, 174, 114, .35);
      --hairline: rgba(243, 240, 232, .14);
      --serif: "Rawan Sans", "Cormorant Garamond", Georgia, serif;
      --sans: "DM Sans", system-ui, -apple-system, sans-serif;
      --ease-out: ${EASE_OUT};
      --ease-luxe: ${LUXE_EASE};
      --pad: max(clamp(24px, calc(4.5 * var(--vw, 1vw)), 76px), calc(3 * var(--vw, 1vw)));          /* keeps growing past 2K screens */
      --pattern: ${PATTERN} 50% 50% / ${PATTERN_SIZE} no-repeat;
    }
    :where(#rwS, #rwO) * { box-sizing: border-box; margin: 0; padding: 0; }
    :where(#rwS, #rwO) button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
    #rwS svg, #rwO svg { display: block; }
    #rwS :focus-visible, #rwO :focus-visible { outline: 1px solid var(--gold); outline-offset: 4px; }

    /* ── Landing: landscape (the laptop look) ─────────────────────────── */
    #rwS {
      position: fixed; inset: 0; z-index: 2147483647; overflow: hidden;
      color: var(--cream); font: 400 15px/1.6 var(--sans); -webkit-font-smoothing: antialiased;
      background: radial-gradient(90% 80% at 50% 40%, #2C2F4B 0%, var(--navy) 45%, var(--navy-deep) 100%);
    }
    #rwS.wait > :not(.beam) { opacity: 0; }
    #rwS::after {
      content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
      background: radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(8, 9, 18, .55) 100%);
    }

    /* While entering the tour, the star is cut out of the whole page so the live panorama shows
       through it. enterTour() sets --hole-x, --hole-y and --hole-size to where the star is. */
    #rwS.opening {
      -webkit-mask: linear-gradient(#000 0 0), ${STAR_MASK} var(--hole-x) var(--hole-y) / var(--hole-size) var(--hole-size) no-repeat;
      -webkit-mask-composite: xor;
              mask: linear-gradient(#000 0 0), ${STAR_MASK} var(--hole-x) var(--hole-y) / var(--hole-size) var(--hole-size) no-repeat;
              mask-composite: exclude;
      will-change: transform;
    }

    #rwS .beam {
      position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(55% 70% at 92% 4%, rgba(214, 186, 120, .34), transparent 62%),
        linear-gradient(118deg, transparent 46%, rgba(214, 186, 120, .10) 60%, transparent 74%);
    }
    #rwS .pattern-bg {
      position: absolute; inset: 0; pointer-events: none; background: var(--pattern);
      -webkit-mask-image: radial-gradient(circle at 50% 46%, #000 30%, rgba(0,0,0,.6) 55%, transparent 80%);
              mask-image: radial-gradient(circle at 50% 46%, #000 30%, rgba(0,0,0,.6) 55%, transparent 80%);
    }

    /* Top bar */
    #rwS .bar {
      position: absolute; top: 0; left: 0; right: 0; z-index: 4;
      display: flex; align-items: center; justify-content: space-between; gap: 24px;
      padding: clamp(20px, calc(3.4 * var(--vh, 1vh)), 48px) var(--pad);
    }
    #rwS .mark { position: relative; display: block; height: max(clamp(56px, calc(7.5 * var(--vw, 1vw)), 92px), calc(4.2 * var(--vw, 1vw))); aspect-ratio: 3.72; flex: none; }
    #rwS .mark img {
      position: absolute; left: -12.5%; top: 50%; width: 125%; height: auto;
      transform: translateY(-50%); pointer-events: none;
    }
    #rwS .bar .credit {
      display: flex; align-items: center; gap: .8em; min-width: 0; text-align: right;
      font-size: max(12px, calc(.83 * var(--vw, 1vw))); font-weight: 400; letter-spacing: .22em; text-transform: uppercase; color: var(--text-faint);
    }
    #rwS .bar .credit strong { color: var(--gold-light); font-weight: 500; white-space: nowrap; }
    #rwS .bar .credit svg { width: .75em; flex: none; color: var(--gold); }

    /* Star: as tall as the screen, centred, always square */
    #rwS .stage {
      position: absolute; z-index: 1; pointer-events: none;
      left: 50%; top: 0; height: 100%; aspect-ratio: 1;
      translate: -50% 0;
    }
    #rwS .layer { position: absolute; inset: 0; }
    #rwS .window {
      position: absolute; inset: 0; overflow: hidden; background: #2E3050;
      -webkit-mask: ${STAR_MASK} center / 100% 100% no-repeat;
              mask: ${STAR_MASK} center / 100% 100% no-repeat;
    }
    #rwS .petals { width: 100%; height: 100%; overflow: visible; }
    #rwS .petal-pattern {
      background: var(--pattern);
      -webkit-mask: ${PETAL_MASK} center / 100% 100% no-repeat;
              mask: ${PETAL_MASK} center / 100% 100% no-repeat;
    }
    #rwS .photo {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      animation: rwS-kenburns 18s ease-in-out infinite alternate;
    }
    #rwS .glint {
      position: absolute; inset: -20%; pointer-events: none;
      background: linear-gradient(105deg, transparent 40%, rgba(255, 244, 214, .22) 50%, transparent 60%);
      transform: translateX(-120%);
    }

    /* Notes. --bar-h and --word-h are measured by the script, so the left note always
       clears the top bar and the right note always sits just above the wordmark. */
    #rwS .note {
      position: absolute; z-index: 4; width: max(clamp(220px, calc(24 * var(--vw, 1vw)), 360px), calc(18.75 * var(--vw, 1vw)));
      text-shadow: 0 1px 14px rgba(10, 12, 24, .6);
    }
    #rwS .note.l { left: var(--pad); top: max(calc(var(--bar-h, 110px) + 12px), min(calc(30 * var(--vh, 1vh)), 340px)); }
    #rwS .note.r { right: var(--pad); bottom: calc(calc(1.5 * var(--vh, 1vh)) + var(--word-h, calc(13 * var(--vw, 1vw))) + clamp(16px, calc(5.5 * var(--vh, 1vh)), 72px)); }
    #rwS .note p { font-size: max(clamp(15px, calc(1.2 * var(--vw, 1vw)), 18px), calc(.94 * var(--vw, 1vw))); line-height: 1.65; font-weight: 300; color: var(--text-soft); text-wrap: pretty; }
    #rwS .note .place { font-size: max(clamp(12px, calc(.9 * var(--vw, 1vw)), 14px), calc(.73 * var(--vw, 1vw))); font-weight: 500; line-height: 1.4; letter-spacing: .24em; text-transform: uppercase; color: var(--gold-light); }
    #rwS .note .coord { margin-top: .55em; font-size: max(clamp(12px, calc(1 * var(--vw, 1vw)), 15px), calc(.78 * var(--vw, 1vw))); font-weight: 400; letter-spacing: .12em; color: var(--text-faint); font-variant-numeric: tabular-nums; }

    #rwg {
      display: inline-flex; align-items: center; gap: .9em; margin-top: max(24px, calc(1.25 * var(--vw, 1vw)));
      height: max(56px, calc(2.92 * var(--vw, 1vw))); padding: 0 max(34px, calc(1.77 * var(--vw, 1vw))); border-radius: 999px;
      background: var(--orange); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, .25);
      font: 600 max(13px, calc(.68 * var(--vw, 1vw)))/1 var(--sans); letter-spacing: .15em; text-transform: uppercase;
      transition: background-color .2s ease, transform .2s var(--ease-out);
    }
    #rwg svg { width: 1.5em; height: 1.5em; transition: transform .3s var(--ease-out); }
    #rwg:active { transform: scale(.97); }

    /* Dark gradient behind the wordmark */
    #rwS .floor {
      position: absolute; left: 0; right: 0; bottom: 0; height: 46%; z-index: 2; pointer-events: none;
      background: linear-gradient(to top, rgba(14, 15, 28, .92) 0%, rgba(14, 15, 28, .6) 40%, transparent 100%);
    }

    /* Giant wordmark: fitted to the width by the script and capped for large displays */
    #rwS .word {
      position: absolute; z-index: 3; left: var(--pad); right: var(--pad); bottom: calc(1.5 * var(--vh, 1vh));
      overflow: hidden; text-align: center; pointer-events: none;
    }
    #rwS .word h1 {
      display: inline-block; white-space: nowrap;
      font: 400 120px/.86 var(--serif); letter-spacing: .01em; word-spacing: -.08em; text-transform: uppercase;
      color: var(--cream); text-shadow: 0 6px 40px rgba(10, 12, 24, .55);
    }
    #rwS .word h1 span { display: inline-block; }
    #rwS .word h1 .gold {
      background: linear-gradient(180deg, var(--gold-light), var(--gold) 70%, #B39255);
      -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: none;
    }

    @media (hover: hover) and (pointer: fine) {
      #rwg:hover { background: var(--orange-hover); transform: translateY(-2px); }
      #rwg:hover svg { transform: translateX(4px); }
    }

    @keyframes rwS-kenburns { from { transform: scale(var(--zoom)); } to { transform: scale(calc(var(--zoom) * 1.08)); } }

    /* ── Landing: short landscape (phones on their side, small windows) ── */
    #rwS.short .bar { padding-top: 10px; padding-bottom: 10px; }
    #rwS.short .mark { height: clamp(34px, calc(9 * var(--vh, 1vh)), 48px); }
    #rwS.short .bar .credit { font-size: 10px; letter-spacing: .18em; }
    #rwS.short .note { width: clamp(180px, calc(27 * var(--vw, 1vw)), 280px); }
    #rwS.short .note.l { top: calc(var(--bar-h, 64px) + 6px); }
    #rwS.short .note.r { bottom: calc(calc(1.5 * var(--vh, 1vh)) + var(--word-h, 60px) + 10px); }
    #rwS.short .note p { font-size: 13px; line-height: 1.45; }
    #rwS.short .note .place { font-size: 11px; }
    #rwS.short .note .coord { font-size: 11px; }
    #rwS.short #rwg { height: 42px; margin-top: 10px; padding: 0 20px; font-size: 11px; }

    /* ── Landing: portrait, any size (one column, scaled to the width) ── */
    #rwS.m {
      overflow-x: hidden; overflow-y: auto; display: flex; flex-direction: column;
      --pad: clamp(20px, calc(6 * var(--vw, 1vw)), 72px);
    }
    #rwS.m > * { flex-shrink: 0; }            /* the column scrolls; nothing gets squeezed */
    #rwS.m .bar { position: relative; order: 1; padding: clamp(18px, calc(4 * var(--vw, 1vw)), 48px) var(--pad); }
    #rwS.m .mark { height: clamp(44px, calc(11 * var(--vw, 1vw)), 120px); }
    #rwS.m .bar .credit { font-size: clamp(10px, calc(2.2 * var(--vw, 1vw)), 18px); }
    #rwS.m .bar .credit span { display: none; }
    #rwS.m .stage { order: 2; position: relative; left: auto; top: auto; translate: none; width: 100%; height: auto; flex: none; }
    #rwS.m .word { order: 3; position: relative; left: auto; right: auto; bottom: auto; margin: calc(-9 * var(--vw, 1vw)) var(--pad) 0; }
    #rwS.m .note {
      position: relative; left: auto; right: auto; top: auto; bottom: auto;
      width: auto; max-width: 760px; margin: clamp(22px, calc(5 * var(--vw, 1vw)), 56px) var(--pad) 0;
    }
    #rwS.m .note.l { order: 4; margin-top: auto; padding-top: clamp(22px, calc(5 * var(--vw, 1vw)), 56px); }   /* on tall screens the notes settle at the bottom */
    #rwS.m .note.r { order: 5; margin-bottom: max(clamp(28px, calc(7 * var(--vw, 1vw)), 72px), env(safe-area-inset-bottom, 0px)); }
    #rwS.m .note p { font-size: clamp(16px, calc(3.4 * var(--vw, 1vw)), 30px); }
    #rwS.m .note .place { font-size: clamp(12px, calc(2.4 * var(--vw, 1vw)), 22px); }
    #rwS.m .note .coord { font-size: clamp(12px, calc(2.6 * var(--vw, 1vw)), 24px); }
    #rwS.m #rwg {
      display: flex; width: 100%; justify-content: space-between;
      height: clamp(54px, calc(11 * var(--vw, 1vw)), 96px); padding: 0 clamp(24px, calc(5 * var(--vw, 1vw)), 48px); font-size: clamp(13px, calc(2.6 * var(--vw, 1vw)), 22px);
    }

    @media (prefers-reduced-motion: reduce) {
      #rwS .photo, #rwO .mouse, #rwO .key, #rwO .cursor, #rwO .hot::before, #rwO .hot::after, #rwO .hand { animation: none; }
    }


    /* ── Onboarding ──────────────────────────────────────────────────── */
    #rwO {
      /* How see-through the screen is. 0 = fully clear, 1 = solid. Lower it to show more of the
         panorama behind, raise it if the text gets hard to read over a bright scene. */
      --veil: .74;
      /* Softness of the panorama behind the screen (0px = sharp) */
      --soften: 3px;

      /* Width of the header line and the cards. Shared, so their edges always line up.
         This is the main dial for how big the cards are: lower 1040px and 1240px for smaller cards.
         The 45 only takes over on very large displays, past about 2750px wide. */
      --content-w: min(max(clamp(1040px, calc(60 * var(--vw, 1vw)), 1240px), calc(45 * var(--vw, 1vw))), 100%);
      /* Distance from the screen edge to the thin gold frame */
      --frame: clamp(12px, calc(1.6 * var(--vw, 1vw)), 32px);

      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; grid-template-rows: auto 1fr;
      padding: max(32px, env(safe-area-inset-top, 0px)) var(--pad) max(var(--frame), env(safe-area-inset-bottom, 0px));
      overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain;
      scrollbar-gutter: stable both-edges; /* a visible scrollbar cannot push the content off-centre */
      color: var(--cream); font: 400 16px/1.6 var(--sans); -webkit-font-smoothing: antialiased;
      background: radial-gradient(90% 80% at 50% 45%,
        rgba(44, 47, 75, calc(var(--veil) - .08)) 0%,
        rgba(31, 33, 51, var(--veil)) 45%,
        rgba(18, 20, 34, calc(var(--veil) + .14)) 100%);
      -webkit-backdrop-filter: blur(var(--soften));
              backdrop-filter: blur(var(--soften));
    }
    #rwO::after {
      content: ""; position: fixed; inset: var(--frame); z-index: -1; pointer-events: none;
      border: 1px solid rgba(201, 174, 114, .22);
      box-shadow: 0 0 0 100vmax rgba(8, 9, 18, .1), inset 0 0 160px rgba(8, 9, 18, .28);
    }
    /* A soft warm glow in the top right corner. No line pattern on this screen. */
    #rwO::before {
      content: ""; position: fixed; inset: 0; z-index: -2; pointer-events: none;
      background: radial-gradient(55% 70% at 92% 4%, rgba(214, 186, 120, .22), transparent 62%);
      -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 35%, transparent 80%);
              mask-image: radial-gradient(circle at 50% 50%, #000 35%, transparent 80%);
    }
    #rwO .hd {
      display: flex; align-items: center; justify-content: center; gap: clamp(24px, calc(5.5 * var(--vw, 1vw)), 96px); flex-wrap: wrap;
      padding: clamp(12px, calc(2.5 * var(--vh, 1vh)), 32px) 0 clamp(20px, calc(3.5 * var(--vh, 1vh)), 48px); border-bottom: 1px solid var(--hairline);
      width: var(--content-w); margin: 0 auto;
    }
    #rwO .hd img { width: auto; object-fit: contain; }
    #rwO .hd img.logo-main { height: max(clamp(56px, calc(6.8 * var(--vw, 1vw)), 88px), calc(4.6 * var(--vw, 1vw))); }
    #rwO .hd img.logo-dev { height: max(clamp(50px, calc(6 * var(--vw, 1vw)), 80px), calc(4.2 * var(--vw, 1vw))); }
    #rwO .hd img.logo-partner { height: max(clamp(40px, calc(4.8 * var(--vw, 1vw)), 64px), calc(3.3 * var(--vw, 1vw))); opacity: .92; }
    #rwO .hd img.mono { filter: brightness(0) invert(1); opacity: .9; }
    #rwO .hd i { width: 1px; height: 36px; background: var(--hairline); }

    #rwO .mid {
      align-self: center; display: flex; flex-direction: column; align-items: center;
      gap: clamp(28px, calc(5 * var(--vh, 1vh)), 72px); width: var(--content-w); margin: 0 auto; padding: clamp(20px, calc(4 * var(--vh, 1vh)), 48px) 0;
    }
    #rwO .ey {
      display: flex; align-items: center; gap: 18px;
      font: 500 max(13px, calc(.9 * var(--vw, 1vw)))/1.5 var(--sans); letter-spacing: .32em; text-transform: uppercase; color: var(--gold-light);
      text-shadow: 0 1px 12px rgba(8, 9, 18, .6);
    }
    #rwO .ey::before, #rwO .ey::after { content: ""; width: clamp(40px, calc(4 * var(--vw, 1vw)), 96px); height: 1px; background: var(--rule); }
    #rwO .ey::after { margin-left: -.32em; } /* cancels the letter-spacing after the last letter, so the text sits centred between its lines */

    #rwO .cols {
      display: grid; grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
      gap: clamp(20px, calc(4.5 * var(--vw, 1vw)), 72px); width: 100%; align-items: stretch;
      margin-inline: auto;
    }
    #rwO .sep {
      position: relative; width: 1px; align-self: stretch;
      background: linear-gradient(180deg, transparent, var(--rule) 20%, var(--rule) 40%, transparent 40%,
                                          transparent 60%, var(--rule) 60%, var(--rule) 80%, transparent);
    }
    #rwO .sep svg { position: absolute; top: 50%; left: 50%; width: 14px; translate: -50% -50%; color: var(--gold); }

    #rwO .card {
      display: flex; flex-direction: column; align-items: center; text-align: center;
      width: 100%; min-width: 0;
      padding: clamp(24px, calc(3 * var(--vw, 1vw)), 48px) clamp(20px, calc(2.6 * var(--vw, 1vw)), 44px);
      background: rgba(14, 15, 28, .34);
      -webkit-backdrop-filter: blur(8px);
              backdrop-filter: blur(8px);
      border: 1px solid rgba(201, 174, 114, 0.22);
      border-radius: 12px;
      transition: border-color .3s ease, transform .3s var(--ease-out);
    }
    @media (hover: hover) and (pointer: fine) {
      #rwO .card:hover { border-color: rgba(201, 174, 114, 0.4); transform: translateY(-3px); }
    }
    /* Two equal slots around the divider, so the divider sits exactly on the card's centre line.
       86px is the width of the arrow keys, the widest icon. */
    #rwO .ico {
      display: grid; grid-template-columns: 86px 1px 86px; justify-items: center; align-items: center;
      gap: 28px; height: 72px; margin-bottom: 24px;
    }
    #rwO .ico > i { width: 1px; height: 32px; background: var(--hairline); }
    @media (min-width: 2200px) { #rwO:not(.m) .ico { zoom: 1.2; } }
    @media (min-width: 3200px) { #rwO:not(.m) .ico { zoom: 1.5; } }
    @media (min-width: 900px) { #rwO.m .ico { zoom: 1.2; } }
    #rwO h2 {
      margin-bottom: .45em;
      padding-left: .08em; /* balances the letter-spacing after the last letter */
      font: 400 max(clamp(26px, calc(2.6 * var(--vw, 1vw)), 42px), calc(1.6 * var(--vw, 1vw)))/1.1 var(--serif); letter-spacing: .08em; text-transform: uppercase;
      background: linear-gradient(180deg, var(--gold-light), var(--gold) 70%, #B39255);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    /* margin-block: auto centres the shorter text against the longer one in the other card,
       while the icons and titles stay level with each other. */
    #rwO .card p {
      max-width: 26em; margin-block: auto; text-wrap: balance;
      font-size: max(clamp(15px, calc(1.15 * var(--vw, 1vw)), 19px), calc(.72 * var(--vw, 1vw))); line-height: 1.65; color: var(--text-soft); font-weight: 300;
    }

    #rwO .act { display: flex; flex-direction: column; align-items: center; gap: 18px; margin-top: 8px; }
    #rwO .go {
      display: inline-flex; align-items: center; gap: 16px; height: 62px; padding: 0 44px; border-radius: 31px;
      background: linear-gradient(135deg, #FF7052 0%, #E65335 100%); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, .3);
      font: 600 13px/1 var(--sans); letter-spacing: .2em; text-transform: uppercase;
      transition: transform .2s var(--ease-out);
    }
    #rwO .go svg { width: 18px; height: 18px; transition: transform .3s var(--ease-out); }
    #rwO .go:active { transform: scale(.97); }
    @media (hover: hover) and (pointer: fine) {
      #rwO .go:hover { background: linear-gradient(135deg, #FF8064 0%, #FF5D3B 100%); transform: translateY(-2px); }
      #rwO .go:hover svg { transform: translateX(5px); }
    }

    #rwO .mouse { position: relative; width: 24px; height: 38px; border: 1px solid var(--gold); border-radius: 12px; animation: rwO-drag 3.2s var(--ease-luxe) infinite; }
    #rwO .mouse::before { content: ""; position: absolute; top: 0; left: 50%; width: 1px; height: 12px; margin-left: -.5px; background: var(--gold); opacity: .35; }
    #rwO .mouse::after { content: ""; position: absolute; top: 7px; left: 50%; width: 2px; height: 6px; margin-left: -1px; border-radius: 1px; background: var(--gold); }
    #rwO .keys { display: grid; grid-template-columns: repeat(3, 26px); grid-template-areas: ". u ." "l d r"; gap: 4px; }
    #rwO .key { display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid var(--gold); border-radius: 6px; color: var(--gold); animation: rwO-key 4s ease infinite; }
    #rwO .key svg { width: 12px; height: 12px; }
    #rwO .key.u { grid-area: u; }
    #rwO .key.l { grid-area: l; animation-delay: 1s; }
    #rwO .key.d { grid-area: d; animation-delay: 2s; }
    #rwO .key.r { grid-area: r; animation-delay: 3s; }
    #rwO .cursor { width: 28px; height: 28px; color: var(--gold); animation: rwO-reach 2.4s var(--ease-luxe) infinite; }
    #rwO .hot { position: relative; display: grid; place-items: center; width: 40px; height: 40px; color: var(--gold); }
    #rwO .hot::before { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 1px dashed var(--gold); animation: rwO-spin 14s linear infinite; }
    #rwO .hot::after { content: ""; position: absolute; inset: 5px; border-radius: 50%; border: 0.8px solid var(--gold); animation: rwO-ripple 2.4s var(--ease-out) infinite; }
    #rwO .hot svg { width: 13px; }
    #rwO .hand { width: 32px; height: 32px; color: var(--gold); }
    #rwO .hand.drag { animation: rwO-drag 3.2s var(--ease-luxe) infinite; }
    #rwO .hand.tap { animation: rwO-tap 2.4s var(--ease-luxe) infinite; }
    #rwO .swipe { width: 30px; height: 30px; color: var(--gold); }

    @keyframes rwO-drag   { 0%, 100% { transform: translateX(-7px); } 50% { transform: translateX(7px); } }
    @keyframes rwO-key    { 0%, 22%, 100% { background: transparent; color: var(--gold); } 6%, 14% { background: var(--gold); color: var(--ink); } }
    @keyframes rwO-reach  { 0%, 100% { transform: translate(-4px, -4px); } 50% { transform: translate(3px, 3px); } }
    @keyframes rwO-tap    { 0%, 100% { transform: translateY(0) scale(1); } 45% { transform: translateY(3px) scale(.94); } }
    @keyframes rwO-spin   { to { rotate: 360deg; } }
    @keyframes rwO-ripple { from { transform: scale(1); opacity: .8; } to { transform: scale(1.9); opacity: 0; } }

    /* Onboarding: short landscape - everything tighter so it fits without scrolling where possible */
    #rwO.short { --frame: 8px; padding-top: 14px; }
    #rwO.short .hd { gap: 20px; padding: 4px 0 10px; }
    #rwO.short .hd img.logo-main { height: 34px; }
    #rwO.short .hd img.logo-dev { height: 30px; }
    #rwO.short .hd img.logo-partner { height: 24px; }
    #rwO.short .hd i { height: 18px; }
    #rwO.short .mid { gap: 12px; padding: 10px 0; }
    #rwO.short .ey { font-size: 11px; }
    #rwO.short .card { padding: 14px 16px; }
    #rwO.short .ico { height: 56px; margin-bottom: 8px; zoom: .8; }
    #rwO.short h2 { font-size: 20px; margin-bottom: 4px; }
    #rwO.short .card p { font-size: 13px; line-height: 1.45; }
    #rwO.short .act { gap: 0; margin-top: 0; }
    #rwO.short .go { height: 44px; padding: 0 28px; font-size: 12px; }

    /* Onboarding: portrait, any size */
    #rwO.m { --pad: clamp(20px, calc(6 * var(--vw, 1vw)), 72px); --content-w: min(clamp(560px, calc(62 * var(--vw, 1vw)), 760px), 100%); }
    #rwO.m .hd { gap: clamp(16px, calc(4 * var(--vw, 1vw)), 48px); }
    #rwO.m .hd img.logo-main { height: clamp(36px, calc(8 * var(--vw, 1vw)), 96px); }
    #rwO.m .hd img.logo-dev { height: clamp(32px, calc(7 * var(--vw, 1vw)), 84px); }
    #rwO.m .hd img.logo-partner { height: clamp(24px, calc(5.4 * var(--vw, 1vw)), 64px); }
    #rwO.m .hd i { height: clamp(18px, calc(4 * var(--vw, 1vw)), 44px); }
    #rwO.m .mid { gap: clamp(24px, calc(5 * var(--vw, 1vw)), 56px); padding: clamp(20px, calc(4 * var(--vw, 1vw)), 48px) 0; }
    #rwO.m .ey { font-size: clamp(11px, calc(2.2 * var(--vw, 1vw)), 18px); }
    #rwO.m .cols { grid-template-columns: 1fr; gap: clamp(16px, calc(3 * var(--vw, 1vw)), 32px); }
    #rwO.m .sep {
      width: 140px; height: 1px; justify-self: center;
      background: linear-gradient(90deg, transparent, var(--rule) 30%, var(--rule) 40%, transparent 40%,
                                         transparent 60%, var(--rule) 60%, var(--rule) 70%, transparent);
    }
    #rwO.m .card { padding: clamp(20px, calc(5 * var(--vw, 1vw)), 36px); }
    #rwO.m .ico { height: 56px; margin-bottom: 12px; }
    #rwO.m h2 { font-size: clamp(24px, calc(5.4 * var(--vw, 1vw)), 42px); }
    #rwO.m .card p { font-size: clamp(15px, calc(3 * var(--vw, 1vw)), 19px); }
    #rwO.m .act { width: 100%; }
    #rwO.m .go { width: 100%; justify-content: center; padding: 0 20px; }
  `;


  /* 4. Helpers ------------------------------------------------------------- */

  const doc = document;
  const el = (tag, props) => Object.assign(doc.createElement(tag), props || {});

  function loadFonts() {
    if (doc.querySelector(`link[href="${FONTS}"]`)) return;
    doc.head.appendChild(el('link', { rel: 'stylesheet', href: FONTS }));
  }

  /* Plays a Web Animation. Exit animations keep their end state (fill: both) until the
     element is removed. Entrance animations pass fill: 'backwards' so they let go of the
     element when they finish - otherwise they would keep overriding CSS (hover lifts etc). */
  function play(node, frames, options) {
    if (!node || !node.animate) return null;
    if (REDUCED_MOTION) {
      frames = frames.map((f) => ({ opacity: f.opacity == null ? 1 : f.opacity }));
      options = Object.assign({}, options, { duration: Math.min(options.duration || 200, 200), delay: 0 });
    }
    return node.animate(frames, Object.assign({ fill: 'both' }, options));
  }

  const enter = (node, frames, options) => play(node, frames, Object.assign({ fill: 'backwards' }, options));

  /* Softer entrance for the onboarding: rises, un-blurs and fades in */
  const reveal = (node, distance, duration, delay) =>
    enter(node, [
      { opacity: 0, transform: `translateY(${distance}px)`, filter: 'blur(8px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
      { duration, delay, easing: LUXE_EASE });

  /* How much the browser is shrinking the page. 3DVista asks for half size on phones
     (initial-scale=0.5 in the viewport tag), but Chrome and Firefox ignore that in fullscreen and
     show the page at full size, so in fullscreen the browser's live value is used instead. */
  function pageScale() {
    let scale;
    if (window.visualViewport && (doc.fullscreenElement || doc.webkitFullscreenElement)) {
      scale = window.visualViewport.scale;
    } else {
      const meta = doc.querySelector('meta[name=viewport]');
      const match = meta && /initial-scale=([0-9.]+)/.exec(meta.content);
      scale = match ? +match[1] : 1;
    }
    return scale > 0 && scale < 1 ? scale : 1;
  }

  /* Undo 3DVista's phone zoom (it sets initial-scale=0.5) and pick the layout:
     portrait screens of any size get the one-column layout (.m);
     landscape screens under SHORT_HEIGHT get the compact layout (.short).
     Runs once straight away, then at most once per frame on resize. */
  function fitToScreen(node, onChange) {
    let lastScale = -1;
    let queued = 0;
    const update = () => {
      queued = 0;
      const scale = pageScale();
      if (scale !== lastScale) {
        lastScale = scale;
        node.style.zoom = scale < 1 ? String(1 / scale) : '';
      }
      /* 1% of the real screen width/height. Under 3DVista's phone zoom, plain vw/vh would come out
         doubled, so every size in the stylesheet uses these instead. */
      node.style.setProperty('--vw', (innerWidth * scale / 100).toFixed(3) + 'px');
      node.style.setProperty('--vh', (innerHeight * scale / 100).toFixed(3) + 'px');
      const portrait = innerHeight > innerWidth;
      node.classList.toggle('m', portrait);
      node.classList.toggle('short', !portrait && innerHeight * scale < SHORT_HEIGHT);
      if (onChange) onChange();
    };
    const schedule = () => { if (!queued) queued = requestAnimationFrame(update); };
    update();
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule);
    doc.addEventListener('fullscreenchange', schedule);
    doc.addEventListener('webkitfullscreenchange', schedule);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule);
    const observer = window.MutationObserver && new MutationObserver(schedule);
    if (observer) observer.observe(doc.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['content'] });
    return () => {
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      doc.removeEventListener('fullscreenchange', schedule);
      doc.removeEventListener('webkitfullscreenchange', schedule);
      if (window.visualViewport) window.visualViewport.removeEventListener('resize', schedule);
      if (observer) observer.disconnect();
    };
  }


  /* 5. Onboarding Screen --------------------------------------------------- */

  /* delay = how long to wait (ms) before the screen starts to fade in */
  function mountOnboarding(onComplete, delay) {
    if (doc.getElementById('rwO')) return;

    const wait = delay || 0;
    const touch = !FINE_POINTER;
    const key = (k) => `<span class="key ${k[0]}">${ICONS[k]}</span>`;
    /* Same icons on every device (only the wording changes for touch screens) */
    const lookIcons = `<span class="mouse"></span><i></i><span class="keys">${['up', 'left', 'down', 'right'].map(key).join('')}</span>`;
    const moveIcons = `<span class="cursor">${ICONS.cursor}</span><i></i><span class="hot">${STAR}</span>`;

    const overlay = el('div', { id: 'rwO' });
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'rwO-title');

    overlay.innerHTML = `
      <header class="hd">
        <img src="${SETTINGS.logo}" alt="The Rawan" class="logo-main" decoding="async">
        <i aria-hidden="true"></i>
        <img src="${SETTINGS.partnerLogo}" alt="Mitsui Fudosan Group" class="logo-partner" decoding="async">
        <i aria-hidden="true"></i>
        <img src="${SETTINGS.developerLogo}" alt="Arthaland" class="logo-dev mono" decoding="async">
      </header>

      <div class="mid">
        <p class="ey" id="rwO-title">${ONBOARDING.eyebrow}</p>
        <div class="cols">
          <section class="card">
            <div class="ico" aria-hidden="true">${lookIcons}</div>
            <h2>${ONBOARDING.look.title}</h2>
            <p>${touch ? ONBOARDING.look.touch : ONBOARDING.look.mouse}</p>
          </section>
          <div class="sep" aria-hidden="true">${STAR}</div>
          <section class="card">
            <div class="ico" aria-hidden="true">${moveIcons}</div>
            <h2>${ONBOARDING.move.title}</h2>
            <p>${touch ? ONBOARDING.move.touch : ONBOARDING.move.mouse}</p>
          </section>
        </div>
        <div class="act">
          <button class="go" type="button"><span>${ONBOARDING.button}</span>${ICONS.arrowRight}</button>
        </div>
      </div>
    `;

    doc.body.appendChild(overlay);
    const stopFitting = fitToScreen(overlay);
    const startBtn = overlay.querySelector('.go');

    enter(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: 1200, delay: wait, easing: 'ease-out' });
    [overlay.querySelector('.hd'), overlay.querySelector('.ey'), ...overlay.querySelectorAll('.card'), overlay.querySelector('.act')]
      .forEach((node, i) => reveal(node, 22, 1100, wait + 250 + i * 120));
    enter(overlay.querySelector('.sep'), [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }],
      { duration: 1000, delay: wait + 600, easing: LUXE_EASE });

    if (!touch) setTimeout(() => startBtn.focus({ preventScroll: true }), wait + 350);

    const readyAt = performance.now() + wait + 700;
    let leaving = false;

    function dismiss() {
      if (leaving) return;
      leaving = true;
      doc.removeEventListener('keydown', onKey);
      const fade = play(overlay, [{ opacity: 1 }, { opacity: 0, transform: 'scale(1.02)' }],
        { duration: 450, easing: 'cubic-bezier(.4, 0, 1, 1)' });
      const finish = () => {
        stopFitting();
        overlay.remove();
        doc.dispatchEvent(new CustomEvent('rw:onboarded'));
        if (typeof onComplete === 'function') onComplete();
      };
      if (fade) fade.onfinish = finish;
      else finish();
    }

    function onKey(e) {
      if (e.key === 'Tab') { e.preventDefault(); startBtn.focus(); return; }
      if (e.key !== 'Enter' && e.key !== 'Escape' && e.key !== ' ') return;
      e.preventDefault();
      if (performance.now() < readyAt) return;
      dismiss();
    }

    startBtn.onclick = dismiss;
    doc.addEventListener('keydown', onKey);
  }


  /* 6. Build Landing Page -------------------------------------------------- */

  let mounted = false;
  let onboarded = false;

  function mount() {
    if (mounted || !doc.body) return;
    mounted = true;

    loadFonts();
    doc.head.appendChild(el('style', { textContent: CSS }));
    showLanding(false);

    /* "Home" in the side menu (Script 1) brings the landing page back */
    doc.addEventListener('rw:home', (e) => {
      e.preventDefault();
      showLanding(true);
    });
  }

  /* again = shown from the Home menu item: the visitor is already in the tour,
     so the button gets focus and the onboarding screen is not repeated. */
  function showLanding(again) {
    if (doc.getElementById('rwS')) return;

    const page = el('div', { id: 'rwS' });
    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-modal', 'true');
    page.setAttribute('aria-label', 'Welcome to The Rawan');
    page.classList.add('wait');

    const beam = el('div', { className: 'beam' });
    const patternBg = el('div', { className: 'pattern-bg' });

    /* Top bar */
    const bar = el('header', { className: 'bar' });
    bar.innerHTML =
      `<span class="mark"><img src="${SETTINGS.logo}" alt="The Rawan" decoding="async"></span>` +
      `<p class="credit">${STAR}<span>${SETTINGS.creditLead}</span><strong>${SETTINGS.creditName}</strong></p>`;

    /* Star stage */
    const stage = el('div', { className: 'stage' });
    const win = el('div', { className: 'window' });
    const photo = el('img', { className: 'photo', alt: '', decoding: 'async', fetchPriority: 'high' });
    photo.setAttribute('aria-hidden', 'true');
    photo.style.objectPosition = SETTINGS.focus;
    photo.style.transformOrigin = SETTINGS.focus;
    photo.style.setProperty('--zoom', SETTINGS.zoom);
    photo.src = SETTINGS.image;
    const glint = el('div', { className: 'glint' });
    win.append(photo, glint);
    const petalsLayer = el('div', { className: 'layer', innerHTML: PETALS });
    const patternLayer = el('div', { className: 'layer petal-pattern' });
    stage.append(win, petalsLayer, patternLayer);

    /* Left note: place & coordinates */
    const noteL = el('div', { className: 'note l' });
    noteL.innerHTML = '<p class="place"></p><p class="coord"></p>';
    noteL.querySelector('.place').textContent = SETTINGS.place;
    noteL.querySelector('.coord').textContent = SETTINGS.coordinates;

    /* Right note: intro & CTA button */
    const noteR = el('div', { className: 'note r' });
    noteR.innerHTML = `<p></p><button id="rwg" type="button"><span></span>${ICONS.arrowRight}</button>`;
    noteR.querySelector('p').textContent = SETTINGS.intro;
    const button = noteR.querySelector('#rwg');
    button.querySelector('span').textContent = SETTINGS.button;
    button.onclick = () => enterTour();

    /* Giant wordmark */
    const word = el('div', { className: 'word' });
    const h1 = el('h1');
    SETTINGS.headline.forEach((w, i) => {
      if (i) h1.append(' ');
      h1.append(el('span', { className: i === SETTINGS.headline.length - 1 ? 'gold' : '', textContent: w }));
    });
    word.append(h1);

    const floor = el('div', { className: 'floor' });
    page.append(beam, patternBg, stage, floor, bar, noteL, noteR, word);
    doc.body.appendChild(page);
    if (again) button.focus({ preventScroll: true });

    /* The beam stays visible while the photo loads, so fade it in now rather than
       hiding it again when the intro starts. */
    enter(beam, [{ opacity: 0 }, { opacity: 1 }], { duration: 2400, easing: 'ease-out' });

    /* Fit the wordmark to the available width, with viewport-height and absolute size caps.
       Then publish the bar and wordmark heights so the notes can avoid them. */
    function fitWord() {
      const avail = word.clientWidth;
      if (!avail) return;
      h1.style.fontSize = '100px';
      const natural = h1.scrollWidth;
      if (!natural) return;
      let size = 100 * avail / natural;
      size = Math.min(size, page.clientHeight * WORD_MAX_VH, WORD_MAX_PX);
      h1.style.fontSize = size.toFixed(2) + 'px';
      page.style.setProperty('--word-h', h1.offsetHeight + 'px');
      page.style.setProperty('--bar-h', bar.offsetHeight + 'px');
    }

    const stopFitting = fitToScreen(page, fitWord);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitWord);
    bar.querySelector('img').addEventListener('load', fitWord);


    /* 7. Entrance Animations ----------------------------------------------- */

    /* The first half of the camera move. The petals start a little closer and turned, then settle
       into place like an aperture closing onto the view - the reverse of the exit. The photo eases
       back inside the star, and the words rise out of their mask one by one. */
    function startIntro() {
      fitWord();
      page.classList.remove('wait');

      enter(patternBg, [{ opacity: 0 }, { opacity: 1 }], { duration: 2600, delay: 200, easing: 'ease-out' });
      enter(stage, [
        { opacity: 0, scale: '1.16', rotate: '4deg' },
        { opacity: 1, offset: .35 },                    /* solid early; the settling carries on after */
        { opacity: 1, scale: '1', rotate: '0deg' },
      ], { duration: 2600, delay: 100, easing: LUXE_EASE });
      enter(photo, [{ opacity: 0, scale: '1.2' }, { opacity: 1, scale: '1' }],
        { duration: 3200, delay: 250, easing: LUXE_EASE });
      if (!REDUCED_MOTION) {
        enter(glint, [{ transform: 'translateX(-120%)' }, { transform: 'translateX(120%)' }],
          { duration: 1800, delay: 2600, easing: 'cubic-bezier(.45, 0, .2, 1)' });
      }

      reveal(bar, -10, 1000, 450);
      /* The words rise out of the wordmark's mask: no fade, so the letters stay crisp */
      h1.querySelectorAll('span').forEach((s, i) => {
        enter(s, [{ transform: 'translateY(105%)' }, { transform: 'none' }],
          { duration: 1500, delay: 750 + i * 120, easing: LUXE_EASE });
      });
      reveal(noteL, 16, 1100, 1200);
      reveal(noteR, 16, 1100, 1350);
    }

    const decoded = photo.decode ? photo.decode() : Promise.resolve();
    let started = false;
    let leaving = false;
    const go = () => {
      if (started || leaving) return;
      started = true;
      startIntro();
    };
    Promise.race([decoded.catch(() => {}), new Promise((r) => setTimeout(r, 2500))])
      .then(() => {
        requestAnimationFrame(() => requestAnimationFrame(go));
        setTimeout(go, 150);
      });


    /* 8. Transition Landing → Panorama → Onboarding ------------------------ */

    /* Cuts the star out of the page, so the live panorama shows through it, and returns where
       the star is in the page's own pixels (3DVista's phone zoom makes those differ from the screen's). */
    function cutOutStar() {
      const unit = parseFloat(page.style.zoom) || 1;
      const pageBox = page.getBoundingClientRect();
      const starBox = win.getBoundingClientRect();
      const hole = {
        x: (starBox.left - pageBox.left) / unit,
        y: (starBox.top - pageBox.top) / unit,
        size: starBox.width / unit,
        pageW: pageBox.width / unit,
        pageH: pageBox.height / unit,
      };
      page.style.setProperty('--hole-x', hole.x + 'px');
      page.style.setProperty('--hole-y', hole.y + 'px');
      page.style.setProperty('--hole-size', hole.size + 'px');
      page.style.transformOrigin = (hole.x + hole.size / 2) + 'px ' + (hole.y + hole.size / 2) + 'px';
      page.classList.add('opening');
      return hole;
    }

    /* How far the page must zoom before the star opening covers the whole screen:
       its widest inner circle has to reach the screen corner furthest from its centre. */
    function zoomToFill(hole) {
      const cx = hole.x + hole.size / 2;
      const cy = hole.y + hole.size / 2;
      const furthest = Math.max(
        Math.hypot(cx, cy), Math.hypot(hole.pageW - cx, cy),
        Math.hypot(cx, hole.pageH - cy), Math.hypot(hole.pageW - cx, hole.pageH - cy));
      return furthest / (STAR_INNER_RADIUS * hole.size);
    }

    /* The flight's pace: slow to start, fastest in the middle, gentle at the end (ease-in-out cubic),
       and its inverse - for a point along the way, when the flight gets there. */
    const glide = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2);
    const glideTimeAt = (e) => (e < .5 ? Math.cbrt(e / 4) : 1 - Math.cbrt(2 * (1 - e)) / 2);

    function showOnboardingOnce(delay) {
      if (onboarded) return;
      onboarded = true;
      mountOnboarding(null, delay);
    }

    /* The second half of the camera move, in three overlapping steps:
       1. the words lift up out of their mask while the bar and notes drift away;
       2. the photo inside the star eases forward and melts into the live panorama behind the page;
       3. the page - background, petals and pattern together - flies towards the viewer through the
          star at full strength, until the opening is bigger than the screen.
       While the page is in flight only movement and fades of small parts run (no blur, nothing
       added or removed), so the browser can keep it on the graphics card and it stays smooth. */
    function enterTour() {
      if (leaving) return;
      leaving = true;
      doc.removeEventListener('keydown', onKey);
      page.style.overflow = 'hidden';         /* no scrollbars while the page flies past (portrait layout) */

      const finish = () => { stopFitting(); page.remove(); };

      /* Reduced motion: no flight, just a short fade into the onboarding */
      if (REDUCED_MOTION || !page.animate) {
        showOnboardingOnce(0);
        const fade = play(page, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: 'ease-out' });
        if (fade) fade.onfinish = finish;
        else finish();
        return;
      }

      /* If the intro is still playing, jump it to the end so the star is in its final place */
      page.getAnimations({ subtree: true })
        .filter((a) => a.effect && a.effect.getComputedTiming().iterations !== Infinity)
        .forEach((a) => a.finish());

      const SOFT = 'cubic-bezier(.4, 0, .2, 1)';
      const SLIDE = 'cubic-bezier(.7, 0, .3, 1)';
      const FLIGHT_DELAY = 300;               /* gives the words a head start before the page moves */

      /* 1 · details */
      const drift = (node, delay) => play(node,
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-12px)' }],
        { duration: 650, delay, easing: SOFT });
      drift(bar, 0);
      drift(noteL, 60);
      drift(noteR, 120);
      h1.querySelectorAll('span').forEach((w, i) => play(w,
        [{ transform: 'none' }, { transform: 'translateY(-105%)' }],
        { duration: 750, delay: i * 70, easing: SLIDE }));

      /* 2 · the star opens: the photo eases forward and melts into the live panorama */
      const hole = cutOutStar();
      play(win, [{ opacity: 1, scale: '1' }, { opacity: 0, scale: '1.08' }], { duration: 700, delay: 60, easing: SOFT });

      /* 3 · fly through. The flight goes 30% past the point where the screen is covered, and is
         eased on a log scale so it feels like moving at a steady pace rather than ballooning. */
      const fill = zoomToFill(hole);
      const target = fill * 1.3;
      const frames = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        frames.push({ transform: `scale(${Math.pow(target, glide(t)).toFixed(4)})`, offset: t });
      }
      const flight = page.animate(frames, { duration: EXIT_MS, delay: FLIGHT_DELAY, easing: 'linear', fill: 'both' });
      flight.onfinish = finish;

      /* The onboarding starts fading in just as the opening covers the screen */
      const coveredAt = FLIGHT_DELAY + glideTimeAt(Math.log(fill) / Math.log(target)) * EXIT_MS;
      showOnboardingOnce(Math.max(0, Math.round(coveredAt - ONBOARD_OVERLAP)));
    }

    function onKey(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target.tagName)) return;
      e.preventDefault();
      enterTour();
    }
    doc.addEventListener('keydown', onKey);
  }


  /* 9. Start --------------------------------------------------------------- */

  mount();
  if (!mounted) {
    doc.addEventListener('DOMContentLoaded', mount, { once: true });
    const bootRetry = setInterval(() => { mount(); if (mounted) clearInterval(bootRetry); }, 100);
  }
})();
