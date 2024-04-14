import http from 'http';
import { Agent } from 'http';

// async function endConnection() {
//     return new Promise((resolve, reject) => {
//         const options = {
//             hostname: 'localhost',
//             port: process.env.BLOOM_FILTER_PORT,
//             path: '/',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'text/plain',
//                 'Content-Length': Buffer.byteLength('quit'),
//             }
//         };
//         const request = http.request(options, response => {
//             let data = '';
//             response.on('data', chunk => {
//                 data += chunk;
//             });
//             response.on('end', () => {
//                 resolve(data.includes('Server connection closed')); // Resolve when the entire response has been received
//             });
//         });
//         request.on('error', error => {
//             reject(error);
//         });
//         request.write('quit');
//         request.end();
//     })
// }

// async function checkUrl(url) {
//     return new Promise((resolve, reject) => {
//         // const postData = JSON.stringify({ message: url });
//         // const agent = new Agent({ keepAlive: true });
//         const options = {
//             hostname: 'localhost',
//             port: process.env.BLOOM_FILTER_PORT,
//             path: '/',
//             method: 'POST',
//             headers: {
//                 'Connection': 'keep-alive', // Keep the connection open for future requests
//                 'Content-Type': 'text/plain',
//                 'Content-Length': Buffer.byteLength(url),
//             },
//             // agent: agent  // Use the custom agent

//         };
//         const request = http.request(options, response => {
//             let data = '';
//             response.on('data', chunk => {
//                 data += chunk;
//             });
//             response.on('end', () => {
//                 resolve(data.includes('blacklisted')); // Resolve when the entire response has been received
//             });
//         });

//         // Set a timeout to close the socket after 10 seconds
//         // let timeout = setTimeout(() => {
//         //     request.socket.end(); // Gracefully close the socket
//         //     console.log('Connection closed due to timeout.');
//         // }, 10000); // 10 seconds timeout

//         request.on('error', error => {
//             // clearTimeout(timeout);
//             reject(error);
//         });
//         request.write(url);
//         request.end();
//     });
// }

function sendRequest(message) {
    return new Promise((resolve, reject) => {
      const postData = message;
      const options = {
        hostname: 'localhost',
        port: process.env.BLOOM_FILTER_PORT,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Connection': 'keep-alive', // Keep the connection open for future requests
          'Content-Length': Buffer.byteLength(postData)
        }
      };
  
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log('Server response:', data);
          resolve(data);
        });
      });
  
      req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        reject(e);
      });
  
      // Write data to request body
      req.write(postData);
      req.end();
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
        const bloomFilterResponse = await sendRequest(url);
        if (bloomFilterResponse.includes('blacklisted')) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

const validateUrls = async (urls) => {
    for (const url of urls) {
        const isValid = await validateUrl(url);
        if (!isValid) {
            const endConnectionSucceffuly = await sendRequest('quit');
            if (endConnectionSucceffuly.includes('Server connection closed')) {
                console.log('Connection closed:', endConnectionSucceffuly);
                return false;
            }
        }
    }
    const endConnectionSucceffuly = await sendRequest('quit');
    if (endConnectionSucceffuly.includes('Server connection closed')) {
        console.log('Connection closed:', endConnectionSucceffuly);
        return true;
    }
}

const validateContent = async (content) => {
    let postUrls = findUrls(content);
    if (postUrls.length > 0) {
        const isValid = await validateUrls(postUrls);
        if (!isValid) {
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
