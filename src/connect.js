require('dotenv').config();

const Kodicord = require('./Kodicord.js');
const rpc = new Kodicord(process.env.URL, process.env.PORT);
rpc.connect();