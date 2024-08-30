const express = require("express");
const cors = require('cors');
const requestIp = require('request-ip');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const connectToMongoDb = require('./mongoDbConnection');

const urlRouter = require("./routes/url")
const userRouter = require("./routes/user")
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

// Routes
app.use("/api/v1/url", urlRouter);
app.use("/api/v1/user", userRouter);

connectToMongoDb(CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });
