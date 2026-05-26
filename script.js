document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. Smooth Scroll for Anchor Links ───────────────────────────────────────
  document.body.addEventListener('click', function (e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const hash = target.getAttribute('href');
    if (!hash || hash === '#') return;

    const destination = document.querySelector(hash);
    if (!destination) return;

    e.preventDefault();

    destination.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    if (history.pushState) {
      history.pushState(null, null, hash);
    }
  });

  // ─── 2. Navbar Scroll Effect ─────────────────────────────────────────────────
  const navbar = document.querySelector('nav, .navbar, [data-navbar]');

  if (navbar) {
    const SCROLL_THRESHOLD = 50;
    const SCROLLED_CLASS = 'navbar--scrolled';

    function handleNavbarScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add(SCROLLED_CLASS);
      } else {
        navbar.classList.remove(SCROLLED_CLASS);
      }
    }

    let navbarTicking = false;
    window.addEventListener('scroll', function () {
      if (!navbarTicking) {
        requestAnimationFrame(function () {
          handleNavbarScroll();
          navbarTicking = false;
        });
        navbarTicking = true;
      }
    }, { passive: true });

    handleNavbarScroll();
  }

  // ─── 3. Contact Form Validation ──────────────────────────────────────────────
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    const FIELD_ERROR_CLASS = 'field--error';
    const FIELD_SUCCESS_CLASS = 'field--success';
    const ERROR_MESSAGE_CLASS = 'field-error-message';

    function getErrorMessage(field) {
      const type = field.type;
      const name = field.name || field.id || 'field';
      const value = field.value.trim();

      if (field.required && value === '') {
        return field.dataset.errorRequired || 'This field is required.';
      }

      if (type === 'email' && value !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return field.dataset.errorEmail || 'Please enter a valid email address.';
        }
      }

      if (type === 'tel' && value !== '') {
        const telPattern = /^[+\d\s\-().]{7,20}$/;
        if (!telPattern.test(value)) {
          return field.dataset.errorTel || 'Please enter a valid phone number.';
        }
      }

      if (field.minLength && field.minLength > 0 && value.length < field.minLength) {
        return field.dataset.errorMinlength ||
          'Please enter at least ' + field.minLength + ' characters.';
      }

      if (field.maxLength && field.maxLength > 0 && value.length > field.maxLength) {
        return field.dataset.errorMaxlength ||
          'Please enter no more than ' + field.maxLength + ' characters.';
      }

      return null;
    }

    function showFieldError(field, message) {
      const wrapper = field.closest('.form-group, .field-wrapper, .input-wrapper') || field.parentElement;
      wrapper.classList.add(FIELD_ERROR_CLASS);
      wrapper.classList.remove(FIELD_SUCCESS_CLASS);

      let errorEl = wrapper.querySelector('.' + ERROR_MESSAGE_CLASS);
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = ERROR_MESSAGE_CLASS;
        errorEl.setAttribute('role', 'alert');
        errorEl.setAttribute('aria-live', 'polite');
        wrapper.appendChild(errorEl);
      }
      errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errorEl.id || (errorEl.id = 'err-' + Math.random().toString(36).slice(2)));
    }

    function clearFieldError(field) {
      const wrapper = field.closest('.form-group, .field-wrapper, .input-wrapper') || field.parentElement;
      wrapper.classList.remove(FIELD_ERROR_CLASS);
      wrapper.classList.add(FIELD_SUCCESS_CLASS);

      const errorEl = wrapper.querySelector('.' + ERROR_MESSAGE_CLASS);
      if (errorEl) errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }

    function validateField(field) {
      const message = getErrorMessage(field);
      if (message) {
        showFieldError(field, message);
        return false;
      }
      clearFieldError(field);
      return true;
    }

    function getValidatableFields() {
      return Array.from(contactForm.querySelectorAll('input, textarea, select')).filter(function (field) {
        return field.type !== 'hidden' && field.type !== 'submit' && field.type !== 'button' && field.type !== 'reset';
      });
    }

    // Live validation on blur
    contactForm.addEventListener('blur', function (e) {
      const field = e.target.closest('input, textarea, select');
      if (!field) return;
      validateField(field);
    }, true);

    // Clear error on input
    contactForm.addEventListener('input', function (e) {
      const field = e.target.closest('input, textarea, select');
      if (!field) return;
      const wrapper = field.closest('.form-group, .field-wrapper, .input-wrapper') || field.parentElement;
      if (wrapper.classList.contains(FIELD_ERROR_CLASS)) {
        validateField(field);
      }
    });

    // Form submit validation
    contactForm.addEventListener('submit', function (e) {
      const fields = getValidatableFields();
      let isValid = true;
      let firstInvalidField = null;

      fields.forEach(function (field) {
        const fieldValid = validateField(field);
        if (!fieldValid && !firstInvalidField) {
          firstInvalidField = field;
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        if (firstInvalidField) {
          firstInvalidField.focus();
          firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Optional: show success state
      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = submitBtn.dataset.loadingText || 'Sending...';
      }
    });
  }

  // ─── 4. Scroll Animations (Fade-in on Scroll) ────────────────────────────────
  const ANIMATE_SELECTOR = '[data-animate], .animate-on-scroll';
  const VISIBLE_CLASS = 'is-visible';
  const ANIMATION_ROOT_MARGIN = '0px 0px -60px 0px';
  const ANIMATION_THRESHOLD = 0.15;

});
/* === NAVBAR SCROLL JS OVERRIDE START === */
(function(){var nb=document.querySelector('nav.navbar,.navbar:not(.zappy-catalog-menu)');var cm=document.querySelector('.zappy-catalog-menu,#zappy-catalog-menu');if(!nb)return;var bodyBg=getComputedStyle(document.body).backgroundColor||'rgb(0,0,0)';var m=bodyBg.match(/\d+/g);var cr=m?parseInt(m[0]):0,cg=m?parseInt(m[1]):0,cb=m?parseInt(m[2]):0;var fb='rgba('+cr+','+cg+','+cb+',0.85)';var sR=cr/255,sG=cg/255,sB=cb/255;sR=sR<=0.03928?sR/12.92:Math.pow((sR+0.055)/1.055,2.4);sG=sG<=0.03928?sG/12.92:Math.pow((sG+0.055)/1.055,2.4);sB=sB<=0.03928?sB/12.92:Math.pow((sB+0.055)/1.055,2.4);var lum=0.2126*sR+0.7152*sG+0.0722*sB;var rs=getComputedStyle(document.documentElement);var td=rs.getPropertyValue('--text-dark').trim()||'#1a1a1a';var tl=rs.getPropertyValue('--text-light').trim()||'#ffffff';var st=(lum>0.4)?td:tl;var th=60;var neSel='a,.navbar-brand,.navbar-brand a,.dropdown-toggle,.mobile-toggle,.phone-header-btn,.mobile-hamburger-btn,.mobile-close-btn,.mobile-submenu-toggle,.nav-link';var skipCls=['cart-link','login-link','nav-search-toggle','search-toggle','nav-cta-btn'];function sTC(c,clr){var els=c.querySelectorAll(neSel);for(var i=0;i<els.length;i++){var sk=false;if(els[i].closest('.sub-menu')||els[i].closest('.dropdown-menu')){sk=true;}for(var j=0;j<skipCls.length;j++){if(els[i].classList.contains(skipCls[j])){sk=true;break;}}if(!sk)els[i].style.setProperty('color',clr,'important');}}function cTC(c){var els=c.querySelectorAll(neSel);for(var i=0;i<els.length;i++){if(els[i].closest('.sub-menu')||els[i].closest('.dropdown-menu'))continue;els[i].style.removeProperty('color');}}function onS(){if(window._zappyNavOverrideActive)return;if(window._zappyNavNoDarkHero)return;if(window.innerWidth<=768){nb.style.removeProperty('background');nb.style.removeProperty('background-color');nb.style.removeProperty('background-image');nb.style.removeProperty('--frosted-text');nb.style.backdropFilter='';nb.style.webkitBackdropFilter='';nb.style.boxShadow='';nb.classList.remove('scrolled');cTC(nb);if(cm){cm.style.removeProperty('background');cm.style.removeProperty('background-color');cm.style.removeProperty('backdrop-filter');cm.style.removeProperty('-webkit-backdrop-filter');cm.classList.remove('scrolled');cTC(cm);}return;}var y=window.scrollY||window.pageYOffset;if(y>th){nb.classList.add('scrolled');nb.style.setProperty('background-color',fb,'important');nb.style.setProperty('background-image','none','important');nb.style.setProperty('--frosted-text',st);nb.style.backdropFilter='blur(12px)';nb.style.webkitBackdropFilter='blur(12px)';nb.style.boxShadow='0 2px 16px rgba(0,0,0,0.12)';sTC(nb,st);if(cm){cm.classList.add('scrolled');cm.style.setProperty('background',fb,'important');cm.style.setProperty('backdrop-filter','blur(12px)','important');cm.style.setProperty('-webkit-backdrop-filter','blur(12px)','important');sTC(cm,st);}}else{if(window._zappyNavNoDarkHero)return;nb.classList.remove('scrolled');nb.style.setProperty('background-color','transparent','important');nb.style.removeProperty('background-image');nb.style.removeProperty('--frosted-text');nb.style.backdropFilter='none';nb.style.webkitBackdropFilter='none';nb.style.boxShadow='none';cTC(nb);if(cm){cm.classList.remove('scrolled');cm.style.setProperty('background','transparent','important');cm.style.setProperty('backdrop-filter','none','important');cm.style.setProperty('-webkit-backdrop-filter','none','important');cTC(cm);}}}if(window._zappyNavScrollCleanup)window._zappyNavScrollCleanup();window.addEventListener('scroll',onS,{passive:true});window.addEventListener('resize',onS,{passive:true});window._zappyNavScrollCleanup=function(){window.removeEventListener('scroll',onS);window.removeEventListener('resize',onS);};onS();function sLum(rv,gv,bv){rv/=255;gv/=255;bv/=255;rv=rv<=0.03928?rv/12.92:Math.pow((rv+0.055)/1.055,2.4);gv=gv<=0.03928?gv/12.92:Math.pow((gv+0.055)/1.055,2.4);bv=bv<=0.03928?bv/12.92:Math.pow((bv+0.055)/1.055,2.4);return 0.2126*rv+0.7152*gv+0.0722*bv;}var heroEl=document.querySelector('section[class*="hero"],[data-hero-type],main>section:first-child');var hasDH=false;if(heroEl){var hCs=getComputedStyle(heroEl);var hBI=hCs.backgroundImage;if(hBI&&hBI!=='none'){if(hBI.indexOf('url(')!==-1){var hM2=hCs.backgroundColor.match(/\d+/g);if(hM2&&hM2.length>=3){hasDH=sLum(parseInt(hM2[0]),parseInt(hM2[1]),parseInt(hM2[2]))<0.4;}else{hasDH=true;}}else if(hBI.indexOf('gradient')!==-1){var cM=hBI.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g);if(cM&&cM.length>0){var tLm=0;for(var ci=0;ci<cM.length;ci++){var pts=cM[ci].match(/\d+/g);tLm+=sLum(parseInt(pts[0]),parseInt(pts[1]),parseInt(pts[2]));}hasDH=(tLm/cM.length)<0.4;}else{hasDH=true;}}else{hasDH=true;}}else{var hM=hCs.backgroundColor.match(/\d+/g);if(hM&&hM.length>=3){hasDH=sLum(parseInt(hM[0]),parseInt(hM[1]),parseInt(hM[2]))<0.4;}}}if(!hasDH){window.removeEventListener('scroll',onS);window.removeEventListener('resize',onS);delete window._zappyNavScrollCleanup;nb.classList.add('scrolled');if(window.innerWidth>768){nb.style.setProperty('--frosted-text',st);nb.style.setProperty('background-image','none','important');nb.style.setProperty('background-color',fb,'important');nb.style.backdropFilter='blur(12px)';nb.style.webkitBackdropFilter='blur(12px)';nb.style.boxShadow='0 2px 16px rgba(0,0,0,0.12)';sTC(nb,st);}if(cm){cm.classList.add('scrolled');if(window.innerWidth>768){cm.style.setProperty('background',fb,'important');cm.style.setProperty('backdrop-filter','blur(12px)','important');cm.style.setProperty('-webkit-backdrop-filter','blur(12px)','important');sTC(cm,st);}}window._zappyNavNoDarkHero=true;var origNbR=nb.classList.remove.bind(nb.classList);nb._origClassListRemove=origNbR;nb.classList.remove=function(){var a=[];for(var i=0;i<arguments.length;i++){if(arguments[i]!=='scrolled')a.push(arguments[i]);}if(a.length>0)origNbR.apply(null,a);};if(cm){var origCmR=cm.classList.remove.bind(cm.classList);cm._origClassListRemove=origCmR;cm.classList.remove=function(){var a=[];for(var i=0;i<arguments.length;i++){if(arguments[i]!=='scrolled')a.push(arguments[i]);}if(a.length>0)origCmR.apply(null,a);};}}})();
/* === NAVBAR SCROLL JS OVERRIDE END === */

;

/* Cookie Consent */

// Helper function to check cookie consent
function hasConsentFor(category) {
  if (typeof window.CookieConsent === 'undefined') {
    return false; // Default to no consent if cookie consent not loaded
  }
  
  return window.CookieConsent.validConsent(category);
}

// Helper function to execute code only with consent
function withConsent(category, callback) {
  if (hasConsentFor(category)) {
    callback();
  } else {
    console.log(`[WARNING] Skipping ${category} code - no user consent`);
  }
}

// Cookie Consent Initialization (multi-language) /* __ccConfigCustomBannerV1 */

(function() {
  'use strict';
  
  var initAttempts = 0;
  var maxAttempts = 50;
  
  function initCookieConsent() {
    initAttempts++;
    
    if (typeof window.CookieConsent === 'undefined') {
      if (initAttempts < maxAttempts) {
        setTimeout(initCookieConsent, 100);
      }
      return;
    }

    if (window.__zappyCookieConsentInitialized) {
      return;
    }
    window.__zappyCookieConsentInitialized = true;

    var cc = window.CookieConsent;
    
    try {
      var __ccConfig = {
  "autoShow": false,
  "mode": "opt-in",
  "revision": 0,
  "categories": {
    "necessary": {
      "enabled": true,
      "readOnly": true
    },
    "analytics": {
      "enabled": false,
      "readOnly": false,
      "autoClear": {
        "cookies": [
          {
            "name": "_ga"
          },
          {
            "name": "_ga_*"
          },
          {
            "name": "_gid"
          },
          {
            "name": "_gat"
          }
        ]
      }
    },
    "marketing": {
      "enabled": false,
      "readOnly": false,
      "autoClear": {
        "cookies": [
          {
            "name": "_fbp"
          },
          {
            "name": "_fbc"
          },
          {
            "name": "fr"
          }
        ]
      }
    }
  },
  "language": {
    "default": "he",
    "translations": {
      "en": {
        "consentModal": {
          "description": "We use cookies to improve your experience and analyze site usage.",
          "acceptAllBtn": "Accept",
          "showPreferencesBtn": "Customize"
        },
        "preferencesModal": {
          "title": "Cookie Preferences",
          "acceptAllBtn": "Accept",
          "acceptNecessaryBtn": "Accept Necessary",
          "savePreferencesBtn": "Save Preferences",
          "closeIconLabel": "Close",
          "sections": [
            {
              "title": "Essential Cookies",
              "description": "These cookies are necessary for the website to function and cannot be disabled.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Analytics Cookies",
              "description": "These cookies help us understand how visitors interact with our website.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Marketing Cookies",
              "description": "These cookies are used to deliver personalized advertisements.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "es": {
        "consentModal": {
          "description": "Usamos cookies para mejorar tu experiencia y analizar el uso del sitio.",
          "acceptAllBtn": "Aceptar",
          "showPreferencesBtn": "Personalizar"
        },
        "preferencesModal": {
          "title": "Preferencias de Cookies",
          "acceptAllBtn": "Aceptar",
          "acceptNecessaryBtn": "Solo Necesarias",
          "savePreferencesBtn": "Guardar Preferencias",
          "closeIconLabel": "Cerrar",
          "sections": [
            {
              "title": "Cookies Esenciales",
              "description": "Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Cookies de Análisis",
              "description": "Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Cookies de Marketing",
              "description": "Estas cookies se utilizan para entregar anuncios personalizados.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "fr": {
        "consentModal": {
          "description": "Nous utilisons des cookies pour améliorer votre expérience et analyser l'utilisation du site.",
          "acceptAllBtn": "Accepter",
          "showPreferencesBtn": "Personnaliser"
        },
        "preferencesModal": {
          "title": "Préférences des Cookies",
          "acceptAllBtn": "Accepter",
          "acceptNecessaryBtn": "Accepter les Nécessaires",
          "savePreferencesBtn": "Enregistrer les Préférences",
          "closeIconLabel": "Fermer",
          "sections": [
            {
              "title": "Cookies Essentiels",
              "description": "Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Cookies Analytiques",
              "description": "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site web.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Cookies Marketing",
              "description": "Ces cookies sont utilisés pour diffuser des publicités personnalisées.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "de": {
        "consentModal": {
          "description": "Wir verwenden Cookies, um Ihr Erlebnis zu verbessern und die Nutzung der Website zu analysieren.",
          "acceptAllBtn": "Akzeptieren",
          "showPreferencesBtn": "Anpassen"
        },
        "preferencesModal": {
          "title": "Cookie-Einstellungen",
          "acceptAllBtn": "Akzeptieren",
          "acceptNecessaryBtn": "Nur Notwendige",
          "savePreferencesBtn": "Einstellungen speichern",
          "closeIconLabel": "Schließen",
          "sections": [
            {
              "title": "Notwendige Cookies",
              "description": "Diese Cookies sind für die Funktion der Website erforderlich und können nicht deaktiviert werden.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Analyse-Cookies",
              "description": "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Marketing-Cookies",
              "description": "Diese Cookies werden verwendet, um personalisierte Werbung zu liefern.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "it": {
        "consentModal": {
          "description": "Utilizziamo i cookie per migliorare la tua esperienza e analizzare l'utilizzo del sito.",
          "acceptAllBtn": "Accetta",
          "showPreferencesBtn": "Personalizza"
        },
        "preferencesModal": {
          "title": "Preferenze Cookie",
          "acceptAllBtn": "Accetta",
          "acceptNecessaryBtn": "Solo Necessari",
          "savePreferencesBtn": "Salva Preferenze",
          "closeIconLabel": "Chiudi",
          "sections": [
            {
              "title": "Cookie Essenziali",
              "description": "Questi cookie sono necessari per il funzionamento del sito web e non possono essere disattivati.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Cookie Analitici",
              "description": "Questi cookie ci aiutano a capire come i visitatori interagiscono con il nostro sito web.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Cookie di Marketing",
              "description": "Questi cookie vengono utilizzati per fornire pubblicità personalizzate.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "pt": {
        "consentModal": {
          "description": "Usamos cookies para melhorar sua experiência e analisar o uso do site.",
          "acceptAllBtn": "Aceitar",
          "showPreferencesBtn": "Personalizar"
        },
        "preferencesModal": {
          "title": "Preferências de Cookies",
          "acceptAllBtn": "Aceitar",
          "acceptNecessaryBtn": "Apenas Necessários",
          "savePreferencesBtn": "Salvar Preferências",
          "closeIconLabel": "Fechar",
          "sections": [
            {
              "title": "Cookies Essenciais",
              "description": "Estes cookies são necessários para o funcionamento do site e não podem ser desativados.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Cookies Analíticos",
              "description": "Estes cookies nos ajudam a entender como os visitantes interagem com nosso site.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Cookies de Marketing",
              "description": "Estes cookies são usados para exibir anúncios personalizados.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "nl": {
        "consentModal": {
          "description": "Wij gebruiken cookies om uw ervaring te verbeteren en het sitegebruik te analyseren.",
          "acceptAllBtn": "Accepteren",
          "showPreferencesBtn": "Aanpassen"
        },
        "preferencesModal": {
          "title": "Cookie-voorkeuren",
          "acceptAllBtn": "Accepteren",
          "acceptNecessaryBtn": "Alleen noodzakelijke",
          "savePreferencesBtn": "Voorkeuren opslaan",
          "closeIconLabel": "Sluiten",
          "sections": [
            {
              "title": "Noodzakelijke Cookies",
              "description": "Deze cookies zijn nodig voor het functioneren van de website en kunnen niet worden uitgeschakeld.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Analytische Cookies",
              "description": "Deze cookies helpen ons te begrijpen hoe bezoekers onze website gebruiken.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Marketing Cookies",
              "description": "Deze cookies worden gebruikt om gepersonaliseerde advertenties te tonen.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "he": {
        "consentModal": {
          "description": "אנחנו משתמשים בעוגיות כדי לשפר את החוויה שלך ולנתח שימוש באתר.",
          "acceptAllBtn": "אישור",
          "showPreferencesBtn": "התאמה אישית"
        },
        "preferencesModal": {
          "title": "העדפות עוגיות",
          "acceptAllBtn": "אישור",
          "acceptNecessaryBtn": "רק הכרחי",
          "savePreferencesBtn": "שמור העדפות",
          "closeIconLabel": "סגור",
          "sections": [
            {
              "title": "עוגיות חיוניות",
              "description": "עוגיות אלה הכרחיות לתפקוד האתר ולא ניתן להשבית אותן.",
              "linkedCategory": "necessary"
            },
            {
              "title": "עוגיות ניתוח",
              "description": "עוגיות אלה עוזרות לנו להבין איך המבקרים מתקשרים עם האתר שלנו.",
              "linkedCategory": "analytics"
            },
            {
              "title": "עוגיות שיווקיות",
              "description": "עוגיות אלה משמשות להצגת פרסומות מותאמות אישית.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "ar": {
        "consentModal": {
          "description": "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع.",
          "acceptAllBtn": "قبول",
          "showPreferencesBtn": "تخصيص"
        },
        "preferencesModal": {
          "title": "تفضيلات ملفات تعريف الارتباط",
          "acceptAllBtn": "قبول",
          "acceptNecessaryBtn": "الضرورية فقط",
          "savePreferencesBtn": "حفظ التفضيلات",
          "closeIconLabel": "إغلاق",
          "sections": [
            {
              "title": "ملفات تعريف الارتباط الأساسية",
              "description": "هذه الملفات ضرورية لعمل الموقع ولا يمكن تعطيلها.",
              "linkedCategory": "necessary"
            },
            {
              "title": "ملفات تعريف الارتباط التحليلية",
              "description": "تساعدنا هذه الملفات في فهم كيفية تفاعل الزوار مع موقعنا.",
              "linkedCategory": "analytics"
            },
            {
              "title": "ملفات تعريف الارتباط التسويقية",
              "description": "تُستخدم هذه الملفات لعرض إعلانات مخصصة.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "tr": {
        "consentModal": {
          "description": "Deneyiminizi geliştirmek ve site kullanımını analiz etmek için çerezler kullanırız.",
          "acceptAllBtn": "Kabul Et",
          "showPreferencesBtn": "Özelleştir"
        },
        "preferencesModal": {
          "title": "Çerez Tercihleri",
          "acceptAllBtn": "Kabul Et",
          "acceptNecessaryBtn": "Sadece Gerekli",
          "savePreferencesBtn": "Tercihleri Kaydet",
          "closeIconLabel": "Kapat",
          "sections": [
            {
              "title": "Zorunlu Çerezler",
              "description": "Bu çerezler web sitesinin çalışması için gereklidir ve devre dışı bırakılamaz.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Analiz Çerezleri",
              "description": "Bu çerezler, ziyaretçilerin web sitemizle nasıl etkileşime girdiğini anlamamıza yardımcı olur.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Pazarlama Çerezleri",
              "description": "Bu çerezler kişiselleştirilmiş reklamlar sunmak için kullanılır.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "ru": {
        "consentModal": {
          "description": "Мы используем файлы cookie для улучшения вашего опыта и анализа использования сайта.",
          "acceptAllBtn": "Принять",
          "showPreferencesBtn": "Настроить"
        },
        "preferencesModal": {
          "title": "Настройки cookie",
          "acceptAllBtn": "Принять",
          "acceptNecessaryBtn": "Только необходимые",
          "savePreferencesBtn": "Сохранить настройки",
          "closeIconLabel": "Закрыть",
          "sections": [
            {
              "title": "Необходимые cookie",
              "description": "Эти файлы cookie необходимы для работы сайта и не могут быть отключены.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Аналитические cookie",
              "description": "Эти файлы cookie помогают нам понять, как посетители взаимодействуют с нашим сайтом.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Маркетинговые cookie",
              "description": "Эти файлы cookie используются для показа персонализированной рекламы.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "zh": {
        "consentModal": {
          "description": "我们使用 Cookie 来改善您的体验并分析网站使用情况。",
          "acceptAllBtn": "接受",
          "showPreferencesBtn": "自定义"
        },
        "preferencesModal": {
          "title": "Cookie 偏好设置",
          "acceptAllBtn": "接受",
          "acceptNecessaryBtn": "仅接受必要",
          "savePreferencesBtn": "保存偏好",
          "closeIconLabel": "关闭",
          "sections": [
            {
              "title": "必要 Cookie",
              "description": "这些 Cookie 是网站正常运行所必需的，无法禁用。",
              "linkedCategory": "necessary"
            },
            {
              "title": "分析 Cookie",
              "description": "这些 Cookie 帮助我们了解访问者如何与我们的网站互动。",
              "linkedCategory": "analytics"
            },
            {
              "title": "营销 Cookie",
              "description": "这些 Cookie 用于投放个性化广告。",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "ja": {
        "consentModal": {
          "description": "お客様の体験向上とサイト利用状況の分析のためにCookieを使用しています。",
          "acceptAllBtn": "許可する",
          "showPreferencesBtn": "カスタマイズ"
        },
        "preferencesModal": {
          "title": "Cookie設定",
          "acceptAllBtn": "許可する",
          "acceptNecessaryBtn": "必要なもののみ",
          "savePreferencesBtn": "設定を保存",
          "closeIconLabel": "閉じる",
          "sections": [
            {
              "title": "必要なCookie",
              "description": "これらのCookieはウェブサイトの機能に必要であり、無効にすることはできません。",
              "linkedCategory": "necessary"
            },
            {
              "title": "分析Cookie",
              "description": "これらのCookieは、訪問者がウェブサイトとどのように対話するかを理解するのに役立ちます。",
              "linkedCategory": "analytics"
            },
            {
              "title": "マーケティングCookie",
              "description": "これらのCookieはパーソナライズされた広告を配信するために使用されます。",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "ko": {
        "consentModal": {
          "description": "경험 향상과 사이트 사용 분석을 위해 쿠키를 사용합니다.",
          "acceptAllBtn": "수락",
          "showPreferencesBtn": "사용자 지정"
        },
        "preferencesModal": {
          "title": "쿠키 설정",
          "acceptAllBtn": "수락",
          "acceptNecessaryBtn": "필수만 수락",
          "savePreferencesBtn": "설정 저장",
          "closeIconLabel": "닫기",
          "sections": [
            {
              "title": "필수 쿠키",
              "description": "이 쿠키는 웹사이트 작동에 필요하며 비활성화할 수 없습니다.",
              "linkedCategory": "necessary"
            },
            {
              "title": "분석 쿠키",
              "description": "이 쿠키는 방문자가 웹사이트와 어떻게 상호작용하는지 이해하는 데 도움이 됩니다.",
              "linkedCategory": "analytics"
            },
            {
              "title": "마케팅 쿠키",
              "description": "이 쿠키는 맞춤형 광고를 제공하는 데 사용됩니다.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "pl": {
        "consentModal": {
          "description": "Używamy plików cookie, aby poprawić Twoje wrażenia i analizować korzystanie z witryny.",
          "acceptAllBtn": "Akceptuję",
          "showPreferencesBtn": "Dostosuj"
        },
        "preferencesModal": {
          "title": "Preferencje cookie",
          "acceptAllBtn": "Akceptuję",
          "acceptNecessaryBtn": "Tylko niezbędne",
          "savePreferencesBtn": "Zapisz preferencje",
          "closeIconLabel": "Zamknij",
          "sections": [
            {
              "title": "Niezbędne pliki cookie",
              "description": "Te pliki cookie są niezbędne do działania strony i nie można ich wyłączyć.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Analityczne pliki cookie",
              "description": "Te pliki cookie pomagają nam zrozumieć, w jaki sposób odwiedzający korzystają z naszej strony.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Marketingowe pliki cookie",
              "description": "Te pliki cookie służą do wyświetlania spersonalizowanych reklam.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "uk": {
        "consentModal": {
          "description": "Ми використовуємо файли cookie для покращення вашого досвіду та аналізу використання сайту.",
          "acceptAllBtn": "Прийняти",
          "showPreferencesBtn": "Налаштувати"
        },
        "preferencesModal": {
          "title": "Налаштування cookie",
          "acceptAllBtn": "Прийняти",
          "acceptNecessaryBtn": "Лише необхідні",
          "savePreferencesBtn": "Зберегти налаштування",
          "closeIconLabel": "Закрити",
          "sections": [
            {
              "title": "Необхідні cookie",
              "description": "Ці файли cookie необхідні для роботи сайту і не можуть бути вимкнені.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Аналітичні cookie",
              "description": "Ці файли cookie допомагають нам зрозуміти, як відвідувачі взаємодіють з нашим сайтом.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Маркетингові cookie",
              "description": "Ці файли cookie використовуються для показу персоналізованої реклами.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "ro": {
        "consentModal": {
          "description": "Folosim cookie-uri pentru a vă îmbunătăți experiența și a analiza utilizarea site-ului.",
          "acceptAllBtn": "Acceptă",
          "showPreferencesBtn": "Personalizează"
        },
        "preferencesModal": {
          "title": "Preferințe cookie",
          "acceptAllBtn": "Acceptă",
          "acceptNecessaryBtn": "Doar necesare",
          "savePreferencesBtn": "Salvează preferințele",
          "closeIconLabel": "Închide",
          "sections": [
            {
              "title": "Cookie-uri esențiale",
              "description": "Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot fi dezactivate.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Cookie-uri analitice",
              "description": "Aceste cookie-uri ne ajută să înțelegem cum interacționează vizitatorii cu site-ul nostru.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Cookie-uri de marketing",
              "description": "Aceste cookie-uri sunt folosite pentru a afișa reclame personalizate.",
              "linkedCategory": "marketing"
            }
          ]
        }
      },
      "bg": {
        "consentModal": {
          "description": "Използваме бисквитки, за да подобрим изживяването ви и да анализираме използването на сайта.",
          "acceptAllBtn": "Приемам",
          "showPreferencesBtn": "Персонализиране"
        },
        "preferencesModal": {
          "title": "Настройки за бисквитки",
          "acceptAllBtn": "Приемам",
          "acceptNecessaryBtn": "Само необходимите",
          "savePreferencesBtn": "Запазване на предпочитанията",
          "closeIconLabel": "Затвори",
          "sections": [
            {
              "title": "Необходими бисквитки",
              "description": "Тези бисквитки са необходими за функционирането на уебсайта и не могат да бъдат деактивирани.",
              "linkedCategory": "necessary"
            },
            {
              "title": "Аналитични бисквитки",
              "description": "Тези бисквитки ни помагат да разберем как посетителите взаимодействат с нашия уебсайт.",
              "linkedCategory": "analytics"
            },
            {
              "title": "Маркетингови бисквитки",
              "description": "Тези бисквитки се използват за показване на персонализирани реклами.",
              "linkedCategory": "marketing"
            }
          ]
        }
      }
    }
  },
  "guiOptions": {
    "consentModal": {
      "layout": "bar inline",
      "position": "bottom",
      "equalWeightButtons": false,
      "flipButtons": false
    },
    "preferencesModal": {
      "layout": "box",
      "equalWeightButtons": false,
      "flipButtons": false
    }
  }
};
      var __ccCloseLabels = {"en":"Close","es":"Cerrar","fr":"Fermer","de":"Schließen","it":"Chiudi","pt":"Fechar","nl":"Sluiten","he":"סגור","ar":"إغلاق","tr":"Kapat","ru":"Закрыть","zh":"关闭","ja":"閉じる","ko":"닫기","pl":"Zamknij","uk":"Закрити","ro":"Închide","bg":"Затвори"};

      // Detect the current page language and override the build-time default.
      // Published multi-language sites set <html lang="…"> per URL prefix;
      // preview pages may store the active language on zappyI18n.
      var pageLang = (document.documentElement.getAttribute('lang') || '').split('-')[0].toLowerCase();
      if (!pageLang && typeof zappyI18n !== 'undefined' && zappyI18n.language) {
        pageLang = String(zappyI18n.language).split('-')[0].toLowerCase();
      }
      if (pageLang && __ccConfig.language.translations[pageLang]) {
        __ccConfig.language.default = pageLang;
      }

      function getActiveLanguage() {
        var lang = (document.documentElement.getAttribute('lang') || '').split('-')[0].toLowerCase();
        if (!lang && typeof zappyI18n !== 'undefined' && zappyI18n.language) {
          lang = String(zappyI18n.language).split('-')[0].toLowerCase();
        }
        if (!lang || !__ccConfig.language.translations[lang]) {
          lang = __ccConfig.language.default || 'en';
        }
        return __ccConfig.language.translations[lang] ? lang : 'en';
      }

      function getConsentText() {
        var lang = getActiveLanguage();
        var translations = __ccConfig.language.translations || {};
        var current = translations[lang] || translations.en || {};
        var consent = current.consentModal || {};
        var labels = __ccCloseLabels || {};
        return {
          description: consent.description || '',
          accept: consent.acceptAllBtn || 'Accept',
          customize: consent.showPreferencesBtn || 'Customize',
          close: labels[lang] || labels.en || 'Close'
        };
      }

      function removeCustomBanner() {
        var banner = document.getElementById('zappy-cookie-banner');
        if (banner && banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
        document.documentElement.classList.remove('zappy-cookie-banner-visible');
      }

      function updateCustomBannerText() {
        var banner = document.getElementById('zappy-cookie-banner');
        if (!banner) return;
        var text = getConsentText();
        var desc = banner.querySelector('[data-zappy-cookie-description]');
        var accept = banner.querySelector('[data-zappy-cookie-accept]');
        var customize = banner.querySelector('[data-zappy-cookie-customize]');
        var close = banner.querySelector('[data-zappy-cookie-close]');
        banner.setAttribute('aria-label', text.description || text.close);
        if (desc) desc.textContent = text.description;
        if (accept) accept.textContent = text.accept;
        if (customize) customize.textContent = text.customize;
        if (close) close.setAttribute('aria-label', text.close);
      }

      // Google Consent Mode v2 integration
      function updateGoogleConsentMode() {
        if (typeof gtag !== 'function') {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){dataLayer.push(arguments);};
        }
        
        var analyticsAccepted = cc.acceptedCategory('analytics');
        var marketingAccepted = cc.acceptedCategory('marketing');
        
        gtag('consent', 'update', {
          'analytics_storage': analyticsAccepted ? 'granted' : 'denied',
          'ad_storage': marketingAccepted ? 'granted' : 'denied',
          'ad_user_data': marketingAccepted ? 'granted' : 'denied',
          'ad_personalization': marketingAccepted ? 'granted' : 'denied'
        });
      }

      function acceptAndClose(categories) {
        try { cc.acceptCategory(categories); } catch (_) {}
        removeCustomBanner();
        updateGoogleConsentMode();
      }

      function renderCustomBanner() {
        try {
          if (typeof cc.validConsent === 'function' && cc.validConsent()) {
            removeCustomBanner();
            return;
          }
          if (!document.body) {
            setTimeout(renderCustomBanner, 50);
            return;
          }
          var existing = document.getElementById('zappy-cookie-banner');
          if (existing) {
            updateCustomBannerText();
            return;
          }

          var text = getConsentText();
          var banner = document.createElement('div');
          banner.id = 'zappy-cookie-banner';
          banner.className = 'zappy-cookie-banner';
          banner.setAttribute('role', 'region');
          banner.setAttribute('aria-label', text.description || text.close);

          var inner = document.createElement('div');
          inner.className = 'zappy-cookie-banner__inner';

          var description = document.createElement('p');
          description.className = 'zappy-cookie-banner__text';
          description.setAttribute('data-zappy-cookie-description', 'true');
          description.textContent = text.description;

          var actions = document.createElement('div');
          actions.className = 'zappy-cookie-banner__actions';

          var customizeBtn = document.createElement('button');
          customizeBtn.type = 'button';
          customizeBtn.className = 'zappy-cookie-banner__button zappy-cookie-banner__button--customize';
          customizeBtn.setAttribute('data-zappy-cookie-customize', 'true');
          customizeBtn.textContent = text.customize;
          customizeBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            try { cc.showPreferences(); } catch (_) {}
          });

          var acceptBtn = document.createElement('button');
          acceptBtn.type = 'button';
          acceptBtn.className = 'zappy-cookie-banner__button zappy-cookie-banner__button--accept';
          acceptBtn.setAttribute('data-zappy-cookie-accept', 'true');
          acceptBtn.textContent = text.accept;
          acceptBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            acceptAndClose('all');
          });

          var closeBtn = document.createElement('button');
          closeBtn.type = 'button';
          closeBtn.className = 'zappy-cookie-banner__close';
          closeBtn.setAttribute('data-zappy-cookie-close', 'true');
          closeBtn.setAttribute('aria-label', text.close);
          closeBtn.textContent = '\u00D7';
          closeBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            acceptAndClose([]);
          });

          actions.appendChild(customizeBtn);
          actions.appendChild(acceptBtn);
          inner.appendChild(description);
          inner.appendChild(actions);
          inner.appendChild(closeBtn);
          banner.appendChild(inner);
          document.body.appendChild(banner);
          document.documentElement.classList.add('zappy-cookie-banner-visible');
        } catch (_) {
          // Defensive — never let the custom banner break the page.
        }
      }

      function handleConsentResolved() {
        removeCustomBanner();
        updateGoogleConsentMode();
      }

      __ccConfig.onFirstConsent = handleConsentResolved;
      __ccConfig.onConsent = handleConsentResolved;
      __ccConfig.onChange = handleConsentResolved;

      var runResult = cc.run(__ccConfig);
      var afterRun = function() {
        updateGoogleConsentMode();
        if (!cc.validConsent || !cc.validConsent()) {
          renderCustomBanner();
        }
      };
      if (runResult && typeof runResult.then === 'function') {
        runResult.then(afterRun).catch(afterRun);
      } else {
        setTimeout(afterRun, 0);
      }

      // Keep cookie consent in sync when the user switches language without
      // a full navigation (preview / embedded-resources path).
      if (typeof zappyI18n !== 'undefined' && typeof zappyI18n.onLanguageChange === 'function') {
        zappyI18n.onLanguageChange(function(newLang) {
          try {
            if (__ccConfig.language.translations[newLang]) {
              __ccConfig.language.default = newLang;
              cc.setLanguage(newLang, true);
              updateCustomBannerText();
            }
          } catch (_) {}
        });
      }
    } catch (error) {
      window.__zappyCookieConsentInitialized = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
    setTimeout(initCookieConsent, 1000);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initCookieConsent();
  } else {
    setTimeout(initCookieConsent, 500);
  }
  
  if (typeof window !== 'undefined') {
    if (window.addEventListener) {
      window.addEventListener('load', initCookieConsent, { once: true });
    }
  }
})();

/* Accessibility Features */

/* Mickidum Accessibility Toolbar Initialization - Zappy Style */

window.onload = function() {
    
    try {
        // Detect current page language and direction from <html> element
        // so the toolbar matches the active language on multi-language sites.
        var htmlEl = document.documentElement;
        var pageLang = (htmlEl.getAttribute('lang') || 'he').toLowerCase().split('-')[0];
        var pageDir = (htmlEl.getAttribute('dir') || '').toLowerCase();
        var rtlLangs = ['he', 'ar', 'fa', 'ur', 'yi', 'iw'];
        var isPageRTL = pageDir === 'rtl' || rtlLangs.indexOf(pageLang) !== -1;
        var buttonSide = isPageRTL ? 'left' : 'right';

        var langMap = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', pt: 'pt-PT', nl: 'nl-NL', he: 'he-IL', ar: 'ar-SA' };
        var forceLang = langMap[pageLang] || 'he-IL';

        var iconPos = { bottom: { size: 50, units: 'px' }, type: 'fixed' };
        iconPos[buttonSide] = { size: 20, units: 'px' };

        window.micAccessTool = new MicAccessTool({
            buttonPosition: buttonSide,
            forceLang: forceLang,
            icon: {
                position: iconPos,
                backgroundColor: 'transparent',
                color: 'transparent',
                img: 'accessible',
                circular: false
            },
            menu: {
                dimensions: {
                    width: { size: 300, units: 'px' },
                    height: { size: 'auto', units: 'px' }
                }
            }
        });
        
    } catch (error) {
    }
    
    // Keyboard shortcut handler: ALT+A (Option+A on Mac) to toggle accessibility menu
    document.addEventListener('keydown', function(event) {
        var isAltOrOption = event.altKey;
        var isAKey = event.code === 'KeyA' || event.keyCode === 65 || event.which === 65 || 
                      (event.key && (event.key.toLowerCase() === 'a' || event.key === 'å' || event.key === 'Å'));
        
        if (isAltOrOption && isAKey) {
            event.preventDefault();
            event.stopPropagation();
            var accessButton = document.getElementById('mic-access-tool-general-button');
            if (accessButton) {
                accessButton.click();
            }
        }
    }, true);
};

// Zappy Contact Form API Integration (Fallback)
(function() {
    if (window.zappyContactFormLoaded) {
        console.log('📧 Zappy contact form already loaded');
        return;
    }
    window.zappyContactFormLoaded = true;

    function zappyNotify(message, type) {
        var existing = document.querySelectorAll('.zappy-notification');
        existing.forEach(function(el) { el.remove(); });
        var el = document.createElement('div');
        el.className = 'zappy-notification';
        var bg = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1';
        var fg = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460';
        var border = type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb';
        var icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        el.style.cssText = 'position:fixed;top:20px;right:20px;max-width:400px;padding:16px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.4;animation:slideInRight .3s ease-out;background:' + bg + ';color:' + fg + ';border:1px solid ' + border;
        el.innerHTML = '<span style="margin-right:8px">' + icon + '</span>' + message + '<button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;cursor:pointer;float:right;opacity:.7;padding:0 0 0 12px">&times;</button>';
        if (!document.getElementById('zappy-notify-anim')) {
            var s = document.createElement('style');
            s.id = 'zappy-notify-anim';
            s.textContent = '@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
            document.head.appendChild(s);
        }
        document.body.appendChild(el);
        setTimeout(function() { if (el.parentElement) el.remove(); }, type === 'error' ? 8000 : 5000);
    }

    function initContactFormIntegration() {
        console.log('📧 Zappy: Initializing contact form API integration...');

        // Exclude newsletter popup form (data-zappy-newsletter / #znl-form /
        // forms inside .znl-overlay) — they have their own submit handler that
        // posts to /api/newsletter/public/.../subscribe and must not be hijacked
        // by the contact-form integration.
        function isNewsletterPopupForm(f) {
            if (!f) return false;
            if (f.hasAttribute && f.hasAttribute('data-zappy-newsletter')) return true;
            if (f.id === 'znl-form' || (f.classList && f.classList.contains('znl-form'))) return true;
            if (f.closest && f.closest('.znl-overlay, [data-zappy-newsletter]')) return true;
            return false;
        }
        function pickContactForm() {
            var candidates = [
                document.querySelector('.contact-form'),
                document.querySelector('form[action*="contact"]'),
                document.querySelector('form#contact'),
                document.querySelector('form#contactForm'),
                document.getElementById('contactForm'),
                document.querySelector('section.contact form'),
                document.querySelector('section#contact form')
            ];
            for (var i = 0; i < candidates.length; i++) {
                if (candidates[i] && !isNewsletterPopupForm(candidates[i])) return candidates[i];
            }
            // Last-resort fallback: first <form> that isn't a newsletter popup form.
            var all = document.querySelectorAll('form');
            for (var j = 0; j < all.length; j++) {
                if (!isNewsletterPopupForm(all[j])) return all[j];
            }
            return null;
        }
        var contactForm = pickContactForm();

        if (!contactForm) {
            console.log('⚠️ Zappy: No contact form found on page');
            return;
        }
        
        console.log('✅ Zappy: Contact form found:', contactForm.className || contactForm.id || 'unnamed form');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate privacy consent checkbox if present (required for GDPR)
        var privacyCheckbox = this.querySelector('.privacy-consent-checkbox');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            zappyNotify('Please accept the Terms & Conditions and Privacy Policy to continue', 'error');
            privacyCheckbox.focus();
            return;
        }

        // Collect form data with multi-value support (checkboxes, multi-selects)
        var formData = new FormData(this);
        var data = {};
        for (var pair of formData.entries()) {
            if (data[pair[0]] !== undefined) {
                if (Array.isArray(data[pair[0]])) data[pair[0]].push(pair[1]);
                else data[pair[0]] = [data[pair[0]], pair[1]];
            } else {
                data[pair[0]] = pair[1];
            }
        }

        // Smart field mapping
        var _coreNameFields = ['name','firstName','first_name','fname','lastName','last_name','lname'];
        var _coreEmailFields = ['email','emailAddress','mail','e-mail'];
        var _corePhoneFields = ['phone','tel','telephone','mobile','cellphone'];
        var _coreMsgFields = ['message','msg','comments','comment','description','details','notes','body','text','inquiry'];
        var _coreSubjectFields = ['subject','topic','regarding','re'];
        var _allCoreFields = [].concat(_coreNameFields, _coreEmailFields, _corePhoneFields, _coreMsgFields, _coreSubjectFields);

        var resolvedName = (data.name || '').trim()
            || [data.firstName || data.first_name || data.fname || '', data.lastName || data.last_name || data.lname || ''].filter(Boolean).join(' ').trim()
            || (data.email || data.emailAddress || data.mail || '').trim()
            || 'Anonymous';
        var resolvedEmail = (data.email || data.emailAddress || data.mail || data['e-mail'] || '').trim();
        var resolvedPhone = data.phone || data.tel || data.telephone || data.mobile || data.cellphone || null;
        var resolvedSubject = data.subject || data.topic || data.regarding || data.re || 'Contact Form Submission';
        var resolvedMessage = (data.message || data.msg || data.comments || data.comment || data.description || data.details || data.body || data.text || data.inquiry || '').trim();
        if (!resolvedMessage) {
            var extraEntries = Object.entries(data).filter(function(e) { return _allCoreFields.indexOf(e[0]) === -1; });
            if (extraEntries.length > 0) {
                resolvedMessage = extraEntries.map(function(e) {
                    var label = e[0].replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim();
                    var val = Array.isArray(e[1]) ? e[1].join(', ') : e[1];
                    return label + ': ' + val;
                }).join('\n');
            } else {
                resolvedMessage = 'Form submission from ' + window.location.pathname;
            }
        }

        var extraFields = {};
        for (var k of Object.keys(data)) {
            if (_allCoreFields.indexOf(k) === -1 && data[k] !== '' && data[k] !== null && data[k] !== undefined) {
                extraFields[k] = data[k];
            }
        }

        // Loading state
        var submitBtn = this.querySelector('button[type="submit"], input[type="submit"]');
        var originalText = submitBtn ? (submitBtn.value || submitBtn.textContent) : '';
        if (submitBtn) {
            if (submitBtn.tagName === 'INPUT') submitBtn.value = 'Sending...';
            else submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        var currentPagePath = window.location.pathname;
        if (window.ZAPPY_CONFIG && window.ZAPPY_CONFIG.currentPagePath) {
            currentPagePath = window.ZAPPY_CONFIG.currentPagePath;
        } else {
            try {
                var p = new URLSearchParams(window.location.search).get('page');
                if (p) currentPagePath = p;
            } catch (ignored) {}
        }

        var theForm = this;
        try {
            console.log('📧 Zappy: Sending contact form to backend API...');
            var apiBase = (window.ZAPPY_API_BASE || 'http://localhost:5001').replace(/\/$/, '');
            var payload = {
                websiteId: 'b765e116-d895-4d86-aafa-64f6a5c43ded',
                name: resolvedName,
                email: resolvedEmail,
                subject: resolvedSubject,
                message: resolvedMessage,
                phone: resolvedPhone,
                currentPagePath: currentPagePath
            };
            if (Object.keys(extraFields).length > 0) {
                payload.extraFields = extraFields;
            }
            var response = await fetch(apiBase + '/api/email/contact-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            var result = await response.json();
            
            if (result.success) {
                console.log('✅ Zappy: Contact form data sent successfully to backend');

                // Thank-you page redirect
                if (result.thankYouPagePath && result.ticketNumber) {
                    var ticketParam = 'ticket=' + encodeURIComponent(result.ticketNumber);
                    var isPreview = window.location.pathname.indexOf('/preview') !== -1;
                    var thankYouUrl;
                    if (isPreview && window.ZAPPY_CONFIG) {
                        var wid = window.ZAPPY_CONFIG.websiteId || 'b765e116-d895-4d86-aafa-64f6a5c43ded';
                        var pt = window.location.pathname.indexOf('fullscreen') !== -1 ? 'preview-fullscreen' : 'preview';
                        thankYouUrl = window.location.origin + '/api/website/' + pt + '/' + wid + '?page=' + encodeURIComponent(result.thankYouPagePath) + '&' + ticketParam;
                        if (window.ZAPPY_CONFIG.authToken) thankYouUrl += '&auth_token=' + encodeURIComponent(window.ZAPPY_CONFIG.authToken);
                    } else {
                        thankYouUrl = result.thankYouPagePath + '?' + ticketParam;
                    }
                    window.location.href = thankYouUrl;
                    return;
                }

                var _siteLang = document.documentElement.lang || '';
                var _isHeSite = _siteLang === 'he' || (_siteLang !== 'ar' && document.documentElement.dir === 'rtl');
                var _isArSite = _siteLang === 'ar';
                var _successFallback = _isHeSite ? 'ההודעה שלך נשלחה בהצלחה! נחזור אליך בהקדם.' : _isArSite ? 'تم إرسال رسالتك بنجاح! سنرد عليك قريبًا.' : 'Thank you for your message! We\'ll get back to you soon.';
                zappyNotify(result.message || _successFallback, 'success');
                theForm.reset();
            } else {
                console.log('⚠️ Zappy: Backend returned error:', result.error);
                var _isHeSiteErr = _siteLang === 'he' || (_siteLang !== 'ar' && document.documentElement.dir === 'rtl');
                var _isArSiteErr = _siteLang === 'ar';
                var _errFallback = _isHeSiteErr ? 'שליחת ההודעה נכשלה. אנא נסו שוב.' : _isArSiteErr ? 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'Failed to send message. Please try again.';
                zappyNotify(result.error || _errFallback, 'error');
            }
        } catch (error) {
            console.error('❌ Zappy: Failed to send to backend API:', error);
            var _isHeSiteNet = _siteLang === 'he' || (_siteLang !== 'ar' && document.documentElement.dir === 'rtl');
            var _isArSiteNet = _siteLang === 'ar';
            var _netFallback = _isHeSiteNet ? 'לא ניתן לשלוח הודעה כרגע. אנא נסו שוב מאוחר יותר.' : _isArSiteNet ? 'لا يمكن إرسال الرسالة الآن. يرجى المحاولة مرة أخرى لاحقًا.' : 'Unable to send message right now. Please try again later.';
            zappyNotify(_netFallback, 'error');
        } finally {
            if (submitBtn) {
                if (submitBtn.tagName === 'INPUT') submitBtn.value = originalText;
                else submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
        }, true);

        console.log('✅ Zappy: Contact form API integration initialized');
    } // End of initContactFormIntegration
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactFormIntegration);
    } else {
        initContactFormIntegration();
    }
})();

;

/* ZAPPY_COURSES_ECOM_TEXT_ALIASES_V1 */
(function(){
  'use strict';
  if (window.__zappyCoursesEcomAliases) return;
  window.__zappyCoursesEcomAliases = 1;
  var ALIASES = {
    products: 'coursesNav',
    featuredProducts: 'featuredCourses',
    searchProducts: 'searchCourses',
    noFeaturedProducts: 'noFeaturedCourses',
    loadingProducts: 'loadingCourses',
    ourProducts: 'coursesNav',
    backToProducts: 'backToCourses',
    noProducts: 'coursesCatalogEmpty',
    browseFavorites: 'coursesNav'
  };
  if (typeof getEcomText === 'function') {
    var orig = getEcomText;
    window.getEcomText = function(key, fallback) {
      var alias = ALIASES[key];
      if (alias) {
        var translated = orig(alias, null);
        if (translated && translated !== alias && translated.indexOf('ecom_') !== 0) {
          return translated;
        }
      }
      return orig(key, fallback);
    };
  }
})();
/* ZAPPY_COURSES_NAV_PATCH_V1 */
(function(){
  'use strict';
  if (window.__zappyCoursesNavPatch) return;
  window.__zappyCoursesNavPatch = 1;
  var CATALOG = '/courses';
  function patchDom() {
    document.querySelectorAll('a[href="/products"], a[href="/products/"]').forEach(function(a) {
      a.setAttribute('href', CATALOG);
    });
    document.querySelectorAll('.nav-search-input, #mobile-search-input, #nav-search-input').forEach(function(input) {
      var ph = (input.getAttribute('placeholder') || '').toLowerCase();
      if (ph.indexOf('product') !== -1 || ph.indexOf('מוצר') !== -1) {
        input.setAttribute('placeholder', typeof getEcomText === 'function'
          ? getEcomText('searchCourses', 'Search courses...')
          : 'Search courses...');
      }
    });
  }
  if (location.pathname === '/products' || location.pathname === '/products/') {
    var q = location.search || '';
    location.replace(CATALOG + q);
    return;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchDom);
  } else {
    patchDom();
  }
})();

;

/* ZAPPY_COURSES_STOREFRONT_V1 */
(function() {
  'use strict';
  if (window.__zappyCoursesRuntime) return;
  window.__zappyCoursesRuntime = 1;

  /** Baked storefront dictionary — used when the ecommerce JS block (getEcomText) is absent. */
  var COURSES_ECOM_TEXT = {"ar":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"أضف {count} منتجات إلى السلة","addToCart":"أضف إلى السلة","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"أوافق على","all":"الكل","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"شقة، طابق، رمز المبنى، ملاحظات، إلخ.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"إجمالي الحزمة","callNow":"Call Now","cancel":"Cancel","capacity":"السعة","cart":"Cart","category":"Category","checkout":"الدفع","city":"المدينة","cityRequired":"يرجى إدخال المدينة","color":"اللون","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"متابعة التسوق","continueToHomePage":"Continue to Home Page","countryRegion":"البلد / المنطقة","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"لا توجد دورات متاحة بعد.","coursesCatalogError":"فشل في تحميل الدورات.","coursesCatalogSubtitle":"تصفح مكتبة الدورات الكاملة لدينا.","coursesCatalogTitle":"الدورات","coursesCertificateLoading":"جاري التحقق…","coursesCertificateTitle":"التحقق من الشهادة","coursesDetailEnroll":"التسجيل","coursesDetailResume":"متابعة التعلم","coursesLessonLoading":"جاري تحميل الدرس…","coursesLessonMarkComplete":"تحديد كمكتمل","coursesLessonNext":"التالي","coursesLessonPrev":"السابق","coursesMyLearningEmpty":"لم تسجل في أي دورات بعد.","coursesMyLearningLoading":"جاري تحميل دوراتك…","coursesMyLearningSubtitle":"تابع من حيث توقفت.","coursesMyLearningTitle":"تعلمي","coursesCertCourse":"الدورة","coursesCertDownload":"تحميل","coursesCertError":"فشل في التحقق.","coursesCertInvalid":"لا يمكن التحقق من هذه الشهادة.","coursesCertIssued":"تاريخ الإصدار","coursesCertStudent":"الطالب","coursesCertValid":"تم التحقق","coursesCurriculumEmpty":"المنهج قادم قريباً.","coursesFree":"مجاني","coursesJoinLive":"انضم مباشرة","coursesLessonGate":"سجل في هذه الدورة للوصول إلى هذا الدرس.","coursesLessonLocked":"الدرس مقفل","coursesLessonLoadError":"فشل في تحميل الدرس.","coursesEnrollCta":"عرض الدورة والتسجيل","coursesEnrollmentRevoked":"تسجيلك لم يعد نشطاً.","coursesDripLocked":"هذا الدرس سيتم فتحه وفقاً لجدول زمني.","coursesVideoProcessing":"الفيديو لا يزال قيد المعالجة. تحقق مرة أخرى قريباً.","coursesVideoFailed":"فشل في معالجة الفيديو. يرجى إعادة تحميل فيديو الدرس من Course Studio.","coursesDetailLoading":"جاري التحميل…","coursesDetailInstructor":"المدرب","coursesDetailCurriculum":"المنهج الدراسي","coursesLevelBeginner":"مبتدئ","coursesLevelIntermediate":"متوسط","coursesLevelAdvanced":"متقدم","coursesLessonUnsupported":"نوع الدرس هذا غير مدعوم بعد.","coursesLiveScheduled":"تم جدولة الجلسة المباشرة","coursesPreview":"معاينة","coursesQuizError":"فشل في تحميل الاختبار.","coursesQuizLoading":"جاري تحميل الاختبار…","coursesQuizNone":"لا يوجد اختبار في هذا الدرس.","coursesQuizPassed":"لقد نجحت!","coursesQuizRetry":"حاول مرة أخرى.","coursesQuizSubmit":"إرسال","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"أيام","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"الخصم","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"يرجى إدخال بريد إلكتروني صالح","emailRequired":"يرجى إدخال عنوان البريد الإلكتروني","emptyCart":"السلة فارغة","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"خطأ في تحميل الخيارات","featured":"مميز","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"مجاني","freeAbove":"مجاني فوق","frequentlyBoughtTogether":"يُشترى معًا بشكل متكرر","frequentlyBoughtTogetherSubtitle":"وفّر وقتك واحصل على كل ما تحتاجه","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"الرئيسية","inStock":"متوفر","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"الطول","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"المادة","minimumOrderNotMet":"الحد الأدنى لمبلغ الطلب: {{amount}}. أضف {{remaining}} للمتابعة.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"يرجى إدخال الاسم الكامل","new":"جديد","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"لا توجد خيارات شحن متاحة","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"غير متوفر","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"يرجى إدخال رقم الهاتف","placeOrder":"Place Order","pleaseAcceptTerms":"يرجى الموافقة على الشروط والأحكام","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"متابعة الدفع","productDetails":"تفاصيل المنتج","productNotFound":"Product not found","products":"المنتجات","profileUpdated":"Profile updated successfully","quantity":"الكمية","relatedProducts":"منتجات ذات صلة","remove":"إزالة","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"تخفيضات","saveAddressForNextTime":"احفظ هذا العنوان للمرة القادمة","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"الشحن","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"يرجى اختيار طريقة الشحن","signInHere":"Sign in here","size":"الحجم","sku":"رمز المنتج","specifications":"المواصفات","startingAt":"ابتداءً من","stateProvince":"الولاية / المحافظة","stateRequired":"يرجى اختيار الولاية / المحافظة","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"معلومات إضافية","street":"Street Address","streetAndNumber":"الشارع والرقم","streetRequired":"يرجى إدخال عنوان الشارع","style":"الطراز","subtotal":"المجموع الفرعي","termsAndConditions":"الشروط والأحكام","thankYouOrder":"Thank you for your order","total":"المجموع","totalToPay":"المبلغ الإجمالي المستحق","transactionDate":"Transaction Date","upsellFree":"مجاناً","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"شامل ضريبة القيمة المضافة","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"عرض التفاصيل","viewOrder":"View Order","weight":"الوزن","work":"Work","yourCart":"سلتك","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"الرمز البريدي"},"bg":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Добави {count} продукта в количката","addToCart":"Добави в количката","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Съгласен съм с","all":"Всички","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Апартамент, етаж, код на сграда, бележки и др.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Общо за комплекта","callNow":"Call Now","cancel":"Cancel","capacity":"Капацитет","cart":"Cart","category":"Category","checkout":"Поръчка","city":"Град","cityRequired":"Моля, въведете града си","color":"Цвят","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Продължи пазаруването","continueToHomePage":"Continue to Home Page","countryRegion":"Държава / Регион","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Все още няма налични курсове.","coursesCatalogError":"Неуспешно зареждане на курсовете.","coursesCatalogSubtitle":"Разгледайте пълната ни библиотека от курсове.","coursesCatalogTitle":"Курсове","coursesCertificateLoading":"Проверява се…","coursesCertificateTitle":"Проверка на сертификат","coursesDetailEnroll":"Записване","coursesDetailResume":"Продължи обучението","coursesLessonLoading":"Зарежда се урок…","coursesLessonMarkComplete":"Маркирай като завършен","coursesLessonNext":"Следващ","coursesLessonPrev":"Предишен","coursesMyLearningEmpty":"Все още не сте записани в никакви курсове.","coursesMyLearningLoading":"Зареждат се вашите курсове…","coursesMyLearningSubtitle":"Продължете от там, където спряхте.","coursesMyLearningTitle":"Моето обучение","coursesCertCourse":"Курс","coursesCertDownload":"Изтегли","coursesCertError":"Верификацията неуспешна.","coursesCertInvalid":"Този сертификат не може да бъде верифициран.","coursesCertIssued":"Издаден","coursesCertStudent":"Студент","coursesCertValid":"Верифициран","coursesCurriculumEmpty":"Учебната програма идва скоро.","coursesFree":"Безплатно","coursesJoinLive":"Присъедини се на живо","coursesLessonGate":"Запишете се в този курс, за да получите достъп до този урок.","coursesLessonLocked":"Урокът е заключен","coursesLessonLoadError":"Неуспешно зареждане на урока.","coursesEnrollCta":"Вижте курса и се запишете","coursesEnrollmentRevoked":"Вашата регистрация вече не е активна.","coursesDripLocked":"Този урок се отключва по график.","coursesVideoProcessing":"Видеото все още се обработва. Проверете отново скоро.","coursesVideoFailed":"Обработката на видеото неуспешна. Моля, качете отново видеото на урока от Course Studio.","coursesDetailLoading":"Зарежда се…","coursesDetailInstructor":"Инструктор","coursesDetailCurriculum":"Учебна програма","coursesLevelBeginner":"Начинаещ","coursesLevelIntermediate":"Средно ниво","coursesLevelAdvanced":"Напреднал","coursesLessonUnsupported":"Този тип урок все още не се поддържа.","coursesLiveScheduled":"Планирана е сесия на живо","coursesPreview":"Преглед","coursesQuizError":"Неуспешно зареждане на теста.","coursesQuizLoading":"Зарежда се тест…","coursesQuizNone":"Няма тест за този урок.","coursesQuizPassed":"Успяхте!","coursesQuizRetry":"Опитайте отново.","coursesQuizSubmit":"Изпрати","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"дни","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Отстъпка","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Моля, въведете валиден имейл адрес","emailRequired":"Моля, въведете имейл адреса си","emptyCart":"Количката ви е празна","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Грешка при зареждане на опциите","featured":"Препоръчани","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"БЕЗПЛАТНО","freeAbove":"Безплатно над","frequentlyBoughtTogether":"Често купувани заедно","frequentlyBoughtTogetherSubtitle":"Спестете време и вземете всичко необходимо","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Начало","inStock":"В наличност","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Дължина","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Материал","minimumOrderNotMet":"Минимална сума на поръчката: {{amount}}. Добавете още {{remaining}}, за да продължите.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Моля, въведете пълното си име","new":"Нови","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Няма налични опции за доставка","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Изчерпан","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Моля, въведете телефонния си номер","placeOrder":"Place Order","pleaseAcceptTerms":"Моля, приемете общите условия","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Към плащане","productDetails":"Детайли за продукта","productNotFound":"Product not found","products":"Продукти","profileUpdated":"Profile updated successfully","quantity":"Количество","relatedProducts":"Свързани продукти","remove":"Премахни","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Намаление","saveAddressForNextTime":"Запази този адрес за следващия път","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Доставка","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Моля, изберете метод за доставка","signInHere":"Sign in here","size":"Размер","sku":"Артикул","specifications":"Спецификации","startingAt":"От","stateProvince":"Област / Провинция","stateRequired":"Моля, изберете област / провинция","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Допълнителна информация","street":"Street Address","streetAndNumber":"Улица и номер","streetRequired":"Моля, въведете адреса си","style":"Стил","subtotal":"Междинна сума","termsAndConditions":"Общите условия","thankYouOrder":"Thank you for your order","total":"Общо","totalToPay":"Общо за плащане","transactionDate":"Transaction Date","upsellFree":"Безплатно","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"Включително ДДС","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Виж детайли","viewOrder":"View Order","weight":"Тегло","work":"Work","yourCart":"Вашата количка","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Пощенски код"},"de":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"{count} Artikel in den Warenkorb","addToCart":"In den Warenkorb","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Ich akzeptiere die","all":"Alle","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Wohnung, Etage, Gebäudecode, Hinweise usw.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Bundle-Gesamtsumme","callNow":"Call Now","cancel":"Cancel","capacity":"Kapazität","cart":"Cart","category":"Category","checkout":"Zur Kasse","city":"Stadt","cityRequired":"Bitte geben Sie Ihre Stadt ein","color":"Farbe","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Weiter einkaufen","continueToHomePage":"Continue to Home Page","countryRegion":"Land / Region","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Noch keine Kurse verfügbar.","coursesCatalogError":"Kurse konnten nicht geladen werden.","coursesCatalogSubtitle":"Durchsuchen Sie unsere vollständige Kursbibliothek.","coursesCatalogTitle":"Kurse","coursesCertificateLoading":"Überprüfung läuft…","coursesCertificateTitle":"Zertifikat-Verifizierung","coursesDetailEnroll":"Einschreiben","coursesDetailResume":"Lernen fortsetzen","coursesLessonLoading":"Lektion wird geladen…","coursesLessonMarkComplete":"Als abgeschlossen markieren","coursesLessonNext":"Weiter","coursesLessonPrev":"Zurück","coursesMyLearningEmpty":"Sie haben sich noch für keinen Kurs eingeschrieben.","coursesMyLearningLoading":"Ihre Kurse werden geladen…","coursesMyLearningSubtitle":"Setzen Sie dort fort, wo Sie aufgehört haben.","coursesMyLearningTitle":"Mein Lernen","coursesCertCourse":"Kurs","coursesCertDownload":"Herunterladen","coursesCertError":"Verifizierung fehlgeschlagen.","coursesCertInvalid":"Dieses Zertifikat konnte nicht verifiziert werden.","coursesCertIssued":"Ausgestellt","coursesCertStudent":"Student","coursesCertValid":"Verifiziert","coursesCurriculumEmpty":"Lehrplan folgt in Kürze.","coursesFree":"Kostenlos","coursesJoinLive":"Live beitreten","coursesLessonGate":"Melden Sie sich für diesen Kurs an, um auf diese Lektion zuzugreifen.","coursesLessonLocked":"Lektion gesperrt","coursesLessonLoadError":"Lektion konnte nicht geladen werden.","coursesEnrollCta":"Kurs ansehen & einschreiben","coursesEnrollmentRevoked":"Ihre Einschreibung ist nicht mehr aktiv.","coursesDripLocked":"Diese Lektion wird nach einem Zeitplan freigeschaltet.","coursesVideoProcessing":"Video wird noch verarbeitet. Schauen Sie bald wieder vorbei.","coursesVideoFailed":"Videoverarbeitung fehlgeschlagen. Bitte laden Sie das Lektionsvideo erneut aus dem Course Studio hoch.","coursesDetailLoading":"Lädt…","coursesDetailInstructor":"Dozent","coursesDetailCurriculum":"Lehrplan","coursesLevelBeginner":"Anfänger","coursesLevelIntermediate":"Fortgeschritten","coursesLevelAdvanced":"Experte","coursesLessonUnsupported":"Dieser Lektionstyp wird noch nicht unterstützt.","coursesLiveScheduled":"Live-Session geplant","coursesPreview":"Vorschau","coursesQuizError":"Quiz konnte nicht geladen werden.","coursesQuizLoading":"Quiz wird geladen…","coursesQuizNone":"Kein Quiz in dieser Lektion.","coursesQuizPassed":"Sie haben bestanden!","coursesQuizRetry":"Erneut versuchen.","coursesQuizSubmit":"Absenden","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"Tage","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Rabatt","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Bitte geben Sie eine gültige E-Mail-Adresse ein","emailRequired":"Bitte geben Sie Ihre E-Mail-Adresse ein","emptyCart":"Ihr Warenkorb ist leer","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Fehler beim Laden der Optionen","featured":"Empfohlen","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"KOSTENLOS","freeAbove":"Kostenlos ab","frequentlyBoughtTogether":"Oft zusammen gekauft","frequentlyBoughtTogetherSubtitle":"Sparen Sie Zeit und holen Sie sich alles, was Sie brauchen","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Startseite","inStock":"Auf Lager","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Länge","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Material","minimumOrderNotMet":"Mindestbestellwert: {{amount}}. Fügen Sie noch {{remaining}} hinzu, um fortzufahren.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Bitte geben Sie Ihren vollständigen Namen ein","new":"Neu","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Keine Versandoptionen verfügbar","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Nicht verfügbar","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Bitte geben Sie Ihre Telefonnummer ein","placeOrder":"Place Order","pleaseAcceptTerms":"Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Zur Kasse gehen","productDetails":"Produktdetails","productNotFound":"Product not found","products":"Produkte","profileUpdated":"Profile updated successfully","quantity":"Menge","relatedProducts":"Ähnliche Produkte","remove":"Entfernen","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Sale","saveAddressForNextTime":"Diese Adresse für das nächste Mal speichern","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Versand","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Bitte wählen Sie eine Versandart","signInHere":"Sign in here","size":"Größe","sku":"Art.-Nr.","specifications":"Spezifikationen","startingAt":"Ab","stateProvince":"Bundesland / Provinz","stateRequired":"Bitte wählen Sie ein Bundesland / Provinz","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Zusätzliche Informationen","street":"Street Address","streetAndNumber":"Straße und Hausnummer","streetRequired":"Bitte geben Sie Ihre Straßenadresse ein","style":"Stil","subtotal":"Zwischensumme","termsAndConditions":"Allgemeinen Geschäftsbedingungen","thankYouOrder":"Thank you for your order","total":"Gesamt","totalToPay":"Gesamtbetrag","transactionDate":"Transaction Date","upsellFree":"Gratis","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"Inkl. MwSt.","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Details ansehen","viewOrder":"View Order","weight":"Gewicht","work":"Work","yourCart":"Ihr Warenkorb","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Postleitzahl"},"el":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Προσθήκη {count} προϊόντων στο καλάθι","addToCart":"Προσθήκη στο καλάθι","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Συμφωνώ με τους","all":"Όλα","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Διαμέρισμα, όροφος, κωδικός κτιρίου, σημειώσεις κτλ.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Σύνολο πακέτου","callNow":"Call Now","cancel":"Cancel","capacity":"Χωρητικότητα","cart":"Cart","category":"Category","checkout":"Ταμείο","city":"Πόλη","cityRequired":"Παρακαλώ εισάγετε την πόλη σας","color":"Χρώμα","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Συνέχεια αγορών","continueToHomePage":"Continue to Home Page","countryRegion":"Χώρα / Περιοχή","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Δεν υπάρχουν ακόμη διαθέσιμα μαθήματα.","coursesCatalogError":"Αποτυχία φόρτωσης μαθημάτων.","coursesCatalogSubtitle":"Περιηγηθείτε στην πλήρη βιβλιοθήκη μαθημάτων μας.","coursesCatalogTitle":"Μαθήματα","coursesCertificateLoading":"Επαλήθευση…","coursesCertificateTitle":"Επαλήθευση Πιστοποιητικού","coursesDetailEnroll":"Εγγραφή","coursesDetailResume":"Συνέχεια μάθησης","coursesLessonLoading":"Φόρτωση μαθήματος…","coursesLessonMarkComplete":"Σήμανση ως ολοκληρωμένο","coursesLessonNext":"Επόμενο","coursesLessonPrev":"Προηγούμενο","coursesMyLearningEmpty":"Δεν έχετε εγγραφεί σε κανένα μάθημα ακόμα.","coursesMyLearningLoading":"Φόρτωση των μαθημάτων σας…","coursesMyLearningSubtitle":"Συνεχίστε από εκεί που σταματήσατε.","coursesMyLearningTitle":"Η Μάθησή Μου","coursesCertCourse":"Μάθημα","coursesCertDownload":"Λήψη","coursesCertError":"Η επαλήθευση απέτυχε.","coursesCertInvalid":"Αυτό το πιστοποιητικό δεν μπόρεσε να επαληθευτεί.","coursesCertIssued":"Εκδόθηκε","coursesCertStudent":"Μαθητής","coursesCertValid":"Επαληθευμένο","coursesCurriculumEmpty":"Το πρόγραμμα σπουδών έρχεται σύντομα.","coursesFree":"Δωρεάν","coursesJoinLive":"Συμμετοχή ζωντανά","coursesLessonGate":"Εγγραφείτε σε αυτό το μάθημα για να αποκτήσετε πρόσβαση σε αυτό το μάθημα.","coursesLessonLocked":"Μάθημα κλειδωμένο","coursesLessonLoadError":"Αποτυχία φόρτωσης μαθήματος.","coursesEnrollCta":"Δείτε το μάθημα και εγγραφείτε","coursesEnrollmentRevoked":"Η εγγραφή σας δεν είναι πλέον ενεργή.","coursesDripLocked":"Αυτό το μάθημα ξεκλειδώνει σύμφωνα με το πρόγραμμα.","coursesVideoProcessing":"Το βίντεο εξακολουθεί να επεξεργάζεται. Ελέγξτε ξανά σύντομα.","coursesVideoFailed":"Η επεξεργασία του βίντεο απέτυχε. Παρακαλώ ανεβάστε ξανά το βίντεο του μαθήματος από το Course Studio.","coursesDetailLoading":"Φόρτωση…","coursesDetailInstructor":"Εκπαιδευτής","coursesDetailCurriculum":"Πρόγραμμα Σπουδών","coursesLevelBeginner":"Αρχάριος","coursesLevelIntermediate":"Μεσαίο Επίπεδο","coursesLevelAdvanced":"Προχωρημένο","coursesLessonUnsupported":"Αυτός ο τύπος μαθήματος δεν υποστηρίζεται ακόμη.","coursesLiveScheduled":"Προγραμματισμένη ζωντανή συνεδρία","coursesPreview":"Προεπισκόπηση","coursesQuizError":"Αποτυχία φόρτωσης κουίζ.","coursesQuizLoading":"Φόρτωση κουίζ…","coursesQuizNone":"Δεν υπάρχει κουίζ σε αυτό το μάθημα.","coursesQuizPassed":"Περάσατε!","coursesQuizRetry":"Δοκιμάστε ξανά.","coursesQuizSubmit":"Υποβολή","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"ημέρες","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Έκπτωση","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email","emailRequired":"Παρακαλώ εισάγετε τη διεύθυνση email σας","emptyCart":"Το καλάθι σας είναι άδειο","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Σφάλμα φόρτωσης επιλογών","featured":"Επιλεγμένα","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"ΔΩΡΕΑΝ","freeAbove":"Δωρεάν άνω των","frequentlyBoughtTogether":"Συχνά αγοράζονται μαζί","frequentlyBoughtTogetherSubtitle":"Εξοικονομήστε χρόνο και αποκτήστε ό,τι χρειάζεστε","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Αρχική","inStock":"Διαθέσιμο","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Μήκος","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Υλικό","minimumOrderNotMet":"Ελάχιστο ποσό παραγγελίας: {{amount}}. Προσθέστε {{remaining}} ακόμη για να συνεχίσετε.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Παρακαλώ εισάγετε το πλήρες όνομά σας","new":"Νέα","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Δεν υπάρχουν διαθέσιμες επιλογές αποστολής","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Εξαντλημένο","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Παρακαλώ εισάγετε τον αριθμό τηλεφώνου σας","placeOrder":"Place Order","pleaseAcceptTerms":"Παρακαλώ αποδεχθείτε τους όρους και τις προϋποθέσεις","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Συνέχεια στο ταμείο","productDetails":"Λεπτομέρειες προϊόντος","productNotFound":"Product not found","products":"Προϊόντα","profileUpdated":"Profile updated successfully","quantity":"Ποσότητα","relatedProducts":"Σχετικά προϊόντα","remove":"Αφαίρεση","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Προσφορές","saveAddressForNextTime":"Αποθήκευση αυτής της διεύθυνσης για την επόμενη φορά","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Αποστολή","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Παρακαλώ επιλέξτε μέθοδο αποστολής","signInHere":"Sign in here","size":"Μέγεθος","sku":"Κωδικός","specifications":"Προδιαγραφές","startingAt":"Από","stateProvince":"Νομός / Περιφέρεια","stateRequired":"Παρακαλώ επιλέξτε νομό / περιφέρεια","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Πρόσθετες πληροφορίες","street":"Street Address","streetAndNumber":"Οδός και αριθμός","streetRequired":"Παρακαλώ εισάγετε τη διεύθυνσή σας","style":"Στυλ","subtotal":"Υποσύνολο","termsAndConditions":"Όρους και Προϋποθέσεις","thankYouOrder":"Thank you for your order","total":"Σύνολο","totalToPay":"Σύνολο προς Πληρωμή","transactionDate":"Transaction Date","upsellFree":"Δωρεάν","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"Συμπεριλαμβανομένου ΦΠΑ","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Λεπτομέρειες","viewOrder":"View Order","weight":"Βάρος","work":"Work","yourCart":"Το καλάθι σας","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Ταχυδρομικός κώδικας"},"en":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Add {count} items to cart","addToCart":"Add to Cart","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"I agree to the","all":"All","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Apt, Floor, Building Code, Notes, Etc.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Bundle total","callNow":"Call Now","cancel":"Cancel","capacity":"Capacity","cart":"Cart","category":"Category","checkout":"Checkout","city":"City","cityRequired":"Please enter your city","color":"Color","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Continue Shopping","continueToHomePage":"Continue to Home Page","countryRegion":"Country / Region","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"No courses available yet.","coursesCatalogError":"Failed to load courses.","coursesCatalogSubtitle":"Browse our full course library.","coursesCatalogTitle":"Courses","coursesCertificateLoading":"Verifying…","coursesCertificateTitle":"Certificate Verification","coursesDetailEnroll":"Enroll","coursesDetailResume":"Resume learning","coursesLessonLoading":"Loading lesson…","coursesLessonMarkComplete":"Mark complete","coursesLessonNext":"Next","coursesLessonPrev":"Previous","coursesMyLearningEmpty":"You haven't enrolled in any courses yet.","coursesMyLearningLoading":"Loading your courses…","coursesMyLearningSubtitle":"Continue where you left off.","coursesMyLearningTitle":"My Learning","coursesCertCourse":"Course","coursesCertDownload":"Download","coursesCertError":"Verification failed.","coursesCertInvalid":"This certificate could not be verified.","coursesCertIssued":"Issued","coursesCertStudent":"Student","coursesCertValid":"Verified","coursesCurriculumEmpty":"Curriculum coming soon.","coursesFree":"Free","coursesJoinLive":"Join live","coursesLessonGate":"Enroll in this course to access this lesson.","coursesLessonLocked":"Lesson locked","coursesLessonLoadError":"Failed to load lesson.","coursesEnrollCta":"View course & enroll","coursesEnrollmentRevoked":"Your enrollment is no longer active.","coursesDripLocked":"This lesson unlocks on a schedule.","coursesVideoProcessing":"Video is still processing. Check back soon.","coursesVideoFailed":"Video processing failed. Please re-upload the lesson video from Course Studio.","coursesDetailLoading":"Loading…","coursesDetailInstructor":"Instructor","coursesDetailCurriculum":"Curriculum","coursesLevelBeginner":"Beginner","coursesLevelIntermediate":"Intermediate","coursesLevelAdvanced":"Advanced","coursesLessonUnsupported":"This lesson type is not yet supported.","coursesLiveScheduled":"Live session scheduled","coursesPreview":"Preview","coursesQuizError":"Failed to load quiz.","coursesQuizLoading":"Loading quiz…","coursesQuizNone":"No quiz on this lesson.","coursesQuizPassed":"You passed!","coursesQuizRetry":"Try again.","coursesQuizSubmit":"Submit","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"days","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Discount","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Please enter a valid email address","emailRequired":"Please enter your email address","emptyCart":"Your cart is empty","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Error loading options","featured":"Featured","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"FREE","freeAbove":"Free above","frequentlyBoughtTogether":"Frequently bought together","frequentlyBoughtTogetherSubtitle":"Save time and get everything you need","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Home","inStock":"In Stock","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Length","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Material","minimumOrderNotMet":"Minimum order amount: {{amount}}. Add {{remaining}} more to proceed.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Please enter your full name","new":"New","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"No shipping options available","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Out of Stock","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Please enter your phone number","placeOrder":"Place Order","pleaseAcceptTerms":"Please accept the terms and conditions","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Proceed to Checkout","productDetails":"Product Details","productNotFound":"Product not found","products":"Products","profileUpdated":"Profile updated successfully","quantity":"Quantity","relatedProducts":"Related Products","remove":"Remove","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Sale","saveAddressForNextTime":"Save this address for next time","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Shipping","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Please select a shipping method","signInHere":"Sign in here","size":"Size","sku":"SKU","specifications":"Specifications","startingAt":"Starting at","stateProvince":"State / Province","stateRequired":"Please select a state / province","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Additional Information","street":"Street Address","streetAndNumber":"Street and Number","streetRequired":"Please enter your street address","style":"Style","subtotal":"Subtotal","termsAndConditions":"Terms and Conditions","thankYouOrder":"Thank you for your order","total":"Total","totalToPay":"Total to Pay","transactionDate":"Transaction Date","upsellFree":"Free","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"Including VAT","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"View Details","viewOrder":"View Order","weight":"Weight","work":"Work","yourCart":"Your Cart","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Zip / Postal Code"},"es":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Añadir {count} artículos al carrito","addToCart":"Añadir al carrito","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Acepto los","all":"Todos","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Apt., piso, código de edificio, notas, etc.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Total del paquete","callNow":"Call Now","cancel":"Cancel","capacity":"Capacidad","cart":"Cart","category":"Category","checkout":"Finalizar compra","city":"Ciudad","cityRequired":"Por favor, introduzca su ciudad","color":"Color","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Seguir comprando","continueToHomePage":"Continue to Home Page","countryRegion":"País / Región","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Aún no hay cursos disponibles.","coursesCatalogError":"Error al cargar los cursos.","coursesCatalogSubtitle":"Explora nuestra biblioteca completa de cursos.","coursesCatalogTitle":"Cursos","coursesCertificateLoading":"Verificando…","coursesCertificateTitle":"Verificación de Certificado","coursesDetailEnroll":"Inscribirse","coursesDetailResume":"Continuar aprendiendo","coursesLessonLoading":"Cargando lección…","coursesLessonMarkComplete":"Marcar como completado","coursesLessonNext":"Siguiente","coursesLessonPrev":"Anterior","coursesMyLearningEmpty":"Aún no te has inscrito en ningún curso.","coursesMyLearningLoading":"Cargando tus cursos…","coursesMyLearningSubtitle":"Continúa donde lo dejaste.","coursesMyLearningTitle":"Mi Aprendizaje","coursesCertCourse":"Curso","coursesCertDownload":"Descargar","coursesCertError":"Error en la verificación.","coursesCertInvalid":"Este certificado no pudo ser verificado.","coursesCertIssued":"Emitido","coursesCertStudent":"Estudiante","coursesCertValid":"Verificado","coursesCurriculumEmpty":"Plan de estudios próximamente.","coursesFree":"Gratis","coursesJoinLive":"Unirse en vivo","coursesLessonGate":"Inscríbete en este curso para acceder a esta lección.","coursesLessonLocked":"Lección bloqueada","coursesLessonLoadError":"Error al cargar la lección.","coursesEnrollCta":"Ver curso e inscribirse","coursesEnrollmentRevoked":"Tu inscripción ya no está activa.","coursesDripLocked":"Esta lección se desbloquea según un cronograma.","coursesVideoProcessing":"El video aún se está procesando. Vuelve pronto.","coursesVideoFailed":"El procesamiento del video falló. Por favor, vuelve a subir el video de la lección desde Course Studio.","coursesDetailLoading":"Cargando…","coursesDetailInstructor":"Instructor","coursesDetailCurriculum":"Currículum","coursesLevelBeginner":"Principiante","coursesLevelIntermediate":"Intermedio","coursesLevelAdvanced":"Avanzado","coursesLessonUnsupported":"Este tipo de lección aún no es compatible.","coursesLiveScheduled":"Sesión en vivo programada","coursesPreview":"Vista previa","coursesQuizError":"Error al cargar el cuestionario.","coursesQuizLoading":"Cargando cuestionario…","coursesQuizNone":"No hay cuestionario en esta lección.","coursesQuizPassed":"¡Aprobaste!","coursesQuizRetry":"Intentar de nuevo.","coursesQuizSubmit":"Enviar","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"días","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Descuento","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Por favor, introduzca un correo electrónico válido","emailRequired":"Por favor, introduzca su correo electrónico","emptyCart":"Tu carrito está vacío","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Error al cargar opciones","featured":"Destacados","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"GRATIS","freeAbove":"Gratis a partir de","frequentlyBoughtTogether":"Comprados juntos habitualmente","frequentlyBoughtTogetherSubtitle":"Ahorra tiempo y consigue todo lo que necesitas","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Inicio","inStock":"En stock","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Longitud","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Material","minimumOrderNotMet":"Monto mínimo de pedido: {{amount}}. Agregue {{remaining}} más para continuar.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Por favor, introduzca su nombre completo","new":"Nuevos","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"No hay opciones de envío disponibles","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Agotado","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Por favor, introduzca su número de teléfono","placeOrder":"Place Order","pleaseAcceptTerms":"Por favor, acepte los términos y condiciones","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Proceder al pago","productDetails":"Detalles del producto","productNotFound":"Product not found","products":"Productos","profileUpdated":"Profile updated successfully","quantity":"Cantidad","relatedProducts":"Productos relacionados","remove":"Eliminar","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Ofertas","saveAddressForNextTime":"Guardar esta dirección para la próxima vez","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Envío","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Por favor, seleccione un método de envío","signInHere":"Sign in here","size":"Talla","sku":"SKU","specifications":"Especificaciones","startingAt":"Desde","stateProvince":"Estado / Provincia","stateRequired":"Por favor, seleccione un estado / provincia","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Información adicional","street":"Street Address","streetAndNumber":"Calle y número","streetRequired":"Por favor, introduzca su dirección","style":"Estilo","subtotal":"Subtotal","termsAndConditions":"Términos y Condiciones","thankYouOrder":"Thank you for your order","total":"Total","totalToPay":"Total a Pagar","transactionDate":"Transaction Date","upsellFree":"Gratis","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"IVA incluido","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Ver detalles","viewOrder":"View Order","weight":"Peso","work":"Work","yourCart":"Tu carrito","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Código postal"},"fr":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Ajouter {count} articles au panier","addToCart":"Ajouter au panier","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"J'accepte les","all":"Tout","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Apt., étage, code bâtiment, notes, etc.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Total du lot","callNow":"Call Now","cancel":"Cancel","capacity":"Capacité","cart":"Cart","category":"Category","checkout":"Paiement","city":"Ville","cityRequired":"Veuillez entrer votre ville","color":"Couleur","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Continuer vos achats","continueToHomePage":"Continue to Home Page","countryRegion":"Pays / Région","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Aucun cours disponible pour le moment.","coursesCatalogError":"Échec du chargement des cours.","coursesCatalogSubtitle":"Parcourez notre bibliothèque complète de cours.","coursesCatalogTitle":"Cours","coursesCertificateLoading":"Vérification en cours…","coursesCertificateTitle":"Vérification de certificat","coursesDetailEnroll":"S'inscrire","coursesDetailResume":"Reprendre l'apprentissage","coursesLessonLoading":"Chargement de la leçon…","coursesLessonMarkComplete":"Marquer comme terminé","coursesLessonNext":"Suivant","coursesLessonPrev":"Précédent","coursesMyLearningEmpty":"Vous ne vous êtes encore inscrit à aucun cours.","coursesMyLearningLoading":"Chargement de vos cours…","coursesMyLearningSubtitle":"Continuez là où vous vous êtes arrêté.","coursesMyLearningTitle":"Mon apprentissage","coursesCertCourse":"Cours","coursesCertDownload":"Télécharger","coursesCertError":"Échec de la vérification.","coursesCertInvalid":"Ce certificat n'a pas pu être vérifié.","coursesCertIssued":"Délivré","coursesCertStudent":"Étudiant","coursesCertValid":"Vérifié","coursesCurriculumEmpty":"Programme à venir.","coursesFree":"Gratuit","coursesJoinLive":"Rejoindre en direct","coursesLessonGate":"Inscrivez-vous à ce cours pour accéder à cette leçon.","coursesLessonLocked":"Leçon verrouillée","coursesLessonLoadError":"Échec du chargement de la leçon.","coursesEnrollCta":"Voir le cours et s'inscrire","coursesEnrollmentRevoked":"Votre inscription n'est plus active.","coursesDripLocked":"Cette leçon se débloque selon un calendrier.","coursesVideoProcessing":"La vidéo est encore en cours de traitement. Revenez bientôt.","coursesVideoFailed":"Le traitement de la vidéo a échoué. Veuillez télécharger à nouveau la vidéo de la leçon depuis Course Studio.","coursesDetailLoading":"Chargement…","coursesDetailInstructor":"Instructeur","coursesDetailCurriculum":"Programme","coursesLevelBeginner":"Débutant","coursesLevelIntermediate":"Intermédiaire","coursesLevelAdvanced":"Avancé","coursesLessonUnsupported":"Ce type de leçon n'est pas encore pris en charge.","coursesLiveScheduled":"Session en direct programmée","coursesPreview":"Aperçu","coursesQuizError":"Échec du chargement du quiz.","coursesQuizLoading":"Chargement du quiz…","coursesQuizNone":"Aucun quiz pour cette leçon.","coursesQuizPassed":"Vous avez réussi !","coursesQuizRetry":"Réessayer.","coursesQuizSubmit":"Soumettre","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"jours","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Remise","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Veuillez entrer une adresse e-mail valide","emailRequired":"Veuillez entrer votre adresse e-mail","emptyCart":"Votre panier est vide","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Erreur lors du chargement des options","featured":"En vedette","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"GRATUIT","freeAbove":"Gratuit à partir de","frequentlyBoughtTogether":"Souvent achetés ensemble","frequentlyBoughtTogetherSubtitle":"Gagnez du temps et obtenez tout ce dont vous avez besoin","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Accueil","inStock":"En stock","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Longueur","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Matériau","minimumOrderNotMet":"Montant minimum de commande : {{amount}}. Ajoutez {{remaining}} pour continuer.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Veuillez entrer votre nom complet","new":"Nouveau","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Aucune option de livraison disponible","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Rupture de stock","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Veuillez entrer votre numéro de téléphone","placeOrder":"Place Order","pleaseAcceptTerms":"Veuillez accepter les conditions générales","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Procéder au paiement","productDetails":"Détails du produit","productNotFound":"Product not found","products":"Produits","profileUpdated":"Profile updated successfully","quantity":"Quantité","relatedProducts":"Produits similaires","remove":"Supprimer","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Soldes","saveAddressForNextTime":"Enregistrer cette adresse pour la prochaine fois","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Livraison","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Veuillez sélectionner un mode de livraison","signInHere":"Sign in here","size":"Taille","sku":"Référence","specifications":"Spécifications","startingAt":"À partir de","stateProvince":"État / Province","stateRequired":"Veuillez sélectionner un état / province","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Informations supplémentaires","street":"Street Address","streetAndNumber":"Rue et numéro","streetRequired":"Veuillez entrer votre adresse","style":"Style","subtotal":"Sous-total","termsAndConditions":"Conditions Générales","thankYouOrder":"Thank you for your order","total":"Total","totalToPay":"Total à payer","transactionDate":"Transaction Date","upsellFree":"Gratuit","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"TVA incluse","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Voir les détails","viewOrder":"View Order","weight":"Poids","work":"Work","yourCart":"Votre panier","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Code postal"},"he":{"accountWelcome":"ברוך הבא","addAddress":"הוסף כתובת","addBundleToCart":"הוספת {count} מוצרים לעגלה","addToCart":"הוסף לעגלה","addedToCart":"המוצר נוסף לעגלה!","addedToFavorites":"נוסף למועדפים","addressDeleted":"הכתובת נמחקה","addressLabel":"שם הכתובת","addressSaved":"הכתובת נשמרה בהצלחה","addresses":"כתובות","agreeToTerms":"אני מסכים/ה ל","all":"הכל","alreadyHaveAccount":"כבר יש לך חשבון?","apartment":"דירה, קומה, כניסה","apartmentExt":"דירה, קומה, קוד בניין, הערות וכו'","applyCoupon":"החל","backToProducts":"חזרה למוצרים","browseFavorites":"גלו את כל המוצרים שלנו","bundleTotal":"סה\"כ לעגלה","callNow":"התקשר עכשיו","cancel":"ביטול","capacity":"קיבולת","cart":"עגלת קניות","category":"קטגוריה","checkout":"תשלום","city":"עיר","cityRequired":"נא להזין עיר","color":"צבע","confirmDelete":"האם אתה בטוח שברצונך למחוק?","contactInformation":"פרטי התקשרות","continueShopping":"להמשך קניות","continueToHomePage":"המשך לדף הבית","countryRegion":"מדינה / אזור","couponApplied":"הקופון הוחל בהצלחה!","couponCode":"קוד קופון","couponExpired":"הקופון פג תוקף","couponMinOrder":"סכום הזמנה מינימלי","coursesCatalogEmpty":"אין קורסים זמינים עדיין.","coursesCatalogError":"נכשל בטעינת הקורסים.","coursesCatalogSubtitle":"עיינו בספריית הקורסים המלאה שלנו.","coursesCatalogTitle":"קורסים","coursesCertificateLoading":"מאמת…","coursesCertificateTitle":"אימות תעודה","coursesDetailEnroll":"הרשמה","coursesDetailResume":"המשך ללמוד","coursesLessonLoading":"טוען שיעור…","coursesLessonMarkComplete":"סימון כהושלם","coursesLessonNext":"הבא","coursesLessonPrev":"הקודם","coursesMyLearningEmpty":"עדיין לא נרשמתם לקורסים.","coursesMyLearningLoading":"טוען את הקורסים שלך…","coursesMyLearningSubtitle":"המשיכו מהמקום שבו עצרתם.","coursesMyLearningTitle":"הלמידה שלי","coursesCertCourse":"קורס","coursesCertDownload":"הורדה","coursesCertError":"האימות נכשל.","coursesCertInvalid":"לא ניתן לאמת את התעודה הזו.","coursesCertIssued":"הונפק","coursesCertStudent":"תלמיד","coursesCertValid":"מאומת","coursesCurriculumEmpty":"תכנית הלימודים תגיע בקרוב.","coursesFree":"חינם","coursesJoinLive":"הצטרף בשידור חי","coursesLessonGate":"הירשם לקורס זה כדי לגשת לשיעור זה.","coursesLessonLocked":"השיעור נעול","coursesLessonLoadError":"טעינת השיעור נכשלה.","coursesEnrollCta":"צפה בקורס והירשם","coursesEnrollmentRevoked":"ההרשמה שלך לקורס אינה פעילה יותר.","coursesDripLocked":"שיעור זה ייפתח לפי לוח זמנים.","coursesVideoProcessing":"הסרטון עדיין בעיבוד. נסה שוב בקרוב.","coursesVideoFailed":"עיבוד הסרטון נכשל. העלה מחדש את סרטון השיעור מ-Course Studio.","coursesDetailLoading":"טוען…","coursesDetailInstructor":"מדריך","coursesDetailCurriculum":"תכנית לימודים","coursesLevelBeginner":"מתחיל","coursesLevelIntermediate":"בינוני","coursesLevelAdvanced":"מתקדם","coursesLessonUnsupported":"סוג השיעור הזה עדיין לא נתמך.","coursesLiveScheduled":"מפגש חי מתוזמן","coursesPreview":"תצוגה מקדימה","coursesQuizError":"נכשל בטעינת החידון.","coursesQuizLoading":"טוען חידון...","coursesQuizNone":"אין חידון בשיעור זה.","coursesQuizPassed":"עברת בהצלחה!","coursesQuizRetry":"נסה שוב.","coursesQuizSubmit":"שלח","allCourses":"כל הקורסים","backToCourses":"חזרה לקורסים","coursesNav":"קורסים","featuredCourses":"קורסים מומלצים","loadingCourses":"טוען קורסים...","noFeaturedCourses":"עוד לא נבחרו קורסים מומלצים. צפו בכל הקורסים שלנו!","searchCourses":"חיפוש קורסים","customerInfo":"פרטי לקוח","customerLogin":"התחברות לקוחות","days":"ימים","defaultAddress":"כתובת ברירת מחדל","deleteAddress":"מחק כתובת","discount":"הנחה","editAddress":"ערוך כתובת","editProfile":"עריכת פרופיל","email":"אימייל","emailAddress":"כתובת אימייל","emailInvalid":"כתובת אימייל לא תקינה","emailRequired":"נא להזין כתובת אימייל","emptyCart":"העגלה ריקה","enterCode":"הזן את הקוד שנשלח לאימייל שלך","enterCouponCode":"הזן קוד קופון","enterEmail":"הזן את כתובת האימייל שלך ונשלח לך קוד התחברות","errorLoading":"שגיאה בטעינת האפשרויות","featured":"מומלצים","featuredCategories":"קנו לפי קטגוריה","featuredProducts":"מוצרים מומלצים","free":"חינם","freeAbove":"חינם מעל","frequentlyBoughtTogether":"לרכוש יחד","frequentlyBoughtTogetherSubtitle":"הוספת מוצרים נלווים לעגלה","fullName":"שם מלא","haveCouponCode":"יש לי קוד קופון","home":"דף הבית","inStock":"במלאי","inquiryAbout":"פנייה בנושא","invalidCoupon":"קוד קופון לא תקין","items":"פריטים","length":"אורך","linkCopied":"הקישור הועתק!","loadingOrder":"טוען פרטי הזמנה...","loadingPayment":"טוען אפשרויות תשלום...","loadingProducts":"טוען מוצרים...","loadingShipping":"טוען שיטות משלוח...","loggedInAs":"מחובר כ:","login":"התחברות","loginHere":"התחבר כאן","loginToFavorite":"יש להתחבר כדי לשמור מועדפים","logout":"התנתק","material":"חומר","minimumOrderNotMet":"סכום מינימום להזמנה: {{amount}}. יש להוסיף עוד {{remaining}} כדי להמשיך.","mobileNumber":"מספר טלפון","myAccount":"החשבון שלי","myFavorites":"המועדפים שלי","name":"שם","nameRequired":"נא להזין שם מלא","new":"חדשים","next":"הבא","noAddresses":"אין כתובות שמורות","noFavorites":"אין עדיין מוצרים מועדפים","noFeaturedProducts":"עוד לא נבחרו מוצרים מומלצים. צפו בכל המוצרים שלנו!","noOrders":"אין עדיין הזמנות","noProducts":"אין מוצרים להצגה כרגע","noShippingMethods":"אין אפשרויות משלוח זמינות","notLoggedIn":"לא מחובר","orderConfirmation":"אישור הזמנה נשלח לאימייל שלך","orderDate":"תאריך","orderDetails":"פרטי ההזמנה","orderItems":"פריטים בהזמנה","orderNotFound":"לא נמצאה הזמנה","orderNumber":"מספר הזמנה","orderProcessing":"ההזמנה שלך בטיפול. נעדכן אותך כשהמשלוח יצא לדרך.","orderStatus":"סטטוס","orderSuccess":"ההזמנה התקבלה!","orderSummary":"סיכום הזמנה","orderTotal":"סה\"כ","other":"אחר","ourProducts":"המוצרים שלנו","outOfStock":"אזל מהמלאי","paidAmount":"סכום ששולם","payment":"תשלום","paymentMethod":"אמצעי תשלום","paymentNotConfigured":"תשלום מקוון לא מוגדר","personalDetails":"פרטים אישיים","phone":"טלפון","phoneRequired":"נא להזין מספר טלפון","placeOrder":"בצע הזמנה","pleaseAcceptTerms":"נא לאשר את תנאי השימוש","pleaseLogin":"יש להתחבר כדי לצפות בחשבון","pleaseSelect":"נא לבחור","proceedToCheckout":"המשך לתשלום","productDetails":"פרטי המוצר","productNotFound":"המוצר לא נמצא","products":"מוצרים","profileUpdated":"הפרופיל עודכן בהצלחה","quantity":"כמות","relatedProducts":"מוצרים דומים","remove":"הסר","removeCoupon":"הסר","removeFromFavorites":"הסר ממועדפים","removedFromFavorites":"הוסר מהמועדפים","returnPolicy":"מדיניות החזרות","sale":"מבצעים","saveAddressForNextTime":"שמור את הכתובת לפעם הבאה","saveChanges":"שמור שינויים","saveToFavorites":"שמור למועדפים","saving":"שומר...","searchProducts":"חיפוש מוצרים","selectVariant":"בחר אפשרות","sendCode":"שלח קוד","sendInquiry":"שלח פנייה","setAsDefault":"הגדר כברירת מחדל","shareProduct":"שתף מוצר","shipping":"משלוח","shippingAddress":"כתובת למשלוח","shippingMethod":"שיטת משלוח","shippingRequired":"נא לבחור שיטת משלוח","signInHere":"התחבר כאן","size":"גודל","sku":"מק\"ט","specifications":"מפרט טכני","startingAt":"החל מ","stateProvince":"מדינה / מחוז","stateRequired":"נא לבחור מדינה / מחוז","statusCancelled":"בוטל","statusDelivered":"נמסר","statusPaid":"שולם","statusPending":"ממתין לתשלום","statusProcessing":"בטיפול","statusShipped":"נשלח","storeNote":"מידע נוסף","street":"רחוב ומספר","streetAndNumber":"רחוב ומספר","streetRequired":"נא להזין רחוב ומספר","style":"סגנון","subtotal":"סכום ביניים","termsAndConditions":"תנאי השימוש","thankYouOrder":"תודה על ההזמנה","total":"סה\"כ","totalToPay":"סה\"כ לתשלום","transactionDate":"תאריך עסקה","upsellFree":"חינם","variantUnavailable":"לא זמין","vat":"מע\"מ","vatIncluded":"כולל מע\"מ","verificationCode":"קוד אימות","verify":"אמת","viewAllResults":"הצג את כל התוצאות","viewDetails":"לפרטים נוספים","viewOrder":"צפה בהזמנה","weight":"משקל","work":"עבודה","yourCart":"העגלה שלך","yourOrders":"ההזמנות שלך","zip":"מיקוד","zipPostal":"מיקוד"},"it":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Aggiungi {count} articoli al carrello","addToCart":"Aggiungi al carrello","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Accetto i","all":"Tutti","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Appt., piano, codice edificio, note, ecc.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Totale bundle","callNow":"Call Now","cancel":"Cancel","capacity":"Capacità","cart":"Cart","category":"Category","checkout":"Cassa","city":"Città","cityRequired":"Inserisci la tua città","color":"Colore","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Continua lo shopping","continueToHomePage":"Continue to Home Page","countryRegion":"Paese / Regione","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Nessun corso ancora disponibile.","coursesCatalogError":"Impossibile caricare i corsi.","coursesCatalogSubtitle":"Sfoglia la nostra libreria completa di corsi.","coursesCatalogTitle":"Corsi","coursesCertificateLoading":"Verifica in corso…","coursesCertificateTitle":"Verifica Certificato","coursesDetailEnroll":"Iscriviti","coursesDetailResume":"Riprendi l'apprendimento","coursesLessonLoading":"Caricamento lezione…","coursesLessonMarkComplete":"Segna come completato","coursesLessonNext":"Successivo","coursesLessonPrev":"Precedente","coursesMyLearningEmpty":"Non ti sei ancora iscritto a nessun corso.","coursesMyLearningLoading":"Caricamento dei tuoi corsi…","coursesMyLearningSubtitle":"Continua da dove avevi lasciato.","coursesMyLearningTitle":"Il Mio Apprendimento","coursesCertCourse":"Corso","coursesCertDownload":"Scarica","coursesCertError":"Verifica fallita.","coursesCertInvalid":"Questo certificato non può essere verificato.","coursesCertIssued":"Rilasciato","coursesCertStudent":"Studente","coursesCertValid":"Verificato","coursesCurriculumEmpty":"Programma in arrivo.","coursesFree":"Gratuito","coursesJoinLive":"Partecipa dal vivo","coursesLessonGate":"Iscriviti a questo corso per accedere a questa lezione.","coursesLessonLocked":"Lezione bloccata","coursesLessonLoadError":"Impossibile caricare la lezione.","coursesEnrollCta":"Visualizza corso e iscriviti","coursesEnrollmentRevoked":"La tua iscrizione non è più attiva.","coursesDripLocked":"Questa lezione si sblocca secondo un programma.","coursesVideoProcessing":"Il video è ancora in elaborazione. Ricontrolla presto.","coursesVideoFailed":"Elaborazione video fallita. Si prega di ricaricare il video della lezione da Course Studio.","coursesDetailLoading":"Caricamento…","coursesDetailInstructor":"Istruttore","coursesDetailCurriculum":"Programma","coursesLevelBeginner":"Principiante","coursesLevelIntermediate":"Intermedio","coursesLevelAdvanced":"Avanzato","coursesLessonUnsupported":"Questo tipo di lezione non è ancora supportato.","coursesLiveScheduled":"Sessione dal vivo programmata","coursesPreview":"Anteprima","coursesQuizError":"Impossibile caricare il quiz.","coursesQuizLoading":"Caricamento quiz…","coursesQuizNone":"Nessun quiz per questa lezione.","coursesQuizPassed":"Hai superato!","coursesQuizRetry":"Riprova.","coursesQuizSubmit":"Invia","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"giorni","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Sconto","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Inserisci un indirizzo email valido","emailRequired":"Inserisci il tuo indirizzo email","emptyCart":"Il tuo carrello è vuoto","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Errore nel caricamento delle opzioni","featured":"In evidenza","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"GRATUITA","freeAbove":"Gratuita sopra","frequentlyBoughtTogether":"Spesso acquistati insieme","frequentlyBoughtTogetherSubtitle":"Risparmia tempo e prendi tutto ciò che ti serve","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Home","inStock":"Disponibile","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Lunghezza","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Materiale","minimumOrderNotMet":"Importo minimo dell'ordine: {{amount}}. Aggiungi altri {{remaining}} per procedere.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Inserisci il tuo nome completo","new":"Novità","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Nessuna opzione di spedizione disponibile","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Esaurito","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Inserisci il tuo numero di telefono","placeOrder":"Place Order","pleaseAcceptTerms":"Si prega di accettare i termini e le condizioni","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Procedi al pagamento","productDetails":"Dettagli prodotto","productNotFound":"Product not found","products":"Prodotti","profileUpdated":"Profile updated successfully","quantity":"Quantità","relatedProducts":"Prodotti correlati","remove":"Rimuovi","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Saldi","saveAddressForNextTime":"Salva questo indirizzo per la prossima volta","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Spedizione","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Seleziona un metodo di spedizione","signInHere":"Sign in here","size":"Taglia","sku":"Codice","specifications":"Specifiche","startingAt":"A partire da","stateProvince":"Stato / Provincia","stateRequired":"Seleziona uno stato / provincia","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Informazioni aggiuntive","street":"Street Address","streetAndNumber":"Via e numero","streetRequired":"Inserisci il tuo indirizzo","style":"Stile","subtotal":"Subtotale","termsAndConditions":"Termini e Condizioni","thankYouOrder":"Thank you for your order","total":"Totale","totalToPay":"Totale da Pagare","transactionDate":"Transaction Date","upsellFree":"Gratis","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"IVA inclusa","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Vedi dettagli","viewOrder":"View Order","weight":"Peso","work":"Work","yourCart":"Il tuo carrello","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"CAP"},"ja":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"{count} 点をカートに追加","addToCart":"カートに追加","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"私は同意します","all":"すべて","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"部屋番号、階、建物コード、備考など","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"セット合計","callNow":"Call Now","cancel":"Cancel","capacity":"容量","cart":"Cart","category":"Category","checkout":"お会計","city":"市区町村","cityRequired":"市区町村を入力してください","color":"色","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"買い物を続ける","continueToHomePage":"Continue to Home Page","countryRegion":"国 / 地域","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"まだコースがありません。","coursesCatalogError":"コースの読み込みに失敗しました。","coursesCatalogSubtitle":"全コースライブラリをご覧ください。","coursesCatalogTitle":"コース","coursesCertificateLoading":"確認中…","coursesCertificateTitle":"証明書の確認","coursesDetailEnroll":"受講する","coursesDetailResume":"学習を再開する","coursesLessonLoading":"レッスンを読み込み中…","coursesLessonMarkComplete":"完了にする","coursesLessonNext":"次へ","coursesLessonPrev":"前へ","coursesMyLearningEmpty":"まだコースに登録していません。","coursesMyLearningLoading":"コースを読み込み中…","coursesMyLearningSubtitle":"中断したところから続けましょう。","coursesMyLearningTitle":"マイラーニング","coursesCertCourse":"コース","coursesCertDownload":"ダウンロード","coursesCertError":"認証に失敗しました。","coursesCertInvalid":"この証明書は認証できませんでした。","coursesCertIssued":"発行日","coursesCertStudent":"受講者","coursesCertValid":"認証済み","coursesCurriculumEmpty":"カリキュラムは近日公開予定です。","coursesFree":"無料","coursesJoinLive":"ライブに参加","coursesLessonGate":"このレッスンにアクセスするには、このコースに登録してください。","coursesLessonLocked":"レッスンはロックされています","coursesLessonLoadError":"レッスンの読み込みに失敗しました。","coursesEnrollCta":"コースを見る・申し込む","coursesEnrollmentRevoked":"あなたの登録は無効になりました。","coursesDripLocked":"このレッスンはスケジュールに従って解除されます。","coursesVideoProcessing":"動画はまだ処理中です。しばらくしてからもう一度確認してください。","coursesVideoFailed":"動画の処理に失敗しました。Course Studioからレッスン動画を再アップロードしてください。","coursesDetailLoading":"読み込み中…","coursesDetailInstructor":"講師","coursesDetailCurriculum":"カリキュラム","coursesLevelBeginner":"初級","coursesLevelIntermediate":"中級","coursesLevelAdvanced":"上級","coursesLessonUnsupported":"このレッスンタイプはまだサポートされていません。","coursesLiveScheduled":"ライブセッション予定","coursesPreview":"プレビュー","coursesQuizError":"クイズの読み込みに失敗しました。","coursesQuizLoading":"クイズを読み込み中…","coursesQuizNone":"このレッスンにはクイズがありません。","coursesQuizPassed":"合格しました！","coursesQuizRetry":"もう一度挑戦する。","coursesQuizSubmit":"提出","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"日","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"割引","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"有効なメールアドレスを入力してください","emailRequired":"メールアドレスを入力してください","emptyCart":"カートは空です","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"オプションの読み込みエラー","featured":"おすすめ","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"無料","freeAbove":"以上で送料無料","frequentlyBoughtTogether":"よく一緒に購入されています","frequentlyBoughtTogetherSubtitle":"必要なものをまとめて手早く揃えましょう","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"ホーム","inStock":"在庫あり","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"長さ","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"素材","minimumOrderNotMet":"最低注文金額: {{amount}}。あと{{remaining}}追加してください。","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"フルネームを入力してください","new":"新着","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"配送オプションがありません","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"在庫切れ","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"電話番号を入力してください","placeOrder":"Place Order","pleaseAcceptTerms":"利用規約に同意してください","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"お会計に進む","productDetails":"商品詳細","productNotFound":"Product not found","products":"商品","profileUpdated":"Profile updated successfully","quantity":"数量","relatedProducts":"関連商品","remove":"削除","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"セール","saveAddressForNextTime":"この住所を次回のために保存","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"送料","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"配送方法を選択してください","signInHere":"Sign in here","size":"サイズ","sku":"商品コード","specifications":"仕様","startingAt":"〜から","stateProvince":"都道府県","stateRequired":"都道府県を選択してください","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"追加情報","street":"Street Address","streetAndNumber":"番地","streetRequired":"住所を入力してください","style":"スタイル","subtotal":"小計","termsAndConditions":"利用規約","thankYouOrder":"Thank you for your order","total":"合計","totalToPay":"お支払い合計","transactionDate":"Transaction Date","upsellFree":"無料","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"税込み","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"詳細を見る","viewOrder":"View Order","weight":"重量","work":"Work","yourCart":"カート","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"郵便番号"},"lt":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Pridėti {count} prekių į krepšelį","addToCart":"Į krepšelį","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Sutinku su","all":"Visi","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Butas, aukštas, pastato kodas, pastabos ir kt.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Rinkinio iš viso","callNow":"Call Now","cancel":"Cancel","capacity":"Talpa","cart":"Cart","category":"Category","checkout":"Apmokėti","city":"Miestas","cityRequired":"Prašome įvesti miestą","color":"Spalva","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Tęsti apsipirkimą","continueToHomePage":"Continue to Home Page","countryRegion":"Šalis / regionas","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Kursų dar nėra.","coursesCatalogError":"Nepavyko įkelti kursų.","coursesCatalogSubtitle":"Naršykite visą mūsų kursų biblioteką.","coursesCatalogTitle":"Kursai","coursesCertificateLoading":"Tikrinama…","coursesCertificateTitle":"Sertifikato patvirtinimas","coursesDetailEnroll":"Registruotis","coursesDetailResume":"Tęsti mokymąsi","coursesLessonLoading":"Kraunama pamoka…","coursesLessonMarkComplete":"Pažymėti kaip baigtą","coursesLessonNext":"Kitas","coursesLessonPrev":"Ankstesnis","coursesMyLearningEmpty":"Dar nesate užsiregistravę į jokius kursus.","coursesMyLearningLoading":"Kraunami jūsų kursai…","coursesMyLearningSubtitle":"Tęskite ten, kur sustojote.","coursesMyLearningTitle":"Mano mokymasis","coursesCertCourse":"Kursas","coursesCertDownload":"Atsisiųsti","coursesCertError":"Patikrinimas nepavyko.","coursesCertInvalid":"Šio sertifikato nepavyko patikrinti.","coursesCertIssued":"Išduotas","coursesCertStudent":"Studentas","coursesCertValid":"Patikrintas","coursesCurriculumEmpty":"Programa bus pateikta netrukus.","coursesFree":"Nemokamas","coursesJoinLive":"Prisijungti prie tiesioginės transliacijos","coursesLessonGate":"Užsiregistruokite į šį kursą, kad galėtumėte pasiekti šią pamoką.","coursesLessonLocked":"Pamoka užrakinta","coursesLessonLoadError":"Nepavyko įkelti pamokos.","coursesEnrollCta":"Peržiūrėti kursą ir registruotis","coursesEnrollmentRevoked":"Jūsų registracija nebegalioja.","coursesDripLocked":"Ši pamoka atsirakins pagal grafiką.","coursesVideoProcessing":"Vaizdo įrašas vis dar apdorojamas. Grįžkite vėliau.","coursesVideoFailed":"Vaizdo įrašo apdorojimas nepavyko. Prašome iš naujo įkelti pamokos vaizdo įrašą iš Course Studio.","coursesDetailLoading":"Kraunama…","coursesDetailInstructor":"Instruktorius","coursesDetailCurriculum":"Programa","coursesLevelBeginner":"Pradedantysis","coursesLevelIntermediate":"Vidutinis","coursesLevelAdvanced":"Pažengęs","coursesLessonUnsupported":"Šis pamokos tipas dar nepalaikomas.","coursesLiveScheduled":"Suplanuotas tiesioginis seansas","coursesPreview":"Peržiūra","coursesQuizError":"Nepavyko įkelti testo.","coursesQuizLoading":"Įkeliamas testas…","coursesQuizNone":"Šioje pamokoje nėra testo.","coursesQuizPassed":"Jūs išlaikėte!","coursesQuizRetry":"Bandyti dar kartą.","coursesQuizSubmit":"Pateikti","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"dienos","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Nuolaida","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Prašome įvesti teisingą el. pašto adresą","emailRequired":"Prašome įvesti el. paštą","emptyCart":"Jūsų krepšelis tuščias","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Klaida įkeliant parinktis","featured":"Rekomenduojami","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"NEMOKAMAS","freeAbove":"Nemokamas nuo","frequentlyBoughtTogether":"Dažnai perkama kartu","frequentlyBoughtTogetherSubtitle":"Sutaupykite laiko ir gaukite viską, ko reikia","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Pagrindinis","inStock":"Yra sandėlyje","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Ilgis","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Medžiaga","minimumOrderNotMet":"Minimali užsakymo suma: {{amount}}. Pridėkite dar {{remaining}}, kad galėtumėte tęsti.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Prašome įvesti vardą ir pavardę","new":"Naujiena","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Pristatymo būdų nėra","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Išparduota","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Prašome įvesti telefono numerį","placeOrder":"Place Order","pleaseAcceptTerms":"Prašome sutikti su taisyklėmis ir sąlygomis","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Pereiti prie apmokėjimo","productDetails":"Prekės detalės","productNotFound":"Product not found","products":"Prekės","profileUpdated":"Profile updated successfully","quantity":"Kiekis","relatedProducts":"Susijusios prekės","remove":"Pašalinti","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Išpardavimas","saveAddressForNextTime":"Išsaugoti šį adresą kitam kartui","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Pristatymas","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Prašome pasirinkti pristatymo būdą","signInHere":"Sign in here","size":"Dydis","sku":"Kodas","specifications":"Specifikacijos","startingAt":"Nuo","stateProvince":"Apskritis / rajonas","stateRequired":"Prašome pasirinkti apskritį / rajoną","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Papildoma informacija","street":"Street Address","streetAndNumber":"Gatvė ir namo numeris","streetRequired":"Prašome įvesti adresą","style":"Stilius","subtotal":"Tarpinė suma","termsAndConditions":"taisyklėmis ir sąlygomis","thankYouOrder":"Thank you for your order","total":"Iš viso","totalToPay":"Iš viso mokėti","transactionDate":"Transaction Date","upsellFree":"Nemokama","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"Įskaitant PVM","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Peržiūrėti","viewOrder":"View Order","weight":"Svoris","work":"Work","yourCart":"Jūsų krepšelis","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Pašto kodas"},"pt":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Adicionar {count} itens ao carrinho","addToCart":"Adicionar ao carrinho","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Eu concordo com os","all":"Todos","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Apto, andar, código do edifício, observações, etc.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Total do pacote","callNow":"Call Now","cancel":"Cancel","capacity":"Capacidade","cart":"Cart","category":"Category","checkout":"Finalizar compra","city":"Cidade","cityRequired":"Por favor, insira sua cidade","color":"Cor","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Continuar comprando","continueToHomePage":"Continue to Home Page","countryRegion":"País / Região","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Ainda não há cursos disponíveis.","coursesCatalogError":"Falha ao carregar cursos.","coursesCatalogSubtitle":"Navegue por nossa biblioteca completa de cursos.","coursesCatalogTitle":"Cursos","coursesCertificateLoading":"Verificando…","coursesCertificateTitle":"Verificação de Certificado","coursesDetailEnroll":"Inscrever-se","coursesDetailResume":"Continuar aprendendo","coursesLessonLoading":"Carregando lição…","coursesLessonMarkComplete":"Marcar como concluído","coursesLessonNext":"Próximo","coursesLessonPrev":"Anterior","coursesMyLearningEmpty":"Você ainda não se inscreveu em nenhum curso.","coursesMyLearningLoading":"Carregando seus cursos…","coursesMyLearningSubtitle":"Continue de onde parou.","coursesMyLearningTitle":"Meu Aprendizado","coursesCertCourse":"Curso","coursesCertDownload":"Baixar","coursesCertError":"Verificação falhou.","coursesCertInvalid":"Este certificado não pôde ser verificado.","coursesCertIssued":"Emitido","coursesCertStudent":"Estudante","coursesCertValid":"Verificado","coursesCurriculumEmpty":"Currículo em breve.","coursesFree":"Grátis","coursesJoinLive":"Participar ao vivo","coursesLessonGate":"Inscreva-se neste curso para acessar esta aula.","coursesLessonLocked":"Lição bloqueada","coursesLessonLoadError":"Falha ao carregar a lição.","coursesEnrollCta":"Ver curso e inscrever-se","coursesEnrollmentRevoked":"Sua inscrição não está mais ativa.","coursesDripLocked":"Esta lição será desbloqueada conforme cronograma.","coursesVideoProcessing":"Vídeo ainda está sendo processado. Volte em breve.","coursesVideoFailed":"Falha no processamento do vídeo. Por favor, faça o upload novamente do vídeo da aula no Course Studio.","coursesDetailLoading":"Carregando…","coursesDetailInstructor":"Instrutor","coursesDetailCurriculum":"Currículo","coursesLevelBeginner":"Iniciante","coursesLevelIntermediate":"Intermediário","coursesLevelAdvanced":"Avançado","coursesLessonUnsupported":"Este tipo de aula ainda não é suportado.","coursesLiveScheduled":"Sessão ao vivo agendada","coursesPreview":"Visualizar","coursesQuizError":"Falha ao carregar quiz.","coursesQuizLoading":"Carregando quiz…","coursesQuizNone":"Nenhum quiz nesta aula.","coursesQuizPassed":"Você passou!","coursesQuizRetry":"Tente novamente.","coursesQuizSubmit":"Enviar","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"dias","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Desconto","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Por favor, insira um e-mail válido","emailRequired":"Por favor, insira seu e-mail","emptyCart":"Seu carrinho está vazio","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Erro ao carregar opções","featured":"Destaques","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"GRÁTIS","freeAbove":"Grátis acima de","frequentlyBoughtTogether":"Frequentemente comprados juntos","frequentlyBoughtTogetherSubtitle":"Economize tempo e leve tudo o que precisa","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Início","inStock":"Em estoque","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Comprimento","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Material","minimumOrderNotMet":"Valor mínimo do pedido: {{amount}}. Adicione mais {{remaining}} para continuar.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Por favor, insira seu nome completo","new":"Novidades","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Nenhuma opção de envio disponível","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Esgotado","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Por favor, insira seu telefone","placeOrder":"Place Order","pleaseAcceptTerms":"Por favor, aceite os termos e condições","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Ir para o pagamento","productDetails":"Detalhes do produto","productNotFound":"Product not found","products":"Produtos","profileUpdated":"Profile updated successfully","quantity":"Quantidade","relatedProducts":"Produtos relacionados","remove":"Remover","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Promoção","saveAddressForNextTime":"Salvar este endereço para a próxima vez","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Envio","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Por favor, selecione um método de envio","signInHere":"Sign in here","size":"Tamanho","sku":"Código","specifications":"Especificações","startingAt":"A partir de","stateProvince":"Estado / Província","stateRequired":"Por favor, selecione um estado / província","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Informações adicionais","street":"Street Address","streetAndNumber":"Rua e número","streetRequired":"Por favor, insira seu endereço","style":"Estilo","subtotal":"Subtotal","termsAndConditions":"Termos e Condições","thankYouOrder":"Thank you for your order","total":"Total","totalToPay":"Total a Pagar","transactionDate":"Transaction Date","upsellFree":"Grátis","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"IVA incluído","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Ver detalhes","viewOrder":"View Order","weight":"Peso","work":"Work","yourCart":"Seu carrinho","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"CEP / Código Postal"},"ru":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"Добавить {count} товаров в корзину","addToCart":"В корзину","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Я соглашаюсь с","all":"Все","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Кв., этаж, код дома, заметки и т.д.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Итого набор","callNow":"Call Now","cancel":"Cancel","capacity":"Объем","cart":"Cart","category":"Category","checkout":"Оформить заказ","city":"Город","cityRequired":"Пожалуйста, введите город","color":"Цвет","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Продолжить покупки","continueToHomePage":"Continue to Home Page","countryRegion":"Страна / Регион","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Курсы пока недоступны.","coursesCatalogError":"Не удалось загрузить курсы.","coursesCatalogSubtitle":"Просмотрите нашу полную библиотеку курсов.","coursesCatalogTitle":"Курсы","coursesCertificateLoading":"Проверка…","coursesCertificateTitle":"Проверка сертификата","coursesDetailEnroll":"Записаться","coursesDetailResume":"Продолжить обучение","coursesLessonLoading":"Загрузка урока…","coursesLessonMarkComplete":"Отметить как завершенный","coursesLessonNext":"Далее","coursesLessonPrev":"Назад","coursesMyLearningEmpty":"Вы еще не записались ни на один курс.","coursesMyLearningLoading":"Загрузка ваших курсов…","coursesMyLearningSubtitle":"Продолжите с того места, где остановились.","coursesMyLearningTitle":"Мое обучение","coursesCertCourse":"Курс","coursesCertDownload":"Скачать","coursesCertError":"Проверка не удалась.","coursesCertInvalid":"Этот сертификат не удалось проверить.","coursesCertIssued":"Выдан","coursesCertStudent":"Студент","coursesCertValid":"Проверен","coursesCurriculumEmpty":"Программа курса скоро появится.","coursesFree":"Бесплатно","coursesJoinLive":"Присоединиться к прямому эфиру","coursesLessonGate":"Запишитесь на этот курс, чтобы получить доступ к этому уроку.","coursesLessonLocked":"Урок заблокирован","coursesLessonLoadError":"Не удалось загрузить урок.","coursesEnrollCta":"Посмотреть курс и записаться","coursesEnrollmentRevoked":"Ваша регистрация больше не активна.","coursesDripLocked":"Этот урок откроется по расписанию.","coursesVideoProcessing":"Видео все еще обрабатывается. Проверьте позже.","coursesVideoFailed":"Обработка видео не удалась. Пожалуйста, повторно загрузите видео урока из Course Studio.","coursesDetailLoading":"Загрузка…","coursesDetailInstructor":"Инструктор","coursesDetailCurriculum":"Учебная программа","coursesLevelBeginner":"Начинающий","coursesLevelIntermediate":"Средний","coursesLevelAdvanced":"Продвинутый","coursesLessonUnsupported":"Этот тип урока пока не поддерживается.","coursesLiveScheduled":"Запланирована прямая трансляция","coursesPreview":"Предварительный просмотр","coursesQuizError":"Не удалось загрузить тест.","coursesQuizLoading":"Загрузка теста…","coursesQuizNone":"В этом уроке нет теста.","coursesQuizPassed":"Вы прошли тест!","coursesQuizRetry":"Попробовать снова.","coursesQuizSubmit":"Отправить","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"дней","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"Скидка","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Пожалуйста, введите корректный email","emailRequired":"Пожалуйста, введите ваш email","emptyCart":"Корзина пуста","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Ошибка загрузки вариантов","featured":"Рекомендуемые","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"БЕСПЛАТНО","freeAbove":"Бесплатно от","frequentlyBoughtTogether":"Часто покупают вместе","frequentlyBoughtTogetherSubtitle":"Экономьте время и получите все необходимое","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Главная","inStock":"В наличии","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Длина","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Материал","minimumOrderNotMet":"Минимальная сумма заказа: {{amount}}. Добавьте ещё {{remaining}} для продолжения.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Пожалуйста, введите ваше полное имя","new":"Новинки","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Варианты доставки недоступны","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Нет в наличии","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Пожалуйста, введите номер телефона","placeOrder":"Place Order","pleaseAcceptTerms":"Пожалуйста, примите условия использования","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Перейти к оплате","productDetails":"Описание товара","productNotFound":"Product not found","products":"Товары","profileUpdated":"Profile updated successfully","quantity":"Количество","relatedProducts":"Похожие товары","remove":"Удалить","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"Распродажа","saveAddressForNextTime":"Сохранить этот адрес на будущее","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Доставка","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Пожалуйста, выберите способ доставки","signInHere":"Sign in here","size":"Размер","sku":"Артикул","specifications":"Характеристики","startingAt":"От","stateProvince":"Штат / Область","stateRequired":"Пожалуйста, выберите штат / область","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Дополнительная информация","street":"Street Address","streetAndNumber":"Улица и номер","streetRequired":"Пожалуйста, введите адрес","style":"Стиль","subtotal":"Подытог","termsAndConditions":"Условиями использования","thankYouOrder":"Thank you for your order","total":"Итого","totalToPay":"Итого к оплате","transactionDate":"Transaction Date","upsellFree":"Бесплатно","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"Включая НДС","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Подробнее","viewOrder":"View Order","weight":"Вес","work":"Work","yourCart":"Ваша корзина","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Почтовый индекс"},"th":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"เพิ่ม {count} รายการลงตะกร้า","addToCart":"เพิ่มลงตะกร้า","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"ฉันยอมรับ","all":"ทั้งหมด","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"ห้อง, ชั้น, รหัสอาคาร, หมายเหตุ ฯลฯ","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"ยอดรวมแพ็กเกจ","callNow":"Call Now","cancel":"Cancel","capacity":"ความจุ","cart":"Cart","category":"Category","checkout":"ชำระเงิน","city":"จังหวัด","cityRequired":"กรุณากรอกจังหวัด","color":"สี","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"เลือกซื้อสินค้าต่อ","continueToHomePage":"Continue to Home Page","countryRegion":"ประเทศ / ภูมิภาค","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"ยังไม่มีคอร์สเรียนที่พร้อมใช้งาน","coursesCatalogError":"โหลดคอร์สเรียนไม่สำเร็จ","coursesCatalogSubtitle":"เรียนดูคอร์สเรียนทั้งหมดของเรา","coursesCatalogTitle":"คอร์สเรียน","coursesCertificateLoading":"กำลังตรวจสอบ…","coursesCertificateTitle":"การตรวจสอบใบประกาศนียบัตร","coursesDetailEnroll":"ลงทะเบียนเรียน","coursesDetailResume":"เรียนต่อ","coursesLessonLoading":"กำลังโหลดบทเรียน…","coursesLessonMarkComplete":"ทำเครื่องหมายว่าเสร็จสิ้น","coursesLessonNext":"ถัดไป","coursesLessonPrev":"ก่อนหน้า","coursesMyLearningEmpty":"คุณยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ","coursesMyLearningLoading":"กำลังโหลดคอร์สของคุณ…","coursesMyLearningSubtitle":"เรียนต่อจากจุดที่คุณหยุดไว้","coursesMyLearningTitle":"การเรียนของฉัน","coursesCertCourse":"คอร์สเรียน","coursesCertDownload":"ดาวน์โหลด","coursesCertError":"การตรวจสอบไม่สำเร็จ","coursesCertInvalid":"ไม่สามารถตรวจสอบใบประกาศนียบัตรนี้ได้","coursesCertIssued":"ออกให้เมื่อ","coursesCertStudent":"นักเรียน","coursesCertValid":"ตรวจสอบแล้ว","coursesCurriculumEmpty":"หลักสูตรจะเปิดให้เร็วๆ นี้","coursesFree":"ฟรี","coursesJoinLive":"เข้าร่วมสด","coursesLessonGate":"ลงทะเบียนเรียนคอร์สนี้เพื่อเข้าถึงบทเรียนนี้","coursesLessonLocked":"บทเรียนถูกล็อค","coursesLessonLoadError":"ไม่สามารถโหลดบทเรียนได้","coursesEnrollCta":"ดูคอร์สและลงทะเบียน","coursesEnrollmentRevoked":"การลงทะเบียนของคุณไม่ได้ใช้งานอีกต่อไป","coursesDripLocked":"บทเรียนนี้จะปลดล็อคตามกำหนดการ","coursesVideoProcessing":"วิดีโอยังอยู่ระหว่างการประมวลผล กรุณาตรวจสอบอีกครั้งในภายหลัง","coursesVideoFailed":"การประมวลผลวิดีโอล้มเหลว กรุณาอัปโหลดวิดีโอบทเรียนใหม่จาก Course Studio","coursesDetailLoading":"กำลังโหลด…","coursesDetailInstructor":"ผู้สอน","coursesDetailCurriculum":"หลักสูตร","coursesLevelBeginner":"ผู้เริ่มต้น","coursesLevelIntermediate":"ระดับกลาง","coursesLevelAdvanced":"ระดับสูง","coursesLessonUnsupported":"ประเภทบทเรียนนี้ยังไม่รองรับ","coursesLiveScheduled":"กำหนดการเรียนสดแล้ว","coursesPreview":"ดูตัวอย่าง","coursesQuizError":"โหลดแบบทดสอบไม่สำเร็จ","coursesQuizLoading":"กำลังโหลดแบบทดสอบ…","coursesQuizNone":"ไม่มีแบบทดสอบในบทเรียนนี้","coursesQuizPassed":"คุณผ่านแล้ว!","coursesQuizRetry":"ลองใหม่อีกครั้ง","coursesQuizSubmit":"ส่งคำตอบ","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"วัน","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"ส่วนลด","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"กรุณากรอกอีเมลที่ถูกต้อง","emailRequired":"กรุณากรอกอีเมล","emptyCart":"ตะกร้าของคุณว่างเปล่า","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"เกิดข้อผิดพลาดในการโหลดตัวเลือก","featured":"แนะนำ","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"ฟรี","freeAbove":"ฟรีเมื่อซื้อครบ","frequentlyBoughtTogether":"มักซื้อด้วยกัน","frequentlyBoughtTogetherSubtitle":"ประหยัดเวลาและได้ทุกอย่างที่คุณต้องการ","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"หน้าแรก","inStock":"มีสินค้า","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"ความยาว","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"วัสดุ","minimumOrderNotMet":"ยอดสั่งซื้อขั้นต่ำ: {{amount}} กรุณาเพิ่มอีก {{remaining}} เพื่อดำเนินการต่อ","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"กรุณากรอกชื่อ-นามสกุล","new":"ใหม่","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"ไม่มีตัวเลือกการจัดส่ง","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"สินค้าหมด","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"กรุณากรอกเบอร์โทรศัพท์","placeOrder":"Place Order","pleaseAcceptTerms":"กรุณายอมรับข้อกำหนดและเงื่อนไข","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"ดำเนินการชำระเงิน","productDetails":"รายละเอียดสินค้า","productNotFound":"Product not found","products":"สินค้า","profileUpdated":"Profile updated successfully","quantity":"จำนวน","relatedProducts":"สินค้าที่เกี่ยวข้อง","remove":"ลบ","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"ลดราคา","saveAddressForNextTime":"บันทึกที่อยู่นี้สำหรับครั้งหน้า","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"การจัดส่ง","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"กรุณาเลือกวิธีการจัดส่ง","signInHere":"Sign in here","size":"ขนาด","sku":"รหัสสินค้า","specifications":"ข้อมูลจำเพาะ","startingAt":"เริ่มต้นที่","stateProvince":"จังหวัด / รัฐ","stateRequired":"กรุณาเลือกจังหวัด / รัฐ","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"ข้อมูลเพิ่มเติม","street":"Street Address","streetAndNumber":"ถนนและเลขที่","streetRequired":"กรุณากรอกที่อยู่","style":"สไตล์","subtotal":"ยอดรวมย่อย","termsAndConditions":"ข้อกำหนดและเงื่อนไข","thankYouOrder":"Thank you for your order","total":"รวม","totalToPay":"ยอดรวมที่ต้องชำระ","transactionDate":"Transaction Date","upsellFree":"ฟรี","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"รวม VAT","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"ดูรายละเอียด","viewOrder":"View Order","weight":"น้ำหนัก","work":"Work","yourCart":"ตะกร้าของคุณ","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"รหัสไปรษณีย์"},"tr":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"{count} ürünü sepete ekle","addToCart":"Sepete Ekle","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"Kabul ediyorum","all":"Tümü","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"Daire, kat, bina kodu, notlar vb.","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"Paket toplamı","callNow":"Call Now","cancel":"Cancel","capacity":"Kapasite","cart":"Cart","category":"Category","checkout":"Ödeme","city":"Şehir","cityRequired":"Lütfen şehrinizi girin","color":"Renk","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"Alışverişe Devam Et","continueToHomePage":"Continue to Home Page","countryRegion":"Ülke / Bölge","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"Henüz mevcut kurs yok.","coursesCatalogError":"Kurslar yüklenemedi.","coursesCatalogSubtitle":"Tüm kurs kütüphanemizi inceleyin.","coursesCatalogTitle":"Kurslar","coursesCertificateLoading":"Doğrulanıyor…","coursesCertificateTitle":"Sertifika Doğrulama","coursesDetailEnroll":"Kayıt Ol","coursesDetailResume":"Öğrenmeye devam et","coursesLessonLoading":"Ders yükleniyor…","coursesLessonMarkComplete":"Tamamlandı olarak işaretle","coursesLessonNext":"Sonraki","coursesLessonPrev":"Önceki","coursesMyLearningEmpty":"Henüz hiçbir kursa kayıt olmadınız.","coursesMyLearningLoading":"Kurslarınız yükleniyor…","coursesMyLearningSubtitle":"Kaldığınız yerden devam edin.","coursesMyLearningTitle":"Öğrenimim","coursesCertCourse":"Kurs","coursesCertDownload":"İndir","coursesCertError":"Doğrulama başarısız.","coursesCertInvalid":"Bu sertifika doğrulanamadı.","coursesCertIssued":"Verildi","coursesCertStudent":"Öğrenci","coursesCertValid":"Doğrulandı","coursesCurriculumEmpty":"Müfredat yakında gelecek.","coursesFree":"Ücretsiz","coursesJoinLive":"Canlı katıl","coursesLessonGate":"Bu derse erişmek için kursa kaydolun.","coursesLessonLocked":"Ders kilitli","coursesLessonLoadError":"Ders yüklenemedi.","coursesEnrollCta":"Kursu görüntüle ve kaydol","coursesEnrollmentRevoked":"Kaydınız artık aktif değil.","coursesDripLocked":"Bu ders programlı olarak açılacak.","coursesVideoProcessing":"Video hala işleniyor. Kısa süre sonra tekrar kontrol edin.","coursesVideoFailed":"Video işleme başarısız oldu. Lütfen ders videosunu Course Studio'dan yeniden yükleyin.","coursesDetailLoading":"Yükleniyor…","coursesDetailInstructor":"Eğitmen","coursesDetailCurriculum":"Müfredat","coursesLevelBeginner":"Başlangıç","coursesLevelIntermediate":"Orta","coursesLevelAdvanced":"İleri","coursesLessonUnsupported":"Bu ders türü henüz desteklenmiyor.","coursesLiveScheduled":"Canlı oturum planlandı","coursesPreview":"Önizleme","coursesQuizError":"Quiz yüklenemedi.","coursesQuizLoading":"Quiz yükleniyor…","coursesQuizNone":"Bu derste quiz yok.","coursesQuizPassed":"Başardınız!","coursesQuizRetry":"Tekrar dene.","coursesQuizSubmit":"Gönder","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"gün","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"İndirim","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"Lütfen geçerli bir e-posta adresi girin","emailRequired":"Lütfen e-posta adresinizi girin","emptyCart":"Sepetiniz boş","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"Seçenekler yüklenirken hata oluştu","featured":"Öne Çıkanlar","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"ÜCRETSİZ","freeAbove":"Ücretsiz kargo","frequentlyBoughtTogether":"Sıkça birlikte alınanlar","frequentlyBoughtTogetherSubtitle":"Zamandan kazanın ve ihtiyacınız olan her şeyi alın","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"Ana Sayfa","inStock":"Stokta","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"Uzunluk","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"Malzeme","minimumOrderNotMet":"Minimum sipariş tutarı: {{amount}}. Devam etmek için {{remaining}} daha ekleyin.","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"Lütfen tam adınızı girin","new":"Yeni","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"Kargo seçeneği bulunmuyor","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"Stokta Yok","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"Lütfen telefon numaranızı girin","placeOrder":"Place Order","pleaseAcceptTerms":"Lütfen şartları ve koşulları kabul edin","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"Ödemeye Geç","productDetails":"Ürün Detayları","productNotFound":"Product not found","products":"Ürünler","profileUpdated":"Profile updated successfully","quantity":"Adet","relatedProducts":"İlgili Ürünler","remove":"Kaldır","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"İndirim","saveAddressForNextTime":"Bu adresi bir sonraki sefer için kaydet","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"Kargo","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"Lütfen bir kargo yöntemi seçin","signInHere":"Sign in here","size":"Beden","sku":"Stok Kodu","specifications":"Teknik Özellikler","startingAt":"Başlayan fiyat","stateProvince":"Eyalet / İl","stateRequired":"Lütfen bir eyalet / il seçin","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"Ek Bilgiler","street":"Street Address","streetAndNumber":"Sokak ve numara","streetRequired":"Lütfen adresinizi girin","style":"Stil","subtotal":"Ara Toplam","termsAndConditions":"Şartlar ve Koşullar","thankYouOrder":"Thank you for your order","total":"Toplam","totalToPay":"Ödenecek Toplam","transactionDate":"Transaction Date","upsellFree":"Ücretsiz","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"KDV Dahil","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"Detayları Gör","viewOrder":"View Order","weight":"Ağırlık","work":"Work","yourCart":"Sepetiniz","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"Posta Kodu"},"zh":{"accountWelcome":"Welcome","addAddress":"Add Address","addBundleToCart":"将 {count} 件商品加入购物车","addToCart":"加入购物车","addedToCart":"Product added to cart!","addedToFavorites":"Added to favorites","addressDeleted":"Address deleted","addressLabel":"Address Label","addressSaved":"Address saved successfully","addresses":"Addresses","agreeToTerms":"我同意","all":"全部","alreadyHaveAccount":"Already have an account?","apartment":"Apt, Floor, Unit","apartmentExt":"公寓、楼层、建筑代码、备注等。","applyCoupon":"Apply","backToProducts":"Back to Products","browseFavorites":"Discover all our products","bundleTotal":"组合总计","callNow":"Call Now","cancel":"Cancel","capacity":"容量","cart":"Cart","category":"Category","checkout":"结账","city":"城市","cityRequired":"请输入您的城市","color":"颜色","confirmDelete":"Are you sure you want to delete?","contactInformation":"Contact Information","continueShopping":"继续购物","continueToHomePage":"Continue to Home Page","countryRegion":"国家 / 地区","couponApplied":"Coupon applied successfully!","couponCode":"Coupon Code","couponExpired":"Coupon has expired","couponMinOrder":"Minimum order amount","coursesCatalogEmpty":"暂无可用课程。","coursesCatalogError":"加载课程失败。","coursesCatalogSubtitle":"浏览我们完整的课程库。","coursesCatalogTitle":"课程","coursesCertificateLoading":"验证中…","coursesCertificateTitle":"证书验证","coursesDetailEnroll":"报名","coursesDetailResume":"继续学习","coursesLessonLoading":"加载课程中…","coursesLessonMarkComplete":"标记完成","coursesLessonNext":"下一个","coursesLessonPrev":"上一个","coursesMyLearningEmpty":"您还没有报名任何课程。","coursesMyLearningLoading":"加载您的课程中…","coursesMyLearningSubtitle":"从上次停下的地方继续。","coursesMyLearningTitle":"我的学习","coursesCertCourse":"课程","coursesCertDownload":"下载","coursesCertError":"验证失败。","coursesCertInvalid":"此证书无法验证。","coursesCertIssued":"颁发时间","coursesCertStudent":"学员","coursesCertValid":"已验证","coursesCurriculumEmpty":"课程大纲即将推出。","coursesFree":"免费","coursesJoinLive":"加入直播","coursesLessonGate":"请注册此课程以访问本课时。","coursesLessonLocked":"课程已锁定","coursesLessonLoadError":"加载课程失败。","coursesEnrollCta":"查看课程并报名","coursesEnrollmentRevoked":"您的注册已失效。","coursesDripLocked":"此课程将按计划解锁。","coursesVideoProcessing":"视频仍在处理中。请稍后再试。","coursesVideoFailed":"视频处理失败。请从课程工作室重新上传课程视频。","coursesDetailLoading":"加载中…","coursesDetailInstructor":"讲师","coursesDetailCurriculum":"课程大纲","coursesLevelBeginner":"初级","coursesLevelIntermediate":"中级","coursesLevelAdvanced":"高级","coursesLessonUnsupported":"暂不支持此课时类型。","coursesLiveScheduled":"直播课程已安排","coursesPreview":"预览","coursesQuizError":"加载测验失败。","coursesQuizLoading":"正在加载测验…","coursesQuizNone":"本课时无测验。","coursesQuizPassed":"您通过了！","coursesQuizRetry":"重新尝试。","coursesQuizSubmit":"提交","allCourses":"All Courses","backToCourses":"Back to courses","coursesNav":"Courses","featuredCourses":"Featured Courses","loadingCourses":"Loading courses...","noFeaturedCourses":"No featured courses yet. Browse our full course library!","searchCourses":"Search courses","customerInfo":"Customer Info","customerLogin":"Customer Login","days":"天","defaultAddress":"Default Address","deleteAddress":"Delete Address","discount":"折扣","editAddress":"Edit Address","editProfile":"Edit Profile","email":"Email","emailAddress":"Email Address","emailInvalid":"请输入有效的电子邮件地址","emailRequired":"请输入您的电子邮件地址","emptyCart":"您的购物车是空的","enterCode":"Enter the code sent to your email","enterCouponCode":"Enter coupon code","enterEmail":"Enter your email and we'll send you a login code","errorLoading":"加载选项时出错","featured":"精选","featuredCategories":"Shop by Category","featuredProducts":"Featured Products","free":"免费","freeAbove":"满额免运费","frequentlyBoughtTogether":"经常一起购买","frequentlyBoughtTogetherSubtitle":"节省时间，一次买齐所需","fullName":"Full Name","haveCouponCode":"I have a coupon code","home":"首页","inStock":"有货","inquiryAbout":"Inquiry about","invalidCoupon":"Invalid coupon code","items":"Items","length":"长度","linkCopied":"Link copied!","loadingOrder":"Loading order details...","loadingPayment":"Loading payment options...","loadingProducts":"Loading products...","loadingShipping":"Loading shipping methods...","loggedInAs":"Logged in as:","login":"Login","loginHere":"Login here","loginToFavorite":"Log in to save favorites","logout":"Logout","material":"材质","minimumOrderNotMet":"最低订单金额：{{amount}}。还需添加 {{remaining}} 才能结账。","mobileNumber":"Mobile Number","myAccount":"My Account","myFavorites":"My Favorites","name":"Name","nameRequired":"请输入您的全名","new":"新品","next":"Next","noAddresses":"No saved addresses","noFavorites":"No favorites yet","noFeaturedProducts":"No featured products yet. Check out all our products!","noOrders":"No orders yet","noProducts":"No products to display","noShippingMethods":"暂无配送方式","notLoggedIn":"Not Logged In","orderConfirmation":"A confirmation email has been sent to you","orderDate":"Date","orderDetails":"Order Details","orderItems":"Order Items","orderNotFound":"Order not found","orderNumber":"Order Number","orderProcessing":"Your order is being processed. We'll notify you when it ships.","orderStatus":"Status","orderSuccess":"Order Received!","orderSummary":"Order Summary","orderTotal":"Total","other":"Other","ourProducts":"Our Products","outOfStock":"缺货","paidAmount":"Amount Paid","payment":"Payment","paymentMethod":"Payment Method","paymentNotConfigured":"Online payment not configured","personalDetails":"Personal Details","phone":"Phone","phoneRequired":"请输入您的电话号码","placeOrder":"Place Order","pleaseAcceptTerms":"请接受条款和条件","pleaseLogin":"Please login to view your account","pleaseSelect":"Please select","proceedToCheckout":"继续结账","productDetails":"商品详情","productNotFound":"Product not found","products":"商品","profileUpdated":"Profile updated successfully","quantity":"数量","relatedProducts":"相关商品","remove":"移除","removeCoupon":"Remove","removeFromFavorites":"Remove from Favorites","removedFromFavorites":"Removed from favorites","returnPolicy":"Return Policy","sale":"促销","saveAddressForNextTime":"保存此地址以备下次使用","saveChanges":"Save Changes","saveToFavorites":"Save to Favorites","saving":"Saving...","searchProducts":"Search products","selectVariant":"Select option","sendCode":"Send Code","sendInquiry":"Send Inquiry","setAsDefault":"Set as Default","shareProduct":"Share Product","shipping":"配送","shippingAddress":"Shipping Address","shippingMethod":"Shipping Method","shippingRequired":"请选择运输方式","signInHere":"Sign in here","size":"尺寸","sku":"货号","specifications":"规格参数","startingAt":"起价","stateProvince":"州 / 省","stateRequired":"请选择州 / 省","statusCancelled":"Cancelled","statusDelivered":"Delivered","statusPaid":"Paid","statusPending":"Pending Payment","statusProcessing":"Processing","statusShipped":"Shipped","storeNote":"附加信息","street":"Street Address","streetAndNumber":"街道和门牌号","streetRequired":"请输入您的街道地址","style":"款式","subtotal":"小计","termsAndConditions":"条款和条件","thankYouOrder":"Thank you for your order","total":"总计","totalToPay":"应付总额","transactionDate":"Transaction Date","upsellFree":"免费","variantUnavailable":"Unavailable","vat":"VAT","vatIncluded":"含税","verificationCode":"Verification Code","verify":"Verify","viewAllResults":"View all results","viewDetails":"查看详情","viewOrder":"View Order","weight":"重量","work":"Work","yourCart":"您的购物车","yourOrders":"Your Orders","zip":"ZIP Code","zipPostal":"邮政编码"}};

  function resolveWebsiteId() {
    return window.ZAPPY_WEBSITE_ID
      || window.zappyWebsiteId
      || (window.ZAPPY_CONFIG && window.ZAPPY_CONFIG.websiteId)
      || (function() {
        var meta = document.querySelector('meta[name="zappy-website-id"]');
        return meta ? meta.getAttribute('content') : null;
      })();
  }

  function resolveApiBase() {
    return (window.ZAPPY_API_BASE || window.zappyApiBase || '').replace(/\/$/, '');
  }

  var WEBSITE_ID = resolveWebsiteId();
  var API_BASE = resolveApiBase();

  /** In preview iframes the logical page lives in ?page=/courses, not pathname. */
  function getEffectivePath() {
    try {
      var sp = new URLSearchParams(window.location.search || '');
      var p = sp.get('page');
      if (p) {
        var decoded = decodeURIComponent(p);
        var qIdx = decoded.indexOf('?');
        return qIdx === -1 ? decoded : decoded.slice(0, qIdx);
      }
    } catch (e0) {}
    var path = location.pathname || '/';
    try {
      var match = path.match(/\/api\/website\/preview(?:-fullscreen)?\/[^\/]+(.*)$/);
      if (match !== null) path = match[1] || '/';
    } catch (e1) {}
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path || '/';
  }

  /** Build in-site links that work in preview (?page=) and on the live domain. */
  function pageUrl(routePath) {
    if (location.pathname.indexOf('/api/website/preview') !== -1) {
      var m = location.pathname.match(/\/api\/website\/(preview(?:-fullscreen)?)\/([^\/]+)/);
      if (m) {
        return '/api/website/' + m[1] + '/' + m[2] + '?page=' + encodeURIComponent(routePath);
      }
    }
    return routePath;
  }

  /** Store return path + navigate to login (preview-safe). */
  function redirectToLogin(returnPath) {
    var target = returnPath || getEffectivePath();
    try { sessionStorage.setItem('zappy_login_return', target); } catch (e) { /* swallow */ }
    location.href = pageUrl('/login');
  }

  function productImageUrl(product) {
    if (product && product.cardImageUrl) return product.cardImageUrl;
    var imgs = product && product.images;
    if (!imgs) return '';
    if (typeof imgs === 'string') return imgs;
    if (Array.isArray(imgs) && imgs.length) {
      var first = imgs[0];
      if (typeof first === 'string') return first;
      if (first && typeof first === 'object') return first.url || first.src || '';
    }
    return '';
  }

  function resolveStorefrontLang() {
    var lang = '';
    if (typeof window.zappyI18n !== 'undefined' && typeof window.zappyI18n.getCurrentLanguage === 'function') {
      lang = window.zappyI18n.getCurrentLanguage() || '';
    }
    if (!lang) lang = document.documentElement.lang || '';
    if (!lang) {
      try { lang = localStorage.getItem('zappy_lang') || ''; } catch (e0) { /* swallow */ }
    }
    return String(lang || 'en').split('-')[0].toLowerCase();
  }

  // Single-source-of-truth i18n lookup: route every user-visible string
  // through getEcomText when the ecommerce block is present, else the baked
  // COURSES_ECOM_TEXT dictionary (same source as ECOM_RUNTIME_TEXT).
  function tx(key, fallback) {
    var bare = (key && key.indexOf('ecom_') === 0) ? key.slice(5) : key;
    if (typeof getEcomText === 'function') {
      try {
        var viaEcom = getEcomText(bare, null);
        if (viaEcom && viaEcom !== bare && viaEcom.indexOf('ecom_') !== 0) return viaEcom;
      } catch (e) { /* swallow */ }
    }
    var lang = resolveStorefrontLang();
    var dict = (COURSES_ECOM_TEXT && (COURSES_ECOM_TEXT[lang] || COURSES_ECOM_TEXT.en)) || {};
    if (dict[bare]) return dict[bare];
    return fallback;
  }

  function api(path, opts) {
    var token = localStorage.getItem('zappy_customer_token_' + WEBSITE_ID) || '';
    var headers = Object.assign({ 'Content-Type': 'application/json' }, (opts && opts.headers) || {});
    if (token) headers.Authorization = 'Bearer ' + token;
    return fetch(API_BASE + path, Object.assign({}, opts || {}, { headers }));
  }

  // ---- /courses ----
  function parseCoursePrice(value) {
    if (value == null || value === '') return null;
    var n = typeof value === 'number' ? value : parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }

  function resolveCurrencySymbol(explicitSymbol) {
    if (explicitSymbol) return explicitSymbol;
    if (window.t && window.t.currency) return window.t.currency;
    if (window.ZAPPY_CONFIG && window.ZAPPY_CONFIG.currencySymbol) return window.ZAPPY_CONFIG.currencySymbol;
    return '₪';
  }

  function formatCoursePrice(course, currencySymbol) {
    var sym = resolveCurrencySymbol(currencySymbol);
    var base = parseCoursePrice(course.price);
    var sale = parseCoursePrice(course.sale_price);
    var effective = (sale != null && base != null && sale < base) ? sale : base;
    if (effective == null || effective <= 0) {
      return { text: tx('ecom_coursesFree', 'Free'), html: false, isFree: true };
    }
    if (sale != null && base != null && sale < base) {
      return {
        text: sym + sale.toFixed(2) + ' <span class="course-price-original">' + sym + base.toFixed(2) + '</span>',
        html: true,
        isFree: false
      };
    }
    return { text: sym + effective.toFixed(2), html: false, isFree: false };
  }

  function buildCourseCartProduct(course, imageUrl) {
    if (!course || !course.id) return null;
    var base = parseCoursePrice(course.price);
    var sale = parseCoursePrice(course.sale_price);
    var effective = (sale != null && base != null && sale < base) ? sale : base;
    return {
      id: course.id,
      name: course.name || '',
      slug: course.slug || course.id,
      price: base != null ? base : (effective || 0),
      sale_price: (sale != null && base != null && sale < base) ? sale : null,
      image: imageUrl || productImageUrl(course),
      images: course.images,
      quantity: 1,
      isCourse: true,
      custom_fields: course.custom_fields || null
    };
  }

  function addCourseProductToCart(course, imageUrl) {
    var line = buildCourseCartProduct(course, imageUrl);
    if (!line) return false;
    if (typeof window.zappyAddToCart === 'function') {
      window.zappyAddToCart(line);
      return true;
    }
    return false;
  }

  function renderCoursePrice(root, course, currencySymbol) {
    var block = root.querySelector('[data-zappy-course-price-block]');
    var el = root.querySelector('[data-zappy-course-price]');
    if (!el) return;
    var info = formatCoursePrice(course, currencySymbol);
    if (info.html) {
      el.innerHTML = info.text;
    } else {
      el.textContent = info.text;
    }
    if (block) block.hidden = false;
    el.classList.toggle('course-detail-price--free', !!info.isFree);
  }

  function truncateBlurb(text, maxLen) {
    var s = stripTags(String(text || '')).trim();
    if (!s) return '';
    if (s.length <= maxLen) return s;
    return s.slice(0, Math.max(0, maxLen - 1)).trim() + '\u2026';
  }

  function renderCatalogCard(product) {
    var img = productImageUrl(product);
    var priceInfo = formatCoursePrice(product, null);
    var priceHtml = priceInfo.html ? priceInfo.text : escapeHtml(priceInfo.text);
    var instructor = product.instructor_name ? escapeHtml(product.instructor_name) : '';
    var blurb = truncateBlurb(product.short_description, 100);
    var coursePath = '/courses/' + encodeURIComponent(product.slug || product.id);
    return '<a class="course-card" href="' + escapeAttr(pageUrl(coursePath)) + '">'
      + '<div class="course-card-media">'
      + (img ? '<img src="' + escapeAttr(img) + '" alt="" loading="lazy" />' : '')
      + '</div>'
      + '<div class="course-card-body">'
      + '<h3 class="course-card-title">' + escapeHtml(product.name || '') + '</h3>'
      + '<p class="course-card-instructor">' + (instructor || '&nbsp;') + '</p>'
      + '<p class="course-card-tagline">' + (blurb ? escapeHtml(blurb) : '&nbsp;') + '</p>'
      + '<div class="course-card-price">' + priceHtml + '</div>'
      + '</div>'
      + '</a>';
  }

  function appendLangParam(url) {
    if (typeof buildApiUrlWithLang === 'function') {
      return buildApiUrlWithLang(url);
    }
    return API_BASE + url;
  }

  function hydrateCatalog() {
    var grid = document.querySelector('[data-zappy-courses-grid]');
    if (!grid || !WEBSITE_ID) {
      if (grid && !WEBSITE_ID) {
        grid.innerHTML = '<p>' + tx('ecom_coursesCatalogError', 'Failed to load courses.') + '</p>';
      }
      return;
    }
    var url = appendLangParam('/api/ecommerce/storefront/products?websiteId=' + encodeURIComponent(WEBSITE_ID));
    fetch(url, { credentials: 'include' })
      .then(function(r) { return r.ok ? r.json() : { success: false, data: [] }; })
      .then(function(payload) {
        var products = (payload && payload.data) || (payload && payload.products) || [];
        if (!products.length) {
          grid.innerHTML = '<p>' + tx('ecom_coursesCatalogEmpty', 'No courses available yet.') + '</p>';
          return;
        }
        grid.innerHTML = products.map(renderCatalogCard).join('');
      })
      .catch(function() {
        grid.innerHTML = '<p>' + tx('ecom_coursesCatalogError', 'Failed to load courses.') + '</p>';
      });
  }

  function hydrateCategoryCatalog() {
    var grid = document.querySelector('[data-zappy-courses-grid]');
    if (!grid || !WEBSITE_ID) return;
    var slug = (getEffectivePath().match(/^\/category\/([^\/]+)$/) || [])[1];
    if (!slug) return hydrateCatalog();
    var title = document.querySelector('[data-zappy-courses-category-title]');
    var description = document.querySelector('[data-zappy-courses-category-description]');
    var url = appendLangParam('/api/ecommerce/storefront/categories/' + encodeURIComponent(slug) + '?websiteId=' + encodeURIComponent(WEBSITE_ID));
    fetch(url, { credentials: 'include' })
      .then(function(r) { return r.ok ? r.json() : { success: false, data: null }; })
      .then(function(payload) {
        var category = payload && payload.data;
        var products = (category && category.products) || [];
        if (title) title.textContent = (category && category.name) || tx('ecom_coursesCatalogTitle', 'Courses');
        if (description) {
          var copy = stripTags((category && category.description) || '').trim();
          if (copy) {
            description.textContent = copy;
            description.hidden = false;
          } else {
            description.textContent = '';
            description.hidden = true;
          }
        }
        if (!products.length) {
          grid.innerHTML = '<p>' + tx('ecom_coursesCatalogEmpty', 'No courses available yet.') + '</p>';
          return;
        }
        grid.innerHTML = products.map(renderCatalogCard).join('');
      })
      .catch(function() {
        grid.innerHTML = '<p>' + tx('ecom_coursesCatalogError', 'Failed to load courses.') + '</p>';
      });
  }

  function parseExternalTrailer(url) {
    if (!url) return null;
    var yt = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/i);
    if (yt) return { kind: 'youtube', id: yt[1] };
    var vm = String(url).match(/vimeo\.com\/(\d+)/i);
    if (vm) return { kind: 'vimeo', id: vm[1] };
    if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: 'video', url: url };
    return { kind: 'link', url: url };
  }

  function hasRenderableTrailer(trailer) {
    if (!trailer) return false;
    if (trailer.type === 'mux') return !!(trailer.playbackUrl || trailer.muxPlaybackId);
    if (trailer.type === 'external') return !!trailer.url;
    return false;
  }

  function setHeroImage(root, heroSrc, trailer) {
    var img = root.querySelector('[data-zappy-course-image]');
    if (!img) return;
    if (hasRenderableTrailer(trailer)) {
      img.hidden = true;
      img.classList.add('is-hidden');
      img.removeAttribute('src');
      return;
    }
    if (heroSrc) {
      img.src = heroSrc;
      img.hidden = false;
      img.classList.remove('is-hidden');
    } else {
      img.hidden = true;
      img.classList.add('is-hidden');
      img.removeAttribute('src');
    }
  }

  function renderCourseFacts(root, course) {
    var el = root.querySelector('[data-zappy-course-facts]');
    if (!el) return;
    var meta = (course.custom_fields && course.custom_fields.course) || {};
    var items = [];
    if (meta.level) {
      var levelLabels = {
        beginner: tx('ecom_coursesLevelBeginner', 'Beginner'),
        intermediate: tx('ecom_coursesLevelIntermediate', 'Intermediate'),
        advanced: tx('ecom_coursesLevelAdvanced', 'Advanced')
      };
      var levelText = levelLabels[meta.level] || meta.level;
      items.push('<li class="course-detail-fact">' + escapeHtml(levelText) + '</li>');
    }
    if (meta.language) {
      items.push('<li class="course-detail-fact">' + escapeHtml(meta.language) + '</li>');
    }
    if (items.length) {
      el.innerHTML = items.join('');
      el.hidden = false;
    } else {
      el.innerHTML = '';
      el.hidden = true;
    }
  }

  function renderInstructorBlock(root, instructor) {
    var iEl = root.querySelector('[data-zappy-course-instructor]');
    if (!iEl) return;
    if (!instructor) {
      iEl.hidden = true;
      iEl.innerHTML = '';
      return;
    }
    var avatar = instructor.avatar_url
      ? '<img class="course-detail-instructor-avatar" src="' + escapeAttr(instructor.avatar_url) + '" alt="" />'
      : '<span class="course-detail-instructor-avatar course-detail-instructor-avatar--placeholder" aria-hidden="true"></span>';
    var bio = instructor.bio
      ? '<p class="course-detail-instructor-bio">' + escapeHtml(stripTags(instructor.bio)) + '</p>'
      : '';
    iEl.innerHTML = avatar
      + '<div class="course-detail-instructor-info">'
      + '<span class="course-detail-instructor-label">' + escapeHtml(tx('ecom_coursesDetailInstructor', 'Instructor')) + '</span>'
      + '<span class="course-detail-instructor-name">' + escapeHtml(instructor.name || '') + '</span>'
      + bio
      + '</div>';
    iEl.hidden = false;
  }

  function renderCourseDescription(root, course) {
    var el = root.querySelector('[data-zappy-course-description]');
    if (!el) return;
    var desc = stripTags(course.description || '').trim();
    if (desc) {
      el.textContent = desc;
      el.hidden = false;
    } else {
      el.textContent = '';
      el.hidden = true;
    }
  }

  function renderCourseTrailer(root, trailer, course) {
    var wrap = root.querySelector('[data-zappy-course-trailer]');
    if (!wrap) return;
    wrap.innerHTML = '';
    wrap.hidden = true;
    if (!hasRenderableTrailer(trailer)) return;
    wrap.hidden = false;

    if (trailer.type === 'mux' && trailer.playbackUrl) {
      ensureMuxPlayerScript()
        .then(function() { return waitForMuxPlayerCustomElement(); })
        .then(function(muxReady) {
          if (muxReady && trailer.muxPlaybackId && trailer.playbackToken) {
            var player = document.createElement('mux-player');
            player.setAttribute('stream-type', 'on-demand');
            player.setAttribute('metadata-video-title', (course && course.name) || '');
            player.setAttribute('src', trailer.playbackUrl);
            if (trailer.posterUrl) player.setAttribute('poster', trailer.posterUrl);
            wrap.appendChild(player);
          } else if (trailer.playbackUrl) {
            var video = document.createElement('video');
            video.controls = true;
            video.playsInline = true;
            video.className = 'course-trailer-fallback';
            video.src = trailer.playbackUrl;
            if (trailer.posterUrl) video.poster = trailer.posterUrl;
            wrap.appendChild(video);
          }
        });
      return;
    }

    if (trailer.type === 'external' && trailer.url) {
      var parsed = parseExternalTrailer(trailer.url);
      if (parsed.kind === 'youtube') {
        wrap.innerHTML = '<iframe class="course-trailer-embed" src="https://www.youtube.com/embed/' + escapeAttr(parsed.id) + '" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      } else if (parsed.kind === 'vimeo') {
        wrap.innerHTML = '<iframe class="course-trailer-embed" src="https://player.vimeo.com/video/' + escapeAttr(parsed.id) + '" title="" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      } else if (parsed.kind === 'video') {
        wrap.innerHTML = '<video class="course-trailer-fallback" controls playsinline src="' + escapeAttr(parsed.url) + '"></video>';
      } else {
        wrap.innerHTML = '<a class="course-trailer-link" href="' + escapeAttr(parsed.url) + '" target="_blank" rel="noopener">' + escapeHtml(trailer.url) + '</a>';
      }
    }
  }

  function applyCourseDetailPayload(root, payload) {
    if (!payload) return;
    var c = payload.course || {};
    var simpleLessonId = payload.simpleLessonId || (c.custom_fields && c.custom_fields.course && c.custom_fields.course.simpleLessonId) || null;
    setText(root, '[data-zappy-course-title]', c.name);
    setText(root, '[data-zappy-course-tagline]', c.short_description || '');
    renderCourseFacts(root, c);
    renderInstructorBlock(root, payload.instructor);
    renderCourseDescription(root, c);
    renderCoursePrice(root, c, payload.currencySymbol);
    var heroSrc = payload.cardImageUrl || productImageUrl(c);
    setHeroImage(root, heroSrc, payload.trailer);

    renderCurriculum(root.querySelector('[data-zappy-course-curriculum]'), payload.modules || [], simpleLessonId);
    renderCourseTrailer(root, payload.trailer, c);
    var body = root.querySelector('[data-zappy-course-body]');
    var hasCurriculum = (payload.modules || []).some(function(m) {
      return (m.lessons || []).some(function(l) { return !simpleLessonId || l.id !== simpleLessonId; });
    });
    if (body) {
      body.hidden = !hasCurriculum;
    }
    var curriculumAside = root.querySelector('.course-detail-curriculum');
    if (curriculumAside && !hasCurriculum) {
      curriculumAside.hidden = true;
    }

    if (payload.enrollment && payload.enrollment.status === 'active') {
      var enrollBtn = root.querySelector('[data-zappy-course-enroll]');
      if (enrollBtn) enrollBtn.hidden = true;
      var resume = root.querySelector('[data-zappy-course-resume]');
      if (resume && payload.resumeLessonId) {
        resume.hidden = false;
        resume.href = pageUrl('/lesson/' + payload.resumeLessonId);
      }
    } else {
      var enroll = root.querySelector('[data-zappy-course-enroll]');
      if (enroll) {
        enroll.addEventListener('click', function() {
          var heroSrc = payload.cardImageUrl || productImageUrl(c);
          if (!addCourseProductToCart(c, heroSrc)) {
            console.warn('[courses] zappyAddToCart unavailable — course was not added to cart');
          }
        });
      }
    }
  }

  function fetchCourseDetailPayload(slug) {
    var qs = '?websiteId=' + encodeURIComponent(WEBSITE_ID);
    var storefrontPath = '/api/ecommerce/storefront/courses/' + encodeURIComponent(slug) + qs;
    var legacyPath = '/api/courses/student/courses/' + encodeURIComponent(slug) + qs;
    return api(storefrontPath)
      .then(function(r) {
        if (r.ok) return r.json();
        if (r.status === 404) {
          return api(legacyPath).then(function(r2) { return r2.ok ? r2.json() : null; });
        }
        return null;
      })
      .then(function(raw) {
        if (!raw) return null;
        return (raw && raw.data) ? raw.data : raw;
      });
  }

  // ---- /courses/:slug ----
  function hydrateCourseDetail() {
    var root = document.querySelector('[data-zappy-course-detail]');
    if (!root) return;
    var slug = (getEffectivePath().match(/^\/courses\/([^\/]+)$/) || [])[1];
    if (!slug) return;

    fetchCourseDetailPayload(slug)
      .then(function(payload) { applyCourseDetailPayload(root, payload); });
  }

  function renderCurriculum(el, modules, simpleLessonId) {
    if (!el) return;
    var visibleModules = (modules || []).map(function(m) {
      return Object.assign({}, m, {
        lessons: (m.lessons || []).filter(function(l) { return !simpleLessonId || l.id !== simpleLessonId; })
      });
    }).filter(function(m) { return (m.lessons || []).length > 0; });
    var hasLessons = visibleModules.length > 0;
    if (!hasLessons) {
      el.innerHTML = '';
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML = '<h2>' + escapeHtml(tx('ecom_coursesDetailCurriculum', 'Curriculum')) + '</h2>'
      + visibleModules.map(function(m) {
      var lessons = (m.lessons || []).map(function(l) {
        var free = l.is_preview ? '<span class="lesson-free">' + tx('ecom_coursesPreview', 'Preview') + '</span>' : '';
        return '<li><a href="' + escapeAttr(pageUrl('/lesson/' + l.id)) + '">' + escapeHtml(l.title || '') + '</a> ' + free + '</li>';
      }).join('');
      return '<details class="curriculum-module" open>'
        + '<summary>' + escapeHtml(m.title || '') + '</summary>'
        + '<ol>' + lessons + '</ol>'
        + '</details>';
    }).join('');
  }

  // ---- /lesson/:id ----
  function lessonContentType(lesson) {
    return lesson.lesson_type || lesson.contentType || lesson.content_type || '';
  }

  function normalizePlaybackPayload(raw) {
    var data = (raw && raw.data) ? raw.data : raw;
    if (!data) return null;
    return {
      lesson: {
        id: data.lessonId,
        title: data.title,
        lesson_type: data.contentType,
        contentType: data.contentType,
        content_md: data.contentMarkdown || '',
        scheduled_at: data.liveScheduledAt,
        instructor_url: data.liveUrl
      },
      courseName: data.courseName || '',
      playbackUrl: data.playbackUrl,
      playbackToken: data.playbackToken,
      muxPlaybackId: data.muxPlaybackId,
      posterUrl: data.posterUrl,
      pdfUrl: data.pdfUrl,
      quizPending: data.quizPending,
      ready: data.ready,
      reason: data.reason,
      errorMessage: data.errorMessage,
      modules: data.modules
    };
  }

  var MUX_PLAYER_SCRIPT = 'https://cdn.jsdelivr.net/npm/@mux/mux-player@3';

  function ensureMuxPlayerScript() {
    if (window.__muxPlayerReady) return window.__muxPlayerReady;
    if (typeof customElements !== 'undefined' && customElements.get('mux-player')) {
      window.__muxPlayerReady = Promise.resolve();
      return window.__muxPlayerReady;
    }
    window.__muxPlayerReady = new Promise(function(resolve) {
      var existing = document.querySelector('script[data-zappy-mux-player]');
      if (existing) {
        existing.addEventListener('load', function() { resolve(); }, { once: true });
        existing.addEventListener('error', function() { resolve(); }, { once: true });
        return;
      }
      var s = document.createElement('script');
      s.src = MUX_PLAYER_SCRIPT;
      s.setAttribute('data-zappy-mux-player', '1');
      s.onload = function() { resolve(); };
      s.onerror = function() { resolve(); };
      document.head.appendChild(s);
    });
    return window.__muxPlayerReady;
  }

  function waitForMuxPlayerCustomElement(timeoutMs) {
    var limit = timeoutMs || 8000;
    if (typeof customElements === 'undefined') return Promise.resolve(false);
    if (customElements.get('mux-player')) return Promise.resolve(true);
    return Promise.race([
      customElements.whenDefined('mux-player').then(function() { return true; }),
      new Promise(function(resolve) { setTimeout(function() { resolve(!!customElements.get('mux-player')); }, limit); })
    ]).catch(function() { return false; });
  }

  function renderMuxVideoPlayer(body, payload) {
    return ensureMuxPlayerScript()
      .then(function() { return waitForMuxPlayerCustomElement(); })
      .then(function(muxReady) {
      body.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'lesson-video';
      var canUseMux = muxReady && (payload.playbackUrl || (payload.muxPlaybackId && payload.playbackToken));
      if (canUseMux) {
        var player = document.createElement('mux-player');
        player.setAttribute('stream-type', 'on-demand');
        if (payload.lesson && payload.lesson.title) {
          player.setAttribute('metadata-video-title', payload.lesson.title);
        }
        if (payload.playbackUrl) {
          // Prefer the fully-signed manifest URL — most reliable across mux-player
          // versions and headless browsers that ignore playback-token hydration.
          player.setAttribute('src', payload.playbackUrl);
        } else {
          player.setAttribute('playback-id', payload.muxPlaybackId);
          player.setAttribute('playback-token', payload.playbackToken);
          player.tokens = { playback: payload.playbackToken };
        }
        if (payload.posterUrl) player.setAttribute('poster', payload.posterUrl);
        wrap.appendChild(player);
      } else if (payload.playbackUrl) {
        var video = document.createElement('video');
        video.controls = true;
        video.playsInline = true;
        video.className = 'lesson-video-fallback';
        video.src = payload.playbackUrl;
        if (payload.posterUrl) video.poster = payload.posterUrl;
        wrap.appendChild(video);
      } else {
        wrap.innerHTML = '<p>' + tx('ecom_coursesVideoProcessing', 'Video is still processing. Check back soon.') + '</p>';
      }
      body.appendChild(wrap);
    });
  }

  function clearLessonLoadingTitles(root) {
    setText(root, '[data-zappy-lesson-title]', '');
    setText(root, '[data-zappy-lesson-course-title]', '');
  }

  function hydrateLessonPlayer() {
    var root = document.querySelector('[data-zappy-lesson-player]');
    if (!root) return;
    var lessonId = (getEffectivePath().match(/^\/lesson\/([^\/]+)$/) || [])[1];
    if (!lessonId) return;

    api('/api/courses/student/lessons/' + encodeURIComponent(lessonId) + '/playback')
      .then(function(r) {
        return r.json().then(function(body) {
          return { status: r.status, ok: r.ok, body: body || {} };
        }).catch(function() {
          return { status: r.status, ok: r.ok, body: {} };
        });
      })
      .then(function(res) {
        if (!res) return;
        var code = res.body && res.body.code;
        if (res.status === 401 || code === 'AUTH_REQUIRED') {
          redirectToLogin();
          return;
        }
        if (res.status === 423 || code === 'DRIP_LOCKED') {
          showLessonDrip(root, res.body);
          return;
        }
        if (res.status === 403) {
          showLessonGate(root, res.body);
          return;
        }
        if (!res.ok) {
          showLessonError(root, res.body);
          return;
        }
        var payload = normalizePlaybackPayload(res.body);
        if (!payload) {
          showLessonError(root, { error: tx('ecom_coursesLessonLoadError', 'Failed to load lesson.') });
          return;
        }
        renderLessonBody(root, payload);
        if (lessonContentType((payload.lesson || {})) !== 'video') {
          startProgressTracking(lessonId, payload);
        }
      })
      .catch(function() {
        showLessonError(root, { error: tx('ecom_coursesLessonLoadError', 'Failed to load lesson.') });
      });
  }

  function showLessonGate(root, err) {
    clearLessonLoadingTitles(root);
    setText(root, '[data-zappy-lesson-title]', tx('ecom_coursesLessonLocked', 'Lesson locked'));
    if (err && err.courseName) {
      setText(root, '[data-zappy-lesson-course-title]', err.courseName);
    }
    var body = root.querySelector('[data-zappy-lesson-body]');
    if (!body) return;
    var msg = tx('ecom_coursesLessonGate', 'Enroll in this course to access this lesson.');
    if (err && err.code === 'ENROLLMENT_REVOKED') {
      msg = tx('ecom_coursesEnrollmentRevoked', 'Your enrollment is no longer active.');
    }
    var cta = '';
    if (err && err.productSlug) {
      cta = '<a class="course-detail-enroll lesson-gate-cta" href="' + escapeAttr(pageUrl('/courses/' + err.productSlug)) + '">'
        + tx('ecom_coursesEnrollCta', 'View course & enroll') + '</a>';
    } else if (err && err.productId) {
      cta = '<a class="course-detail-enroll lesson-gate-cta" href="' + escapeAttr(pageUrl('/courses')) + '">'
        + tx('ecom_coursesEnrollCta', 'View course & enroll') + '</a>';
    }
    body.innerHTML = '<div class="lesson-gate"><p>' + msg + '</p>' + cta + '</div>';
  }

  function showLessonDrip(root, err) {
    clearLessonLoadingTitles(root);
    setText(root, '[data-zappy-lesson-title]', tx('ecom_coursesLessonLocked', 'Lesson locked'));
    if (err && err.courseName) setText(root, '[data-zappy-lesson-course-title]', err.courseName);
    var body = root.querySelector('[data-zappy-lesson-body]');
    if (!body) return;
    var when = err && err.unlocksAt ? new Date(err.unlocksAt).toLocaleString() : '';
    body.innerHTML = '<div class="lesson-gate lesson-drip">'
      + '<p>' + tx('ecom_coursesDripLocked', 'This lesson unlocks on a schedule.') + '</p>'
      + (when ? '<time class="lesson-drip-when">' + escapeHtml(when) + '</time>' : '')
      + '</div>';
  }

  function showLessonError(root, err) {
    clearLessonLoadingTitles(root);
    setText(root, '[data-zappy-lesson-title]', tx('ecom_coursesLessonLoadError', 'Failed to load lesson.'));
    var body = root.querySelector('[data-zappy-lesson-body]');
    if (body) {
      body.innerHTML = '<p class="lesson-error">' + escapeHtml((err && err.error) || tx('ecom_coursesLessonLoadError', 'Failed to load lesson.')) + '</p>';
    }
  }

  function renderLessonBody(root, payload) {
    var lesson = payload.lesson || {};
    var type = lessonContentType(lesson);
    setText(root, '[data-zappy-lesson-title]', lesson.title || '');
    setText(root, '[data-zappy-lesson-course-title]', payload.courseName || '');
    var body = root.querySelector('[data-zappy-lesson-body]');
    if (!body) return;

    if (type === 'video') {
      if (payload.ready === false) {
        if (payload.reason === 'video-errored') {
          body.innerHTML = '<p class="lesson-video-error">' + escapeHtml(payload.errorMessage || tx('ecom_coursesVideoFailed', 'Video processing failed. Please re-upload the lesson video from Course Studio.')) + '</p>';
        } else {
          body.innerHTML = '<p>' + tx('ecom_coursesVideoProcessing', 'Video is still processing. Check back soon.') + '</p>';
        }
      } else {
        renderMuxVideoPlayer(body, payload).then(function() {
          startProgressTracking(lesson.id || payload.lesson && payload.lesson.id, payload);
        }).catch(function() {
          body.innerHTML = '<p>' + tx('ecom_coursesLessonLoadError', 'Failed to load lesson.') + '</p>';
        });
      }
    } else if (type === 'text') {
      var md = lesson.content_md || '';
      body.innerHTML = '<article class="lesson-text">' + escapeHtml(md).replace(/\n/g, '<br>') + '</article>';
    } else if (type === 'pdf' && payload.pdfUrl) {
      body.innerHTML = '<iframe class="lesson-pdf" src="' + escapeAttr(payload.pdfUrl) + '"></iframe>';
    } else if (type === 'audio' && payload.audioUrl) {
      body.innerHTML = '<audio controls src="' + escapeAttr(payload.audioUrl) + '"></audio>';
    } else if (type === 'quiz' || payload.quizPending) {
      renderQuizPlayer(body, lesson.id);
      return;
    } else if (type === 'live') {
      body.innerHTML = '<div class="lesson-live">'
        + '<p>' + tx('ecom_coursesLiveScheduled', 'Live session scheduled') + '</p>'
        + (lesson.scheduled_at ? '<time>' + new Date(lesson.scheduled_at).toLocaleString() + '</time>' : '')
        + (lesson.instructor_url ? '<a class="btn" href="' + escapeAttr(lesson.instructor_url) + '" target="_blank">' + tx('ecom_coursesJoinLive', 'Join live') + '</a>' : '')
        + '</div>';
    } else {
      body.innerHTML = '<p>' + tx('ecom_coursesLessonUnsupported', 'This lesson type is not yet supported.') + '</p>';
    }

    if (payload.modules) {
      var nav = root.querySelector('[data-zappy-lesson-curriculum]');
      if (nav) {
        nav.innerHTML = payload.modules.map(function(m) {
          var lessons = (m.lessons || []).map(function(l) {
            var active = l.id === lesson.id ? ' class="active"' : '';
            var done = l.completed ? ' ✓' : '';
            return '<li' + active + '><a href="' + escapeAttr(pageUrl('/lesson/' + l.id)) + '">' + escapeHtml(l.title || '') + done + '</a></li>';
          }).join('');
          return '<details open><summary>' + escapeHtml(m.title || '') + '</summary><ol>' + lessons + '</ol></details>';
        }).join('');
      }
    }

    var complete = root.querySelector('[data-zappy-lesson-complete]');
    if (complete) {
      complete.addEventListener('click', function() {
        api('/api/courses/student/lessons/' + lesson.id + '/progress', {
          method: 'POST',
          body: JSON.stringify({ completed: true })
        }).then(function() { location.reload(); });
      });
    }
  }

  function startProgressTracking(lessonId, payload) {
    var video = document.querySelector('mux-player, video, audio');
    if (!video) return;
    var sent = 0;
    setInterval(function() {
      var secs = Math.floor(video.currentTime || 0);
      if (secs > sent + 10) {
        sent = secs;
        api('/api/courses/student/lessons/' + lessonId + '/progress', {
          method: 'POST',
          body: JSON.stringify({ secondsWatched: secs })
        }).catch(function() {});
      }
    }, 5000);
  }

  // ---- Quiz player (rendered inside the lesson player) ----
  function renderQuizPlayer(body, lessonId) {
    body.innerHTML = '<div class="quiz-loading">' + tx('ecom_coursesQuizLoading', 'Loading quiz…') + '</div>';
    api('/api/courses/student/lessons/' + encodeURIComponent(lessonId) + '/quiz')
      .then(function(r) { return r.json(); })
      .then(function(payload) {
        var quiz = payload && payload.data;
        if (!quiz || !quiz.questions || !quiz.questions.length) {
          body.innerHTML = '<p>' + tx('ecom_coursesQuizNone', 'No quiz on this lesson.') + '</p>';
          return;
        }
        var html = '<form class="quiz-form" data-zappy-quiz>'
          + quiz.questions.map(function(q, idx) {
            var input;
            if (q.type === 'short-answer') {
              input = '<input type="text" name="' + q.id + '" class="quiz-text" required />';
            } else {
              input = q.choices.map(function(c) {
                return '<label class="quiz-choice"><input type="radio" name="' + q.id + '" value="' + c.id + '" required /> ' + escapeHtml(c.text || '') + '</label>';
              }).join('');
            }
            return '<fieldset class="quiz-question">'
              + '<legend>' + (idx + 1) + '. ' + escapeHtml(q.prompt) + '</legend>'
              + input
              + '</fieldset>';
          }).join('')
          + '<button type="submit" class="quiz-submit">' + tx('ecom_coursesQuizSubmit', 'Submit') + '</button>'
          + '<div class="quiz-result" hidden></div>'
          + '</form>';
        body.innerHTML = html;

        var form = body.querySelector('[data-zappy-quiz]');
        var result = body.querySelector('.quiz-result');
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var fd = new FormData(form);
          var answers = quiz.questions.map(function(q) {
            var v = fd.get(q.id);
            return q.type === 'short-answer'
              ? { questionId: q.id, freeText: v }
              : { questionId: q.id, selectedChoiceId: v };
          });
          api('/api/courses/student/lessons/' + encodeURIComponent(lessonId) + '/quiz/submit', {
            method: 'POST',
            body: JSON.stringify({ answers })
          })
            .then(function(r) { return r.json(); })
            .then(function(p) {
              var data = p && p.data;
              if (!data) {
                result.hidden = false;
                result.innerHTML = '<p class="quiz-error">' + tx('ecom_coursesQuizError', 'Submission failed.') + '</p>';
                return;
              }
              result.hidden = false;
              result.innerHTML = '<div class="quiz-score ' + (data.passed ? 'passed' : 'failed') + '">'
                + '<strong>' + data.scorePct + '%</strong> — '
                + (data.passed
                  ? tx('ecom_coursesQuizPassed', 'You passed!')
                  : tx('ecom_coursesQuizRetry', 'Try again.'))
                + '</div>';
              if (data.passed && data.courseJustCompleted) {
                setTimeout(function() { location.href = pageUrl('/my-learning'); }, 2000);
              }
            });
        });
      })
      .catch(function() {
        body.innerHTML = '<p>' + tx('ecom_coursesQuizError', 'Failed to load quiz.') + '</p>';
      });
  }

  // ---- /my-learning ----
  function hydrateMyLearning() {
    var grid = document.querySelector('[data-zappy-my-learning-grid]');
    if (!grid) return;
    api('/api/courses/student/my-learning')
      .then(function(r) { if (r.status === 401) { redirectToLogin('/my-learning'); throw 0; } return r.json(); })
      .then(function(payload) {
        var enrollments = (payload && payload.enrollments) || [];
        var empty = document.querySelector('[data-zappy-my-learning-empty]');
        if (!enrollments.length) {
          grid.innerHTML = '';
          if (empty) empty.hidden = false;
          return;
        }
        grid.innerHTML = enrollments.map(function(e) {
          var pct = Math.round((e.progress_pct || 0));
          return '<a class="my-learning-card" href="' + escapeAttr(pageUrl('/courses/' + encodeURIComponent(e.course_slug || e.product_id))) + '">'
            + (e.image ? '<img src="' + e.image + '" alt="" />' : '')
            + '<h3>' + escapeHtml(e.course_name || '') + '</h3>'
            + '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>'
            + '<span class="progress-label">' + pct + '%</span>'
            + '</a>';
        }).join('');
      })
      .catch(function() {});
  }

  // ---- /certificate/:code ----
  function hydrateCertificate() {
    var root = document.querySelector('[data-zappy-certificate-verify]');
    if (!root) return;
    var code = (getEffectivePath().match(/^\/certificate\/([^\/]+)$/) || [])[1];
    if (!code) return;
    var body = root.querySelector('[data-zappy-certificate-body]');

    fetch(API_BASE + '/api/courses/student/certificates/' + encodeURIComponent(code) + '/verify', { credentials: 'include' })
      .then(function(r) { return r.json(); })
      .then(function(payload) {
        if (!payload || !payload.valid) {
          body.innerHTML = '<p class="cert-invalid">' + tx('ecom_coursesCertInvalid', 'This certificate could not be verified.') + '</p>';
          return;
        }
        body.innerHTML = '<div class="cert-valid">'
          + '<h2>✓ ' + tx('ecom_coursesCertValid', 'Verified') + '</h2>'
          + '<dl>'
          + '<dt>' + tx('ecom_coursesCertStudent', 'Student') + '</dt><dd>' + escapeHtml(payload.studentName || '') + '</dd>'
          + '<dt>' + tx('ecom_coursesCertCourse', 'Course') + '</dt><dd>' + escapeHtml(payload.courseName || '') + '</dd>'
          + '<dt>' + tx('ecom_coursesCertIssued', 'Issued') + '</dt><dd>' + new Date(payload.issuedAt).toLocaleDateString() + '</dd>'
          + (payload.pdfUrl ? '<dt>PDF</dt><dd><a href="' + escapeAttr(payload.pdfUrl) + '" target="_blank">' + tx('ecom_coursesCertDownload', 'Download') + '</a></dd>' : '')
          + '</dl></div>';
      })
      .catch(function() {
        body.innerHTML = '<p class="cert-invalid">' + tx('ecom_coursesCertError', 'Verification failed.') + '</p>';
      });
  }

  // ---- helpers ----
  function setText(root, sel, val) {
    var el = root.querySelector(sel);
    if (el) el.textContent = val == null ? '' : String(val);
  }
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/\n/g, ' '); }
  function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

  function applyStaticCoursesLabels() {
    document.querySelectorAll('[data-ecom-text]').forEach(function(el) {
      var key = el.getAttribute('data-ecom-text');
      if (!key) return;
      var fallback = el.textContent || '';
      el.textContent = tx(key, fallback);
    });
  }

  /** Home page featured section — course cards instead of product cards. */
  async function loadFeaturedCoursesHome() {
    var grid = document.getElementById('zappy-featured-products');
    if (!grid || !WEBSITE_ID) return;
    try {
      var url = appendLangParam('/api/ecommerce/storefront/products?websiteId=' + encodeURIComponent(WEBSITE_ID) + '&featured=true');
      var res = await fetch(url);
      var data = await res.json();
      if (!data.success || !data.data || !data.data.length) {
        grid.innerHTML = '<div class="no-featured-products">' + tx('ecom_noFeaturedCourses', 'No featured courses yet. Browse our full course library!') + '</div>';
        return;
      }
      grid.innerHTML = data.data.map(renderCatalogCard).join('');
      grid.className = 'courses-grid featured-courses-grid';
    } catch (e) {
      console.error('Failed to load featured courses', e);
      grid.innerHTML = '<div class="empty-cart">' + tx('ecom_coursesCatalogError', 'Failed to load courses.') + '</div>';
    }
  }

  /** Home page featured categories — category blocks linking to /category/:slug. */
  async function loadFeaturedCategoriesHome() {
    var container = document.getElementById('zappy-featured-categories');
    if (!container || !WEBSITE_ID) return;
    try {
      var url = appendLangParam('/api/ecommerce/storefront/featured-categories?websiteId=' + encodeURIComponent(WEBSITE_ID));
      var res = await fetch(url);
      var data = await res.json();
      if (!data.success || !data.data || !data.data.length) {
        var section = document.getElementById('featured-categories');
        if (section) section.remove();
        return;
      }
      container.innerHTML = data.data.map(function(cat) {
        var imageUrl = cat.image || '';
        var categoryUrl = pageUrl('/category/' + encodeURIComponent(cat.slug || cat.id));
        return '<a href="' + escapeAttr(categoryUrl) + '" class="category-block" data-category-id="' + cat.id + '" data-category-slug="' + escapeAttr(cat.slug || '') + '">'
          + '<div class="category-block-bg" style="background-image: url(\'' + escapeAttr(imageUrl) + '\')"></div>'
          + '<div class="category-block-overlay"></div>'
          + '<div class="category-block-content"><span class="category-block-name">' + escapeHtml(cat.name || '') + '</span></div>'
          + '</a>';
      }).join('');
    } catch (e) {
      console.error('Failed to load featured categories', e);
      var errSection = document.getElementById('featured-categories');
      if (errSection) errSection.remove();
    }
  }

  /** Minimal storefront settings fetch when the ecommerce JS block is absent. */
  async function ensureCoursesStorefrontSettings() {
    if (!WEBSITE_ID) return;
    try {
      var res = await fetch(appendLangParam('/api/ecommerce/storefront/settings?websiteId=' + encodeURIComponent(WEBSITE_ID)));
      var data = await res.json();
      if (!data.success || !data.data) return;
      if (data.data.catalogMenuEnabled === true) {
        var menu = document.getElementById('zappy-catalog-menu');
        if (menu) {
          menu.style.display = '';
          menu.removeAttribute('hidden');
        }
      }
      var allLink = document.querySelector('.catalog-menu-all');
      if (allLink) {
        allLink.setAttribute('href', pageUrl('/courses'));
        if (data.data.allProductsLabel) allLink.textContent = data.data.allProductsLabel;
      }
      var navList = document.getElementById('zappy-nav-category-links');
      if (navList) {
        var firstNavLink = navList.querySelector('li:first-child a');
        if (firstNavLink) firstNavLink.setAttribute('href', pageUrl('/courses'));
      }
    } catch (e) { /* swallow */ }
  }

  function getRuntimeDir() {
    var lang = '';
    if (typeof window.zappyI18n !== 'undefined' && typeof window.zappyI18n.getCurrentLanguage === 'function') {
      lang = window.zappyI18n.getCurrentLanguage() || '';
    }
    lang = String(lang || document.documentElement.lang || '').split('-')[0].toLowerCase();
    if (lang) return ['he', 'iw', 'ar', 'fa', 'ur'].indexOf(lang) !== -1 ? 'rtl' : 'ltr';
    return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  }

  function getNavCategoryLinksContainer() {
    var navList = document.getElementById('zappy-nav-category-links');
    if (navList) return navList;
    var dropdown = document.querySelector('.zappy-products-dropdown');
    if (dropdown) {
      var sub = dropdown.querySelector(':scope > .sub-menu, :scope > ul.sub-menu');
      if (sub) {
        if (!sub.id) sub.id = 'zappy-nav-category-links';
        return sub;
      }
    }
    return null;
  }

  /** Fallback catalog loader for course sites missing the ecommerce JS block. */
  async function loadCatalogCategoriesForCourses() {
    var list = document.getElementById('zappy-category-links');
    var navList = getNavCategoryLinksContainer();
    if (!list && !navList) return;
    if (!WEBSITE_ID) return;
    var currentDir = getRuntimeDir();
    var catalogMenu = document.getElementById('zappy-catalog-menu');
    if (catalogMenu) {
      catalogMenu.setAttribute('dir', currentDir);
      catalogMenu.classList.toggle('rtl', currentDir === 'rtl');
      catalogMenu.classList.toggle('ltr', currentDir === 'ltr');
    }
    [list, navList].forEach(function(menuList) {
      if (!menuList) return;
      menuList.setAttribute('dir', currentDir);
      menuList.style.setProperty('direction', currentDir, 'important');
    });
    try {
      var res = await fetch(appendLangParam('/api/ecommerce/storefront/categories?websiteId=' + encodeURIComponent(WEBSITE_ID)));
      var data = await res.json();
      if (!data.success || !data.data || !data.data.length) return;
      var allCats = data.data;
      var childrenMap = {};
      var topLevel = [];
      allCats.forEach(function(cat) {
        if (cat.parent_id) {
          if (!childrenMap[cat.parent_id]) childrenMap[cat.parent_id] = [];
          childrenMap[cat.parent_id].push(cat);
        } else {
          topLevel.push(cat);
        }
      });
      function collectDescendants(parentId) {
        var result = [];
        (childrenMap[parentId] || []).forEach(function(child) {
          result.push(child);
          result = result.concat(collectDescendants(child.id));
        });
        return result;
      }
      topLevel.forEach(function(cat) {
        childrenMap[cat.id] = collectDescendants(cat.id);
      });
      function catUrl(cat) { return pageUrl('/category/' + encodeURIComponent(cat.slug || cat.id)); }
      var orderedTopLevel = currentDir === 'ltr' ? topLevel.slice().reverse() : topLevel;
      var dropdownItemsHtml = orderedTopLevel.map(function(cat) {
        var children = childrenMap[cat.id] || [];
        if (!children.length) {
          return '<li data-category-id="' + cat.id + '" data-category-slug="' + escapeAttr(cat.slug || '') + '"><a href="' + escapeAttr(catUrl(cat)) + '" dir="' + currentDir + '">' + escapeHtml(cat.name || '') + '</a></li>';
        }
        var items = '<li class="zappy-nav-parent" data-category-id="' + cat.id + '" data-category-slug="' + escapeAttr(cat.slug || '') + '"><a href="' + escapeAttr(catUrl(cat)) + '" dir="' + currentDir + '">' + escapeHtml(cat.name || '') + '</a></li>';
        children.forEach(function(child) {
          items += '<li class="zappy-nav-child" data-category-id="' + child.id + '" data-category-slug="' + escapeAttr(child.slug || '') + '"><a href="' + escapeAttr(catUrl(child)) + '" dir="' + currentDir + '">' + escapeHtml(child.name || '') + '</a></li>';
        });
        return items;
      }).join('');
      var barItemsHtml = orderedTopLevel.map(function(cat) {
        var children = childrenMap[cat.id] || [];
        if (!children.length) {
          return '<a href="' + escapeAttr(catUrl(cat)) + '" class="catalog-menu-item" data-category-id="' + cat.id + '" data-category-slug="' + escapeAttr(cat.slug || '') + '" dir="' + currentDir + '">' + escapeHtml(cat.name || '') + '</a>';
        }
        var subLinks = children.map(function(child) {
          return '<a href="' + escapeAttr(catUrl(child)) + '" class="catalog-menu-item" data-category-id="' + child.id + '" data-category-slug="' + escapeAttr(child.slug || '') + '" dir="' + currentDir + '">' + escapeHtml(child.name || '') + '</a>';
        }).join('');
        return '<div class="catalog-menu-parent" data-category-id="' + cat.id + '" data-category-slug="' + escapeAttr(cat.slug || '') + '">'
          + '<a href="' + escapeAttr(catUrl(cat)) + '" class="catalog-menu-item catalog-menu-trigger" dir="' + currentDir + '">' + escapeHtml(cat.name || '') + '</a>'
          + '<div class="sub-menu" dir="' + currentDir + '">' + subLinks + '</div>'
          + '</div>';
      }).join('');
      if (navList) {
        navList.querySelectorAll('li[data-category-id]').forEach(function(node) { node.remove(); });
        navList.insertAdjacentHTML('beforeend', dropdownItemsHtml);
      }
      if (list) {
        list.querySelectorAll('[data-category-id]').forEach(function(node) { node.remove(); });
        list.insertAdjacentHTML('beforeend', barItemsHtml);
      }
    } catch (e) {
      console.error('[courses] Failed to load catalog categories', e);
    }
  }

  function installCoursesCatalogLoader() {
    if (typeof window.loadCatalogCategories !== 'function') {
      window.loadCatalogCategories = loadCatalogCategoriesForCourses;
    }
  }

  function hijackFeaturedProductsLoader() {
    window.loadFeaturedProducts = loadFeaturedCoursesHome;
    window.loadFeaturedCategories = loadFeaturedCategoriesHome;
    installCoursesCatalogLoader();
  }

  /** Load homepage featured sections + nav categories without relying on ecommerce JS init. */
  function bootstrapCoursesSharedSections() {
    var path = getEffectivePath();
    var onHome = path === '/' || path === '';
    var hasFeatured = !!document.getElementById('zappy-featured-products');
    var hasFeaturedCats = !!document.getElementById('zappy-featured-categories');
    var hasCatalogNav = !!document.getElementById('zappy-category-links') || !!getNavCategoryLinksContainer();
    if (!onHome && !hasFeatured && !hasFeaturedCats && !hasCatalogNav) return;

    hijackFeaturedProductsLoader();
    var settingsPromise = (typeof fetchAdditionalJsSettings === 'function')
      ? fetchAdditionalJsSettings().catch(function() { return ensureCoursesStorefrontSettings(); })
      : ensureCoursesStorefrontSettings();

    settingsPromise.then(function() {
      if (hasFeatured || onHome) loadFeaturedCoursesHome();
      if (hasFeaturedCats || onHome) loadFeaturedCategoriesHome();
      if (hasCatalogNav || onHome) {
        var loader = window.loadCatalogCategories || loadCatalogCategoriesForCourses;
        if (typeof loader === 'function') loader();
      }
    });
  }

  /** Hide physical-shipping accordion on checkout — courses are digital-only. */
  function applyCoursesCheckoutShippingHide() {
    var path = getEffectivePath();
    if (path !== '/checkout' && path !== '/checkout/') return;

    var shippingPanel = document.querySelector('.checkout-accordion-panel[data-step="shipping"]');
    if (shippingPanel) {
      shippingPanel.style.display = 'none';
      shippingPanel.classList.add('completed');
      shippingPanel.classList.remove('expanded');
    }
    var contactNext = document.querySelector('.checkout-accordion-panel[data-step="contact"] .checkout-next-btn[data-next]');
    if (contactNext) contactNext.setAttribute('data-next', 'payment');
    var shippingCostEl = document.getElementById('shipping-cost');
    if (shippingCostEl) {
      var shippingRow = shippingCostEl.closest('.order-totals-row');
      if (shippingRow) shippingRow.style.display = 'none';
    }
  }

  function scheduleCoursesCheckoutUi() {
    applyCoursesCheckoutShippingHide();
    [100, 500, 1500, 3000].forEach(function(ms) {
      setTimeout(applyCoursesCheckoutShippingHide, ms);
    });
  }

  /** Measure fixed navbar (+ catalog bar) so courses pages clear the header. */
  function ensureCoursesHeaderClearance() {
    function measure() {
      var annBar = document.getElementById('zappy-announcement-bar');
      var header = document.querySelector('header.navbar, nav.navbar, .navbar, header');
      var catalogMenu = document.getElementById('zappy-catalog-menu');
      var annH = annBar && getComputedStyle(annBar).display !== 'none'
        ? Math.ceil(annBar.getBoundingClientRect().height || 0) : 0;
      var headerH = header ? Math.ceil(header.getBoundingClientRect().height || header.offsetHeight || 0) : 0;
      var total = annH + headerH;
      if (catalogMenu && getComputedStyle(catalogMenu).display !== 'none') {
        total += Math.ceil(catalogMenu.getBoundingClientRect().height || catalogMenu.offsetHeight || 0);
      }
      if (total < 60) total = 120;
      document.documentElement.style.setProperty('--header-height', headerH + 'px');
      document.documentElement.style.setProperty('--total-header-height', total + 'px');
      var main = document.querySelector('main.courses-page-main, #main.courses-page-main');
      if (!main) return;
      var innerGap = 32;
      var padTop = (total + innerGap) + 'px';
      // Beat navbarLayoutFixService main{padding-top:0!important} — inline !important wins.
      main.style.setProperty('padding-top', padTop, 'important');
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', measure);
    } else {
      measure();
    }
    window.addEventListener('resize', measure);
    setTimeout(measure, 80);
    setTimeout(measure, 350);
    setTimeout(measure, 900);
  }

  function init() {
    ensureCoursesHeaderClearance();
    hijackFeaturedProductsLoader();
    bootstrapCoursesSharedSections();
    applyStaticCoursesLabels();
    var path = getEffectivePath();
    if (path === '/checkout' || path === '/checkout/') scheduleCoursesCheckoutUi();
    if (path === '/courses' || path === '/courses/') return hydrateCatalog();
    if (/^\/category\/[^\/]+$/.test(path)) return hydrateCategoryCatalog();
    if (/^\/courses\/[^\/]+$/.test(path)) return hydrateCourseDetail();
    if (/^\/lesson\/[^\/]+$/.test(path)) return hydrateLessonPlayer();
    if (path === '/my-learning' || path === '/my-learning/') return hydrateMyLearning();
    if (/^\/certificate\/[^\/]+$/.test(path)) return hydrateCertificate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ZAPPY_CHECKOUT_FOCUS_UX_V2 */
(function(){
  if (window.__zappyCheckoutFocusUX >= 2) return;
  window.__zappyCheckoutFocusUX = 2;

  var CSS =
    'body.zappy-cart-open #cc-main,body.zappy-cart-open #zappy-cookie-banner{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}' +
    'body.zappy-checkout-page #zappy-cookie-banner{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-menu,' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-links,' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-cta,' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-right-group .nav-menu,' +
    'body.zappy-checkout-page .lang-switcher,' +
    'body.zappy-checkout-page .nav-icons-right,' +
    'body.zappy-checkout-page .nav-search-box,' +
    'body.zappy-checkout-page .nav-search-toggle,' +
    'body.zappy-checkout-page #mobile-search-toggle,' +
    'body.zappy-checkout-page .mobile-search-panel,' +
    'body.zappy-checkout-page .login-link.nav-login,' +
    'body.zappy-checkout-page .nav-ecommerce-icons>*:not(.cart-link),' +
    'body.zappy-checkout-page .mobile-hamburger-btn,' +
    'body.zappy-checkout-page .mobile-toggle,' +
    'body.zappy-checkout-page .hamburger,' +
    'body.zappy-checkout-page .menu-toggle,' +
    'body.zappy-checkout-page #mobileToggle,' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .phone-header-btn,' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .mobile-close-btn{display:none!important;visibility:hidden!important;pointer-events:none!important}' +
    'body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-container{display:flex!important;align-items:center!important;justify-content:space-between!important;width:100%!important}' +
    'body.zappy-checkout-page .nav-brand,body.zappy-checkout-page .cart-link.nav-cart,body.zappy-checkout-page #cart-drawer-toggle{display:flex!important;visibility:visible!important;pointer-events:auto!important}' +
    'body.zappy-checkout-page .nav-ecommerce-icons{display:inline-flex!important;align-items:center!important;margin-inline-start:auto!important}' +
    '@media (max-width:768px){body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-menu,body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-menu.active,body.zappy-checkout-page nav.navbar:not(.zappy-catalog-menu) .nav-menu.open{display:none!important;visibility:hidden!important}}' +
    'body.zappy-checkout-page .site-footer>*:not(.footer-bottom),body.zappy-checkout-page footer.site-footer>*:not(.footer-bottom){display:none!important;visibility:hidden!important}' +
    'body.zappy-checkout-page .site-footer .footer-bottom,body.zappy-checkout-page footer.site-footer .footer-bottom{display:block!important;visibility:visible!important}' +
    'body.zappy-checkout-page .site-footer:not(:has(.footer-bottom)),body.zappy-checkout-page footer.site-footer:not(:has(.footer-bottom)){display:none!important}';

  function resolvePagePath() {
    var pagePath = window.location.pathname || '';
    try {
      var pageParam = new URLSearchParams(window.location.search).get('page');
      if (pageParam) pagePath = pageParam;
    } catch (e) {}
    return pagePath.toLowerCase();
  }

  function applyCheckoutFocusState() {
    var path = resolvePagePath();
    var isCheckoutPage = path.indexOf('/checkout') !== -1;
    var isFocusedPage = (
      path.indexOf('/product/') !== -1 ||
      path === '/product' ||
      path.indexOf('/cart') !== -1 ||
      isCheckoutPage ||
      path.indexOf('/order-success') !== -1 ||
      path.indexOf('/order') !== -1
    );
    document.body.classList.toggle('zappy-focused-page', isFocusedPage);
    document.body.classList.toggle('zappy-checkout-page', isCheckoutPage);
  }

  function injectCss() {
    var existing = document.getElementById('zappy-checkout-focus-ux-css');
    if (existing && existing.getAttribute('data-v') === '2') return;
    if (existing) existing.remove();
    var style = document.createElement('style');
    style.id = 'zappy-checkout-focus-ux-css';
    style.setAttribute('data-zappy-runtime', 'checkout-focus');
    style.setAttribute('data-v', '2');
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function syncCartOpenFromDom() {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-drawer-overlay');
    var isOpen = (drawer && drawer.classList.contains('active')) ||
      (overlay && overlay.classList.contains('active'));
    document.body.classList.toggle('zappy-cart-open', !!isOpen);
  }

  function watchCartDrawer() {
    syncCartOpenFromDom();
    var obs = new MutationObserver(function() { syncCartOpenFromDom(); });
    ['cart-drawer', 'cart-drawer-overlay'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
    document.addEventListener('click', function(e) {
      var t = e.target && e.target.closest
        ? e.target.closest('#cart-drawer-toggle,.cart-link.nav-cart,a.nav-cart,[data-cart-toggle],.cart-drawer-close,#cart-drawer-overlay')
        : null;
      if (t) setTimeout(syncCartOpenFromDom, 0);
    }, true);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') setTimeout(syncCartOpenFromDom, 0);
    });
  }

  function boot() {
    injectCss();
    applyCheckoutFocusState();
    watchCartDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('popstate', function() { setTimeout(applyCheckoutFocusState, 0); });
  setTimeout(boot, 250);
  setTimeout(boot, 1500);
})();


/* ZAPPY_MOBILE_NAV_ICON_ALIGNMENT_RUNTIME */
/* ZAPPY_MOBILE_NAV_ICON_ALIGNMENT_RUNTIME_V2 */
(function(){
  try {
    function injectMobileNavIconAlignmentFix() {
      if (document.getElementById('zappy-mobile-nav-icon-alignment-fix')) return;
      var style = document.createElement('style');
      style.id = 'zappy-mobile-nav-icon-alignment-fix';
      style.textContent = "\n\n/* ZAPPY_MOBILE_NAV_ICON_ALIGNMENT_FIX */\n/* ZAPPY_MOBILE_NAV_ICON_ALIGNMENT_FIX_V3 */\n/* The mobile hamburger / phone buttons are absolutely positioned. Keep the\n   navbar itself as a non-collapsing containing block so auto-margin centering\n   stays aligned even when generated mobile CSS moves every nav child out of flow. */\n@media (max-width: 768px) {\n  .navbar,\n  nav.navbar {\n    min-height: 70px !important;\n  }\n\n  /* Some generated RTL nav CSS sets both left:50% and right:50% on the\n     absolute .nav-brand. That collapses it to 0px wide, so the logo flows\n     left from the center instead of being centered on it. */\n  .navbar .nav-brand,\n  nav.navbar .nav-brand,\n  html[dir=\"rtl\"] .navbar .nav-brand,\n  html[dir=\"rtl\"] nav.navbar .nav-brand,\n  html[lang=\"he\"] .navbar .nav-brand,\n  html[lang=\"he\"] nav.navbar .nav-brand,\n  html[lang=\"ar\"] .navbar .nav-brand,\n  html[lang=\"ar\"] nav.navbar .nav-brand {\n    position: absolute !important;\n    left: 50% !important;\n    right: auto !important;\n    top: 50% !important;\n    width: auto !important;\n    min-width: max-content !important;\n    max-width: calc(100% - 168px) !important;\n    transform: translate(-50%, -50%) !important;\n    margin: 0 !important;\n    text-align: center !important;\n    justify-content: center !important;\n  }\n\n  .navbar .nav-brand .logo-link,\n  nav.navbar .nav-brand .logo-link,\n  .navbar .nav-brand a,\n  nav.navbar .nav-brand a {\n    display: inline-flex !important;\n    justify-content: center !important;\n    align-items: center !important;\n    margin-left: auto !important;\n    margin-right: auto !important;\n  }\n\n  .navbar > .mobile-toggle,\n  nav.navbar > .mobile-toggle,\n  .navbar .mobile-toggle,\n  nav.navbar .mobile-toggle,\n  #mobileToggle,\n  .navbar > .phone-header-btn,\n  nav.navbar > .phone-header-btn,\n  .navbar .phone-header-btn,\n  nav.navbar .phone-header-btn {\n    position: absolute !important;\n    top: 0 !important;\n    bottom: 0 !important;\n    transform: none !important;\n    margin-top: auto !important;\n    margin-bottom: auto !important;\n    align-self: center !important;\n    align-items: center !important;\n    justify-content: center !important;\n    line-height: 0 !important;\n  }\n\n  .navbar > .mobile-toggle,\n  nav.navbar > .mobile-toggle,\n  .navbar .mobile-toggle,\n  nav.navbar .mobile-toggle,\n  #mobileToggle {\n    display: flex !important;\n  }\n\n  html:not([data-zappy-site-type=\"ecommerce\"]) .navbar > .phone-header-btn,\n  html:not([data-zappy-site-type=\"ecommerce\"]) nav.navbar > .phone-header-btn,\n  html:not([data-zappy-site-type=\"ecommerce\"]) .navbar .phone-header-btn,\n  html:not([data-zappy-site-type=\"ecommerce\"]) nav.navbar .phone-header-btn {\n    display: flex !important;\n  }\n\n  html[data-zappy-site-type=\"ecommerce\"] .phone-header-btn,\n  body[data-zappy-site-type=\"ecommerce\"] .phone-header-btn,\n  html[data-zappy-site-type=\"ecommerce\"] header .phone-header-btn,\n  html[data-zappy-site-type=\"ecommerce\"] nav .phone-header-btn {\n    display: none !important;\n    visibility: hidden !important;\n    width: 0 !important;\n    height: 0 !important;\n    min-width: 0 !important;\n    overflow: hidden !important;\n  }\n}\n";
      document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectMobileNavIconAlignmentFix);
    } else {
      injectMobileNavIconAlignmentFix();
    }
    window.addEventListener('load', injectMobileNavIconAlignmentFix);
    setTimeout(injectMobileNavIconAlignmentFix, 250);
    setTimeout(injectMobileNavIconAlignmentFix, 1000);
  } catch (e) {}
})();

/* ZAPPY_CUSTOMER_DISCOUNT_DELAYED_REFRESH_V1 */


/* ZAPPY_CUSTOMER_DISCOUNT_RUNTIME_V1 */
;(function() {
  if (window.__zappyCustomerDiscountRuntimeV1) return;
  window.__zappyCustomerDiscountRuntimeV1 = true;

  function apiUrl(path) {
    var base = window.ZAPPY_API_BASE || '';
    if (base.endsWith('/')) base = base.slice(0, -1);
    return base + path;
  }

  function getDiscount(productId) {
    var cfg = window.__zappyCustomerDiscountConfig;
    if (!cfg || !cfg.discountPercent) return null;
    var excluded = cfg.excludedProductIds || [];
    if (excluded.indexOf(productId) !== -1) return null;
    return cfg;
  }

  function applyPercent(basePrice, productId) {
    var d = getDiscount(productId);
    if (!d || !Number.isFinite(basePrice) || basePrice <= 0) {
      return { price: basePrice, applied: false };
    }
    var discounted = basePrice - (basePrice * parseFloat(d.discountPercent) / 100);
    if (!Number.isFinite(discounted) || discounted >= basePrice) {
      return { price: basePrice, applied: false };
    }
    return { price: discounted, applied: true, originalPrice: basePrice };
  }

  window.__zappyApplyCustomerPercentToPrice = applyPercent;

  function currencyFromText(text) {
    var m = String(text || '').match(/[₪$€£]/);
    return m ? m[0] : '₪';
  }

  function isPriceAlreadyCustomerDiscounted(priceEl, productId) {
    if (!priceEl) return true;
    if (priceEl.getAttribute('data-customer-discount-applied')) return true;
    // Sale / seasonal strikethrough also uses .original-price — only skip when the
    // visible price already matches a customer discount computed from the
    // strikethrough base (generator path that omits data-customer-discount-applied).
    var origEl = priceEl.querySelector('.original-price');
    if (!origEl || !productId) return false;
    var raw = priceEl.textContent || '';
    var nums = raw.match(/[\d,.]+/g);
    if (!nums || !nums.length) return false;
    var displayed = parseFloat(nums[0].replace(/,/g, ''));
    var origNums = (origEl.textContent || '').match(/[\d,.]+/g);
    if (!origNums || !origNums.length) return false;
    var preCustomerBase = parseFloat(origNums[origNums.length - 1].replace(/,/g, ''));
    if (!Number.isFinite(displayed) || !Number.isFinite(preCustomerBase)) return false;
    var adj = applyPercent(preCustomerBase, productId);
    if (!adj.applied) return false;
    return Math.abs(displayed - adj.price) < 0.02;
  }

  function applyPricesToCards() {
    if (!window.__zappyCustomerDiscountConfig || !window.__zappyCustomerDiscountConfig.discountPercent) return;
    document.querySelectorAll('[data-product-id]').forEach(function(card) {
      var pid = card.getAttribute('data-product-id');
      var priceEl = card.querySelector('.price') || card.querySelector('.product-price');
      if (!priceEl || isPriceAlreadyCustomerDiscounted(priceEl, pid)) return;
      var raw = priceEl.textContent || '';
      var starting = /(?:Starting at|החל מ)/i.test(raw);
      var nums = raw.match(/[\d,.]+/g);
      if (!nums || !nums.length) return;
      var base = parseFloat(nums[0].replace(/,/g, ''));
      if (!Number.isFinite(base) || base <= 0) return;
      var adj = applyPercent(base, pid);
      if (!adj.applied) return;
      var sym = currencyFromText(raw);
      if (starting) {
        var prefix = raw.match(/(?:Starting at|החל מ)/i);
        var label = prefix ? prefix[0] : 'Starting at';
        priceEl.innerHTML = label + ' ' + sym + adj.price.toFixed(2) + ' <span class="original-price">' + sym + base.toFixed(2) + '</span>';
      } else {
        priceEl.innerHTML = sym + adj.price.toFixed(2) + ' <span class="original-price">' + sym + base.toFixed(2) + '</span>';
      }
      priceEl.setAttribute('data-customer-discount-applied', '1');
    });
  }

  function refreshProductDetailPrice() {
    if (!window.currentProduct || !window.__zappyCustomerDiscountConfig) return;
    if (typeof window.__zappyUpdateVariantUI === 'function' && window.productTranslations) {
      window.__zappyUpdateVariantUI(window.selectedVariant || null, window.currentProduct, window.productTranslations, {});
      return;
    }
    var priceEl = document.getElementById('product-price-display');
    if (!priceEl || isPriceAlreadyCustomerDiscounted(priceEl, window.currentProduct.id)) return;
    var raw = priceEl.textContent || '';
    var starting = /(?:Starting at|החל מ)/i.test(raw);
    var nums = raw.match(/[\d,.]+/g);
    if (!nums || !nums.length) return;
    var base = parseFloat((starting && nums.length > 1 ? nums[nums.length - 1] : nums[0]).replace(/,/g, ''));
    if (!Number.isFinite(base) || base <= 0) return;
    var adj = applyPercent(base, window.currentProduct.id);
    if (!adj.applied) return;
    var sym = currencyFromText(raw);
    if (starting) {
      var prefix = raw.match(/(?:Starting at|החל מ)/i);
      var label = prefix ? prefix[0] : 'Starting at';
      priceEl.innerHTML = label + ' ' + sym + adj.price.toFixed(2) + ' <span class="original-price">' + sym + base.toFixed(2) + '</span>';
    } else {
      priceEl.innerHTML = sym + adj.price.toFixed(2) + ' <span class="original-price">' + sym + base.toFixed(2) + '</span>';
    }
    priceEl.setAttribute('data-customer-discount-applied', '1');
  }

  async function syncCustomerDiscount() {
    if (typeof window.__zappyFetchCustomerDiscount === 'function') {
      try {
        await window.__zappyFetchCustomerDiscount();
      } catch (e) {
        console.warn('[ZAPPY] Customer discount runtime delegate failed', e);
      }
      applyPricesToCards();
      refreshProductDetailPrice();
      if (typeof window.loadProducts === 'function') {
        try { window.loadProducts(); } catch (e) {}
      }
      if (typeof window.__zappyScheduleDynamicProductGridsDiscountRefresh === 'function') {
        try { window.__zappyScheduleDynamicProductGridsDiscountRefresh(); } catch (e) {}
      }
      [800, 2500].forEach(function(ms) {
        setTimeout(refreshProductDetailPrice, ms);
      });
      return;
    }
    var wid = window.ZAPPY_WEBSITE_ID;
    if (!wid) return;
    var token = localStorage.getItem('zappy_customer_token_' + wid);
    if (!token) {
      window.__zappyCustomerDiscountConfig = null;
      return;
    }
    try {
      var res = await fetch(apiUrl('/api/ecommerce/storefront/customer-discount?websiteId=' + encodeURIComponent(wid)), {
        headers: { Authorization: 'Bearer ' + token }
      });
      var data = await res.json();
      if (data.success && data.data && data.data.discountPercent > 0) {
        window.__zappyCustomerDiscountConfig = data.data;
      } else {
        window.__zappyCustomerDiscountConfig = null;
      }
    } catch (e) {
      console.warn('[ZAPPY] Customer discount runtime fetch failed', e);
      window.__zappyCustomerDiscountConfig = null;
    }
    applyPricesToCards();
    refreshProductDetailPrice();
    if (typeof window.loadProducts === 'function') {
      try { window.loadProducts(); } catch (e) {}
    }
    if (typeof window.__zappyScheduleDynamicProductGridsDiscountRefresh === 'function') {
      try { window.__zappyScheduleDynamicProductGridsDiscountRefresh(); } catch (e) {}
    }
    [800, 2500].forEach(function(ms) {
      setTimeout(refreshProductDetailPrice, ms);
    });
  }

  function boot() {
    syncCustomerDiscount();
    var detail = document.getElementById('product-detail');
    if (detail && typeof MutationObserver !== 'undefined') {
      new MutationObserver(function() {
        refreshProductDetailPrice();
      }).observe(detail, { childList: true, subtree: true });
    }
    var grid = document.getElementById('zappy-product-grid');
    if (grid && typeof MutationObserver !== 'undefined') {
      new MutationObserver(function() {
        applyPricesToCards();
      }).observe(grid, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
