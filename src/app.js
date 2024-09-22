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
const allowedOrigins = ['http://localhost:3000',];
app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const message = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  }));
app.use(cors());

//router
app.use('/api/v1', require('./v1/routes/index.router'))

const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const path = require('path')
const YAML = require('yaml')

const file  = fs.readFileSync(path.resolve(__dirname, 'swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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