/* Sell Karo Online — static site interactions */
(function () {
  var inMarketplaceDetail = /\/marketplaces\//.test(location.pathname);
  var pre = inMarketplaceDetail ? "../" : "";
  var nav = [
    ["Home", "index.html"], ["About", "about.html"], ["Services", "services.html"],
    ["Marketplaces", "marketplaces.html"], ["Case Studies", "case-studies.html"],
    ["Blog", "blog.html"], ["Careers", "careers.html"], ["FAQ", "faq.html"], ["Contact", "contact.html"]
  ];
  var markets = [
    ["Amazon", "amazon"], ["Flipkart", "flipkart"], ["Meesho", "meesho"], ["Myntra", "myntra"],
    ["AJIO", "ajio"], ["Nykaa", "nykaa"], ["JioMart", "jiomart"], ["Shopify", "shopify"],
    ["Tata CLiQ", "tata-cliq"], ["Snapdeal", "snapdeal"], ["FirstCry", "firstcry"]
  ];
  var logoMap = {
    amazon:"amazon.png", flipkart:"flipkart.png", meesho:"meesho.png", myntra:"myntra.png",
    ajio:"ajio.png", nykaa:"nykaa.png", jiomart:"jiomart.png", shopify:"shopify.svg",
    "tata-cliq":"tata-cliq.svg", snapdeal:"snapdeal.svg", firstcry:"firstcry.svg"
  };

  var header = document.querySelector("header");
  if (!header) return;

  /* Mobile menu: Marketplace remains a normal navigation link and never depends on hover. */
  var btn = header.querySelector('button[aria-label="Toggle menu"]');
  var panel = document.createElement("div");
  panel.className = "sko-mobile-nav border-t border-border bg-background lg:hidden";
  panel.hidden = true;
  var inner = '<div class="container-site flex flex-col gap-1 py-4">';
  nav.forEach(function (n) {
    if (n[0] === "Marketplaces") {
      inner += '<div class="sko-mobile-marketplaces">';
      inner += '<button type="button" class="sko-mobile-marketplaces-toggle rounded-lg px-2 py-2 text-left text-sm font-medium text-foreground hover:bg-accent hover:text-primary" aria-expanded="false">Marketplaces <span aria-hidden="true">⌄</span></button>';
      inner += '<div class="sko-mobile-marketplaces-list" hidden>';
      inner += '<a href="' + pre + 'marketplaces.html" class="rounded-lg px-4 py-2 text-sm font-semibold text-primary">View all marketplaces</a>';
      markets.forEach(function (x) {
        inner += '<a href="' + pre + 'marketplaces/' + x[1] + '.html" class="rounded-lg px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary">' + x[0] + '</a>';
      });
      inner += '</div></div>';
    } else {
      inner += '<a href="' + pre + n[1] + '" class="rounded-lg px-2 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-primary">' + n[0] + '</a>';
    }
  });
  inner += "</div>";
  panel.innerHTML = inner;
  header.appendChild(panel);
  if (btn) {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      btn.setAttribute("aria-expanded", String(!panel.hidden));
    });
  }
  var mobileMarketToggle = panel.querySelector(".sko-mobile-marketplaces-toggle");
  var mobileMarketList = panel.querySelector(".sko-mobile-marketplaces-list");
  if (mobileMarketToggle && mobileMarketList) {
    mobileMarketToggle.addEventListener("click", function () {
      mobileMarketList.hidden = !mobileMarketList.hidden;
      mobileMarketToggle.setAttribute("aria-expanded", String(!mobileMarketList.hidden));
    });
  }

  /* Desktop mega-menu — clean single implementation. */
  var trigger = header.querySelector("[data-marketplace-nav] > a");
  var wrap = header.querySelector("[data-marketplace-nav]");
  if (!trigger || !wrap) return;

  var menu = document.createElement("div");
  menu.className = "sko-marketplace-mega";
  menu.setAttribute("role", "menu");
  menu.hidden = true;

  var grid = '<div class="sko-marketplace-mega__inner">';
  grid += '<div class="sko-marketplace-mega__intro">' +
    '<span class="sko-marketplace-mega__eyebrow">SELL KARO ONLINE</span>' +
    '<strong>Marketplace Growth</strong>' +
    '<span>Choose a channel to explore its dedicated playbook.</span>' +
    '</div>';
  grid += '<div class="sko-marketplace-mega__grid">';

  markets.forEach(function (x, i) {
    var key = x[1];
    grid +=
      '<a role="menuitem" class="sko-marketplace-mega__item" ' +
      'style="--menu-delay:' + (i * 35) + 'ms" ' +
      'href="' + pre + 'marketplaces/' + key + '.html">' +
      '<span class="sko-marketplace-mega__logo">' +
      '<img src="' + pre + 'assets/marketplace-logos/' + logoMap[key] +
      '" alt="' + x[0] + ' logo" loading="lazy">' +
      '</span>' +
      '<span class="sko-marketplace-mega__name">' + x[0] + '</span>' +
      '<span class="sko-marketplace-mega__arrow" aria-hidden="true">↗</span>' +
      '</a>';
  });

  grid += '</div></div>';
  menu.innerHTML = grid;
  wrap.appendChild(menu);

  var closeTimer = null;

  function replayMenuAnimation() {
    menu.classList.remove("is-opening");
    void menu.offsetWidth;
    menu.classList.add("is-opening");
  }

  function openMenu() {
    clearTimeout(closeTimer);
    if (menu.hidden) {
      menu.hidden = false;
      wrap.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      replayMenuAnimation();
    }
  }

  function closeMenu() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      menu.classList.remove("is-opening");
      menu.hidden = true;
      wrap.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }, 140);
  }

  /* Desktop hover/focus preview. */
  wrap.addEventListener("mouseenter", function () {
    if (window.matchMedia("(min-width:1024px)").matches) openMenu();
  });
  wrap.addEventListener("mouseleave", closeMenu);
  menu.addEventListener("mouseenter", openMenu);
  menu.addEventListener("mouseleave", closeMenu);

  /* Keyboard access. */
  trigger.addEventListener("focus", openMenu);
  trigger.addEventListener("blur", function () {
    setTimeout(function () {
      if (!wrap.contains(document.activeElement)) closeMenu();
    }, 0);
  });

  /* IMPORTANT: do not prevent the trigger's normal href.
     Clicking Marketplaces navigates to marketplaces.html. */
  trigger.addEventListener("click", function () {
    closeMenu();
  });

  /* Keep the menu open while tabbing through its links. */
  menu.addEventListener("focusin", openMenu);
  menu.addEventListener("focusout", function () {
    setTimeout(function () {
      if (!wrap.contains(document.activeElement)) closeMenu();
    }, 0);
  });

  /* Marketplace page scroll reveals + lightweight floating motion. */
  (function () {
    var reveals = document.querySelectorAll(".sko-reveal");
    if (!reveals.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  })();

  /* Marketplace marquee performance + accessibility */
  var trustMarquee = document.querySelector(".trust-marquee");
  var trustTrack = document.querySelector(".trust-marquee__track");
  if (trustMarquee && trustTrack) {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    var syncMarquee = function () {
      if (reducedMotion.matches) {
        trustTrack.style.animationPlayState = "paused";
      }
    };

    syncMarquee();
    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", syncMarquee);
    }

    if ("IntersectionObserver" in window) {
      var marqueeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          trustTrack.style.animationPlayState =
            entry.isIntersecting && !reducedMotion.matches ? "running" : "paused";
        });
      }, { threshold: 0.05 });

      marqueeObserver.observe(trustMarquee);
    }
  }


  /* contact form (static) */
  document.querySelectorAll("form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thanks! Your enquiry has been noted. We will get back within 24 hours.");
      f.reset();
    });
  });

/* Hero floating cards: subtle pointer parallax */
(function () {
  var heroVisual = document.querySelector('.hero-visual-wrap');
  var floatCards = heroVisual ? heroVisual.querySelectorAll('.hero-float') : [];
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!heroVisual || !floatCards.length || reducedMotion || window.innerWidth < 900) return;

  var frame = null;
  heroVisual.addEventListener('pointermove', function (e) {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(function () {
      var r = heroVisual.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5;
      var y = (e.clientY - r.top) / r.height - .5;
      floatCards.forEach(function (card) {
        var speed = parseFloat(card.getAttribute('data-float-speed')) || 1;
        card.style.translate = (x * 10 * speed).toFixed(1) + 'px ' + (y * 8 * speed).toFixed(1) + 'px';
      });
    });
  });

  heroVisual.addEventListener('pointerleave', function () {
    floatCards.forEach(function (card) { card.style.translate = ''; });
  });
})();


/* =========================================================
   FAQ ONLY — accessible accordion behavior
   ========================================================= */
(function () {
  function initFaqOnly() {
    var faq = document.querySelector('body[data-faq-page="true"] .faq-accordion');
    if (!faq || faq.dataset.faqReady === "true") return;
    faq.dataset.faqReady = "true";

    var items = Array.prototype.slice.call(faq.querySelectorAll(".faq-item"));
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    items.forEach(function (item, index) {
      var button = item.querySelector(":scope > button");
      if (!button) return;

      var answer = item.querySelector(":scope > p");
      if (answer) {
        answer.classList.add("faq-answer");
        answer.id = answer.id || "faq-answer-" + (index + 1);
        button.setAttribute("aria-controls", answer.id);

        var initiallyOpen = button.getAttribute("aria-expanded") === "true";
        answer.setAttribute("aria-hidden", initiallyOpen ? "false" : "true");

        if (initiallyOpen) {
          answer.classList.add("is-open");
          answer.style.height = "auto";
          answer.style.opacity = "1";
        } else {
          answer.style.height = "0px";
        }
      }

      button.addEventListener("click", function () {
        toggleItem(item);
      });

      button.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleItem(item);
        }
      });
    });

    function closeItem(item) {
      var button = item.querySelector(":scope > button");
      var answer = item.querySelector(":scope > .faq-answer");
      if (!button || !answer) return;

      button.setAttribute("aria-expanded", "false");
      answer.setAttribute("aria-hidden", "true");
      answer.classList.remove("is-open");

      if (reduceMotion) {
        answer.style.height = "0px";
        return;
      }

      answer.style.height = answer.scrollHeight + "px";
      requestAnimationFrame(function () {
        answer.style.height = "0px";
      });
    }

    function openItem(item) {
      var button = item.querySelector(":scope > button");
      var answer = item.querySelector(":scope > .faq-answer");
      if (!button || !answer) return;

      items.forEach(function (other) {
        if (other !== item) closeItem(other);
      });

      button.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");
      answer.classList.add("is-open");

      if (reduceMotion) {
        answer.style.height = "auto";
        return;
      }

      answer.style.height = "0px";
      requestAnimationFrame(function () {
        answer.style.height = answer.scrollHeight + "px";
      });

      answer.addEventListener("transitionend", function onEnd(event) {
        if (event.propertyName === "height" &&
            button.getAttribute("aria-expanded") === "true") {
          answer.style.height = "auto";
        }
      }, { once: true });
    }

    function toggleItem(item) {
      var button = item.querySelector(":scope > button");
      if (!button) return;
      var answer = item.querySelector(":scope > .faq-answer");

      // Preserve existing FAQ content exactly. If an item has no answer
      // in the supplied source, there is no text to invent or modify.
      if (!answer) return;

      if (button.getAttribute("aria-expanded") === "true") {
        closeItem(item);
      } else {
        openItem(item);
      }
    }

    // Keep all existing questions visible immediately; only answers are collapsed.
    items.forEach(function (item) {
      var button = item.querySelector(":scope > button");
      if (button && !button.hasAttribute("aria-expanded")) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFaqOnly);
  } else {
    initFaqOnly();
  }
})();


/* FAQ ONLY — ensure newly supplied answer content starts closed */
(function () {
  function normalizeFaqAnswers() {
    var faq = document.querySelector('body[data-faq-page="true"] .faq-accordion');
    if (!faq) return;

    faq.querySelectorAll(".faq-item > .faq-answer").forEach(function (answer) {
      var button = answer.parentElement.querySelector(":scope > button");
      if (!button) return;

      if (button.getAttribute("aria-expanded") !== "true") {
        answer.setAttribute("aria-hidden", "true");
        answer.classList.remove("is-open");
        answer.style.height = "0px";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", normalizeFaqAnswers);
  } else {
    normalizeFaqAnswers();
  }
})();


/* HOME REVIEW VIDEOS — play button starts exactly a 10-second preview */
(function () {
  function initReviewVideos() {
    var cards = document.querySelectorAll("[data-review-card]");
    if (!cards.length) return;

    cards.forEach(function (card) {
      if (card.getAttribute("data-video-ready") === "true") return;
      card.setAttribute("data-video-ready", "true");

      var video = card.querySelector(".review-video");
      var play = card.querySelector(".review-play-button");
      var cover = card.querySelector(".review-brand-cover");
      if (!video || !play || !cover) return;

      var stopTimer = null;

      function resetVideo() {
        if (stopTimer) {
          clearTimeout(stopTimer);
          stopTimer = null;
        }
        video.pause();
        video.currentTime = 0;
        card.classList.remove("is-playing");
        cover.style.opacity = "";
      }

      function playTenSeconds() {
        if (stopTimer) clearTimeout(stopTimer);

        video.currentTime = 0;
        video.muted = true;
        card.classList.add("is-playing");
        cover.style.opacity = "0";

        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            card.classList.remove("is-playing");
            cover.style.opacity = "";
          });
        }

        stopTimer = setTimeout(function () {
          resetVideo();
        }, 10000);
      }

      play.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        playTenSeconds();
      });

      video.addEventListener("ended", resetVideo);

      video.addEventListener("click", function () {
        resetVideo();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReviewVideos);
  } else {
    initReviewVideos();
  }
})();

/* =========================================================
   GLOBAL PREMIUM PAGE ANIMATIONS
   Scoped to <main> sections only — header/footer untouched.
   ========================================================= */
(function () {
  function initGlobalPageMotion() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("main > section")
    );
    if (!sections.length) return;

    var reduced = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sections.forEach(function (section) {
      if (section.dataset.globalMotionReady === "true") return;
      section.dataset.globalMotionReady = "true";
      section.classList.add("site-motion-section");

      /* Mark meaningful direct content blocks/cards for stagger. */
      var candidates = section.querySelectorAll(
        ".grid > *, .flex > .rounded-2xl, .grid > .rounded-2xl, " +
        "[class*='shadow-card'], [data-review-card], .faq-item, " +
        ".marketplace-playbook-option"
      );

      Array.prototype.slice.call(candidates).forEach(function (el) {
        if (!el.classList.contains("selected-work-animated") &&
            !el.classList.contains("sw-card")) {
          el.classList.add("page-motion-card");
        }
      });

      section.querySelectorAll("a[class*='rounded-full'], button[class*='rounded-full']")
        .forEach(function (el) {
          el.classList.add("page-motion-button");
        });

      section.querySelectorAll("li").forEach(function (el) {
        el.classList.add("page-motion-item");
      });
    });

    if (reduced || !("IntersectionObserver" in window)) {
      sections.forEach(function (section) {
        section.classList.add("motion-visible");
      });
      return;
    }

    /* First prepare only after JS is ready; content remains visible if JS is unavailable. */
    sections.forEach(function (section) {
      if (!section.classList.contains("selected-work-animated")) {
        section.classList.add("motion-prep");
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        requestAnimationFrame(function () {
          entry.target.classList.add("motion-visible");
          entry.target.classList.remove("motion-prep");
        });

        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.10,
      rootMargin: "0px 0px -7% 0px"
    });

    sections.forEach(function (section) {
      if (!section.classList.contains("selected-work-animated")) {
        observer.observe(section);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobalPageMotion);
  } else {
    initGlobalPageMotion();
  }
})();

/* =========================================================
   PREMIUM MODERN ANIMATION SYSTEM — ALL PAGES
   GSAP + ScrollTrigger
   ========================================================= */
(function(){
  function initPremiumMotion(){
    if(!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    var reduce=window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce) return;

    var fine=window.matchMedia("(pointer:fine)").matches;

    /* ---------- HERO ---------- */
    var hero=document.querySelector("main > section:first-child");
    if(hero){
      var heading=hero.querySelector("h1");
      var paragraphs=hero.querySelectorAll("p");
      var buttons=hero.querySelectorAll("a.rounded-full,button.rounded-full");
      var visual=hero.querySelector(
        ".hero-visual-wrap,.hero-chart-card,[class*='hero'][class*='visual']"
      );
      var floats=hero.querySelectorAll(".hero-float,[class*='float']");
      var stats=hero.querySelectorAll("[data-stat],.stat,.stats span");

      var ht=gsap.timeline({defaults:{ease:"power4.out"}});

      if(heading){
        ht.fromTo(heading,
          {autoAlpha:0,y:38,filter:"blur(7px)"},
          {autoAlpha:1,y:0,filter:"blur(0px)",duration:.9},0
        );
      }
      if(paragraphs.length){
        ht.fromTo(paragraphs,
          {autoAlpha:0,y:20},
          {autoAlpha:1,y:0,duration:.6,stagger:.05},.35
        );
      }
      if(buttons.length){
        ht.fromTo(buttons,
          {autoAlpha:0,y:18,scale:.97},
          {autoAlpha:1,y:0,scale:1,duration:.52,stagger:.08},.5
        );
      }
      if(visual){
        ht.fromTo(visual,
          {autoAlpha:0,x:50,scale:.95,rotationY:-4},
          {autoAlpha:1,x:0,scale:1,rotationY:0,duration:1.0},.08
        );
      }
      if(stats.length){
        ht.fromTo(stats,
          {autoAlpha:0,y:12},
          {autoAlpha:1,y:0,duration:.45,stagger:.06},.7
        );
      }

      floats.forEach(function(el,i){
        gsap.to(el,{
          y:"+=8",
          rotation:i%2 ? 1 : -1,
          duration:2.8+i*.2,
          repeat:-1,
          yoyo:true,
          ease:"sine.inOut",
          delay:i*.12
        });
      });
    }

    /* ---------- ALL MAIN SECTIONS ---------- */
    gsap.utils.toArray("main > section").forEach(function(section,index){
      if(section.dataset.premiumMotionReady==="true") return;
      section.dataset.premiumMotionReady="true";

      var eyebrow=section.querySelector(
        ".eyebrow,[class*='eyebrow'],[class*='badge']"
      );
      var h1=section.querySelector("h1,h2");
      var subheads=section.querySelectorAll("h3,h4");
      var paras=section.querySelectorAll(":scope p");
      var cards=section.querySelectorAll(
        ".shadow-card,.rounded-2xl.border,.faq-item,"+
        ".marketplace-playbook-option,[data-review-card],"+
        ".service-card,.case-card"
      );
      var buttons=section.querySelectorAll("a.rounded-full,button.rounded-full");
      var images=section.querySelectorAll("img,video");

      var tl=gsap.timeline({
        scrollTrigger:{
          trigger:section,
          start:"top 82%",
          once:true
        },
        defaults:{ease:"power3.out"}
      });

      /* Do not replay hero's entrance as a generic section. */
      if(section!==hero && eyebrow){
        tl.fromTo(eyebrow,
          {autoAlpha:0,y:-14,scale:.97},
          {autoAlpha:1,y:0,scale:1,duration:.5},0
        );
      }
      if(section!==hero && h1){
        tl.fromTo(h1,
          {autoAlpha:0,y:32,filter:"blur(5px)"},
          {autoAlpha:1,y:0,filter:"blur(0px)",duration:.72},.08
        );
      }
      if(section!==hero && subheads.length){
        tl.fromTo(subheads,
          {autoAlpha:0,y:18},
          {autoAlpha:1,y:0,duration:.5,stagger:.05},.18
        );
      }
      if(section!==hero && paras.length){
        tl.fromTo(paras,
          {autoAlpha:0,y:16},
          {autoAlpha:1,y:0,duration:.5,stagger:.04},.22
        );
      }
      if(cards.length){
        cards.forEach(function(card){card.classList.add("premium-motion-card");});
        tl.fromTo(cards,
          {autoAlpha:0,y:34,scale:.975},
          {autoAlpha:1,y:0,scale:1,duration:.64,stagger:.085},.30
        );
      }
      if(buttons.length){
        buttons.forEach(function(btn){btn.classList.add("premium-motion-button");});
        tl.fromTo(buttons,
          {autoAlpha:0,y:13,scale:.98},
          {autoAlpha:1,y:0,scale:1,duration:.48,stagger:.06},.5
        );
      }

      /* Scroll progress line */
      var line=document.createElement("div");
      line.className="premium-scroll-line";
      section.appendChild(line);
      gsap.to(line,{
        scaleX:1,
        ease:"none",
        scrollTrigger:{
          trigger:section,
          start:"top 85%",
          end:"bottom 25%",
          scrub:1.2
        }
      });

      /* Subtle parallax */
      if(images.length){
        images.forEach(function(img,i){
          img.classList.add("premium-motion-visual");
          gsap.to(img,{
            yPercent:i%2 ? 3 : -3,
            ease:"none",
            scrollTrigger:{
              trigger:section,
              start:"top bottom",
              end:"bottom top",
              scrub:1.5
            }
          });
        });
      }

      /* Card tilt + spotlight-like movement */
      if(fine){
        gsap.utils.toArray(cards).forEach(function(card){
          card.style.transformPerspective="1100px";
          var rx=gsap.quickTo(card,"rotationX",{duration:.35,ease:"power3.out"});
          var ry=gsap.quickTo(card,"rotationY",{duration:.35,ease:"power3.out"});
          var lift=gsap.quickTo(card,"y",{duration:.3,ease:"power3.out"});

          card.addEventListener("pointermove",function(e){
            var r=card.getBoundingClientRect();
            var x=(e.clientX-r.left)/r.width-.5;
            var y=(e.clientY-r.top)/r.height-.5;
            rx(-y*2); ry(x*2); lift(-4);
          },{passive:true});
          card.addEventListener("pointerleave",function(){
            rx(0);ry(0);lift(0);
          },{passive:true});
        });

        gsap.utils.toArray(buttons).forEach(function(btn){
          var x=gsap.quickTo(btn,"x",{duration:.25,ease:"power3.out"});
          var y=gsap.quickTo(btn,"y",{duration:.25,ease:"power3.out"});
          btn.addEventListener("pointermove",function(e){
            var r=btn.getBoundingClientRect();
            x(((e.clientX-r.left)/r.width-.5)*5);
            y(((e.clientY-r.top)/r.height-.5)*3);
          },{passive:true});
          btn.addEventListener("pointerleave",function(){x(0);y(0);},{passive:true});
        });
      }
    });

    /* ---------- MARKETPLACE ACTIVE INDICATOR ---------- */
    var list=document.querySelector(".marketplace-playbook-list");
    if(list){
      var indicator=document.createElement("span");
      indicator.className="premium-market-indicator";
      list.appendChild(indicator);

      function moveIndicator(item){
        var a=item.getBoundingClientRect();
        var b=list.getBoundingClientRect();
        gsap.to(indicator,{
          y:a.top-b.top,
          height:a.height,
          duration:.38,
          ease:"power3.out"
        });
      }

      var initial=list.querySelector(".marketplace-playbook-option.active");
      if(initial) gsap.set(indicator,{y:initial.offsetTop,height:initial.offsetHeight});

      list.querySelectorAll(".marketplace-playbook-option").forEach(function(item){
        item.addEventListener("mouseenter",function(){moveIndicator(item);});
        item.addEventListener("focus",function(){moveIndicator(item);});
      });
    }

    /* ---------- REVIEW VIDEO HOVER ---------- */
    document.querySelectorAll("[data-review-card]").forEach(function(card){
      var frame=card.querySelector(
        ".review-video-frame,video,img"
      );
      var play=card.querySelector(".review-play-button");
      if(!frame) return;

      card.addEventListener("mouseenter",function(){
        gsap.to(frame,{scale:1.025,duration:.42,ease:"power3.out"});
        if(play) gsap.to(play,{scale:1.08,autoAlpha:1,duration:.28});
      });
      card.addEventListener("mouseleave",function(){
        gsap.to(frame,{scale:1,duration:.42,ease:"power3.out"});
        if(play) gsap.to(play,{scale:1,autoAlpha:.92,duration:.24});
      });
    });

    /* ---------- FAQ ---------- */
    document.querySelectorAll(".faq-item").forEach(function(item){
      var button=item.querySelector("button");
      var answer=item.querySelector(
        ".faq-answer,[data-faq-answer],.answer"
      );
      if(!button || !answer || button.dataset.premiumFaq==="true") return;
      button.dataset.premiumFaq="true";

      /* Only initialize closed answers if they are not intentionally open. */
      var expanded=button.getAttribute("aria-expanded")==="true";
      if(!expanded) gsap.set(answer,{height:0,opacity:0,overflow:"hidden"});

      button.addEventListener("click",function(){
        var open=button.getAttribute("aria-expanded")==="true";

        if(open){
          gsap.to(answer,{height:0,opacity:0,duration:.4,ease:"power2.inOut"});
        }else{
          gsap.set(answer,{height:"auto"});
          var h=answer.offsetHeight;
          gsap.set(answer,{height:0});
          gsap.to(answer,{height:h,opacity:1,duration:.48,ease:"power3.out"});
        }
      });
    });

    window.addEventListener("load",function(){
      ScrollTrigger.refresh();
    },{once:true});

    setTimeout(function(){ScrollTrigger.refresh();},350);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initPremiumMotion);
  }else{
    initPremiumMotion();
  }
})();

/* =========================================================
   SVGATOR-STYLE INTERACTION CONTROLLER
   ========================================================= */
(function(){
  function initSVGatorStyleMotion(){
    var reduce=window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Native SVG animations begin automatically; GSAP only coordinates
       section reveal and existing interactions. */
    if(!window.gsap || !window.ScrollTrigger || reduce) {
      document.querySelectorAll(".svgator-reveal").forEach(function(el){
        el.classList.add("is-visible");
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".svgator-reveal").forEach(function(el){
      gsap.fromTo(el,
        {autoAlpha:0,y:24,scale:.97},
        {
          autoAlpha:1,y:0,scale:1,duration:.7,ease:"power3.out",
          scrollTrigger:{
            trigger:el,
            start:"top 86%",
            once:true
          }
        }
      );
    });

    /* Recalculate after SVG dimensions are available. */
    window.addEventListener("load",function(){
      ScrollTrigger.refresh();
    },{once:true});
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initSVGatorStyleMotion);
  }else{
    initSVGatorStyleMotion();
  }
})();



/* SERVICE CARD — STANDALONE MOUSE TILT */
(function(){
  function initServiceCardMotion(){
    if(!window.gsap) return;
    if(window.matchMedia("(pointer: coarse)").matches) return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll(".container-site.space-y-6 > article.shadow-card").forEach(function(card){
      var rx=gsap.quickTo(card,"rotationX",{duration:.45,ease:"power3.out"});
      var ry=gsap.quickTo(card,"rotationY",{duration:.45,ease:"power3.out"});
      var sx=gsap.quickTo(card,"x",{duration:.45,ease:"power3.out"});
      var sy=gsap.quickTo(card,"y",{duration:.45,ease:"power3.out"});

      card.addEventListener("pointermove",function(e){
        var r=card.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-.5;
        var py=(e.clientY-r.top)/r.height-.5;
        rx(-py*2.2);
        ry(px*2.2);
        sx(px*1.5);
        sy(-3+py*1.5);
      },{passive:true});

      card.addEventListener("pointerleave",function(){
        rx(0);ry(0);sx(0);sy(0);
      },{passive:true});
    });
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initServiceCardMotion);
  }else{
    initServiceCardMotion();
  }
})();

})();
