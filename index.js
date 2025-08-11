const { outputJSON } = require('./scripts/output_json');
const { sendRequests } = require('./scripts/send_requests');
const { askQuestion } = require('./scripts/ask');
const path = require('path');

require('dotenv').config();
(async () => {
const defaultBatchSize = 100;
const defaultTimeout = 0; 
const defaultInputCSV = 'data/data.csv';
const defaultOutputDir = 'output';
if ((await askQuestion(`Currently working on realm ${process.env.REALM_ID}. Do you want to continue? (y/n): `)).toLowerCase() !== 'y') {
    console.log('Operation cancelled.');
    process.exit(0);
}
const inputCSV = await askQuestion(`Enter the path to the input CSV file (default path - ${defaultInputCSV}): `) || defaultInputCSV;
const outputDir = path.join(__dirname, 'output', (await askQuestion(`Enter the output directory (default path - ${defaultOutputDir}): `) || defaultOutputDir));
const batchSize = parseInt(await askQuestion(`Enter the batch size of records to process (default - ${defaultBatchSize}): `)) || defaultBatchSize;
const timeout = parseInt(await askQuestion(`Enter the timeout in milliseconds between requests (default - ${defaultTimeout}): `)) || defaultTimeout;

await outputJSON(inputCSV, outputDir);
if ((await askQuestion(`Do you want to send requests now? (y/n): `)).toLowerCase() !== 'y') {
    console.log('Requests not sent.');
    process.exit(0);
}
console.time('Total operation time');
await sendRequests(outputDir, batchSize, timeout);
console.timeEnd('Total operation time');
})();