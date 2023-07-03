const figlet = require('figlet');

const text = 'Hello, Figlet!';

figlet(text, function (err, data) {
    if (err) {
        console.log('Error');
        console.dir(err);
        return;
    }
    console.log(data);
});
