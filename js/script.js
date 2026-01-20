(function ($) {
  "use strict";

  // ============================================
  // TEXT ANIMATIONS (anime.js)
  // ============================================
  var initTexts = function () {
    $('.txt-fx').each(function () {
      this.innerHTML = this.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    });

    anime.timeline().add({
      targets: '.txt-fx .letter',
      translateX: [0, -30],
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 100,
      delay: (el, i) => 0
    });
  };

  var animateTexts = function () {
    anime.timeline().add({
      targets: '.slick-current .txt-fx .letter',
      translateX: [40, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1200,
      delay: (el, i) => 30 * i
    });
  };

  var hideTexts = function () {
    anime.timeline().add({
      targets: '.slick-current .txt-fx .letter',
      translateX: [0, -30],
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1100,
      delay: (el, i) => 30 * i
    });
  };

  // ============================================
  // SLIDER INITIALIZATION
  // ============================================
  var initSlider = function () {
    if (!$('.main-slider').length) return;

    $('.main-slider').slick({
      autoplay: false,
      autoplaySpeed: 4000,
      fade: true,
      prevArrow: $('.prev'),
      nextArrow: $('.next'),
      lazyLoad: 'ondemand',
      speed: 800,
      cssEase: 'cubic-bezier(0.77, 0, 0.175, 1)'
    });

    $('.main-slider').on('beforeChange', function () {
      hideTexts();
    });

    $('.main-slider').on('afterChange', function () {
      animateTexts();
    });

    initTexts();
    animateTexts();
  };

  // ============================================
  // OVERLAY MENU
  // ============================================
  var overlayMenu = function () {
    if (!$('.nav-overlay').length) return;

    const body = document.body;
    const menuToggle = document.querySelector('#menu-toggle');
    const menuBtn = document.querySelector('.menu-btn');
    const menuLinks = document.querySelectorAll('.nav__content a[href^="#"]');

    if (!menuBtn || !menuToggle) return;

    const toggleMenu = () => {
      body.classList.toggle('nav-active');

      if (body.classList.contains('nav-active')) {
        setTimeout(() => {
          document.addEventListener('click', closeMenuOutside);
        }, 100);
      } else {
        document.removeEventListener('click', closeMenuOutside);
      }
    };

    const closeMenuOutside = (e) => {
      const navContent = document.querySelector('.nav__content');
      const sideNavBar = document.querySelector('.side-nav-bar');

      if (!navContent.contains(e.target) && !sideNavBar.contains(e.target)) {
        body.classList.remove('nav-active');
        menuToggle.checked = false;
        document.removeEventListener('click', closeMenuOutside);
      }
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-active');
        menuToggle.checked = false;
        document.removeEventListener('click', closeMenuOutside);
      });
    });

    document.querySelector('.nav__content')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  };

  // ============================================
  // JARALLAX (Parallax)
  // ============================================
  var initParallax = function () {
    if (typeof jarallax === 'undefined') return;

    jarallax(document.querySelectorAll(".jarallax"), {
      speed: 0.5
    });

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
      speed: 0.5
    });
  };

  // ============================================
  // SEE MORE BUTTON
  // ============================================
  var initSeeMore = function () {
    const seeMoreBtn = document.querySelector(".see-more");
    if (!seeMoreBtn) return;

    const hiddenPosts = document.querySelectorAll(".post-grid .hidden-post");
    const buttonText = seeMoreBtn.querySelector(".button-text");

    if (!hiddenPosts.length) return;

    let currentIndex = 0;
    const showCount = 3;
    let isAnimating = false;

    const style = document.createElement('style');
    style.textContent = `
      .particle {
        position: absolute;
        pointer-events: none;
        background: #f1f1f1;
        border-radius: 2px;
        z-index: 1000;
      }
      
      @keyframes particleFloat {
        0% {
          opacity: 1;
          transform: translate(0, 0) rotate(0deg) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(0);
        }
      }
      
      .post-item.appearing {
        animation: dustAppear 0.6s ease-out forwards;
      }
      
      @keyframes dustAppear {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(30px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      button.see-more {
        width: auto;
        min-width: 12rem;
        transition: width 0.3s ease;
      }
      
      button.see-more.expanded {
        width: 16rem;
      }
    `;
    document.head.appendChild(style);

    function smoothScrollTo(element, offset = 0) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    function createParticles(element) {
      const rect = element.getBoundingClientRect();
      const particleCount = 40;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 15 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;
        particle.style.left = (rect.left + startX) + 'px';
        particle.style.top = (rect.top + startY + window.pageYOffset) + 'px';

        const grayShade = Math.floor(Math.random() * 100) + 150;
        particle.style.background = `rgb(${grayShade}, ${grayShade}, ${grayShade})`;

        const tx = (Math.random() - 0.5) * 400;
        const ty = (Math.random() - 0.5) * 400 - 200;
        const rotation = (Math.random() - 0.5) * 720;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.setProperty('--r', rotation + 'deg');

        const duration = Math.random() * 0.5 + 0.8;
        particle.style.animation = `particleFloat ${duration}s ease-out forwards`;

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), duration * 1000);
      }
    }

    function disintegrate(element, delay = 0) {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-out';
        createParticles(element);
      }, delay);
    }

    seeMoreBtn.addEventListener("click", function () {
      if (isAnimating) return;

      const currentText = buttonText.innerText.toLowerCase().trim();

      if (currentText === "no more projects") {
        isAnimating = true;

        const visibleHiddenPosts = Array.from(hiddenPosts).filter(
          post => post.style.display === "block"
        );

        if (visibleHiddenPosts.length > 0) {
          smoothScrollTo(visibleHiddenPosts[0], 100);
        }

        visibleHiddenPosts.forEach((post, index) => {
          const postItem = post.querySelector('.post-item');
          disintegrate(postItem, index * 150);
        });

        setTimeout(() => {
          hiddenPosts.forEach(post => {
            post.style.display = "none";
            const postItem = post.querySelector('.post-item');
            postItem.style.opacity = '1';
            postItem.style.transition = '';
          });

          currentIndex = 0;
          buttonText.innerText = "see More";
          seeMoreBtn.classList.remove('expanded');
          isAnimating = false;

          const inspiringSection = document.querySelector('#inspiring-ideas');
          if (inspiringSection) {
            smoothScrollTo(inspiringSection, 50);
          }
        }, visibleHiddenPosts.length * 150 + 1200);

        return;
      }

      isAnimating = true;
      let firstNewPost = null;

      for (let i = currentIndex; i < currentIndex + showCount; i++) {
        if (hiddenPosts[i]) {
          if (!firstNewPost) firstNewPost = hiddenPosts[i];

          hiddenPosts[i].style.display = "block";

          setTimeout(() => {
            hiddenPosts[i].querySelector('.post-item').classList.add('appearing');
            setTimeout(() => {
              hiddenPosts[i].querySelector('.post-item').classList.remove('appearing');
            }, 600);
          }, (i - currentIndex) * 150);
        }
      }

      if (firstNewPost) {
        setTimeout(() => smoothScrollTo(firstNewPost, 100), 300);
      }

      setTimeout(() => {
        isAnimating = false;
      }, showCount * 150 + 600);

      currentIndex += showCount;

      if (currentIndex >= hiddenPosts.length) {
        buttonText.innerText = "No more projects";
        seeMoreBtn.classList.add('expanded');
      }
    });
  };

  // ============================================
  // BACK TO TOP - ANA SAYFA VE PROJE SAYFALARI
  // ============================================
  var initBackToTop = function () {
    const mainLogo = $('.main-logo');

    // Sayfa tipini kontrol et (index.html mi yoksa project sayfası mı)
    const isProjectPage = window.location.pathname.includes('project-');

    // Her iki sayfada da scroll kontrolü
    $(window).scroll(function () {
      if ($(this).scrollTop() > 150) {
        mainLogo.addClass('scrolled');
      } else {
        mainLogo.removeClass('scrolled');
      }
    });

    if (isProjectPage) {

      // PROJE SAYFALARI
      mainLogo.addClass('project-page-logo');

      mainLogo.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('scrolled')) {
          // Scroll edildiyse: Yukarı çık
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          // Scroll edilmediyse: Ana sayfaya git
          window.location.href = 'index.html';
        }
      });
    } else {
      // ANA SAYFA
      mainLogo.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Sadece scrolled durumunda yukarı çık
        if ($(this).hasClass('scrolled')) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        // Scroll edilmediyse hiçbir şey yapma
      });
    }
  };

  // Logo tıklama olayı - Sadece scrolled durumunda çalışır
  $('.main-logo').click(function () {
    if ($(this).hasClass('scrolled')) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  var initSmoothScroll = function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();

          const offset = 100;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  var initLazyLoad = function () {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  // ============================================
  // ACTIVE NAVIGATION STATE
  // ============================================
  var initActiveNav = function () {
    const sections = document.querySelectorAll('.scrollspy-section');
    const navItems = document.querySelectorAll('.nav__list-item');

    if (!sections.length || !navItems.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');

          navItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link.getAttribute('href');

            if (href === `#${sectionId}`) {
              navItems.forEach(i => i.classList.remove('active-nav'));
              item.classList.add('active-nav');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  };

  // ============================================
  // PREVENT SCROLL WHEN MENU IS OPEN
  // ============================================
  var preventScroll = function () {
    const body = document.body;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          if (body.classList.contains('nav-active')) {
            body.style.overflow = 'hidden';
            body.style.paddingRight = scrollBarWidth + 'px';
          } else {
            body.style.overflow = '';
            body.style.paddingRight = '';
          }
        }
      });
    });

    observer.observe(body, {
      attributes: true
    });
  };

  // ============================================
  // DOCUMENT READY
  // ============================================
  $(document).ready(function () {
    initSlider();
    overlayMenu();
    initParallax();
    initSeeMore();
    initBackToTop();
    initSmoothScroll();
    initLazyLoad();
    initActiveNav();
    preventScroll();
  });

  // ============================================
  // WINDOW LOAD (Preloader)
  // ============================================
  $(window).on('load', function () {
    $(".preloader").fadeOut("slow");
  });

  // ============================================
  // WINDOW RESIZE (Debounced)
  // ============================================
  var resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (typeof jarallax !== 'undefined') {
        jarallax(document.querySelectorAll('.jarallax'), 'destroy');
        initParallax();
      }
    }, 250);
  });

  // ============================================
  // LOGO SCROLL CONTROL
  // ============================================

  document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.main-logo');
    const logoLink = logo.querySelector('a');
    const backToTop = logo.querySelector('.back-to-top');

    // Sayfa türünü belirle (ana sayfa mı, proje sayfası mı)
    const isProjectPage = !window.location.pathname.endsWith('index.html') &&
      window.location.pathname !== '/' &&
      !window.location.pathname.endsWith('/');

    // Proje sayfalarında logo'ya class ekle
    if (isProjectPage) {
      logo.classList.add('project-page-logo');

      // Proje sayfalarında logo ana sayfaya dönüş linki olur
      logoLink.style.cursor = 'pointer';
      logoLink.addEventListener('click', function (e) {
        // Eğer scroll edilmemişse (en üstteyse)
        if (window.pageYOffset === 0) {
          // Ana sayfaya git
          window.location.href = 'index.html';
        } else {
          // Scroll edilmişse, başa dön butonuna tıklandı
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    }

    // Scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function () {
      // Performance için debounce
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(function () {
        const scrollPosition = window.pageYOffset;

        if (scrollPosition > 100) {
          // Scroll edildi → Logo küçülür, ok ikonu görünür
          logo.classList.add('scrolled');

          // Ana sayfada scroll edilince başa dön aktif olur
          if (!isProjectPage) {
            backToTop.style.cursor = 'pointer';
            backToTop.addEventListener('click', scrollToTop);
          }
        } else {
          // En üstte → Normal logo görünümü
          logo.classList.remove('scrolled');
        }
      }, 10);
    });

    // Başa dön fonksiyonu
    function scrollToTop(e) {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Başa dön butonuna tıklama (her iki sayfa için de)
    if (backToTop) {
      backToTop.addEventListener('click', scrollToTop);
    }
  });

  // ============================================
  // HAMBURGER MENU TOGGLE
  // ============================================

  document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const body = document.body;

    if (menuToggle) {
      menuToggle.addEventListener('change', function () {
        if (this.checked) {
          body.classList.add('nav-active');
        } else {
          body.classList.remove('nav-active');
        }
      });
    }

    // Nav linklere tıklayınca menüyü kapat
    const navLinks = document.querySelectorAll('.nav__list-item a, .nav__block a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (menuToggle) {
          menuToggle.checked = false;
          body.classList.remove('nav-active');
        }
      });
    });
  });

  // ============================================
  // SEE MORE BUTTON (İlham Veren Fikirler)
  // ============================================

  document.addEventListener('DOMContentLoaded', function () {
    const seeMoreBtn = document.querySelector('.see-more');
    const buttonText = document.querySelector('.button-text');
    const hiddenPosts = document.querySelectorAll('.hidden-post');
    let currentlyShown = 0;
    const postsPerClick = 3;
    let allShown = false;

    if (seeMoreBtn && hiddenPosts.length > 0) {
      seeMoreBtn.addEventListener('click', function () {
        if (!allShown) {
          // No More Project - Show next batch of posts
          const postsToShow = Math.min(postsPerClick, hiddenPosts.length - currentlyShown);

          for (let i = currentlyShown; i < currentlyShown + postsToShow; i++) {
            hiddenPosts[i].classList.remove('hidden-post');
            hiddenPosts[i].style.display = 'flex';
          }

          currentlyShown += postsToShow;

          // If all posts are shown, change to "No More Project"
          if (currentlyShown >= hiddenPosts.length) {
            buttonText.textContent = 'No More Project';
            allShown = true;
          }
        } else {
          // No More Project - Hide all posts again
          hiddenPosts.forEach(post => {
            post.classList.add('hidden-post');
            post.style.display = 'none';
          });

          currentlyShown = 0;
          allShown = false;
          buttonText.textContent = 'See More';
        }
      });
    }
  });

  // ============================================
  // SMOOTH SCROLL (Ana sayfa için)
  // ============================================

  document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // # ile başlayan ama sadece # olmayan linkler için
        if (href && href !== '#' && href.startsWith('#')) {
          const target = document.querySelector(href);

          if (target) {
            e.preventDefault();

            const offsetTop = target.offsetTop - 80; // Header yüksekliği kadar offset

            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  });

})(jQuery);