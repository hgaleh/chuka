const { readFile, writeFile } = require('fs').promises;
const { resolve } = require('path');

(async () => {
    const fileContent = await readFile(resolve(__dirname, '../package.json'));
    const jsonContent = fileContent.toString();
    const objectPackage = JSON.parse(jsonContent);

    delete objectPackage.scripts;
    delete objectPackage.devDependencies;
    objectPackage.type = 'commonjs';
    objectPackage.main = 'index.js';

    await writeFile(resolve(__dirname, '../dist/chuka/package.json'), JSON.stringify(objectPackage, null, 4));
})()