require('dotenv').config();

const Core = require('./Core.js');
const kodicord = new Core(process.env.URL);
kodicord.connect().catch(console.error);