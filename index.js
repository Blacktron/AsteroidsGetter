const https = require('https');
const express = require('express');
const app = express();
const port = 3000;

function getAsteroidsData(options, onResult) {
    console.log('called');
    let output = '';
    console.log('before request');
    const req = https.request(options, (res) => {
        console.log(`${options.hostname} : ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            let obj = JSON.parse(output);

            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        console.log('error: ' + err.message);
        // res.send('error: ' + err.message);
    });

    req.end();
}

app.get('/', (req, res) => {
    const options = {
        hostname: 'api.nasa.gov',
        port: 443,
        path: '/neo/rest/v1/feed?start_date=2023-09-07&end_date=2023-09-08&api_key=efg0tcb32DfWc1pPkpHg9bKTTzz3NGXrsEeptKRe',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    getAsteroidsData(options, (statusCode, result) => {
        res.statusCode = statusCode;
        res.send(result);
    });

    // res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});