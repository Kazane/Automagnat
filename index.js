const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'static')));

app.post('/new-request', (req, res) => {
	console.log('req', req.body);

	res.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Server is started at http://localhost:${port}`);
});
