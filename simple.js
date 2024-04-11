// import express from 'express';
// import http from 'http';
// const app = express();
// const port = 8082;

// app.use(express.json()); // Middleware to parse JSON bodies

// app.get('/', (req, res) => {
//     const messages = ["Hello", "World", "from", "Node.js"];
//     let responses = [];
//     let completedRequests = 0;

//     function sendHttpPostRequest(message) {
//         return new Promise((resolve, reject) => {
//             const postData = JSON.stringify({ message: message });
//             const options = {
//                 hostname: 'localhost',
//                 port: 8081,
//                 path: '/',
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Content-Length': Buffer.byteLength(postData)
//                 }
//             };

//             const request = http.request(options, response => {
//                 let data = '';
//                 response.on('data', chunk => {
//                     data += chunk;
//                 });
//                 response.on('end', () => {
//                     resolve(data);
//                 });
//             });

//             request.on('error', error => {
//                 reject(error);
//             });

//             request.write(postData);
//             request.end();
//         });
//     }

//     messages.forEach(message => {
//         sendHttpPostRequest(message)
//             .then(response => {
//                 console.log(`Received response: ${response}`);
//                 responses.push(response);
//                 completedRequests++;
//                 if (completedRequests === messages.length) {
//                     res.send(responses.join("\n"));
//                 }
//             })
//             .catch(error => {
//                 res.status(500).send(`Error sending message to C++ server: ${error.message}`);
//             });
//     });
// });

// app.listen(port, () => {
//     console.log(`Node.js Express server running at http://localhost:${port}`);
// });
import express from 'express';
import http from 'http';

const app = express();
const port = 8082;

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', async (req, res) => { // Make the route handler async
    const messages = ["Hello", "World", "from", "Node.js"];
    let responses = [];

    async function sendHttpPostRequest(message) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify({ message: message });
            const options = {
                hostname: 'localhost',
                port: 8081,
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

    // Use a for...of loop to handle asynchronous requests sequentially
    for (let message of messages) {
        try {
            const response = await sendHttpPostRequest(message);
            console.log(`Received response: ${response}`);
            responses.push(response);
        } catch (error) {
            res.status(500).send(`Error sending message to C++ server: ${error.message}`);
            return; // Exit if there's an error
        }
    }

    // Send all responses after all messages have been handled
    res.send(responses.join("\n"));
});

app.listen(port, () => {
    console.log(`Node.js Express server running at http://localhost:${port}`);
});
