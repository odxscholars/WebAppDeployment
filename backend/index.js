const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
// get env variables
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());

app.get('/', (req, res) => {
    res.json('Hello World!');
})
app.use('/api', routes);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
