const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));



app.listen(port, () => console.log(`Example app listening on port ${port}!`));