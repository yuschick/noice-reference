require('dotenv').config({ path: './.env/local.env' });
const config = require('./config');

global.NOICE = config.getConfig(process.env);
global.MediaError = {};

global.userAgent = jest.spyOn(navigator, 'userAgent', 'get');