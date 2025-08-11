require('dotenv').config();
const crypto = require('crypto');
const { encode } = require('punycode');
function generateOAuthHeader(method, url){
    const timestamp = Math.floor(Date.now() / 1000);    
    const nonce = crypto.randomBytes(16).toString('hex');
    const { origin, pathname, search } = new URL(url);

    // Parse query parameters
    const queryParams = {};
    if (search) {
        for (const [key, value] of new URLSearchParams(search)) {
            queryParams[key] = value;
        }
    }

    // OAuth parameters (excluding realm)
    const oauthParams = {
        oauth_consumer_key: process.env.CONSUMER_KEY,
        oauth_token: process.env.TOKEN_ID,
        oauth_signature_method: 'HMAC-SHA256',
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: '1.0'
    };

    // Combine all parameters (query + oauth)
    const allParams = { ...queryParams, ...oauthParams };

    // Build parameter string: key=value, percent-encoded, sorted
    const paramString = Object.entries(allParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .sort()
        .join('&');

    // Build base string
    const baseString = [
        method.toUpperCase(),
        encodeURIComponent(origin + pathname),
        encodeURIComponent(paramString)
    ].join('&');

    const signingKey = `${encodeURIComponent(process.env.CONSUMER_SECRET)}&${encodeURIComponent(process.env.TOKEN_SECRET)}`;
    const signature = crypto.createHmac('sha256', signingKey).update(baseString).digest('base64');
    oauthParams.oauth_signature = signature;

    // Build header (realm first, then sorted keys)
    const headerParams = [
        `realm="${encodeURIComponent(process.env.REALM_ID)}"`,
        ...Object.entries(oauthParams)
            .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    ].join(', ');

    return `OAuth ${headerParams}`;
}

module.exports = {
    generateOAuthHeader
};