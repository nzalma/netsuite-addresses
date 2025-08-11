// const fs = require('fs');
// const path = require('path');
// const { parse } = require('csv-parse');
// const csvPath = path.join(__dirname, '/data/data.csv');

// const parser = parse({
//     columns: true,
//     skip_empty_lines: true,
//     delimiter: ',',
//     trim: true,
//     bom: true
// });

// const rows = [];
// const customers = {
// };

// fs.createReadStream(csvPath)
//     .pipe(parser)
//     .on('error', (error) => {
//         console.error('Error parsing CSV:', error);
//     })
//     .on('data', (row) => {
//         console.log('Parsed row:', row);
//         for (const key in row) {
//             if (row.hasOwnProperty(key)) {
//                 console.log(`Key: ${key}, Value: ${row[key]}`);
//             }
//         }
//         if (row.used !== '0') {
//             if (customers.hasOwnProperty(row['customer'])) {
//                 customers[row['customer']]['addressBook']['items'].push({
//                     'internalId': row['address_id']
//                 });
//             } else {
//                 customers[row['customer']] = {
//                     'addressBook': {
//                         'items': [
//                             {
//                                 'internalId': row['address_id']
//                             }
//                         ]
//                     }
//                 };
//             }
//         }
//         rows.push(row);
//     })
//     .on('end', () => {
//         console.log('CSV parsing completed.');
//         // console.log(customers);
//         for (const key in customers) {
//             fs.writeFileSync(path.join(__dirname, 'output', `${key}.json`), JSON.stringify(customers[key], null, 2));
//             // console.log(key);1
//             // console.log(JSON.stringify(customers[key]));
//         }
//         console.log(`Total customers: ${Object.keys(customers).length}`);
//     });

const { outputJSON } = require('./scripts/output_json');
const { generateOAuthHeader } = require('./scripts/sign_requests');

const inputCSV = 'data/dataSB3.csv';
const outputDir = `/outputSB3`;

outputJSON(inputCSV, outputDir);



