const express = require("express");
const cors = require('cors');
const swaggerDocument = require('./swagger.json');
const requestIp = require('request-ip');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const compression = require('compression')
const connectToMongoDb = require('./mongoDbConnection');
const { checkAuth } = require('./middlewares/auth');

const apiRouter = require("../Linkify/routes/url")
const userRouter = require("../Linkify/routes/user")
const app = express();

// Get data from environment variables
const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;

// Middleware configuration
app.use(cors());
app.use(requestIp.mw());
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression())
app.use(checkAuth);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", apiRouter);
app.use("/user", userRouter);

connectToMongoDb(CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });
