const SENDGRID_API_KEY = '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';
const TEMPLATE_ID = '35704598-7eed-441b-b099-2fcb980154d0';
const RECEIVER_EMAIL = 'info@automagnat.ee';

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(SENDGRID_API_KEY);
sendgrid.setSubstitutionWrappers('{{', '}}');

module.exports.sendNewRequestEmail = (emailData) => {
    const attachments = emailData.files.map((file) => {
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
