function returnFileSize(number) {
	if (number < 1024) {
		return number + 'bytes';
	} else if (number > 1024 && number < 1048576) {
		return (number / 1024).toFixed(1) + 'KB';
	} else if (number > 1048576) {
		return (number / 1048576).toFixed(1) + 'MB';
	}
}

function convertFilesToArray(files) {
	var result = [];

	if (files.length === 0) return result;

	for (var file in files) {
		var isFile = files[file] instanceof File;

		if (isFile) {
			result.push(files[file]);
		}
	}

	return result;
}

function getDataToSend(formData) {
	var formDataToSend = {};

	for (var i = 0; i < formData.length; i++) {
		formDataToSend[formData[i].name] = formData[i].value || '';
	}

	return formDataToSend;
}

function imagesToBase64(images) {
	return images.map(function(image, index) {
		return new Promise(function(success, fail) {
			var reader = new FileReader();

			reader.addEventListener('load', function() {
				success({
					content:
						reader.result &&
						reader.result.substr(reader.result.indexOf(',') + 1),
					filename: image.name,
					type: image.type,
					index: index
				});
			});

			reader.readAsDataURL(image);
		});
	});
}

function submitErrorHandler() {
	$('#request-form .alert--error').removeClass('hidden');
}

function submitSuccessHandler() {
	var alert = $('#request-form .alert--success');

	alert.removeClass('hidden');

	setTimeout(function() {
		alert.addClass('hidden');
	}, 5000);
}

function submitForm(formData) {
	superagent
		.post('/new-request')
		.set('Accept', 'application/json')
		.send(formData)
		.end(function(err) {
			if (err) {
				submitErrorHandler(err);
			} else {
				submitSuccessHandler();
			}
		});
}

function createYears() {
	var currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	var oldestYear = currentYear - 50;
	var years = [];

	while (currentYear >= oldestYear) {
		years.push(currentYear);

		currentYear--;
	}

	var yearsOptions = [];

	for (var i = 0; i < years.length; i++) {
		yearsOptions.push(
			'<option value=' + years[i] + '>' + years[i] + '</option>'
		);
	}

	return yearsOptions;
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

	$('#request-form select[name=year]').append(createYears());

	$('#request-form input[name=files]').change(function(event) {
		var $previewContainer = $('#request-form').find('.query-form__upload.query-form__upload--preview');
		var $previewWrapper = $previewContainer.find('.query-form__upload--wrapper');
		var files = event.currentTarget.files;
		var filesList = convertFilesToArray(files);
		var hasFiles = filesList.length > 0;

		$previewContainer.toggleClass('has-files', hasFiles);

		if (hasFiles) {
			try {
				Promise.all(imagesToBase64(filesList))
					.then(function (images) {

						const previews = images.map(function (image) {
							return `
								<div class="query-form__upload--col" data-index=${image.index}>
									<span class="query-form--photo"><img src="data:image/png;base64,${image.content}"></span>
								</div>
							`;
						});

						$previewWrapper.append(previews);
					})
					.catch(function (e) {
						console.log('e', e);
					})
			} catch (e) {
				console.log('e', e);
			}
		}
	});

	$('#request-form').submit(function(event) {
		event.preventDefault();

		var formDataToSend = getDataToSend($(this).serializeArray());
		var filesList = convertFilesToArray(event.currentTarget.files.files);
		var isEmailEmpty = !Boolean(formDataToSend.email);
		var totalFileSize = 0;

		for (var i = 0; i < filesList.length; i++) {
			totalFileSize += filesList[i].size;
		}

		var ifFileSizeSuitable = totalFileSize < 10000000;

		$(this).find('[name="email"]').toggleClass('invalid', isEmailEmpty);
		$(this)
			.find('.query-form__upload')
			.toggleClass('invalid', !ifFileSizeSuitable);

		if (isEmailEmpty || !ifFileSizeSuitable) return false;

		try {
			Promise.all(imagesToBase64(filesList))
				.then(function(results) {
					formDataToSend.files = results;

					submitForm(formDataToSend);
				})
				.catch(submitErrorHandler);
		} catch (error) {
			submitErrorHandler(error);
		}
	});
});
