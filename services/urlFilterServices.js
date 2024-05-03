import http from 'http';

function sendRequest(message) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.BLOOM_FILTER_PORT,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Connection': 'keep-alive', // Keep the connection open for future requests
        'Content-Length': Buffer.byteLength(message)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });

    // Write data to request body
    req.write(message);
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
    const bloomFilterResponse = await sendRequest('2 ' + url);
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
        return false;
      }
    }
  }
  const endConnectionSucceffuly = await sendRequest('quit');
  if (endConnectionSucceffuly.includes('Server connection closed')) {
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

const initBloomFilter = async () => {
  try {
    const bloomFilterResponse = await sendRequest(process.env.BF_INIT_CONFIG);
    if (bloomFilterResponse.includes('Bloom filter initialized')) {
      const urls = process.env.BLACKLISTED_URLS.split(',');
      for (const url of urls) {
        const res = await sendRequest('1 ' + url);
        if (!res.includes('URL added')) {
          return false;
        }
      }
      const quitReq = await sendRequest('quit');
      if (quitReq.includes('closing connection')) {
        return true;
      }
    }
  }
  catch (error) {
    return false;
  }
}

export default {
  validateContent,
  initBloomFilter
};
