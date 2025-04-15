const fs = require('fs');
const path = require('path');
const util = require('util');

const dataPath = path.join(__dirname, '../data/items.json');

function getItemsSync() {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
}

function getItemsWithCallback(callback) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, JSON.parse(data));
    });
}

function getItemsWithPromise() {
    return new Promise((resolve, reject) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

const readFileAsync = util.promisify(fs.readFile);

async function getItemsWithAsyncAwait() {
    const data = await readFileAsync(dataPath, 'utf8');
    return JSON.parse(data);
}

const getItemById = async (id) => {
    const data = await getItemsWithAsyncAwait();
    return data.find(c => c.id === Number(id));
}

module.exports = {
    getItemsSync,
    getItemsWithCallback,
    getItemsWithPromise,
    getItemsWithAsyncAwait,
    getItemById
};
