import http from 'http';

async function checkUrl(url) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ message: url });
        const options = {
            hostname: 'localhost',
            port: process.env.BLOOM_FILTER_PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const request = http.request(options, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data); // Resolve when the entire response has been received
            });
        });
        request.on('error', error => {
            reject(error);
        });
        request.write(postData);
        request.end();
    });
}

export default {
    checkUrl
};
