const http = require('http');

// Test the security headers implementation
const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/test',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Headers:');
    console.log('================');
    
    // Check for Content Security Policy
    const csp = res.headers['content-security-policy'];
    if (csp) {
        console.log('✅ Content-Security-Policy:', csp);
    } else {
        console.log('❌ Content-Security-Policy: NOT SET');
    }
    
    // Check for X-Frame-Options
    const frameOptions = res.headers['x-frame-options'];
    if (frameOptions) {
        console.log('✅ X-Frame-Options:', frameOptions);
    } else {
        console.log('❌ X-Frame-Options: NOT SET');
    }
    
    // Check all headers for reference
    console.log('\nAll Headers:');
    console.log('============');
    Object.keys(res.headers).forEach(header => {
        console.log(`${header}: ${res.headers[header]}`);
    });
});

req.on('error', (err) => {
    console.error('Error testing headers:', err.message);
    console.log('Make sure the server is running on port 8080');
});

req.end();
