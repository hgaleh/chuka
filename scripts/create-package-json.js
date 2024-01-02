const { readFile, writeFile } = require('fs').promises;
const { resolve } = require('path');

(async () => {
    const fileContent = await readFile(resolve(__dirname, '../package.json'));
    const jsonContent = fileContent.toString();
    const objectPackage = JSON.parse(jsonContent);

    delete objectPackage.scripts;
    delete objectPackage.devDependencies;

    await writeFile(resolve(__dirname, '../dist/package.json'), JSON.stringify(objectPackage, null, 4));
})()