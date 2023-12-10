const express = require('express');
const app = express();

const constants = require('./config/constants');
const nasaRequestConfig = require('./config/nasaRequestConfig');
const neoHelpers = require('./helpers/neoDataHelpers');
const requestHelpers = require('./helpers/requestHelpers');

app.get('/getNeosNames', (req, res) => {
    let queryParamsValidationResult = requestHelpers.validateQueryParameters(req);
    if (queryParamsValidationResult.valid) {
        const options = {
            hostname: nasaRequestConfig.hostname,
            port: nasaRequestConfig.port,
            // path: '/neo/rest/v1/feed?end_date=2023-09-08&api_key=efg0tcb32DfWc1pPkpHg9bKTTzz3NGXrsEeptKRe',
            path: requestHelpers.buildRequestPath(req),
            method: nasaRequestConfig.method,
            headers: {
                'Content-Type': nasaRequestConfig.jsonContentType
            }
        };

        neoHelpers.getNeosNames(options, queryParamsValidationResult.rangeKilometers, (statusCode, result) => {
            res.statusCode = statusCode;
            res.send(result);
        });
    } else {
        res.statusCode = queryParamsValidationResult.statusCode;
        res.send(queryParamsValidationResult.response);
    }

    // res.send('Hello World');
});

app.listen(constants.listeningPort, () => {
    console.log(`Server is running on port ${constants.listeningPort}`);
});