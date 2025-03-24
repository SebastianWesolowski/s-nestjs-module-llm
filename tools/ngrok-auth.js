require('dotenv').config();
const ngrok = require('ngrok');

async function authenticate() {
  try {
    if (!process.env.NGROK_AUTH_TOKEN) {
      throw new Error('NGROK_AUTH_TOKEN not found in .env file');
    }
    await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
    console.log('\x1b[32mNgrok authentication successful!\x1b[0m');
  } catch (error) {
    console.error('\x1b[31mError:', error.message, '\x1b[0m');
    process.exit(1);
  }
}

authenticate();
