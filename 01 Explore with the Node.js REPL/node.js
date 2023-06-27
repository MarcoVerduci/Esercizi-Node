const crypto = require('crypto');

const generateRandomID = (length) => {
    const bytes = crypto.randomBytes(length);
    return bytes.toString('hex');
};

const randomID = generateRandomID(8);
console.log(randomID);
