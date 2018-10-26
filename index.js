const fs = require('fs');
const os = require('os');

const user = os.userInfo();

fs.appendFile(
    'greatings.txt',
    `hey ${user.username} how are you mother fuckers`,
    error => console.log(error),
);
