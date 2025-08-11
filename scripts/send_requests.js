const fs = require('fs');
const path = require('path');
const { generateOAuthHeader } = require('./sign_requests');
// const jsonDirectory = path.join(__dirname, '..', 'outputSB3');
// const TIMEOUT = 0;
require('dotenv').config();

const sendRequests = async (jsonDirectory, batchSize, timeout) => {
    const readFiles = fs.readdirSync(jsonDirectory).filter(file => file.endsWith('.json'));
    if (!fs.existsSync(path.join(jsonDirectory, 'success'))) fs.mkdirSync(path.join(jsonDirectory, 'success'));
    if (!fs.existsSync(path.join(jsonDirectory, 'error'))) fs.mkdirSync(path.join(jsonDirectory, 'error'));
    const jsonFiles = readFiles.slice(0,batchSize);
    for (const file of jsonFiles) {
        const customerId = path.basename(file, '.json');
        const url = process.env.REST_SERVICES + `/customer/${customerId}?replace=addressBook`;
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
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body
        });
        console.log(`Response Status: ${response.status}`);
        console.log(`Response OK: ${response.ok}`);
        if (response.ok) {
            fs.renameSync(path.join(jsonDirectory, file), path.join(jsonDirectory, 'success', file));
        } else {
            fs.renameSync(path.join(jsonDirectory, file), path.join(jsonDirectory, 'error', file));
            console.error(`Error processing customer ${customerId}: ${response.statusText}`);
        }
        await delay(timeout);
    }
}
// sendRequests(jsonFiles);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
