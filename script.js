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

  // Single-source-of-truth i18n lookup: route every user-visible string
  // through getEcomText so it lands in the storefront i18n dictionary
  // (server/i18n/storefront/<lang>.json). getEcomText / ECOM_RUNTIME_TEXT
  // use bare keys (ecom_sku → sku); dict JSON files keep the ecom_ prefix.
  function tx(key, fallback) {
    if (typeof getEcomText === 'function') {
      try {
        var bare = (key && key.indexOf('ecom_') === 0) ? key.slice(5) : key;
        return getEcomText(bare, fallback);
      } catch (e) { /* swallow */ }
    }
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
          description.textContent = copy || tx('ecom_coursesCatalogSubtitle', 'Browse our full course library.');
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
    if (typeof fetchAdditionalJsSettings === 'function') {
      try { await fetchAdditionalJsSettings(); } catch (e0) { /* swallow */ }
    }
    try {
      var url = (typeof buildApiUrlWithLang === 'function')
        ? buildApiUrlWithLang('/api/ecommerce/storefront/products?websiteId=' + WEBSITE_ID + '&featured=true')
        : (API_BASE + '/api/ecommerce/storefront/products?websiteId=' + WEBSITE_ID + '&featured=true');
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

  function hijackFeaturedProductsLoader() {
    if (typeof window.loadFeaturedProducts === 'function') {
      window.loadFeaturedProducts = loadFeaturedCoursesHome;
    }
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

  function init() {
    hijackFeaturedProductsLoader();
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
