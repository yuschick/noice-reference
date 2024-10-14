require('dotenv').config({ path: './.env/local.env' });
const config = require('./config');

global.NOICE = config(process.env);
global.MediaError = {};
