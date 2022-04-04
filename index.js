const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
const apiRouter = require('./routes/api');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error handler 
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));