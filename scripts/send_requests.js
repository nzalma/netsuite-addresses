const fs = require('fs');
const path = require('path');
const { generateOAuthHeader } = require('./sign_requests');
const jsonDirectory = path.join(__dirname, '..', 'outputSB3');
const testDir = path.join(__dirname, '..', 'outputSB3');
require('dotenv').config();

const jsonFiles = fs.readdirSync(jsonDirectory).filter(file => file.endsWith('.json'));
const sendRequests = async (jsonFiles) => {
    if (!fs.existsSync(path.join(testDir, 'success'))) fs.mkdirSync(path.join(testDir, 'success'));
    if (!fs.existsSync(path.join(testDir, 'error'))) fs.mkdirSync(path.join(testDir, 'error'));
    for (const file of jsonFiles) {
        const customerId = path.basename(file, '.json');
        const url = process.env.REST_SERVICES + `/customer/${customerId}`;
        const method = 'PATCH';
        const header = generateOAuthHeader(method, url);
        const request = {
            method: method,
            url: url,
            headers: {
                'Authorization': header,
                'Content-Type': 'application/json'
            },
            body: fs.readFileSync(path.join(jsonDirectory, file), 'utf8')
        };

        console.log(`Sending request for customer: ${customerId}`);
        // console.log(`Request URL: ${request.url}`);
        // console.log(`Request Method: ${request.method}`);
        // console.log(`Request Headers: ${JSON.stringify(request.headers, null, 2)}`);
        // console.log(`Request Body: ${request.body}`);
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body
        });
        console.log(`Response Status: ${response.status}`);
        console.log(`Response OK: ${response.ok}`);
        if (response.ok) {
            fs.renameSync(path.join(jsonDirectory, file), path.join(testDir, 'success', file));
        } else {
            fs.renameSync(path.join(jsonDirectory, file), path.join(testDir, 'error', file));
            console.error(`Error processing customer ${customerId}: ${response.statusText}`);
        }
        // const responseBody = await response.json();
        // console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);
        await delay(1000); // Wait 1 second before next request
    }
}
sendRequests(jsonFiles);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
