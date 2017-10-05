function returnFileSize(number) {
  if(number < 1024) {
    return number + 'bytes';
  } else if(number > 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + 'KB';
  } else if(number > 1048576) {
    return (number/1048576).toFixed(1) + 'MB';
  }
}

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

	$('#request-form input[name=files]').change(function (event) {
		var files = event.currentTarget.files;
		var $parentContainer = $(event.currentTarget).parent();
		var $filesInfoContainer = $parentContainer.find('.files');
		var hasFiles = false;

		for (var file in files) {
			var isFile = files[file] instanceof File;

			if (isFile) {
				var name = files[file].name;
				var size = returnFileSize(files[file].size);

				$filesInfoContainer.append('<div class="file"><span class="name">' + name + '</span><span class="size">' + size + '</span></div>');
				hasFiles = true;
			}
		}

		$parentContainer.toggleClass('has-files', hasFiles);
	});

	$('#request-form').submit(function(event) {
		event.preventDefault();

        var formData = $(this).serializeArray();
        var formDataToSend = {};

        for (var i = 0; i < formData.length; i++) {
            formDataToSend[formData[i].name] = formData[i].value || '';
        }

		$.ajax({
			url: '/new-request',
			data: formDataToSend,
			method: 'POST',
			success: function() {
				debugger;
			},
		});
	});
});
