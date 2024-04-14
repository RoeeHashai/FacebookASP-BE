import http from 'http';

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
