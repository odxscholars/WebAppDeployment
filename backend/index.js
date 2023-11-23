const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
// get env variables
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.json('Hello World!');
})
app.use('/api', routes);
const hostname = process.env.HOSTNAME || 'localhost';

app.listen(port, hostname, () => {
    console.log(`Example app listening at http://${hostname}:${port}`);
});

