const packageJSON = require('./package.json');
const prefix = 'SG.';
const KEY = prefix + packageJSON['super-secret-key'];
const TEMPLATE_ID = '678d3df1-55e7-4f16-b73e-91261b005a59';
const RECEIVER_EMAIL = 'info@automagnat.ee';

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(KEY);
sendgrid.setSubstitutionWrappers('{{', '}}');

module.exports.sendNewRequestEmail = emailData => {
	const attachments = emailData.files.map(file => {
		return Object.assign({}, file, { disposition: 'attachment' });
	});

	const message = {
		to: RECEIVER_EMAIL,
		from: emailData.email,
		subject: 'New request from automagnat.ee',
		templateId: TEMPLATE_ID,
		substitutions: {
			carbrand: emailData.carbrand || '',
			model: emailData.model || '',
			fuel: emailData.fuel || '',
			year: emailData.year || '',
			km: emailData.km || '',
			checkup: emailData.checkup || '',
			price: emailData.price || '',
			carengine: emailData.engine || '',
			name: emailData.name || '',
			phone: emailData.phone || '',
			email: emailData.email,
			carlocation: emailData.carlocation || '',
		},
		attachments: attachments,
	};

	return sendgrid.send(message);
};
