import http from 'http';
import { Agent } from 'http';


async function checkUrl(url) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ message: url });
        const agent = new Agent({ keepAlive: true });
        const options = {
            hostname: 'localhost',
            port: process.env.BLOOM_FILTER_PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
            agent: agent  // Use the custom agent

        };
        const request = http.request(options, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data.includes('blacklisted')); // Resolve when the entire response has been received
            });
        });
        
        // Set a timeout to close the socket after 10 seconds
        // let timeout = setTimeout(() => {
        //     request.socket.end(); // Gracefully close the socket
        //     console.log('Connection closed due to timeout.');
        // }, 10000); // 10 seconds timeout

        request.on('error', error => {
            // clearTimeout(timeout);
            reject(error);
        });
        request.write(postData);
        request.end();
    });
}

function findUrls(postContent) {
    const urlRegex = /(\b((https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|](\b|$))/ig;
    let urls = [];
    let match;

    while ((match = urlRegex.exec(postContent)) !== null) {
        urls.push(match[0]);
    }
    return urls;
}

const validateUrl = async (url) => {
    try {
        const bloomFilterResponse = await checkUrl(url);
        return !bloomFilterResponse; // if its true = response containes blacklisted
    } catch (error) {
        console.error(`Error calling URL filter service for ${url}: ${error.message}`);
        return false;
    }
}

const validateUrls = async (urls) => {
    for (const url of urls) {
        const isValid = await validateUrl(url);
        if (!isValid) {
            return false;
        }
        return true;
    }
}

const validateContent = async (content) => {
    let postUrls = findUrls(content);
    if (postUrls.length > 0) {
        const isValid = await validateUrls(postUrls);
        if (!isValid) {
            console.error('Post contains blacklisted URL');
            const error = new Error('Post contains blacklisted URL');
            error.code = 400;
            throw error;
        }
    }
    return true;
}

export default {
    validateContent
};
