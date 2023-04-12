var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

var pageEvents = {
    wheel: true,
    mouse: false,
    touch: true,
    keydown: true
};

if(isTablet){
    pageEvents = {
        wheel: true,
        mouse: true,
        touch: true,
        keydown: true
    };
}

$(document).ready(function() {

    var pagebleInstance;
    
	$('.close_music_btn, .play_video, .pause_video').hide();
    $('.video_name').css('opacity', 0);

    $('video').each(function() {

        var source = $(this).find('source').get(0);
        var src = $(source).attr('src');
        var mobileSrc = $(source).data('mobile-src');

        if(isTablet){
            $(source).attr('src', mobileSrc);
            $(source).attr('data-mobile-src', src);
        } else {
            $(source).attr('src', src);
            $(source).attr('data-mobile-src', mobileSrc);
        }

        $(this).get(0).load();
    });

    pageInit();

	$(document).on('click','.menu__icon' ,function(){
		$('body').toggleClass('menu_shown');
	});

	$(document).on('click','.menu.mobile li' ,function(){
		$('body').toggleClass('menu_shown');
	});
	
	$(document).on('click','.open_music_btn', function(){
		$('.open_music_btn').hide();
		$('.close_music_btn').show();
		$('audio').get(0).play();
		$('audio').get(0).volume = .5;
	});
	
	$(document).on('click','.close_music_btn',function(){
		$('.open_music_btn').show();
		$('.close_music_btn').hide();
		$('audio').get(0).pause();
		$('audio').get(0).currentTime = 0;
	});

	$(document).on('click','.pause_video', function(){
		$('.pause_video').hide();
		$('.play_video').show();

		video = $('video.active');
		$(video).get(0).pause();
	});
	
	$(document).on('click','.play_video', function(){
		$('.pause_video').show();
		$('.play_video').hide();

		video = $('video.active');
		$(video).get(0).play();
	});

	$(document).on('click','.up', function(){
		pagableInstance.prev();
	});
	
	$(document).on('click','.down', function(){
		pagableInstance.next();
	});

});

function pageInit(){
    console.log(this.pageEvents);
    pagableInstance = new Pageable(".wrapper", {
        // displays navigation pips
        pips: false,
        // animation speed
        animation: 500,
        // delay in ms
        delay: 0,
        // the interval in ms that the resize callback is fired
        throttle: 50,
        // swipe / mouse drag distance in px
        swipeThreshold: 250,
        // or 'horizontal'
        orientation: "vertical", 
        // drag / scroll freely instead of snapping to the next page
        freeScroll: true,
        // nav elements
        navPrevEl: false,
        navNextEl: false,
        // infinite scroll
        infinite: false, 
        // default: false
        slideshow: false,
        // easing function
        easing: function easing(t, b, c, d, s) {
            return -c * (t /= d) * (t - 2) + b;
        },
        // child selector
        childSelector: '[data-anchor]',
        events: this.pageEvents,
        onInit: () => {
            var activeSection = $('.section.pg-active');
            var activeVideo = $(activeSection).find('video');
            if($(activeVideo).length){

                $('.icons .icon.pause_video').show();
                $(activeSection).find('.video_name').css('opacity', 1);
                $(activeVideo).addClass('active');
                $(activeVideo).get(0).play();
                $(activeVideo).addClass('active');

                autoScroll($(activeVideo).get(0));
            }
        },
        onStart: () => {
            $('.video_name').css('opacity', 0);
	        $('.icons .icon.pause_video').hide();
        },
        onFinish: () => {

            $('video').each(function() {
                $(this).get(0).pause();
                $(this).get(0).currentTime = 0;
                $(this).removeClass('active');
            });
        
            var ind = $('.section.pg-active').index();
            if($('.section.pg-active video').length){
                $('.icons .icon.pause_video').show();
                $('.section:eq('+ind+')').find('.video_name').css('opacity', 1);
                $('.section.pg-active video').get(0).play();
                $('.section.pg-active video').addClass('active');
                autoScroll($('.section.pg-active video').get(0));
            }
        
            if(ind > 0){
                $('.icon.direction.up').show();
            } else {
                $('.icon.direction.up').hide();
            }

            var sectionCount = $('.section').length;
            if(ind == sectionCount -1){
                $('.icon.direction.down').hide();
            } else {
                $('.icon.direction.down').show();
            }
        }
    });
}

function autoScroll(video){
	video.onended = function() {
        pagableInstance.next();
	};
}