$(document).ready(function() {
	$('.sliding-link').click(function(e) {
		e.preventDefault();
		var aid = $(this).attr('href');
		$('html,body').animate({ scrollTop: $(aid).offset().top }, 'slow');
	});

	$('.feedback').bxSlider({
		pagerCustom: '#feedback-pager',
		controls: false,
		onSliderLoad: function() {
			$('.feedback').removeClass('feedback-loading');
		},
	});

	$('#request-form').submit(function(event) {
		event.preventDefault();

		var formData = new FormData(event.currentTarget);

		$.ajax({
			url: '/new-request',
			data: formData,
			processData: false,
			method: 'POST',
			success: function() {
				debugger;
			},
		});
	});
});
