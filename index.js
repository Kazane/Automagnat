const { sendNewRequestEmail } = require('./sendgrid');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const express = require('express');
const path = require('path');
const app = express();

app.use(bodyParser.json({ limit: 6000000 }));
app.use(express.static(path.resolve(__dirname, 'static')));

app.post('/new-request', (req, res) => {
	if (req.body.email) {
		sendNewRequestEmail(req.body)
			.then(() => {
				res.sendStatus(200);
			})
			.catch(e => {
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(500);
	}
});

app.listen(port, () => {
	console.log(`Server is started at http://localhost:${port}`);
});
