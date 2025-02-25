const fs = require('fs');
const path = require('path');
const util = require('util');
const itemServices = require('./itemsServices');

const categoriesFilePath = path.join(__dirname, '../data/categories.json');

function getCategoriesSync() {
    const data = fs.readFileSync(categoriesFilePath, 'utf8');
    return JSON.parse(data);
}

function getCategoriesWithCallback(callback) {
    fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, JSON.parse(data));
    });
}

function getCategoriesWithPromise() {
    return new Promise((resolve, reject) => {
        fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

const readFileAsync = util.promisify(fs.readFile);
async function getCategoriesWithAsyncAwait() {
    const data = await readFileAsync(categoriesFilePath, 'utf8');
    return JSON.parse(data);
}

const getCategoryById = async (id) => {
    const data = (await getCategoriesWithAsyncAwait()).find(c => c.id === Number(id));
    const items = await itemServices.getItemsWithAsyncAwait(id);

    return { category: data, items: items };
}

module.exports = {
    getCategoriesSync,
    getCategoriesWithCallback,
    getCategoriesWithPromise,
    getCategoriesWithAsyncAwait,
    getCategoryById
};
