$(document).ready(function(){
	$(".sliding-link").click(function(e) {
		e.preventDefault();
		var aid = $(this).attr("href");
		$('html,body').animate({scrollTop: $(aid).offset().top},'slow');
	});

	$(".slider-controler--spot").click(function() {
	  $(".slider-controler--spot").removeClass("active");
	  $(this).addClass("active");
	  return false;
	});
});