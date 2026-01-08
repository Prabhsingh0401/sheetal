(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();    

    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.top-header').addClass('shadow-sm1');
        } else {
            $('.top-header').removeClass('shadow-sm1');
        }
    });
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('header.header.header-desktop').addClass('shadow-sm2');
        } else {
            $('header.header.header-desktop').removeClass('shadow-sm2');
        }
    });
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.sticky-top').addClass('shadow-sm');
        } else {
            $('.sticky-top').removeClass('shadow-sm');
        }
    });

    $(document).ready(function(){
      $('.dropdown-submenu a.test').on("click", function(e){
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
      });
    });    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 0, 'easeInOutExpo');
        return false;
    });
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.left-side-bar').addClass('sticky-g');
        } else {
            $('.left-side-bar').removeClass('sticky-g');
        }
    });
    

    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        nav: true,
        dots: false,
        items: 1,
        dotsData: false,
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: false,
        smartSpeed: 2000,
        loop: true,
        nav: false,
        dots: false,
        items: 1,
        dotsData: false,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:1,
                nav:false
            },
            1000:{
                items:1,
                nav:true,
                loop:false,
                margin: 30,
            }
        }
    });

   
    $('.pd-carousel').owlCarousel({
        autoplay: false,
        smartSpeed: 500,
        loop: true,
        nav: true,
        dots: true,
        items: 1,
        dotsData: false,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:1,
                nav:false
            },
            1000:{
                items:1,
                nav:true,
                loop:true
            }
        }
    });

    // Product carousel home page
    $('.prod-carousel-home').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 3,
        dotsData: false,
        margin: 20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
                nav:false
            },
            1000:{
                items:4,
                nav:true,
                loop:false
            }
        }
    });
    // New Arrival products
    $('.prod-carousel-home-new').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 3,
        dotsData: false,
        margin: 20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
                nav:false
            },
            1000:{
                items:3,
                nav:true,
                loop:false
            }
        }
    });

    // Collections
    $('.collection-carousel-home-new').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 4,
        dotsData: false,
        margin: 20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
                nav:false
            },
            1000:{
                items:4,
                nav:true,
                loop:false
            }
        }
    });

    // Product carousel home page
    $('.new-deals-prods').owlCarousel({
        autoplay: true,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: false,
        margin: 0,
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1            
            }
        }
    });

    // Product carousel home page
    $('.instagram-reals').owlCarousel({
        autoplay: true,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: false,
        dots: true,
        items: 5,
        dotsData: false,
        margin: 0,
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:5            
            }
        }
    });

    // Product carousel home page
    $('.prod-carousel-related').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 3,
        dotsData: false,
        margin: 30,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
                nav:false
            },
            992:{
                items:4,
                nav:false
            },
            1000:{
                items:5,
                nav:true,
                loop:false
            }
        }
    });

     // Product carousel home page
    $('.prod-carousel-recently-viewed').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 3,
        dotsData: false,
        margin: 30,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
                nav:false
            },
            992:{
                items:4,
                nav:false
            },
            1000:{
                items:5,
                nav:true,
                loop:false
            }
        }
    });
// Product carousel home page
    $('.category-carousel-home').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 3,
        dotsData: false,
        margin: 50,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
                nav:false
            },
            1000:{
                items:5,
                nav:true,
                loop:true
            }
        }
    });

    // Product carousel inner page
    $('.category-carousel-inner').owlCarousel({
        autoplay: false,
        /*smartSpeed: 1000,*/
        loop: true,
        nav: true,
        dots: false,
        items: 5,
        dotsData: false,
        margin: 50,
        responsiveClass:true,
        responsive:{
            0:{
                items:2,
                nav: false,
                dots: true,
            },
            600:{
                items:2,
            },
            1000:{
                items:5,
                
            }
        }
    });

    $(document).on('click', '.kkhjowhxxh', function() {
        $(".afhnheugug").fadeToggle();
        $(".nbbzvuwbeu").focus();
    });
    
    $( ".navbar .navbar-nav .nav-link" ).click(function() {
      $(this).next(".navbar .nav-item .dropdown-menu").toggleClass( "open-sub", function() {
      });
    });
    
   $( ".all-brand label" ).click(function() {
      $(".brnad-list").toggle( "slow", function() {
      });
    });
    
    $( "button.btn-close" ).click(function() {
      $(".write-review-form").toggle( "slow", function() {
      });
      $(".rsmxosilmp.w-review").toggle( "slow", function() {
      });
    }); 
    
    $( ".rsmxosilmp.w-review" ).click(function() {
      $(".write-review-form").toggle( "slow", function() {
      });
      $(".rsmxosilmp.w-review").toggle( "slow", function() {
      });
    });    
    

   $( ".all-brand label" ).click(function() {
      $(this).toggleClass( "open-subb", function() {
      });
    });

    $( ".hamburger-icon" ).click(function() {
      $("#menu").toggleClass( "mobile-menu-open");
      $("html").toggleClass( "overflow-hidden");
    });
    
    $( "li.mob-menu" ).click(function() {
      $(this).toggleClass( "open-menu-mobile", function() {
      });
    }); 
    $( "li.mob-menu" ).click(function() {
      $(".Mob-menu-dis").toggle( "slow", function() {
      });
    });
    

    $( ".catt-list a.dd-menu" ).click(function() {
      $(this).next(".sub-catt").toggle( "slow", function() {
      });
    });
    
     $( ".cart a" ).click(function() {
      
      $(".cart-items-dd").toggleClass( "cart-box-open", function() {
      });
      $("a.close-box").toggleClass( "cart-box-open", function() {
      });
    });


    $( ".catt-list a.dd-menu" ).click(function() {
      $(this).toggleClass( "open-subb", function() {
      });
    });

    $( ".search-box a.close" ).click(function() {
      $(".search-box").toggle( "slow", function() {
      });
    });

    $( ".qv-icon" ).click(function() {
      $(".quick-view-wrapper").toggle( "slow", function() {
      });
    });

    $( ".close-quick-view" ).click(function() {
      $(".quick-view-wrapper").toggle( "slow", function() {
      });
    });

    $( ".grid-view" ).click(function() {      
      $(".grid-view").addClass( "selected", function() {
      });
      $(".list-view").removeClass( "selected", function() {
      });

      $(".products-list-wrapper").addClass( "grid-view-p", function() {
      });
      $(".products-list-wrapper").removeClass( "list-view-p", function() {
      });
    });

    $( ".list-view" ).click(function() {      
      $(".list-view").addClass( "selected", function() {
      });
      $(".grid-view").removeClass( "selected", function() {
      });

      $(".products-list-wrapper").addClass( "list-view-p", function() {
      });
      $(".products-list-wrapper").removeClass( "grid-view-p", function() {
      });
    });



    $(document).on('click', '.zliggxevfz', function() {
        var id = $(this).attr("data-id");
        var heading = $(this).attr("data-heading");
        $(".nsdpujltte").val(id);
        $(".wszhscbqxk").val(heading);
        $("#pp-detail").show();
    });
    $(document).on('click', '.close', function() {
        $("#pp-detail").hide();
    });

     $( "label.size-chart" ).click(function() {      
      $(".size-chart-open").toggleClass( "selected", function() {
      });
    });
    $( ".size-chart-open a.close" ).click(function() {      
      $(".size-chart-open").toggleClass( "selected", function() {
      });
    });


    /* Slick Slider start */
    $(function() { 
      // Card's slider
        var $carousel = $('.slider-for');

        $carousel
          .slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            adaptiveHeight: true,
            asNavFor: '.slider-nav'
          })
          .magnificPopup({
            type: 'image',
            delegate: 'a:not(.slick-cloned)',
            closeOnContentClick: false,
            tLoading: 'Загрузка...',
            mainClass: 'mfp-zoom-in mfp-img-mobile',
            image: {
              verticalFit: true,
              tError: '<a href="%url%">Фото #%curr%</a> не загрузилось.'
            },
            gallery: {
              enabled: true,
              navigateByImgClick: true,
              tCounter: '<span class="mfp-counter">%curr% из %total%</span>', // markup of counte
              preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            zoom: {
              enabled: true,
              duration: 300
            },
            removalDelay: 300, //delay removal by X to allow out-animation
            callbacks: {
              open: function() {
                //overwrite default prev + next function. Add timeout for css3 crossfade animation
                $.magnificPopup.instance.next = function() {
                  var self = this;
                  self.wrap.removeClass('mfp-image-loaded');
                  setTimeout(function() { $.magnificPopup.proto.next.call(self); }, 120);
                };
                $.magnificPopup.instance.prev = function() {
                  var self = this;
                  self.wrap.removeClass('mfp-image-loaded');
                  setTimeout(function() { $.magnificPopup.proto.prev.call(self); }, 120);
                };
                var current = $carousel.slick('slickCurrentSlide');
                $carousel.magnificPopup('goTo', current);
              },
              imageLoadComplete: function() {
                var self = this;
                setTimeout(function() { self.wrap.addClass('mfp-image-loaded'); }, 16);
              },
              beforeClose: function() {
                $carousel.slick('slickGoTo', parseInt(this.index));
              }
            }
          });
        $('.slider-nav').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          asNavFor: '.slider-for',
          dots: false,
          centerMode: false,
          focusOnSelect: true,
          variableWidth: true
        });
        
        
      });

    
    
})(jQuery);

