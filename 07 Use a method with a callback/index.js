const fs = require('fs');

const filePath = 'example.txt';
const fileContent = 'Hello, world!';

fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
        console.error('Error', err);
    } else {
        console.log('Everything good!');
    }
});
