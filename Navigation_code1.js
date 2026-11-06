/* =====================================================================
   THE RAWAN | Script 1: Navigation
   Top bar, side menu and bottom scene dock.

   FILE MAP (search for the section name to jump there)
     SECTION 1   Settings: logo, scenes, menu items   <-- most edits happen here
     SECTION 2   Icons and background pattern
     SECTION 3   Styles (colours and sizes are at the very top)
     SECTION 4   Small helpers
     SECTION 5   Build the page elements
     SECTION 6   Side menu
     SECTION 7   Fullscreen
     SECTION 8   Bottom dock
     SECTION 9   Connect to 3DVista
     SECTION 10  Phone sizing
     SECTION 11  Start

   HOW THE SIDE MENU WORKS
     One class on the root, #rw.sidebar-open, drives everything: the menu
     slides, the dock makes room and the tab arrow flips. To change how any
     of them look when open, search for "sidebar-open" in SECTION 3.

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
     SECTION 1. SETTINGS
     ================================================================= */
  const CONFIG = {
    logo: 'https://raw.githubusercontent.com/virtual-sudo/The-Rawan-/main/Rawan%20Logo%20-%20Full%20Color_The%20Rawan%20Logo%20H%20-%20Gold.png',
    logoText: 'The Rawan',
    credit: 'A Prestige Green Development by ARTHALAND',
    menuTitle: 'Menu',

    /* true = the side menu starts open on desktop. Phones always start with it hidden. */
    sidebarStartsOpen: true,

    /* Screen sizes in pixels */
    phoneMaxWidth: 760,    /* compact layout at or below this width */
    shortMaxHeight: 500,   /* compact layout at or below this height (phones held sideways) */
    narrowMaxWidth: 600    /* at or below this, the dock no longer fits beside the side menu */
  };

  /* Bottom dock. index = the panorama's position in the 3DVista main playlist, starting at 0. */
  const SCENES = [
    { index: 0, title: 'EL NIDO' },
    { index: 1, title: 'WATERFALL OASIS' },
    { index: 2, title: 'DROP OFF' },
    { index: 3, title: 'COMMUNITY COURT' },
    { index: 4, title: 'WATERFALL OASIS' },
    { index: 5, title: 'RIVERINE WALK' },
    { index: 6, title: 'EL NIDO 2' },
    { index: 7, title: 'LIMESTONE TERRACE' },
    { index: 8, title: 'PLAY CANYON' }
  ];

  /* Side menu, in order. The first row starts highlighted.
     - icon:  a name from MENU_ICONS in SECTION 2
     - panel: opens that panel inside the side menu (the panels are written in cards.js)
     - home:  brings the welcome page back
     - href:  opens a link in a new tab
     A row with none of these still highlights when clicked, but opens nothing yet. */
  const MENU = [
    { label: 'Masterplan', icon: 'masterplan' },
    { label: 'Rawan Estate', icon: 'rawanEstate', panel: 'overview' },
    { label: 'Kayen', icon: 'kayen', panel: 'units' },
    { label: 'Amenities', icon: 'amenities' },
    { label: 'Location', icon: 'location' }
  ];

  /* Same stylesheet URL as Script 2, so DM Sans is only downloaded once */
  const FONTS = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&display=swap';

  const REDUCED_MOTION = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);


  /* =================================================================
     SECTION 2. ICONS AND BACKGROUND PATTERN
     ================================================================= */
  const STAR = `
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 2C50 34 66 50 98 50C66 50 50 66 50 98C50 66 34 50 2 50C34 50 50 34 50 2Z"/>
    </svg>`;

  function lineIcon(paths) {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  const ICONS = {
    fullscreen: lineIcon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    exitFullscreen: lineIcon('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),
    prev: lineIcon('<path d="M15 5l-7 7 7 7"/>'),
    next: lineIcon('<path d="M9 5l7 7-7 7"/>')
  };

  /* Side menu icons. They use currentColor, so their colour is set in SECTION 3 under "Menu rows". */
  const MENU_ICONS = {
    masterplan: `<svg viewBox="0 0 29 29" fill="none" aria-hidden="true"><path d="M11.9271 11.9276H16.6982M11.9271 11.9276V16.6987M11.9271 11.9276L7.75233 7.75284M16.6982 11.9276V16.6987M16.6982 11.9276L20.8729 7.75284M16.6982 16.6987H11.9271M16.6982 16.6987L20.8729 20.8734M11.9271 16.6987L7.75233 20.8734M11.8793 7.15645C11.7697 6.38898 11.4484 5.66721 10.9516 5.07202C10.4549 4.47683 9.80215 4.03173 9.06665 3.78659C8.33115 3.54145 7.54193 3.50596 6.7874 3.6841C6.03287 3.86223 5.34285 4.24695 4.79465 4.79515C4.24645 5.34335 3.86173 6.03337 3.68359 6.7879C3.50546 7.54243 3.54095 8.33166 3.78609 9.06715C4.03123 9.80265 4.47632 10.4554 5.07152 10.9521C5.66671 11.4489 6.38847 11.7702 7.15595 11.8798M21.4693 11.8798C22.2368 11.7702 22.9585 11.4489 23.5537 10.9521C24.1489 10.4554 24.594 9.80265 24.8391 9.06715C25.0843 8.33166 25.1198 7.54243 24.9416 6.7879C24.7635 6.03337 24.3788 5.34335 23.8306 4.79515C23.2824 4.24695 22.5924 3.86223 21.8378 3.6841C21.0833 3.50596 20.2941 3.54145 19.5586 3.78659C18.8231 4.03173 18.1704 4.47683 17.6736 5.07202C17.1768 5.66721 16.8556 6.38898 16.7459 7.15645M16.7459 21.4698C16.8556 22.2373 17.1768 22.959 17.6736 23.5542C18.1704 24.1494 18.8231 24.5945 19.5586 24.8396C20.2941 25.0848 21.0833 25.1203 21.8378 24.9421C22.5924 24.764 23.2824 24.3793 23.8306 23.8311C24.3788 23.2829 24.7635 22.5929 24.9416 21.8383C25.1198 21.0838 25.0843 20.2946 24.8391 19.5591C24.594 18.8236 24.1489 18.1709 23.5537 17.6741C22.9585 17.1773 22.2368 16.8561 21.4693 16.7464M7.15595 16.7464C6.38847 16.8561 5.66671 17.1773 5.07152 17.6741C4.47632 18.1709 4.03123 18.8236 3.78609 19.5591C3.54095 20.2946 3.50546 21.0838 3.68359 21.8383C3.86173 22.5929 4.24645 23.2829 4.79465 23.8311C5.34285 24.3793 6.03287 24.764 6.7874 24.9421C7.54193 25.1203 8.33115 25.0848 9.06665 24.8396C9.80215 24.5945 10.4549 24.1494 10.9516 23.5542C11.4484 22.959 11.7697 22.2373 11.8793 21.4698" stroke="currentColor" stroke-width="2.38556" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    rawanEstate: `<svg viewBox="0 0 29 29" fill="none" aria-hidden="true"><path d="M9.54303 5.96377C9.54303 5.01474 9.92003 4.10457 10.5911 3.43351C11.2622 2.76244 12.1723 2.38544 13.1214 2.38544H22.6636C23.6126 2.38544 24.5228 2.76244 25.1938 3.43351C25.8649 4.10457 26.2419 5.01474 26.2419 5.96377V22.6627C26.2419 23.6117 25.8649 24.5219 25.1938 25.1929C24.5228 25.864 23.6126 26.241 22.6636 26.241H13.1214C12.1723 26.241 11.2622 25.864 10.5911 25.1929C9.92003 24.5219 9.54303 23.6117 9.54303 22.6627V5.96377ZM13.1214 4.77099C12.805 4.77099 12.5016 4.89666 12.2779 5.12035C12.0543 5.34404 11.9286 5.64743 11.9286 5.96377V22.6627C11.9286 22.979 12.0543 23.2824 12.2779 23.5061C12.5016 23.7298 12.805 23.8554 13.1214 23.8554H22.6636C22.9799 23.8554 23.2833 23.7298 23.507 23.5061C23.7307 23.2824 23.8564 22.979 23.8564 22.6627V5.96377C23.8564 5.64743 23.7307 5.34404 23.507 5.12035C23.2833 4.89666 22.9799 4.77099 22.6636 4.77099H13.1214Z" fill-rule="evenodd" clip-rule="evenodd" fill="currentColor"/><path d="M2.38641 13.1207C2.38641 12.1716 2.76342 11.2615 3.43448 10.5904C4.10555 9.91934 5.01571 9.54234 5.96475 9.54234H11.3322V11.9279H5.96475C5.6484 11.9279 5.34501 12.0536 5.12133 12.2773C4.89764 12.5009 4.77197 12.8043 4.77197 13.1207V22.6629C4.77197 22.9792 4.89764 23.2826 5.12133 23.5063C5.34501 23.73 5.6484 23.8557 5.96475 23.8557H17.2961V26.2412H5.96475C5.01571 26.2412 4.10555 25.8642 3.43448 25.1932C2.76342 24.5221 2.38641 23.6119 2.38641 22.6629V13.1207Z" fill-rule="evenodd" clip-rule="evenodd" fill="currentColor"/><path d="M14.3148 20.2772C14.3148 19.6446 14.5662 19.0378 15.0135 18.5904C15.4609 18.143 16.0677 17.8917 16.7004 17.8917H19.0859C19.7186 17.8917 20.3254 18.143 20.7728 18.5904C21.2202 19.0378 21.4715 19.6446 21.4715 20.2772V23.8556H19.0859V20.2772H16.7004V23.8556H14.3148V20.2772Z" fill-rule="evenodd" clip-rule="evenodd" fill="currentColor"/><path d="M14.3132 7.15654C14.3132 6.84019 14.4389 6.53681 14.6625 6.31312C14.8862 6.08943 15.1896 5.96376 15.506 5.96376C15.8223 5.96376 16.1257 6.08943 16.3494 6.31312C16.5731 6.53681 16.6987 6.84019 16.6987 7.15654V8.34932C16.6987 8.66566 16.5731 8.96905 16.3494 9.19274C16.1257 9.41643 15.8223 9.54209 15.506 9.54209C15.1896 9.54209 14.8862 9.41643 14.6625 9.19274C14.4389 8.96905 14.3132 8.66566 14.3132 8.34932V7.15654ZM14.3132 13.1204C14.3132 12.8041 14.4389 12.5007 14.6625 12.277C14.8862 12.0533 15.1896 11.9276 15.506 11.9276C15.8223 11.9276 16.1257 12.0533 16.3494 12.277C16.5731 12.5007 16.6987 12.8041 16.6987 13.1204V14.3132C16.6987 14.6295 16.5731 14.9329 16.3494 15.1566C16.1257 15.3803 15.8223 15.506 15.506 15.506C15.1896 15.506 14.8862 15.3803 14.6625 15.1566C14.4389 14.9329 14.3132 14.6295 14.3132 14.3132V13.1204ZM5.96375 17.8915C5.96375 17.5752 6.08941 17.2718 6.3131 17.0481C6.53679 16.8244 6.84018 16.6988 7.15652 16.6988C7.47287 16.6988 7.77625 16.8244 7.99994 17.0481C8.22363 17.2718 8.3493 17.5752 8.3493 17.8915V19.0843C8.3493 19.4007 8.22363 19.704 7.99994 19.9277C7.77625 20.1514 7.47287 20.2771 7.15652 20.2771C6.84018 20.2771 6.53679 20.1514 6.3131 19.9277C6.08941 19.704 5.96375 19.4007 5.96375 19.0843V17.8915ZM19.0843 7.15654C19.0843 6.84019 19.21 6.53681 19.4337 6.31312C19.6573 6.08943 19.9607 5.96376 20.2771 5.96376C20.5934 5.96376 20.8968 6.08943 21.1205 6.31312C21.3442 6.53681 21.4699 6.84019 21.4699 7.15654V8.34932C21.4699 8.66566 21.3442 8.96905 21.1205 9.19274C20.8968 9.41643 20.5934 9.54209 20.2771 9.54209C19.9607 9.54209 19.6573 9.41643 19.4337 9.19274C19.21 8.96905 19.0843 8.66566 19.0843 8.34932V7.15654ZM19.0843 13.1204C19.0843 12.8041 19.21 12.5007 19.4337 12.277C19.6573 12.0533 19.9607 11.9276 20.2771 11.9276C20.5934 11.9276 20.8968 12.0533 21.1205 12.277C21.3442 12.5007 21.4699 12.8041 21.4699 13.1204V14.3132C21.4699 14.6295 21.3442 14.9329 21.1205 15.1566C20.8968 15.3803 20.5934 15.506 20.2771 15.506C19.9607 15.506 19.6573 15.3803 19.4337 15.1566C19.21 14.9329 19.0843 14.6295 19.0843 14.3132V13.1204Z" fill="currentColor"/></svg>`,

    kayen: `<svg viewBox="0 0 29 29" fill="none" aria-hidden="true"><path d="M2.45551 24.0189H4.84106M4.84106 24.0189H11.9977M4.84106 24.0189V13.7232C4.84106 13.08 4.84106 12.7584 4.91859 12.4585C4.98725 12.1934 5.1002 11.9421 5.25257 11.7153C5.42552 11.4588 5.66527 11.2456 6.14477 10.8228L11.8713 5.76166C12.7611 4.97635 13.206 4.5837 13.7058 4.43434C14.1471 4.30185 14.6183 4.30185 15.0596 4.43434C15.5606 4.5837 16.0067 4.97635 16.8965 5.76407L22.6218 10.8228C23.1013 11.2468 23.341 11.4588 23.514 11.7141C23.6667 11.9446 23.778 12.1927 23.848 12.4585C23.9255 12.7584 23.9255 13.08 23.9255 13.7232V24.0189M11.9977 24.0189H16.7688M11.9977 24.0189V19.2011C11.9977 18.5622 12.2491 17.9495 12.6964 17.4977C13.1438 17.0459 13.7506 16.7921 14.3833 16.7921C15.016 16.7921 15.6227 17.0459 16.0701 17.4977C16.5175 17.9495 16.7688 18.5622 16.7688 19.2011V24.0189M23.9255 24.0189H16.7688M23.9255 24.0189H26.3111" stroke="currentColor" stroke-width="2.39721" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    amenities: `<svg viewBox="0 0 30 30" fill="none" aria-hidden="true"><path d="M14.7863 24.6438C14.047 24.6438 13.4617 24.8492 13.0304 25.2599C12.5992 25.6706 11.8085 25.876 10.6585 25.876C9.50843 25.876 8.71778 25.6706 8.28651 25.2599C7.85524 24.8492 7.26996 24.6438 6.53064 24.6438C5.93508 24.6438 5.48328 24.7826 5.17523 25.0603C4.86719 25.3379 4.38458 25.5585 3.72741 25.722C3.39883 25.8041 3.10639 25.7322 2.8501 25.5063C2.5938 25.2804 2.46524 24.9929 2.46442 24.6438C2.4636 24.2947 2.58682 23.992 2.83408 23.7357C3.08134 23.4794 3.35858 23.2687 3.6658 23.1036C4.01492 22.9187 4.38458 22.7183 4.77477 22.5023C5.16497 22.2862 5.75026 22.1786 6.53064 22.1794C7.68068 22.1794 8.47134 22.3848 8.9026 22.7955C9.33387 23.2062 9.91916 23.4116 10.6585 23.4116C11.3978 23.4116 11.9831 23.2062 12.4143 22.7955C12.8456 22.3848 13.6363 22.1794 14.7863 22.1794C15.9363 22.1794 16.727 22.3848 17.1583 22.7955C17.5895 23.2062 18.1748 23.4116 18.9141 23.4116C19.6534 23.4116 20.2387 23.2062 20.67 22.7955C21.1013 22.3848 21.8919 22.1794 23.042 22.1794C23.8224 22.1794 24.4076 22.2874 24.7978 22.5035C25.188 22.7195 25.5577 22.9196 25.9068 23.1036C26.2148 23.2679 26.4921 23.4786 26.7385 23.7357C26.985 23.9928 27.1082 24.2955 27.1082 24.6438C27.1082 24.9921 26.98 25.2796 26.7237 25.5063C26.4674 25.7331 26.1746 25.8049 25.8452 25.722C25.188 25.5577 24.7054 25.3371 24.3974 25.0603C24.0893 24.7834 23.6375 24.6446 23.042 24.6438C22.3027 24.6438 21.7174 24.8492 21.2861 25.2599C20.8548 25.6706 20.0642 25.876 18.9141 25.876C17.7641 25.876 16.9734 25.6706 16.5422 25.2599C16.1109 24.8492 15.5256 24.6438 14.7863 24.6438ZM14.7863 19.099C14.0059 19.099 13.4256 19.3043 13.0452 19.715C12.6649 20.1258 11.8693 20.3311 10.6585 20.3311C9.44764 20.3311 8.64138 20.1258 8.23969 19.715C7.83799 19.3043 7.26831 19.099 6.53064 19.099C5.93508 19.099 5.48328 19.2378 5.17523 19.5154C4.86719 19.7931 4.38458 20.0136 3.72741 20.1771C3.39883 20.2593 3.10639 20.1874 2.8501 19.9615C2.5938 19.7356 2.46524 19.4481 2.46442 19.099C2.4636 18.7498 2.58682 18.4471 2.83408 18.1908C3.08134 17.9345 3.35858 17.7238 3.6658 17.5587C4.01492 17.3739 4.38458 17.1735 4.77477 16.9574C5.16497 16.7414 5.75026 16.6338 6.53064 16.6346C7.68068 16.6346 8.47668 16.8399 8.91862 17.2507C9.36057 17.6614 9.94052 17.8668 10.6585 17.8668C11.3978 17.8668 11.9831 17.6614 12.4143 17.2507C12.8456 16.8399 13.6363 16.6346 14.7863 16.6346C15.9363 16.6346 16.727 16.8399 17.1583 17.2507C17.5895 17.6614 18.1748 17.8668 18.9141 17.8668C19.6534 17.8668 20.2387 17.6614 20.67 17.2507C21.1013 16.8399 21.8919 16.6346 23.042 16.6346C23.8224 16.6346 24.4076 16.7426 24.7978 16.9586C25.188 17.1747 25.5577 17.3747 25.9068 17.5587C26.2148 17.723 26.4921 17.9337 26.7385 18.1908C26.985 18.4479 27.1082 18.7507 27.1082 19.099C27.1082 19.4473 26.98 19.7348 26.7237 19.9615C26.4674 20.1882 26.1746 20.2601 25.8452 20.1771C25.188 20.0128 24.7054 19.7923 24.3974 19.5154C24.0893 19.2386 23.6375 19.0998 23.042 19.099C22.3027 19.099 21.7326 19.3043 21.3317 19.715C20.9308 20.1258 20.125 20.3311 18.9141 20.3311C17.7436 20.3311 16.948 20.1258 16.5274 19.715C16.1068 19.3043 15.5264 19.099 14.7863 19.099ZM8.50214 14.047L12.5992 9.94996L11.367 8.71777C10.8536 8.20436 10.325 7.79856 9.78115 7.50037C9.23735 7.20218 8.61592 7.00215 7.91685 6.90029C7.50612 6.81815 7.15208 6.62305 6.85471 6.315C6.55734 6.00696 6.40824 5.64757 6.40742 5.23684C6.40742 4.80557 6.56145 4.44085 6.86949 4.14266C7.17754 3.84447 7.53693 3.71632 7.94766 3.75821C9.05663 3.8609 10.0116 4.09214 10.8125 4.45193C11.6134 4.81173 12.4041 5.38142 13.1845 6.16098L21.0705 14.047C20.7213 14.2729 20.3825 14.4528 20.0539 14.5867C19.7253 14.7206 19.3454 14.7871 18.9141 14.7863C18.1748 14.7863 17.5895 14.5809 17.1583 14.1702C16.727 13.7595 15.9363 13.5541 14.7863 13.5541C13.6363 13.5541 12.8456 13.7595 12.4143 14.1702C11.9831 14.5809 11.3978 14.7863 10.6585 14.7863C10.2272 14.7863 9.84728 14.7198 9.5187 14.5867C9.19011 14.4536 8.85126 14.2737 8.50214 14.047ZM22.7647 4.60473C23.3603 5.21096 23.6581 5.93508 23.6581 6.77707C23.6581 7.63961 23.3603 8.36865 22.7647 8.96421C22.1692 9.55977 21.4401 9.85754 20.5776 9.85754C19.7151 9.85754 18.986 9.55977 18.3905 8.96421C17.7949 8.36865 17.4971 7.63961 17.4971 6.77707C17.4971 5.93508 17.7949 5.21096 18.3905 4.60473C18.986 3.99849 19.7151 3.69578 20.5776 3.6966C21.4401 3.69742 22.1692 3.99931 22.7647 4.60473Z" fill="currentColor"/></svg>`,

    location: `<svg viewBox="0 0 29 29" fill="none" aria-hidden="true"><path d="M8.01608 19.8478C8.31977 19.7592 8.64621 19.7949 8.92359 19.947C9.20096 20.0991 9.40655 20.3552 9.49513 20.6589C9.5837 20.9625 9.54801 21.289 9.3959 21.5664C9.24379 21.8437 8.98773 22.0493 8.68404 22.1379C8.08765 22.312 7.65825 22.4957 7.38272 22.6627C7.6666 22.8333 8.11508 23.0241 8.73771 23.2019C10.1154 23.5955 12.087 23.8555 14.3139 23.8555C16.5409 23.8555 18.5125 23.5955 19.8902 23.2019C20.514 23.0241 20.9613 22.8333 21.2452 22.6627C20.9708 22.4957 20.5414 22.312 19.9451 22.1379C19.6461 22.0454 19.3955 21.8392 19.2473 21.5637C19.099 21.2881 19.0649 20.9654 19.1524 20.665C19.2398 20.3646 19.4418 20.1105 19.7148 19.9577C19.9878 19.8048 20.31 19.7653 20.6118 19.8478C21.4086 20.0804 22.1386 20.3786 22.6992 20.7614C23.218 21.1181 23.8562 21.7395 23.8562 22.6627C23.8562 23.5967 23.2025 24.2229 22.6753 24.5795C22.1052 24.9636 21.3597 25.263 20.545 25.4956C18.9014 25.9667 16.6995 26.2411 14.3139 26.2411C11.9284 26.2411 9.72653 25.9667 8.08288 25.4956C7.26821 25.263 6.52273 24.9636 5.95258 24.5795C5.42537 24.2217 4.77173 23.5967 4.77173 22.6627C4.77173 21.7395 5.40986 21.1181 5.92872 20.7614C6.48933 20.3786 7.21931 20.0804 8.01608 19.8478ZM14.3139 2.3855C16.6865 2.3855 18.9619 3.328 20.6396 5.00567C22.3173 6.68334 23.2598 8.95875 23.2598 11.3313C23.2598 14.3944 21.5899 16.8849 19.8604 18.655C19.1729 19.3515 18.434 19.9954 17.6501 20.5813C16.9416 21.1133 15.3218 22.1105 15.3218 22.1105C15.0146 22.2851 14.6673 22.3769 14.3139 22.3769C13.9606 22.3769 13.6133 22.2851 13.3061 22.1105C12.5022 21.6443 11.7249 21.1338 10.9778 20.5813C10.1927 19.9968 9.45379 19.3528 8.76753 18.655C7.03801 16.8849 5.36812 14.3944 5.36812 11.3313C5.36812 8.95875 6.31062 6.68334 7.98829 5.00567C9.66596 3.328 11.9414 2.3855 14.3139 2.3855ZM14.3139 4.77105C12.5741 4.77105 10.9054 5.46222 9.67513 6.69251C8.44484 7.92281 7.75367 9.59144 7.75367 11.3313C7.75367 13.4974 8.94168 15.4202 10.4732 16.9851C11.6254 18.1636 12.8945 19.0605 13.7736 19.6116L14.3139 19.9384L14.8543 19.6116C15.7322 19.0605 17.0025 18.1636 18.1547 16.9863C19.6862 15.4202 20.8742 13.4986 20.8742 11.3313C20.8742 9.59144 20.1831 7.92281 18.9528 6.69251C17.7225 5.46222 16.0538 4.77105 14.3139 4.77105ZM14.3139 7.753C14.7839 7.753 15.2492 7.84555 15.6833 8.02538C16.1175 8.20521 16.5119 8.46879 16.8442 8.80107C17.1765 9.13335 17.4401 9.52782 17.6199 9.96196C17.7997 10.3961 17.8923 10.8614 17.8923 11.3313C17.8923 11.8012 17.7997 12.2666 17.6199 12.7007C17.4401 13.1348 17.1765 13.5293 16.8442 13.8616C16.5119 14.1939 16.1175 14.4575 15.6833 14.6373C15.2492 14.8171 14.7839 14.9097 14.3139 14.9097C13.3649 14.9097 12.4548 14.5327 11.7837 13.8616C11.1126 13.1905 10.7356 12.2804 10.7356 11.3313C10.7356 10.3823 11.1126 9.47214 11.7837 8.80107C12.4548 8.13 13.3649 7.753 14.3139 7.753ZM14.3139 10.1386C13.9976 10.1386 13.6942 10.2642 13.4705 10.4879C13.2468 10.7116 13.1212 11.015 13.1212 11.3313C13.1212 11.6477 13.2468 11.9511 13.4705 12.1748C13.6942 12.3984 13.9976 12.5241 14.3139 12.5241C14.6303 12.5241 14.9337 12.3984 15.1574 12.1748C15.3811 11.9511 15.5067 11.6477 15.5067 11.3313C15.5067 11.015 15.3811 10.7116 15.1574 10.4879C14.9337 10.2642 14.6303 10.1386 14.3139 10.1386Z" fill="currentColor"/></svg>`
  };

  /* Gold line pattern behind the side menu. To make it stronger or fainter,
     change opacity at the end of buildPattern(). */
  const PATTERN_WIDTH = 6400;
  const PATTERN_HEIGHT = 3600;
  const PATTERN_SCALE = 0.5;
  const PATTERN_SIZE = `${PATTERN_WIDTH * PATTERN_SCALE}px ${PATTERN_HEIGHT * PATTERN_SCALE}px`;
  const PATTERN_CELL = 'M-28.03 -28.03h56.06v56.06h-56.06zM28.03 28.03A137.58 137.58 0 0 1 178.87 165.46M-28.03 28.03A137.58 137.58 0 0 0 122.81 165.46M28.03 28.03A154.17 154.17 0 0 1 122.81 165.46M28.03 28.03A154.17 154.17 0 0 0 122.81 165.46M28.03 -28.03A137.58 137.58 0 0 1 165.46 -178.87M28.03 28.03A137.58 137.58 0 0 0 165.46 -122.81M28.03 -28.03A154.17 154.17 0 0 1 165.46 -122.81M28.03 -28.03A154.17 154.17 0 0 0 165.46 -122.81';

  function buildPattern() {
    const stepX = 150.84;
    const stepY = 193.49;
    const margin = 230;
    const tiles = [];

    for (let m = -30; m <= 30; m++) {
      for (let n = -30; n <= 30; n++) {
        const x = PATTERN_WIDTH / 2 + m * stepX + n * stepY;
        const y = PATTERN_HEIGHT / 2 + m * stepY - n * stepX;
        const onCanvas = x > -margin && x < PATTERN_WIDTH + margin && y > -margin && y < PATTERN_HEIGHT + margin;
        if (onCanvas) tiles.push(`<use href="#c" x="${x.toFixed(1)}" y="${y.toFixed(1)}"/>`);
      }
    }

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${PATTERN_WIDTH * PATTERN_SCALE}" height="${PATTERN_HEIGHT * PATTERN_SCALE}" viewBox="0 0 ${PATTERN_WIDTH} ${PATTERN_HEIGHT}">` +
      `<defs><path id="c" d="${PATTERN_CELL}"/></defs>` +
      `<g fill="none" stroke="#C0B177" stroke-width="2" opacity=".08">${tiles.join('')}</g></svg>`;

    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }


  /* =================================================================
     SECTION 3. STYLES
     ================================================================= */
  const CSS = `
    /* ---------- Colours, fonts and sizes: change them here ---------- */
    #rw {
      --ink: #2A2A38;
      --gold: #C0B177;
      --cream: #ECEBE3;
      --avocado: #D2DB12;
      --line: #C0B17780;

      --serif: "Rawan Sans", "Cormorant Garamond", Georgia, serif;
      --sans: "DM Sans", system-ui, sans-serif;

      --topbar-h: 64px;
      --sidebar-w: min(340px, 84%);

      --ease: cubic-bezier(.23, 1, .32, 1);
      --ease-drawer: cubic-bezier(.32, .72, 0, 1);

      /* How the side menu moves. The dock uses the same value so they travel together. */
      --slide: .28s var(--ease);

      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      --safe-left: env(safe-area-inset-left, 0px);
      --safe-right: env(safe-area-inset-right, 0px);

      position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      z-index: 999999 !important;
      pointer-events: none !important; /* the panorama underneath stays draggable */
      font: 400 14px var(--sans);
      color: var(--cream);
      -webkit-font-smoothing: antialiased;
    }
    #rw.sidebar-open { --slide: .45s var(--ease-drawer); }

    :where(#rw) * { box-sizing: border-box; margin: 0; padding: 0; }
    :where(#rw) svg { display: block; }
    :where(#rw) button {
      font: inherit; color: inherit; background: none; border: 0; cursor: pointer;
      pointer-events: auto; -webkit-tap-highlight-color: transparent;
    }
    #rw :focus-visible { outline: 2px solid var(--avocado); }


    /* ---------- Top bar ---------- */
    #rw-topbar {
      position: absolute; top: 0; left: 0; right: 0; z-index: 1;
      height: calc(var(--topbar-h) + var(--safe-top));
      padding: var(--safe-top) max(16px, var(--safe-right)) 0 max(16px, var(--safe-left));
      display: flex; align-items: center; justify-content: space-between;
      background: var(--ink);
      border-bottom: 1px solid var(--line);
      pointer-events: auto;
    }

    #rw-logo {
      display: flex; align-items: center; min-height: 32px; white-space: nowrap;
      color: var(--gold); font: 24px var(--serif); letter-spacing: .08em; text-transform: uppercase;
    }
    #rw-logo .rw-mark { position: relative; display: block; height: 38px; aspect-ratio: 3.72; }
    #rw-logo .rw-mark img {
      position: absolute; left: -12.5%; top: 50%; width: 125%; height: auto;
      transform: translateY(-50%); pointer-events: none;
    }

    #rw-fullscreen {
      display: grid; place-items: center; width: 42px; height: 42px;
      border-radius: 50%; border: 1px solid var(--line);
      transition: background-color .2s, color .2s, transform .16s;
    }
    #rw-fullscreen svg { width: 18px; height: 18px; }
    #rw-fullscreen:active { transform: scale(.97); }


    /* ---------- Side menu: slides in and out from the left ---------- */
    /* This outer box moves. It holds the tab and the menu, so the two can never drift apart. */
    #rw-sidebar {
      position: absolute; top: calc(var(--topbar-h) + var(--safe-top)); bottom: 0; left: 0;
      width: var(--sidebar-w);
      transform: translateX(calc(-100% + var(--safe-left)));
      transition: transform var(--slide);
    }
    #rw.sidebar-open #rw-sidebar { transform: none; }

    /* The menu itself: rounded top right corner, ink background */
    #rw-sidebar-body {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; overflow: hidden;
      pointer-events: auto;
      background: var(--ink);
      border-right: 1px solid var(--line);
      border-top-right-radius: 28px;
      box-shadow: 12px 0 32px rgba(0, 0, 0, .35);
      visibility: hidden;
      transition: visibility 0s .28s;
    }
    #rw.sidebar-open #rw-sidebar-body { visibility: visible; transition: none; }

    /* Gold line pattern, fading out towards the bottom */
    #rw-sidebar-body::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background: ${buildPattern()} 50% 50% / ${PATTERN_SIZE} no-repeat;
      -webkit-mask-image: linear-gradient(180deg, #000, transparent 55%);
              mask-image: linear-gradient(180deg, #000, transparent 55%);
    }


    /* ---------- Side menu tab: hides and shows the menu ---------- */
    /* Rides on the menu's right edge and overlaps its border, so tab and menu read as one shape */
    #rw-sidebar-toggle {
      position: absolute; top: 50%; left: 100%; margin-left: -1px;
      width: 34px; height: 92px; /* fixed, so it stays put when the label changes */
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
      background: var(--ink); color: var(--gold);
      border: 1px solid var(--line); border-left: 0;
      border-radius: 0 16px 16px 0;
      box-shadow: 6px 0 18px rgba(0, 0, 0, .28);
      transform: translateY(-50%);
      transform-origin: left center;
      transition: color .2s, transform .16s;
    }
    /* Invisible extra area, so it is easy to tap on a phone */
    #rw-sidebar-toggle::after { content: ""; position: absolute; inset: -6px -12px -6px 0; }
    #rw-sidebar-toggle:active { transform: translateY(-50%) scale(.97); }
    #rw-sidebar-toggle svg {
      width: 16px; height: 16px;
      transition: transform .3s var(--ease);
    }
    #rw.sidebar-open #rw-sidebar-toggle svg { transform: rotate(180deg); }
    #rw-sidebar-toggle span {
      writing-mode: vertical-rl;
      font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
    }


    /* ---------- Side menu header: title and back arrow ---------- */
    #rw-sidebar-header {
      position: relative; display: flex; align-items: center; gap: 12px; min-height: 70px;
      padding: 18px 24px;
      border-bottom: 1px solid var(--line);
    }
    #rw-sidebar-header h3 {
      font: 400 20px var(--serif); letter-spacing: .1em; text-transform: uppercase; color: var(--gold);
    }
    #rw-sidebar-header .rw-back {
      flex: none; display: grid; place-items: center; width: 34px; height: 34px; margin-left: -6px;
      border-radius: 50%; border: 1px solid #C0B17760;
      transition: background-color .2s, color .2s, transform .16s;
    }
    #rw-sidebar-header .rw-back svg { width: 16px; height: 16px; }
    #rw-sidebar-header .rw-back:active { transform: scale(.97); }


    /* ---------- Side menu content: the menu list OR a panel, never both ---------- */
    #rw-menu, #rw-panel {
      position: relative; flex: 1; overflow: auto; overscroll-behavior: contain;
      scrollbar-width: thin; scrollbar-color: #D2DB1259 transparent;
    }
    #rw-menu { padding: 16px; }
    #rw-panel { padding: 18px 24px 24px; }

    #rw-sidebar-body[data-view=menu] .rw-back,
    #rw-sidebar-body[data-view=menu] #rw-panel,
    #rw-sidebar-body[data-view=panel] #rw-menu { display: none; }


    /* ---------- Menu rows: gold icon and label ---------- */
    #rw-menu button {
      position: relative; display: flex; align-items: center; gap: 16px;
      width: 100%; min-height: 56px; padding: 0 18px; border-radius: 999px;
      text-align: left; font: 400 18px var(--serif); letter-spacing: .02em; word-spacing: -.12em;
      transition: background-color .2s ease;
    }
    #rw-menu button + button { margin-top: 8px; }
    #rw-menu button:active { transform: scale(.97); }
    #rw-menu button svg {
      position: relative; flex: none; width: 32px; height: 32px; color: var(--gold);
      transition: color .2s ease;
    }
    #rw-menu button span { position: relative; transition: transform .3s var(--ease); }
    #rw.sidebar-open #rw-menu button { animation: rw-slide-in .45s var(--ease) both; }

    /* Current row: soft olive pill behind it */
    #rw-menu button::before {
      content: ""; position: absolute; inset: 0; border-radius: inherit;
      background: linear-gradient(90deg, rgba(210, 219, 18, .3), rgba(210, 219, 18, .1));
      opacity: 0;
      transition: opacity .2s ease;
    }
    /* Current row: bar on the menu's left edge. left matches the padding of #rw-menu. */
    #rw-menu button::after {
      content: ""; position: absolute; top: 0; bottom: 0; left: -16px; width: 4px;
      border-radius: 0 4px 4px 0;
      background: var(--avocado);
      opacity: 0; transform: scaleY(.5);
      transition: opacity .2s ease, transform .25s var(--ease);
    }
    #rw-menu button.is-current::before { opacity: 1; }
    #rw-menu button.is-current::after { opacity: 1; transform: none; }
    #rw-menu button.is-current svg { color: var(--avocado); }

    @keyframes rw-slide-in { from { opacity: 0; transform: translateX(-12px); } }


    /* ---------- Credit: stays at the bottom of the side menu ---------- */
    #rw-sidebar-body .rw-credit {
      position: relative; display: flex; align-items: center; gap: 10px;
      padding: 12px 24px calc(18px + var(--safe-bottom));
      font-size: 10px; line-height: 1.7; letter-spacing: .1em; text-transform: uppercase;
      color: #ECEBE3d9;
      border-top: 1px solid #C0B17740;
    }
    #rw-sidebar-body .rw-credit svg { width: 8px; flex: none; color: var(--avocado); }


    /* ---------- Bottom dock: stays centred in the space beside the side menu ---------- */
    #rw-dock {
      --pill-h: 46px;
      --dock-gap: 18px;
      position: absolute; left: 0; right: 0;
      bottom: calc(var(--dock-gap) + var(--safe-bottom));
      padding: 0 var(--dock-gap);
      display: flex; justify-content: center;
      transition: left var(--slide), transform .5s var(--ease-drawer), opacity .35s ease .1s, visibility 0s;
    }
    #rw.sidebar-open #rw-dock { left: var(--sidebar-w); }
    #rw-dock.is-hidden {
      opacity: 0; visibility: hidden; transform: translateY(32px);
      transition: left var(--slide), transform .35s var(--ease), opacity .2s ease, visibility 0s .35s;
    }

    #rw-dock .rw-strip {
      position: relative; max-width: min(1000px, 100%);
      display: flex; align-items: center; gap: 4px;
      padding: 7px; border-radius: 999px; pointer-events: auto;
      background: rgba(30, 31, 46, .72);
      border: 1px solid rgba(255, 255, 255, .18);
      -webkit-backdrop-filter: blur(28px) saturate(1.8);
              backdrop-filter: blur(28px) saturate(1.8);
      box-shadow: 0 18px 48px rgba(10, 10, 20, .35), 0 2px 6px rgba(10, 10, 20, .2);
    }
    @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
      #rw-dock .rw-strip { background: rgba(42, 42, 56, .92); }
    }

    /* The scrolling row of pills. Its edges fade out when there is more to scroll to. */
    #rw-dock .rw-track {
      --fade-left: 0px;
      --fade-right: 0px;
      position: relative; flex: 1; min-width: 0; display: flex; gap: 6px; padding: 2px;
      overflow-x: auto; overflow-y: hidden;
      scroll-snap-type: x proximity; overscroll-behavior-x: contain;
      scrollbar-width: none; border-radius: 999px;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 var(--fade-left), #000 calc(100% - var(--fade-right)), transparent);
              mask-image: linear-gradient(90deg, transparent, #000 var(--fade-left), #000 calc(100% - var(--fade-right)), transparent);
    }
    #rw-dock .rw-track::-webkit-scrollbar { display: none; }
    #rw-dock .rw-track.can-scroll-left { --fade-left: 28px; }
    #rw-dock .rw-track.can-scroll-right { --fade-right: 28px; }

    #rw-dock .rw-arrow {
      flex: none; width: var(--pill-h); height: var(--pill-h); border-radius: 50%;
      display: grid; place-items: center;
      background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .16); color: var(--cream);
      transition: background-color .2s, color .2s, opacity .2s, transform .16s;
    }
    #rw-dock .rw-arrow svg { width: 16px; height: 16px; }
    #rw-dock .rw-arrow:disabled { opacity: .3; cursor: default; }
    #rw-dock .rw-arrow:not(:disabled):active { transform: scale(.94); }
    #rw-dock.no-overflow .rw-arrow { display: none; }
    #rw-dock.no-overflow .rw-track { justify-content: center; }

    #rw-dock .rw-pill {
      position: relative; flex: none; height: var(--pill-h); scroll-snap-align: center;
      display: flex; align-items: center; padding: 0 22px;
      border-radius: 999px;
      background: rgba(255, 255, 255, .07); border: 1px solid rgba(255, 255, 255, .12);
      color: #F5F4EE; font-size: 12px; font-weight: 500; line-height: 1;
      letter-spacing: .1em; text-transform: uppercase; white-space: nowrap;
      text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
      transition: border-color .25s, background-color .25s, color .25s, box-shadow .25s, transform .16s;
    }
    #rw-dock .rw-pill:active { transform: scale(.97); }
    #rw-dock .rw-pill.is-current {
      background: var(--avocado); border-color: var(--avocado);
      color: var(--ink); font-weight: 600; text-shadow: none;
      box-shadow: 0 6px 18px rgba(210, 219, 18, .35);
    }


    /* ---------- Hover effects: only on devices with a real mouse ---------- */
    @media (hover: hover) and (pointer: fine) {
      #rw-fullscreen:hover,
      #rw-sidebar-header .rw-back:hover { background: rgba(210, 219, 18, .2); color: var(--avocado); }

      #rw-sidebar-toggle:hover { color: var(--avocado); }
      #rw-sidebar-toggle:hover svg { transform: translateX(2px); }
      #rw.sidebar-open #rw-sidebar-toggle:hover svg { transform: rotate(180deg) translateX(2px); }

      #rw-menu button:not(.is-current):hover { background-color: #ECEBE314; }
      #rw-menu button:hover span { transform: translateX(4px); }

      #rw-dock .rw-arrow:not(:disabled):hover { background: rgba(255, 255, 255, .16); }
      #rw-dock .rw-pill:not(.is-current):hover { background-color: rgba(255, 255, 255, .14); border-color: rgba(255, 255, 255, .26); }
    }


    /* ---------- Phones (classes are set in SECTION 10) ---------- */
    #rw.is-phone #rw-topbar {
      padding-left: max(8px, var(--safe-left));
      padding-right: max(8px, var(--safe-right));
    }
    #rw.is-phone #rw-fullscreen { width: 40px; height: 40px; }
    #rw.is-phone #rw-logo { font-size: 18px; }
    #rw.is-phone #rw-logo .rw-mark { height: 30px; }
    #rw.is-phone #rw-dock { --pill-h: 40px; --dock-gap: 10px; }
    #rw.is-phone #rw-dock .rw-strip { padding: 5px; }
    #rw.is-phone #rw-dock .rw-arrow { display: none; }
    #rw.is-phone #rw-dock .rw-pill { padding: 0 16px; font-size: 11px; }

    /* Phones held sideways: slimmer top bar and menu rows, so more of the panorama shows */
    #rw.is-short { --topbar-h: 54px; }
    #rw.is-short #rw-sidebar-header { min-height: 54px; padding-top: 10px; padding-bottom: 10px; }
    #rw.is-short #rw-menu button { min-height: 46px; font-size: 16px; }
    #rw.is-short #rw-menu button + button { margin-top: 4px; }
    #rw.is-short #rw-menu button svg { width: 26px; height: 26px; }

    /* Narrow phones: no room beside the menu, so the dock floats over its bottom edge
       and the credit lifts up to stay readable above it */
    #rw.is-narrow.sidebar-open #rw-dock { left: 0; }
    #rw.is-narrow #rw-sidebar-body .rw-credit { padding-bottom: calc(80px + var(--safe-bottom)); }


    /* ---------- Reduced motion: things still work, they just do not slide ---------- */
    @media (prefers-reduced-motion: reduce) {
      #rw, #rw.sidebar-open { --slide: 0s; }
      #rw * { animation: none !important; }
      #rw-menu button span { transform: none !important; }
      #rw-dock, #rw-dock.is-hidden { transition: none; }
    }
  `;


  /* =================================================================
     SECTION 4. SMALL HELPERS
     ================================================================= */
  const doc = document;

  function el(tag, attrs, html) {
    const node = doc.createElement(tag);
    for (const key in attrs || {}) node.setAttribute(key, attrs[key]);
    if (html != null) node.innerHTML = html;
    return node;
  }

  function setText(node, text) {
    node.textContent = text;
    return node;
  }

  function emit(name, detail) {
    doc.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function titleCase(text) {
    return String(text).toLowerCase().replace(/(^| )[^ ]/g, (c) => c.toUpperCase());
  }


  /* =================================================================
     SECTION 5. BUILD THE PAGE ELEMENTS
     The whole structure is in this one template.
     ================================================================= */
  let ui = null;   /* every element the script needs, filled in below */

  function buildUI() {
    const logo = CONFIG.logo
      ? `<span class="rw-mark"><img src="${CONFIG.logo}" alt="${CONFIG.logoText}" decoding="async"></span>`
      : CONFIG.logoText;

    const root = el('div', { id: 'rw' }, `
      <header id="rw-topbar">
        <div id="rw-logo">${logo}</div>
        <button id="rw-fullscreen" aria-label="Enter fullscreen">${ICONS.fullscreen}</button>
      </header>

      <nav id="rw-sidebar" aria-label="Menu">
        <button id="rw-sidebar-toggle" aria-controls="rw-sidebar-body">${ICONS.next}<span></span></button>

        <div id="rw-sidebar-body" data-view="menu">
          <div id="rw-sidebar-header">
            <button class="rw-back" aria-label="Back to menu">${ICONS.prev}</button>
            <h3>${CONFIG.menuTitle}</h3>
          </div>
          <div id="rw-menu"></div>
          <div id="rw-panel"></div>
          <p class="rw-credit">${STAR}<span>${CONFIG.credit}</span></p>
        </div>
      </nav>

      <div id="rw-dock">
        <div class="rw-strip" role="region" aria-label="Scenes">
          <button class="rw-arrow rw-prev" aria-label="Previous scenes">${ICONS.prev}</button>
          <div class="rw-track"></div>
          <button class="rw-arrow rw-next" aria-label="More scenes">${ICONS.next}</button>
        </div>
      </div>
    `);

    const $ = (selector) => root.querySelector(selector);

    ui = {
      root: root,
      host: doc.body || doc.documentElement,

      fullscreenBtn: $('#rw-fullscreen'),

      sidebar: $('#rw-sidebar'),
      sidebarToggle: $('#rw-sidebar-toggle'),
      sidebarToggleLabel: $('#rw-sidebar-toggle span'),
      sidebarBody: $('#rw-sidebar-body'),
      heading: $('#rw-sidebar-header h3'),
      backBtn: $('.rw-back'),
      menuList: $('#rw-menu'),
      panel: $('#rw-panel'),

      dock: $('#rw-dock'),
      track: $('.rw-track'),
      prevBtn: $('.rw-prev'),
      nextBtn: $('.rw-next')
    };

    doc.head.appendChild(setText(el('style'), CSS));
    if (!doc.querySelector(`link[href="${FONTS}"]`)) {
      doc.head.appendChild(el('link', { rel: 'stylesheet', href: FONTS }));
    }
    ui.host.appendChild(root);
  }


  /* =================================================================
     SECTION 6. SIDE MENU
     Two separate things to keep track of:
       sidebarOpen  is it showing or hidden?
       sidebarView  what is inside it: the menu list or a panel?
     Hiding keeps the view, so reopening returns the visitor to where they were.
     ================================================================= */
  let sidebarOpen = false;
  let sidebarView = 'menu';   /* 'menu', or a panel key from MENU such as 'overview' */
  const panelRows = {};       /* panel key -> its menu row, so focus can return to it */
  let currentRow = null;      /* the highlighted menu row */

  function setSidebarOpen(open) {
    sidebarOpen = open;
    ui.root.classList.toggle('sidebar-open', open);
    ui.sidebarToggle.setAttribute('aria-expanded', String(open));
    ui.sidebarToggle.setAttribute('aria-label', open ? 'Hide menu' : 'Show menu');
    setText(ui.sidebarToggleLabel, open ? 'Hide' : 'Menu');
  }

  function hideSidebar() {
    const focusWasInside = ui.sidebarBody.contains(doc.activeElement);
    setSidebarOpen(false);
    if (focusWasInside) ui.sidebarToggle.focus();
  }

  /* On narrow phones the open menu covers the panorama, so it moves
     out of the way once the visitor has picked somewhere to go. */
  function hideSidebarIfCoveringScene() {
    if (ui.root.classList.contains('is-narrow')) hideSidebar();
  }

  function panelTitle(key) {
    const item = MENU.find((entry) => entry.panel === key);
    return item ? item.label : key;
  }

  /* Shows the menu list, or a panel ('overview', 'units') with a back arrow */
  function showView(view) {
    const cameFrom = sidebarView;
    const isMenu = view === 'menu';
    sidebarView = view;

    ui.sidebarBody.dataset.view = isMenu ? 'menu' : 'panel';
    setText(ui.heading, isMenu ? CONFIG.menuTitle : panelTitle(view));

    if (!isMenu) {
      ui.panel.textContent = '';
      ui.panel.scrollTop = 0;
      emit('rw:open', { panel: view, container: ui.panel });   /* cards.js fills the panel */
    }

    /* Keyboard users land on the back arrow, or back on the row they came from */
    const focusTarget = isMenu ? panelRows[cameFrom] : ui.backBtn;
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function goHome() {
    hideSidebarIfCoveringScene();
    /* Script 2 shows the welcome page again. Without it, jump to the first scene. */
    const handled = !doc.dispatchEvent(new CustomEvent('rw:home', { cancelable: true }));
    if (!handled && SCENES.length) goToScene(SCENES[0].index);
  }

  /* Moves the highlight (pill, edge bar and avocado icon) to this row */
  function setCurrentRow(row) {
    if (currentRow) {
      currentRow.classList.remove('is-current');
      currentRow.removeAttribute('aria-current');
    }
    currentRow = row;
    row.classList.add('is-current');
    row.setAttribute('aria-current', 'true');
  }

  function buildMenuRow(item, i) {
    const row = el('button', null, `${MENU_ICONS[item.icon] || ''}<span></span>`);
    setText(row.querySelector('span'), item.label);
    row.style.animationDelay = (120 + Math.min(i * 35, 420)) + 'ms';

    if (item.home) {
      row.onclick = goHome;
    } else if (item.href) {
      row.onclick = () => window.open(item.href, '_blank', 'noopener');
    } else {
      row.onclick = () => {
        setCurrentRow(row);
        if (item.panel) showView(item.panel);
      };
      if (item.panel) panelRows[item.panel] = row;
    }
    return row;
  }

  function initSidebar() {
    MENU.forEach((item, i) => ui.menuList.appendChild(buildMenuRow(item, i)));
    setCurrentRow(ui.menuList.firstElementChild);

    ui.backBtn.onclick = () => showView('menu');
    ui.sidebarToggle.onclick = () => {
      if (sidebarOpen) hideSidebar();
      else setSidebarOpen(true);
    };

    /* Escape only applies while the keyboard is inside the menu. It is not a popup,
       so Escape pressed elsewhere (such as on the welcome screen) leaves it alone. */
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebarOpen && ui.sidebar.contains(doc.activeElement)) hideSidebar();
    });

    const isPhone = ui.root.classList.contains('is-phone');
    setSidebarOpen(CONFIG.sidebarStartsOpen && !isPhone);
  }


  /* =================================================================
     SECTION 7. FULLSCREEN
     ================================================================= */
  const html = doc.documentElement;
  const requestFs = html.requestFullscreen || html.webkitRequestFullscreen;
  const exitFs = doc.exitFullscreen || doc.webkitExitFullscreen;

  function fullscreenElement() {
    return doc.fullscreenElement || doc.webkitFullscreenElement || null;
  }

  /* Runs a fullscreen call and swallows the rejection browsers throw when it is refused */
  function fsCall(fn, target) {
    try { return Promise.resolve(fn && fn.call(target)).catch(() => {}); }
    catch (e) { return Promise.resolve(); }
  }

  function onFullscreenChange() {
    const fsEl = fullscreenElement();
    const on = !!fsEl;

    ui.fullscreenBtn.innerHTML = on ? ICONS.exitFullscreen : ICONS.fullscreen;
    ui.fullscreenBtn.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Enter fullscreen');

    /* If something else went fullscreen, keep our UI visible on top of it */
    if (on && fsEl !== html && fsEl !== doc.body && !fsEl.contains(ui.root)) {
      if (/^(CANVAS|VIDEO|IFRAME|IMG)$/.test(fsEl.tagName)) {
        fsCall(exitFs, doc).then(() => fsCall(requestFs, html));
      } else {
        fsEl.appendChild(ui.root);
      }
    } else if (!on && ui.root.parentNode !== ui.host) {
      ui.host.appendChild(ui.root);
    }
  }

  function initFullscreen() {
    if (!requestFs || !exitFs) {
      ui.fullscreenBtn.style.display = 'none';
      return;
    }
    ui.fullscreenBtn.onclick = () => {
      if (fullscreenElement()) fsCall(exitFs, doc);
      else fsCall(requestFs, html);
    };
    doc.addEventListener('fullscreenchange', onFullscreenChange);
    doc.addEventListener('webkitfullscreenchange', onFullscreenChange);
  }


  /* =================================================================
     SECTION 8. BOTTOM DOCK
     ================================================================= */
  const pills = [];
  let dockSizeWatcher = null;

  function setDockVisible(visible) {
    ui.dock.classList.toggle('is-hidden', !visible);
    if (visible) queueArrowUpdate();
  }

  /* Fade edges and arrow states follow the scroll position */
  function updateArrows() {
    const track = ui.track;
    const max = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;

    ui.dock.classList.toggle('no-overflow', max <= 1);
    track.classList.toggle('can-scroll-left', x > 1);
    track.classList.toggle('can-scroll-right', x < max - 1);
    ui.prevBtn.disabled = x <= 1;
    ui.nextBtn.disabled = x >= max - 1;
  }

  /* At most one arrow update per frame, however many scroll or resize events arrive */
  let arrowUpdateQueued = false;
  function queueArrowUpdate() {
    if (arrowUpdateQueued) return;
    arrowUpdateQueued = true;
    requestAnimationFrame(() => {
      arrowUpdateQueued = false;
      updateArrows();
    });
  }

  function scrollBehavior() {
    return REDUCED_MOTION ? 'auto' : 'smooth';
  }

  function scrollDockByPage(direction) {
    ui.track.scrollBy({ left: direction * ui.track.clientWidth * 0.8, behavior: scrollBehavior() });
  }

  function centerPill(pill, instant) {
    const left = pill.offsetLeft - (ui.track.clientWidth - pill.offsetWidth) / 2;
    ui.track.scrollTo({ left: Math.max(0, left), behavior: instant ? 'auto' : scrollBehavior() });
  }

  /* Mouse wheel scrolls the strip sideways on desktop. Snapping is paused while the
     wheel moves, otherwise small trackpad steps snap straight back to the same pill. */
  let wheelTimer = 0;
  function onDockWheel(e) {
    const track = ui.track;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (track.scrollWidth <= track.clientWidth) return;

    e.preventDefault();
    track.style.scrollSnapType = 'none';
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { track.style.scrollSnapType = ''; }, 160);

    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? track.clientWidth : 1;
    track.scrollLeft += e.deltaY * unit;
  }

  function buildPill(scene) {
    const pill = setText(el('button', { 'class': 'rw-pill' }), titleCase(scene.title));
    pill.onclick = () => goToScene(scene.index);
    ui.track.appendChild(pill);
    pills.push(pill);
    if (dockSizeWatcher) dockSizeWatcher.observe(pill);
  }

  function initDock() {
    ui.prevBtn.onclick = () => scrollDockByPage(-1);
    ui.nextBtn.onclick = () => scrollDockByPage(1);
    ui.track.addEventListener('scroll', queueArrowUpdate, { passive: true });
    ui.track.addEventListener('wheel', onDockWheel, { passive: false });

    /* Re-check the arrows whenever the dock or a pill changes size
       (window resize, side menu opening, phone layout, web font finishing loading) */
    if (window.ResizeObserver) {
      dockSizeWatcher = new ResizeObserver(queueArrowUpdate);
      dockSizeWatcher.observe(ui.track);
    } else {
      window.addEventListener('resize', queueArrowUpdate);
    }

    SCENES.forEach(buildPill);
    queueArrowUpdate();
  }


  /* =================================================================
     SECTION 9. CONNECT TO 3DVISTA
     ================================================================= */
  let playlist = null;
  let shownIndex = null;

  function findPlaylist() {
    const tour = window.tour;
    if (tour && tour.mainPlayList) return tour.mainPlayList;

    const api = window.TDV && TDV.PlayerAPI;
    const player = (tour && tour.player) ||
      (api && typeof api.getCurrentPlayer === 'function' && api.getCurrentPlayer()) ||
      (api && typeof api.getCurrentPlayers === 'function' && (api.getCurrentPlayers() || [])[0]);
    if (!player) return null;

    if (player.mainPlayList) return player.mainPlayList;
    if (typeof player.getById === 'function') {
      const main = player.getById('mainPlayList');
      if (main) return main;
    }
    if (typeof player.getByClassName === 'function') {
      return (player.getByClassName('PlayList') || [])[0] || null;
    }
    return null;
  }

  function goToScene(index) {
    if (!playlist || index < 0) return false;
    const items = playlist.get('items');
    if (items && index >= items.length) return false;

    playlist.set('selectedIndex', index);
    hideSidebarIfCoveringScene();
    return true;
  }

  /* Accepts a playlist index, or part of a scene title such as 'el nido' */
  function findSceneIndex(target) {
    if (typeof target === 'number') return target;
    const text = String(target || '').trim().toLowerCase();
    if (!text) return -1;
    const scene = SCENES.find((item) => item.title.toLowerCase().indexOf(text) > -1);
    return scene ? scene.index : -1;
  }

  /* Keeps the dock highlighting the scene that is showing */
  function syncCurrentScene(instant) {
    const current = playlist ? playlist.get('selectedIndex') : 0;
    if (current === shownIndex) return;
    shownIndex = current;

    SCENES.forEach((scene, i) => {
      const isCurrent = scene.index === current;
      pills[i].classList.toggle('is-current', isCurrent);
      if (isCurrent) {
        pills[i].setAttribute('aria-current', 'true');
        centerPill(pills[i], instant);
      } else {
        pills[i].removeAttribute('aria-current');
      }
    });
  }

  function connectToPlaylist(found) {
    playlist = found;
    syncCurrentScene(true);

    if (playlist) {
      /* 3DVista fires "change" as soon as the scene switches, so the highlight
         follows instantly. The slow poll is only a safety net. */
      let bound = false;
      if (typeof playlist.bind === 'function') {
        try {
          playlist.bind('change', () => syncCurrentScene(false), window);
          bound = true;
        } catch (e) { }
      }
      setInterval(() => syncCurrentScene(false), bound ? 1500 : 400);
    }

    window.__rwReady = 1;
    emit('rw:ready');
  }

  function waitForTour() {
    let tries = 0;
    const timer = setInterval(() => {
      let found = null;
      try { found = findPlaylist(); } catch (e) { }

      if (found || ++tries > 120) {
        clearInterval(timer);
        connectToPlaylist(found);
      }
    }, 250);
  }

  /* For 3DVista hotspots and other scripts */
  function initPublicApi() {
    window.RawanTour = {
      find: findSceneIndex,
      goTo: (target) => goToScene(findSceneIndex(target)),
      showStrip: (visible) => setDockVisible(visible !== false)
    };
  }


  /* =================================================================
     SECTION 10. PHONE SIZING
     ================================================================= */
  /* How much the browser is shrinking the page. 3DVista asks for half size on phones
     (initial-scale=0.5 in the viewport tag), but Chrome and Firefox ignore that in fullscreen
     and show the page at full size, so in fullscreen the browser's live value is used instead. */
  function pageScale() {
    let scale;
    if (window.visualViewport && fullscreenElement()) {
      scale = window.visualViewport.scale;
    } else {
      const meta = doc.querySelector('meta[name=viewport]');
      const match = meta && /initial-scale=([0-9.]+)/.exec(meta.content);
      scale = match ? +match[1] : 1;
    }
    return scale > 0 && scale < 1 ? scale : 1;
  }

  /* Sets is-phone, is-short and is-narrow on the root. The styles for them are at the end of SECTION 3. */
  function fitToScreen() {
    const node = ui.root;
    let lastScale = -1;

    function update() {
      const scale = pageScale();
      if (scale !== lastScale) {
        lastScale = scale;
        node.style.zoom = scale < 1 ? String(1 / scale) : '';
      }
      const width = innerWidth * scale;
      const isShort = innerHeight * scale <= CONFIG.shortMaxHeight;

      node.classList.toggle('is-phone', isShort || width <= CONFIG.phoneMaxWidth);
      node.classList.toggle('is-short', isShort);
      node.classList.toggle('is-narrow', width <= CONFIG.narrowMaxWidth);
    }

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    doc.addEventListener('fullscreenchange', update);
    doc.addEventListener('webkitfullscreenchange', update);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', update);
    if (window.MutationObserver) {
      new MutationObserver(update).observe(doc.head, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['content']
      });
    }
  }


  /* =================================================================
     SECTION 11. START
     ================================================================= */
  function mount() {
    buildUI();
    fitToScreen();
    initSidebar();
    initFullscreen();
    initDock();
    initPublicApi();
    waitForTour();
  }

  /* 3DVista can run this before the page body exists, so wait for it */
  function start() {
    if (doc.body) {
      mount();
      return;
    }
    const timer = setInterval(() => {
      if (!doc.body) return;
      clearInterval(timer);
      mount();
    }, 50);
  }

  start();

})();
