$(document).ready(function() {

    pageInit();

	var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

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

	$('.icon.direction.up').hide();
	$('.section:eq(0)').find('.video_name').css('opacity', 1);
	$('.close_music_btn, .play_video').hide();

	video = $('video.active');
	autoScroll(video[0]);

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
		$.fn.fullpage.moveSectionUp();
	});
	
	$(document).on('click','.down', function(){
		$.fn.fullpage.moveSectionDown();
	});

});

function pageInit(){

    var pages = [];    
    $('.menu.mobile li a').each(function(){
        pages.push($(this).attr('href').replace('#', ''));
    });

    $.fn.fullpage({
        anchors: pages,
        afterLoad: function(e, index){
            afterLoad(e, index);
        },
        onLeave: function(e, index){
            onLeave(e, index)
        }
    });
}

function autoScroll(video){
	video.onended = function() {
		$.fn.fullpage.moveSectionDown();
	};
}

function afterLoad(e, index){
    
    $('video').each(function() {
        $(this).get(0).pause();
        $(this).get(0).currentTime = 0;
        $(this).removeClass('active');
    });

    var ind = index -1;
    if($('.section:eq('+ind+') video').length){
        $('.section:eq('+ind+') video').get(0).play();
        $('.section:eq('+ind+') video').addClass('active');
        autoScroll($('.section:eq('+ind+') video').get(0));
    }

    var sectionCount = $('.section').length;
    if(ind > 0){
        $('.icon.direction.up').show();
    } else {
        $('.icon.direction.up').hide();
    }
    
    if(index == sectionCount){
        $('.icon.direction.down').hide();
    } else {
        $('.icon.direction.down').show();
    }

    $('.icons .icon.pause_video').show();
    $('.section:eq('+ind+')').find('.video_name').css('opacity', 1);
}

function onLeave(e, index){
	$('.video_name').css('opacity', 0);
	$('.icons .icon.pause_video').hide();
}