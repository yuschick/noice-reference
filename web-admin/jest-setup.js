require('dotenv').config({ path: './.env/local.env' });
const { getConfig } = require('./config');

global.NOICE = getConfig(process.env);
global.MediaError = {};
