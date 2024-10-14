const { exec } = require('child_process');
const route = process.argv[2]; // e.g. u/toboas

const url = `https://noice.com/${route}`;
const command = `xcrun simctl openurl booted ${url}`;

exec(command, (err) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
});
