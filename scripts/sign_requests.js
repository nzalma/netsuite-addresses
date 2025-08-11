require('dotenv').config();
const crypto = require('crypto');
const { encode } = require('punycode');

function generateOAuthHeader(method, url){
    const timestamp = Math.floor(Date.now() / 1000);    
    const nonce = crypto.randomBytes(16).toString('hex');

    // const nonce = 'pn8v1KF0v27';
    // const timestamp = '1754901607';
    const { origin, pathname, search } = new URL(url);
    // console.log(`Origin: ${origin}, Pathname: ${pathname}, Search: ${search}`);
    const debugMethod = method || 'GET';
    const params = {
        realm: process.env.REALM_ID,
        oauth_consumer_key: process.env.CONSUMER_KEY,
        oauth_token: process.env.TOKEN_ID,
        oauth_signature_method: 'HMAC-SHA256',
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: '1.0'
    };
    
    const oauthParams = Object.entries(params)
        .filter(([key]) => key.startsWith('oauth_'))
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .sort()
        .join('&');
    // console.log(`oAuth Params: ${oauthParams}`);

    const baseString = [
        debugMethod.toUpperCase(),
        encodeURIComponent(origin + pathname),
        encodeURIComponent(oauthParams)
    ].join('&');
    // console.log(`Base String: ${baseString}`);

    const signingKey = `${encodeURIComponent(process.env.CONSUMER_SECRET)}&${encodeURIComponent(process.env.TOKEN_SECRET)}`;
    const signature = crypto.createHmac('sha256', signingKey).update(baseString).digest('base64');
    params.oauth_signature = signature;
    
    const headerParams = [
        `realm="${encodeURIComponent(params.realm)}"`,
        ... Object.entries(params)
            .filter(([key]) => key !== 'realm')
            .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
    ].join(', ');
    return `OAuth ${headerParams}`;
}

module.exports = {
    generateOAuthHeader
};