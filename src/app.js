const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

//init dbs 
require('./v1/databases/init.mongodb')
require('./v1/databases/init.redis')

//user middleware
app.use(helmet())
app.use(morgan('combined'))
// compress responses
app.use(compression())

// add body-parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser());

// cors
app.use(cors());
//router
app.use('/api/v1', require('./v1/routes/index.router'))

// Error Handling Middleware called

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

module.exports = app;