import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configFolderPath = join(__dirname, 'config');
const envContent = `CONNECTION_STRING='mongodb://localhost:27017/'
PORT=8080
JWT_SECRET='secret'
BLOOM_FILTER_PORT = 8081
BF_INIT_CONFIG = '128 1 2'
BLACKLISTED_URLS = 'https://www.google.com,https://www.youtube.com,https://www.facebook.com,http://www.amazon.com,http://www.wikipedia.org,https://www.twitter.com,https://www.instagram.com,https://www.linkedin.com,https://www.netflix.com,http://www.apple.com,https://www.bbc.com,https://www.microsoft.com,http://www.imdb.com,https://www.cnn.com,https://www.espn.com,https://www.adobe.com,https://www.tumblr.com,http://www.pinterest.com,https://www.paypal.com,https://www.wordpress.com,https://www.ebay.com,http://www.reddit.com,https://www.dropbox.com,https://www.spotify.com,https://www.github.com,http://www.quora.com,https://www.yahoo.com,https://www.soundcloud.com,https://www.blogger.com,http://www.imgur.com'
`;

// Function to create a directory if it doesn't exist
async function ensureDirSync(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
        console.log(`Directory ${dirPath} has been created!`);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err; // Ignore the error if directory already exists
    }
}

// Function to write content to a file, creating the file if it doesn't exist
async function writeFileAsync(filePath, content) {
    try {
        await writeFile(filePath, content, { flag: 'w' });
        console.log(`File ${filePath} has been saved!`);
    } catch (err) {
        throw err;
    }
}

// Main function to orchestrate the creation of config folder and files
async function setupConfigFiles() {
    await ensureDirSync(configFolderPath);
    await writeFileAsync(join(configFolderPath, '.env'), envContent);
    await writeFileAsync(join(configFolderPath, '.env.local'), envContent);
}

setupConfigFiles().catch(console.error);
