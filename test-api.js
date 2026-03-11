const http = require('http');

const sheetUrl = encodeURIComponent('https://docs.google.com/spreadsheets/d/1JhnWKiaCp-1sLx04vn4HKMiNMvSxgFu3rqvrBHUcJAU/edit?gid=0#gid=0');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/sheets?url=${sheetUrl}`,
    method: 'GET',
};

const req = http.request(options, (res) => {
    let body = '';
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
