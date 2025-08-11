# CSV to JSON & NetSuite REST Uploader

This project converts CSV files to JSON and uploads them to NetSuite via REST API, with interactive prompts for configuration.

## Features
- Converts CSV data to per-customer JSON files
- Supports batch processing and configurable timeouts
- Sends requests to NetSuite REST endpoints with OAuth 1.0 authentication
- Interactive CLI for user input and confirmation

## Prerequisites
- Node.js (v14+ recommended)
- NetSuite REST API credentials (see `.env`)

## Setup
1. **Clone the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` (if provided) or create a `.env` file with your NetSuite credentials:
     ```env
     REALM_ID=your_realm_id
     CONSUMER_KEY=your_consumer_key
     CONSUMER_SECRET=your_consumer_secret
     TOKEN_ID=your_token_id
     TOKEN_SECRET=your_token_secret
     COMPANY_URL=https://your-account.suitetalk.api.netsuite.com
     REST_SERVICES=https://your-account.suitetalk.api.netsuite.com/services/rest/record/v1
     ```

## Usage
1. **Prepare your CSV file** and place it in the `data/` directory (or specify a custom path when prompted).
   - the CSV file must contain the following fields: `address_id`, `customer_id` and `used` (where used > 0 means the address needs to be kept, otherwise the address will be deleted)
2. **Run the app:**
   ```sh
   npm start
   ```
3. **Follow the prompts:**
   - Confirm the NetSuite realm
   - Enter the CSV file path (or use the default)
   - Enter the output directory (or use the default)
   - Set batch size and timeout as needed
   - Choose whether to send requests after conversion

4. **Output:**
   - JSON files are created in the specified output directory.
   - Success and error logs are managed in subfolders.

## Project Structure
- `index.js` — Main entry point, handles CLI and workflow
- `scripts/output_json.js` — Converts CSV to JSON
- `scripts/send_requests.js` — Sends JSON data to NetSuite
- `scripts/sign_requests.js` — Handles OAuth 1.0 signature generation
- `scripts/ask.js` — User input helper
- `data/` — Place your input CSV files here
- `output/` — Default output directory for JSON files

## Notes
- The `.gitignore` excludes sensitive and generated files (like `.env`, `output/`, and `data/`).
- Make sure your NetSuite account and integration are set up for REST API access.

## License
MIT
