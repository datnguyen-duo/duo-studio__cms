import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollSmoother } from "gsap/dist/ScrollSmoother";

let scroller;

document.addEventListener("DOMContentLoaded", function (event) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable);

  gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

  var cursor = document.querySelector(".cursor");
  var pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var mouse = { x: pos.x, y: pos.y };
  var speed = 0.1;

  var fpms = 60 / 1000;

  var xSet = gsap.quickSetter(cursor, "x", "px");
  var ySet = gsap.quickSetter(cursor, "y", "px");

  document.body.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  gsap.ticker.add((time, deltaTime) => {
    var delta = deltaTime * fpms;
    var dt = 1.0 - Math.pow(1.0 - speed, delta);

    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    xSet(pos.x);
    ySet(pos.y);
  });

  //REFRESH ON ORIENTATION CHANGE https://stackoverflow.com/questions/17708869/how-to-reload-the-webpage-when-orientation-changes
  window.onorientationchange = function () {
    var orientation = window.orientation;
    switch (orientation) {
      case 0:
      case 90:
      case -90:
        window.location.reload();
        break;
    }
  };
});

window.addEventListener("load", (event) => {
  // NAV

  if (window.innerWidth > 1024) {
    const navItems = document.querySelectorAll(".nav-item, .egg");
    const containerItems = document.querySelectorAll(".nav-container__inner");

    navItems.forEach((item, i) => {
      var el = containerItems[i].querySelector(".nav-marquee"),
        container = el.querySelector(".nav-marquee__container"),
        marquee = el.querySelector(".nav-marquee__inner"),
        w = marquee.clientWidth,
        x = Math.round(window.innerWidth / w + 1),
        dur = 2;

      for (var y = 0; y < x; y++) {
        var clone = marquee.cloneNode(true);
        container.appendChild(clone);
      }

      var marqueeTl = gsap.timeline({ paused: true });
      marqueeTl.to(container, {
        duration: dur,
        ease: "none",
        x: "-=" + w,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x)),
        },
        repeat: -1,
      });
      item.addEventListener("mouseenter", function () {
        containerItems[i].classList.add("active");
        document.body.classList.add("init__nav");
        marqueeTl.play();
      });

      item.addEventListener("mouseleave", function () {
        containerItems[i].classList.remove("active");
        document.body.classList.remove("init__nav");
        marqueeTl.pause();
      });
    });
  } else {
    var navToggle = document.querySelector(".nav-toggle");
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("init__nav");
    });
  }
});

function loadGlobalScripts() {
  if (document.querySelector(".cursor__hide")) {
    gsap.utils.toArray(".cursor__hide").forEach((el) => {
      el.addEventListener("mouseenter", function () {
        document.body.classList.add("cursor__hidden");
      });
      el.addEventListener("mouseleave", function () {
        document.body.classList.remove("cursor__hidden");
      });
    });
  }

  if (document.querySelector(".cursor__hover")) {
    document.querySelectorAll(".cursor__hover").forEach((hover) => {
      var text = hover.getAttribute("data-attribute-text");

      if (hover.classList.contains("--highlight")) {
        var highlight = "--highlight";
      } else {
        var highlight = "";
      }
      hover.addEventListener("mouseenter", function () {
        document.querySelector(".cursor span").textContent = text;
        document.body.classList.add("cursor__hover" + highlight);
      });
      hover.addEventListener("mouseleave", function () {
        document.body.classList.remove("cursor__hover" + highlight);
      });
    });
  }

  // SLIDERS

  if (document.querySelector(".slider")) {
    const sliders = new Swiper(".slider", {
      slidesPerView: 1,
      centeredSlides: true,
      loop: true,
      speed: 1000,
      allowTouchMove: true,
      allowTouchMove: false,
      effect: "creative",
      creativeEffect: {
        next: {
          translate: [0, "100%", 0],
          scale: 1.5,
          rotate: [0, 0, -15],
          origin: "right top",
        },
      },
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 3,
      },
    });

    if (sliders.length > 1) {
      sliders.forEach((slider) => {
        var clickable = slider.el;
        clickable.addEventListener("click", function () {
          slider.slideNext();
        });
      });
    } else {
      if (sliders.slides.length > 1) {
        var clickable = sliders.el;
        clickable.addEventListener("click", function () {
          sliders.slideNext();
        });
      }
    }
  }

  if (document.querySelector(".slider__draggable")) {
    if (window.innerWidth > 1024) {
      const draggableSliders = new Swiper(".slider__draggable", {
        slidesPerView: "auto",
        allowTouchMove: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          draggable: true,
          dragSize: 100,
        },
        freeMode: {
          enabled: true,
          sticky: false,
          momentumBounce: false,
        },
      });
    }
  }

  //  GLOBAL TEXT LOAD

  // TEXT TRANSITIONS
  if (document.querySelector(".st__headline")) {
    gsap.utils.toArray(".st__headline").forEach((headline) => {
      var splitInner = new SplitText(headline, {
        type: "lines",
        linesClass: "line__inner",
      });

      var splitOuter = new SplitText(headline, {
        type: "lines",
        linesClass: "line__outer",
      });

      if (headline.classList.contains("headline__footer")) {
        var tl = gsap.timeline({
          onComplete: function () {
            gsap.set(headline, { pointerEvents: "initial" });
          },
          scrollTrigger: {
            trigger: headline,
            start: "top 45%",
          },
        });
        tl.from(splitInner.lines, 0.8, {
          yPercent: 50,
          rotation: 5,
          opacity: 0,
          ease: "Power2.easeOut",
          stagger: 0.1,
        });
      } else {
        var tl = gsap.timeline({
          onComplete: function () {
            gsap.set(headline, { pointerEvents: "initial" });
          },
          scrollTrigger: {
            trigger: headline,
            start: "top 80%",
          },
        });
        tl.from(splitInner.lines, 0.8, {
          yPercent: 50,
          rotation: 5,
          opacity: 0,
          ease: "Power2.easeOut",
          stagger: 0.1,
        });
      }
    });
  }

  if (document.querySelector(".st__text")) {
    gsap.utils.toArray(".st__text").forEach((headline) => {
      gsap.from(headline, 1, {
        y: 40,
        opacity: 0,
        ease: "Power2.easeOut",
        scrollTrigger: {
          trigger: headline,
          start: "top 90%",
        },
      });
    });
  }

  // IMAGE TRANSITIONS

  if (document.querySelector(".st__image")) {
    gsap.utils.toArray(".st__image").forEach((image) => {
      var pos = image.getAttribute("data-attribute-pos");
      var fade = image.getAttribute("data-attribute-fade");

      if (pos == "right") {
        var skew = -5;
        if (window.innerWidth > 1024) {
          var y = "25";
        } else {
          var y = "20";
        }
      } else {
        var skew = 5;
        var y = "-25";

        if (window.innerWidth > 1024) {
          var y = "-25";
        } else {
          var y = "-20";
        }
      }

      if (fade) {
        var opacity = 1;
      } else {
        var opacity = 0;
      }

      gsap.from(image, 0.8, {
        skewY: skew,
        yPercent: 35,
        opacity: opacity,
        scrollTrigger: {
          trigger: image,
          start: "top 100%",
          ease: "power3.In",
        },
      });

      //PARALLAX

      var plaxEl = image.closest(".st__image-container");

      if (plaxEl) {
        gsap.to(plaxEl, {
          yPercent: y,
          scrollTrigger: {
            trigger: plaxEl,
            start: "top bottom",
            scrub: true,
          },
        });
      }
    });
  }
  if (document.querySelector(".st__full-width")) {
    gsap.utils.toArray(".st__full-width").forEach((container) => {
      var image = container.querySelector("img");
      gsap.to(image, {
        scale: 1,
        scrollTrigger: {
          trigger: container,
          scrub: true,
          ease: "power3.Out",
        },
      });
    });
  }

  // MAGNETIC BUTTON

  var buttons = document.querySelectorAll(".btn__circle");

  if (buttons) {
    buttons.forEach((btn) => {
      var offsetHoverMax = 1;
      var offsetHoverMin = 1;
      var hover = false;

      window.addEventListener("mousemove", function (e) {
        var hoverArea = hover ? offsetHoverMax : offsetHoverMin;

        var cursor = {
          x: e.clientX,
          y: e.clientY + this.window.scrollY,
        };

        var width = btn.clientWidth;
        var height = btn.clientHeight;

        function getOffset(element) {
          if (!element.getClientRects().length) {
            return { top: 0, left: 0 };
          }

          let rect = element.getBoundingClientRect();
          let win = element.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset,
          };
        }
        var offset = getOffset(btn);

        var elPos = {
          x: offset.left + width / 2,
          y: offset.top + height / 2,
        };

        var x = cursor.x - elPos.x;
        var y = cursor.y - elPos.y;

        var dist = Math.sqrt(x * x + y * y);

        var mutHover = false;

        if (dist < width * hoverArea) {
          mutHover = true;
          if (!hover) {
            hover = true;
          }
          onHover(x, y);
        }

        if (!mutHover && hover) {
          onLeave();
          hover = false;
        }
      });

      var onHover = function (x, y) {
        document.body.classList.add("cursor__hidden");
        btn.classList.add("active");
        gsap.to(btn, 0.4, {
          x: x * 0.4,
          y: y * 0.4,
          ease: Power2.easeOut,
        });
        gsap.to(btn.querySelector("*"), 0.4, {
          x: x * 0.1,
          y: y * 0.1,
          ease: Power2.easeOut,
        });
      };

      var onLeave = function () {
        document.body.classList.remove("cursor__hidden");
        btn.classList.remove("active");
        gsap.to(btn, 1, {
          x: 0,
          y: 0,
          scale: 1,
          ease: Elastic.easeOut.config(1.2, 0.4),
        });
        gsap.to(btn.querySelector("*"), 1, {
          x: 0,
          y: 0,
          scale: 1,
          ease: Elastic.easeOut.config(1.2, 0.4),
        });
      };
    });
  }

  // HOVERS

  if (document.querySelector(".hover__headline")) {
    gsap.utils.toArray(".hover__headline").forEach((headline) => {
      var major = headline.querySelectorAll("h1")[0],
        minor = headline.querySelectorAll("h1")[1];

      var tl = gsap.timeline({ paused: true });
      tl.to(major, {
        yPercent: -100,
        rotation: -5,
        opacity: 0,
        ease: "power2.inOut",
      });
      tl.to(
        minor,
        { y: 0, rotation: 0, opacity: 1, ease: "power2.inOut" },
        "<"
      );

      headline.addEventListener("mouseover", function () {
        tl.play();
      });
      headline.addEventListener("mouseleave", function () {
        tl.reverse();
      });
    });
  }

  // LINES
  if (document.querySelector(".st__line")) {
    gsap.utils.toArray(".st__line").forEach((line, i) => {
      gsap.to(line, 0.8, {
        width: "100vw",
        scrollTrigger: {
          trigger: line,
          start: "top bottom",
          ease: "Power2.easeIn",
        },
      });
    });
  }

  // FOOTER

  var footerPin = document.querySelector(".footer-spacer");

  if (footerPin) {
    var h = window.innerHeight;

    if (h > 650) {
      gsap.from("footer", {
        yPercent: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: footerPin,
          start: "top bottom",
          scrub: true,
          end: "+=" + h,
        },
      });
    }
  }

  if (document.querySelector(".bg__trigger")) {
    gsap.utils.toArray(".bg__trigger").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        toggleClass: { targets: "body", className: "bg__dark" },
      });
    });
  }

  ScrollTrigger.refresh();
}

function loadIndexScripts() {
  var trigger = document.querySelector(".top"),
    end =
      document.querySelector("#banner").clientHeight - trigger.clientHeight + 2;

  var splitInner = new SplitText(trigger, {
    type: "lines",
    linesClass: "line__inner",
  });

  var splitOuter = new SplitText(trigger, {
    type: "lines",
    linesClass: "line__outer",
  });

  var y = window.innerWidth > 1024 ? 40 : 20;

  document.querySelector(".barba-container").classList.remove("loading");

  var loaderTl = gsap.timeline();
  loaderTl.from(".promo", {
    opacity: 0,
    delay: 0.2,
    ease: "Power2.easeIn",
  });
  loaderTl.to(
    "#banner .inner",
    {
      yPercent: y,
      scrollTrigger: {
        trigger: "#banner",
        start: "top top",
        ease: "expo.inOut",
        scrub: true,
      },
    },
    "<"
  );
  loaderTl.from(
    splitInner.lines,
    0.8,
    {
      yPercent: 50,
      rotation: 5,
      opacity: 0,
      ease: "Power2.easeOut",
      stagger: 0.1,
    },
    "<"
  );
  gsap.to("#banner .promo", {
    scaleX: 1,
    scaleY: 1,
    y: 0,
    scrollTrigger: {
      trigger: "#banner",
      start: "5px top",
      ease: "expo.inOut",
    },
  });

  ScrollTrigger.create({
    trigger: "#intro",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: function () {
      document.body.classList.add("intro-leave");
    },
    onLeaveBack: function () {
      document.body.classList.remove("intro-leave");
    },
  });

  // HOVERS

  gsap.utils.toArray(".hover__headline").forEach((headline) => {
    var minor = headline.nextElementSibling,
      major = headline.nextElementSibling.nextElementSibling;

    var tl = gsap.timeline({ paused: true });
    tl.to(minor, 0.35, {
      skewX: 0,
      skewY: 0,
      yPercent: -10,
      opacity: 0.8,
      scale: 1,
      rotation: 0,
    });
    tl.to(
      major,
      0.35,
      {
        skewX: 0,
        skewY: 0,
        yPercent: 10,
        opacity: 0.8,
        scale: 1,
        rotation: 0,
      },
      "<.02"
    );

    headline.addEventListener("mouseenter", function () {
      tl.play();
    });

    headline.addEventListener("mouseleave", function () {
      tl.reverse();
    });
  });

  // MENTIONS CLIENTS

  gsap.set(".client-images", { xPercent: -50, yPercent: -50 });
  var cursor = document.querySelector(".client-images");
  var pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var mouse = { x: pos.x, y: pos.y };
  var speed = 0.1;

  var fpms = 60 / 1000;

  var xSet = gsap.quickSetter(cursor, "x", "px");
  var ySet = gsap.quickSetter(cursor, "y", "px");

  document.body.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  gsap.ticker.add((time, deltaTime) => {
    var delta = deltaTime * fpms;
    var dt = 1.0 - Math.pow(1.0 - speed, delta);

    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    xSet(pos.x);
    ySet(pos.y);
  });

  document.querySelectorAll(".container__inner").forEach((container) => {
    var inner = container.querySelectorAll(".inner");
    inner.forEach((client, i) => {
      client.addEventListener("mouseenter", function () {
        document.body.classList.add("cursor__image", "init__" + (i + 1));
      });
      client.addEventListener("mouseleave", function () {
        document.body.classList.remove("cursor__image", "init__" + (i + 1));
      });
    });
  });

  function toggle(selected) {
    var rows = selected.querySelectorAll(".inner"),
      loadMore = selected.querySelector(".load-more");
    if (window.innerWidth < 1024) {
      scroller.scrollTo("#clients header", false);
    }
    var tl = gsap.timeline({
      onStart: function () {
        scroller.paused(true);
        document.querySelector("#clients header").classList.add("no-pointer");
      },
      onComplete: function () {
        document
          .querySelector("#clients header")
          .classList.remove("no-pointer");
        ScrollTrigger.refresh();
        scroller.paused(false);
      },
    });
    tl.to(".container__inner", { opacity: 0 });
    tl.set(".container__inner", { display: "none" });
    tl.set(selected, { display: "flex" });
    tl.to(selected, { opacity: 1 });
    tl.from(
      rows,
      1,
      {
        y: 40,
        opacity: 0,
        ease: "Power2.easeOut",
        stagger: 0.02,
      },
      "<"
    );
    tl.from(
      loadMore,
      1,
      {
        y: 10,
        opacity: 0,
        ease: "Power2.easeOut",
      },
      "<30%"
    );
  }

  document.querySelectorAll("#clients header h1").forEach((headline, i) => {
    if (i > 0) {
      headline.addEventListener("click", function () {
        var selected = document.querySelector(".-clients");
        document.body.classList.add("init__clients");
        toggle(selected);
      });
    } else {
      headline.addEventListener("click", function () {
        var selected = document.querySelector(".-mentions");
        document.body.classList.remove("init__clients");
        toggle(selected);
      });
    }
  });
  document
    .querySelector("#clients header .toggle")
    .addEventListener("click", function (e, i) {
      if (document.body.classList.contains("init__clients")) {
        var selected = document.querySelector(".-mentions");
      } else {
        var selected = document.querySelector(".-clients");
      }
      document.body.classList.toggle("init__clients");
      toggle(selected);
    });

  var loadBtn = document.querySelector(".load-more");

  function loadMore(selected) {
    var tl = gsap.timeline({
      onStart: function () {
        scroller.paused(true);
      },
      onComplete: function () {
        ScrollTrigger.refresh();
        document.body.classList.add("bg__dark");
        scroller.paused(false);
      },
    });
    tl.set(selected, { display: "block" });
    tl.from(selected, 1, {
      y: 40,
      opacity: 0,
      ease: "Power2.easeOut",
      stagger: 0.02,
    });
  }
  loadBtn.addEventListener("click", function () {
    gsap.to("#clients .container", { width: "100vw", ease: "power2.inOut" });
    gsap.to(this, { opacity: 0, pointerEvents: "none" });
    if (document.body.classList.contains("init__clients")) {
      var selected = document.querySelectorAll(".-clients .next");
      loadMore(selected);
    } else {
      var selected = document.querySelectorAll(".-mentions .next");
      loadMore(selected);
    }
  });
  ScrollTrigger.refresh();
}

function loadStudioScripts() {
  var headline = document.querySelector(".headline__load");
  var splitInner = new SplitText(headline, {
    type: "lines",
    linesClass: "line__inner",
  });
  var splitOuter = new SplitText(headline, {
    type: "lines",
    linesClass: "line__outer",
  });
  var tl = gsap.timeline();

  if (window.innerWidth > 1024) {
    document.querySelectorAll(".accordion").forEach((accordion) => {
      var header = accordion.querySelector(".header"),
        end = accordion.clientHeight - header.clientHeight - 3;

      ScrollTrigger.create({
        trigger: header,
        start: "top top",
        end: () => "+=" + end,
        pinnedContainer: accordion,
        pinType: "transform",
        onRefreshInit: (self) => self.scroll(0),
        pin: true,
      });
    });
    ScrollTrigger.refresh();
  } else {
    document.querySelectorAll(".accordion").forEach((accordion) => {
      accordion.addEventListener("click", function () {
        accordion.classList.toggle("expanded");
        document.body.classList.add("bg__dark");
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 400);
      });
    });
  }

  if (window.location.hash) {
    var hash = window.location.hash,
      location = document.querySelector(hash),
      offset = window.innerWidth > 1024 ? 0 : "top 50px";
    setTimeout(() => {
      scroller.scrollTo(location, false, offset);
    }, 50);

    if (window.innerWidth < 1024) {
      location.classList.add("expanded");
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);
    }

    setTimeout(() => {
      document.querySelector(".barba-container").classList.remove("loading");
    }, 100);
  } else {
    document.querySelector(".barba-container").classList.remove("loading");
  }

  tl.from(splitInner.lines, 0.8, {
    yPercent: 50,
    rotation: 5,
    opacity: 0,
    ease: "Power2.easeOut",
    stagger: 0.1,
  });
  tl.from("#banner .minor", 1, { opacity: 0, ease: "Power2.easeOut" }, "<");

  var testimonialTl = gsap.timeline({
    repeat: -1,
    paused: true,
  });

  var testimonial = document.getElementById("testimonial"),
    allContent = testimonial.querySelectorAll(".content"),
    pagination = testimonial.querySelectorAll(".inner"),
    opacity = window.innerWidth > 1024 ? 0.3 : 0,
    y = window.innerWidth > 1024 ? 0 : "-1em";
  allContent.forEach((content, i) => {
    var text = content,
      nextContent = content.nextElementSibling;
    if (!nextContent) {
      var nextText = allContent[0],
        x = 0;
    } else {
      var nextText = nextContent,
        x = i + 1;
    }

    testimonialTl.to(text, 0.6, {
      y: "-1em",
      opacity: 0,
      ease: "power2.Out",
    });
    testimonialTl.to(
      pagination[i],
      {
        y: y,
        opacity: opacity,
        ease: "power2.In",
      },
      "<"
    );
    testimonialTl.to(nextText, 0.6, {
      y: 0,
      opacity: 1,
      stagger: 0.03,
      ease: "power2.In",
    });
    testimonialTl.to(
      pagination[x],
      {
        opacity: 1,
        y: 0,
      },
      "<"
    );
    testimonialTl.set(text, {
      y: "1em",
    });
    if (window.innerWidth < 1024) {
      testimonialTl.set(pagination[i], {
        y: "1em",
      });
    }
    testimonialTl.addPause();
  });

  testimonial.addEventListener("click", function () {
    testimonialTl.play();
  });
}

function loadContactScripts() {
  var headline = document.querySelector(".headline__load"),
    tl = gsap.timeline();
  var splitInner = new SplitText(headline, {
    type: "lines",
    linesClass: "line__inner",
  });

  var splitOuter = new SplitText(headline, {
    type: "lines",
    linesClass: "line__outer",
  });

  document.querySelector(".barba-container").classList.remove("loading");

  var tl = gsap.timeline({
    onComplete: function () {
      gsap.set(headline, { pointerEvents: "initial" });
    },
  });
  tl.from(splitInner.lines, 0.8, {
    yPercent: 50,
    rotation: 5,
    opacity: 0,
    ease: "Power2.easeOut",
    stagger: 0.1,
  });
  tl.from("#banner .row", 1, { opacity: 0, ease: "Power2.easeOut" }, "<");
  tl.from("#form h2", 1, { y: 20, opacity: 0, ease: "Power2.easeOut" }, "<25%");
  tl.from(
    ".input-wrapper",
    1,
    { y: 20, opacity: 0, ease: "Power2.easeOut", stagger: 0.02 },
    "<"
  );

  document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("focus", function () {
      var parent = this.closest(".input-wrapper");
      parent.classList.add("active");
    });

    input.addEventListener("focusout", function () {
      var parent = this.closest(".input-wrapper");
      parent.classList.remove("active");
    });
  });
  // TEXTAREA AUTOHEIGHT
  // source:https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    );
    tx[i].addEventListener("input", OnInput, false);
  }

  function OnInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
    ScrollTrigger.refresh();
  }

  // FORM SUBMISSION (https://docs.netlify.com/forms/setup/)
  const handleSubmit = (event) => {
    event.preventDefault();

    const myForm = event.target;
    const formData = new FormData(myForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => document.querySelector("button").classList.add("success"))
      .catch((error) => alert(error));
  };

  document.querySelector("form").addEventListener("submit", handleSubmit);
}

function loadWorkScripts() {
  var headline = document.querySelector(".headline__load");
  var splitInner = new SplitText(headline, {
    type: "lines",
    linesClass: "line__inner",
  });
  var splitOuter = new SplitText(headline, {
    type: "lines",
    linesClass: "line__outer",
  });
  var tl = gsap.timeline();
  document.querySelector(".barba-container").classList.remove("loading");

  tl.from(splitInner.lines, 0.8, {
    yPercent: 50,
    rotation: 5,
    opacity: 0,
    ease: "Power2.easeOut",
    stagger: 0.1,
  });
  tl.from(
    "header .content",
    1,
    { y: 20, opacity: 0, ease: "Power2.easeOut" },
    "<25%"
  );
}

function loadProjectScripts(triggerState, prev) {
  var trigger = document.querySelector(".top"),
    end =
      document.querySelector("#banner").clientHeight - trigger.clientHeight + 2;

  var splitInner = new SplitText(trigger, {
    type: "lines",
    linesClass: "line__inner",
  });

  var splitOuter = new SplitText(trigger, {
    type: "lines",
    linesClass: "line__outer",
  });
  document.querySelector(".barba-container").classList.remove("loading");

  if (prev !== "project") {
    var loaderTl = gsap.timeline();
    loaderTl.from(".promo", {
      opacity: 0,
      delay: 0.2,
      ease: "Power2.easeIn",
    });
    loaderTl.from(
      splitInner.lines,
      0.8,
      {
        yPercent: 50,
        rotation: 5,
        opacity: 0,
        ease: "Power2.easeOut",
        stagger: 0.1,
      },
      "<"
    );
  } else {
    if (
      triggerState == "popstate" ||
      triggerState == "back" ||
      triggerState == "forward"
    ) {
      var loaderTl = gsap.timeline();
      loaderTl.from(".promo", {
        opacity: 0,
        delay: 0.2,
        ease: "Power2.easeIn",
      });
      loaderTl.from(
        splitInner.lines,
        0.8,
        {
          yPercent: 50,
          rotation: 5,
          opacity: 0,
          ease: "Power2.easeOut",
          stagger: 0.1,
        },
        "<"
      );
    }
  }

  if (window.innerWidth > 1024) {
    ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end: end,
      pinnedContainer: trigger,
      pinType: "transform",
      pin: true,
    });
  }

  ScrollTrigger.create({
    trigger: "#sec__001",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: function () {
      document.body.classList.add("intro-leave");
    },
    onLeaveBack: function () {
      document.body.classList.remove("intro-leave");
    },
  });

  if (window.innerWidth > 1024) {
    gsap.utils.toArray(".pin__sticky").forEach((pin, i) => {
      var trigger = pin.querySelector(".minor");
      var bar = pin.querySelector(".bar");
      ScrollTrigger.create({
        trigger: trigger,
        start: "top 125px",
        end: "bottom 50%",
        pinnedContainer: trigger,
        pinType: "transform",
        onRefreshInit: (self) => self.scroll(0),
        onUpdate: (self) => (bar.style.width = self.progress * 100 + "%"),
        pin: true,
      });
    });
  }
}

function loadEggScripts() {
  const eggSlider = new Swiper(".slider__egg", {
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    speed: 1000,
    allowTouchMove: true,
    preloadImages: false,
    allowTouchMove: false,
    effect: "creative",
    creativeEffect: {
      next: {
        translate: [0, "100%", 0],
        scale: 1.5,
        rotate: [0, 0, -15],
        origin: "right top",
      },
    },
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 3,
    },
  });

  if (window.innerWidth > 1024) {
    gsap.set(".cursor__egg", { xPercent: -50, yPercent: -50 });
    var cursor = document.querySelector(".cursor__egg");
    var pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var mouse = { x: pos.x, y: pos.y };
    var speed = 0.1;

    var fpms = 60 / 1000;

    var xSet = gsap.quickSetter(cursor, "x", "px");
    var ySet = gsap.quickSetter(cursor, "y", "px");

    document.body.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    gsap.ticker.add((time, deltaTime) => {
      var delta = deltaTime * fpms;
      var dt = 1.0 - Math.pow(1.0 - speed, delta);

      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    });
  }

  var headline = document.querySelector(".headline__load");
  var splitInner = new SplitText(headline, {
    type: "lines",
    linesClass: "line__inner",
  });
  var splitOuter = new SplitText(headline, {
    type: "lines",
    linesClass: "line__outer",
  });
  var loaderTl = gsap.timeline();

  document.querySelector(".barba-container").classList.remove("loading");

  loaderTl.from(splitInner.lines, 0.8, {
    yPercent: 50,
    rotation: 5,
    opacity: 0,
    ease: "Power2.easeOut",
    stagger: 0.1,
  });
  loaderTl.from(
    ".slider__egg",
    1,
    {
      opacity: 0,
      ease: "Power2.easeOut",
    },
    "<.2"
  );

  var container = document.getElementById("easter-egg"),
    headlines = container.querySelectorAll("h1"),
    h = headlines[0].clientHeight * 1.1;

  var headlineTl = gsap.timeline({
    repeat: -1,
    paused: true,
  });

  headlines.forEach((headline, i) => {
    var nextHeadline = headline.nextElementSibling;
    if (!nextHeadline) {
      var nextHeadline = headlines[0];
    }

    headlineTl.to(headline, 1, {
      y: -h,
      rotation: -5,
      opacity: 0,
      ease: "power2.inOut",
    });
    headlineTl.to(
      nextHeadline,
      1,
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: "power2.inOut",
      },
      "<"
    );

    headlineTl.set(headline, {
      y: h,
      rotation: 5,
      opacity: 0,
    });
    headlineTl.addPause();
  });

  var display = document.querySelectorAll(".display");

  display.forEach((el, i) => {
    var inner = el.querySelectorAll(".display__inner");
    var innerHeight = inner[0].clientHeight;
    var displayTl = gsap.timeline({
      repeat: -1,
      paused: true,
    });
    inner.forEach((innerEl) => {
      var nextEl = innerEl.nextElementSibling;
      if (!nextEl) {
        var nextEl = inner[0];
      }
      displayTl.to(innerEl, 1, {
        y: -innerHeight,
        ease: "power2.inOut",
      });
      displayTl.to(
        nextEl,
        1,
        {
          y: 0,
          ease: "power2.inOut",
        },
        "<"
      );

      displayTl.set(innerEl, {
        y: innerHeight,
      });
      displayTl.addPause();
    });

    container.addEventListener("click", function () {
      displayTl.play();
    });
  });

  container.addEventListener("click", function () {
    eggSlider.slideNext();
    headlineTl.play();
  });
}

function load404Scripts() {
  document.querySelector(".barba-container").classList.remove("loading");
}

document.addEventListener("DOMContentLoaded", function (event) {
  var nav = document.querySelector("nav"),
    navItems = document.querySelectorAll(".nav-item, .egg");
  //GENERAL TRANSITIONS
  function pageTransitionLeave() {
    var tl = gsap.timeline({
      onComplete: function () {
        nav.classList.add("no-pointer");
        document.body.classList.remove("intro-leave", "--project");
        gsap.set(".nav-container", { clearProps: "all" });
      },
    });
    tl.to(".page-transition", {
      skewX: 0,
      skewY: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      ease: "power3.InOut",
    });
    tl.to(
      ".barba-container, .nav-container",
      { filter: "blur(20px)", ease: "power3.Out" },
      "<"
    );
    tl.add(function () {
      let allTriggers = ScrollTrigger.getAll();
      for (let i = 0; i < allTriggers.length; i++) {
        allTriggers[i].kill(true);
      }
    });
  }

  function pageTransitionEnter(data) {
    var tl = gsap.timeline();
    tl.to(".page-transition", {
      opacity: 0,
      ease: "power3.Out",
    });
    tl.set(".page-transition", { clearProps: "all" });
    nav.classList.remove("no-pointer");
  }

  //NEXT PROJECT TRANSITION

  function projectTransitionLeave(data) {
    document.body.classList.add("--project");
    gsap.to(".footer-spacer .btn__mobile", 0.2, {
      opacity: 0,
      ease: "power3.Out",
    });
    var tl = gsap.timeline();
    tl.add(function () {
      scroller.scrollTo(".footer-spacer", true);
    });
    if (window.innerWidth > 1024) {
      tl.to(".footer-spacer", 0.3, {
        paddingTop: "0vw",
        ease: "Power2.easeOut",
      });
    } else {
      tl.to(".footer-spacer", 0.3, {
        paddingTop: "0vh",
        ease: "Power2.easeOut",
      });
    }
  }

  function projectTransitionEnter(data) {
    document.querySelector(".barba-container").classList.remove("loading");
  }
  function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
      setTimeout(() => {
        done();
      }, n);
    });
  }
  barba.hooks.beforeEnter((data) => {
    document.body.classList.remove("intro-leave", "cursor__hover", "init__nav");

    var scrollContainer = data.next.container,
      fullHeight = document.querySelectorAll(".full-height"),
      namespace = data.next.namespace;

    if (window.innerWidth < 1024) {
      fullHeight.forEach((el) => {
        el.style.height = document.documentElement.clientHeight + "px";
      });
    }

    navItems.forEach((item) => {
      var attr = item.getAttribute("data-attribute-item");
      if (attr == namespace) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    imagesLoaded(
      scrollContainer.querySelector("section:first-of-type"),
      function () {
        window.scrollTo(0, 0);
        scroller = ScrollSmoother.create({
          smooth: 0.3,
        });

        loadGlobalScripts();
      }
    );
  });

  barba.hooks.afterEnter((data) => {
    // ga("set", "page", window.location.pathname);
    // ga("send", "pageview");
    var vids = document.querySelectorAll("video");
    vids.forEach((vid) => {
      var playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {}).catch((error) => {});
      }
    });
  });

  barba.init({
    transitions: [
      {
        name: "general-transition",
        async leave(data) {
          const done = this.async();

          pageTransitionLeave(data);
          await delay(1500);
          done();
        },

        async enter(data) {
          pageTransitionEnter(data);
        },

        async once(data) {
          var namespace = data.next.namespace;
          navItems.forEach((item) => {
            var attr = item.getAttribute("data-attribute-item");
            if (attr == namespace) {
              item.classList.add("active");
            }
          });
        },
      },
      {
        name: "next-project",
        from: {
          namespace: ["project"],
        },
        to: {
          namespace: ["project"],
        },
        async leave(data) {
          var triggerState = data.trigger;
          const done = this.async();
          if (
            triggerState == "popstate" ||
            triggerState == "back" ||
            triggerState == "forward"
          ) {
            pageTransitionLeave(data);
            await delay(1500);
          } else {
            projectTransitionLeave(data);
            await delay(450);
          }

          done();
        },

        async enter(data) {
          var triggerState = data.trigger;
          if (
            triggerState == "popstate" ||
            triggerState == "back" ||
            triggerState == "forward"
          ) {
            pageTransitionEnter(data);
          } else {
            projectTransitionEnter(data);
          }
        },

        async once(data) {
          var namespace = data.next.namespace;
          navItems.forEach((item) => {
            var attr = item.getAttribute("data-attribute-item");
            if (attr == namespace) {
              item.classList.add("active");
            }
          });
        },
      },
    ],

    views: [
      {
        namespace: "home",
        afterEnter({ next }) {
          var scrollContainer = next.container;
          imagesLoaded(scrollContainer.querySelector("#banner"), function () {
            loadIndexScripts();
            ScrollTrigger.refresh();
          });
        },
      },
      {
        namespace: "studio",
        afterEnter({ next }) {
          var scrollContainer = next.container;
          imagesLoaded(scrollContainer, function () {
            loadStudioScripts();
            ScrollTrigger.refresh();
          });
        },
      },

      {
        namespace: "contact",
        afterEnter({ next }) {
          var scrollContainer = next.container;
          imagesLoaded(scrollContainer, function () {
            loadContactScripts();
            ScrollTrigger.refresh();
          });
        },
      },

      {
        namespace: "work",
        afterEnter({ next }) {
          var scrollContainer = next.container;
          imagesLoaded(scrollContainer, function () {
            loadWorkScripts();
            ScrollTrigger.refresh();
          });
        },
      },

      {
        namespace: "project",
        afterEnter(data) {
          var next = data.next,
            prev = data.current.namespace,
            triggerState = data.trigger,
            scrollContainer = next.container;

          imagesLoaded(scrollContainer.querySelector("#banner"), function () {
            loadProjectScripts(triggerState, prev);
            ScrollTrigger.refresh();
          });
        },
      },

      {
        namespace: "easter-egg",
        afterEnter({ next }) {
          var scrollContainer = next.container;
          imagesLoaded(scrollContainer, function () {
            loadEggScripts();
            ScrollTrigger.refresh();
          });
        },
      },
      {
        namespace: "404",
        afterEnter({ next }) {
          var scrollContainer = next.container;
          imagesLoaded(scrollContainer, function () {
            load404Scripts();
            ScrollTrigger.refresh();
          });
        },
      },
    ],
  });
});
