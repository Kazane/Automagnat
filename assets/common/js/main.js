$(document).ready(function(){
	$(".sliding-link").click(function(e) {
		e.preventDefault();
		var aid = $(this).attr("href");
		$('html,body').animate({scrollTop: $(aid).offset().top},'slow');
	});

	$('.feedback').bxSlider({
		pagerCustom: '#feedback-pager',
		controls: false,
		onSliderLoad: function() {
			$('.feedback').removeClass('feedback-loading');
		}
	});
});
