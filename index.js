const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
const multer = require('multer')
var path = require("path");
const upload = multer();
const swaggerJSON = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

// view setup
app.set("view engine", "ejs");
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3600000 },
    })
);
app.use(flash());

app.use(methodOverride("_method"));
app.use(upload.any());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Router
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
app.use("/api", apiRouter);
app.use("/", webRouter);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
// Error handler 
app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);

    req.headers.accept.includes("application/json")
        ? res.json({ error: error.message, status: error.status })
        : res.render("error", { error });
});

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`));