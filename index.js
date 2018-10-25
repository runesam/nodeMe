const fs = require('fs');

fs.appendFile('greatings.txt', 'hey mother fuckers', error => console.log(error));
