//const fp= require('./fileOps');

// Synchronous file read
const readFileSync = () => {
    console.log('Reading file synchronously...');
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('Synchronous read result:', data);
  };
  
  // Asynchronous file read
  
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);}
)
console.log('File read successfully');

fs.writeFile('file2.txt', 'Hello World', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data written successfully');
})
console.log('2. Data write operation completed');

fs. appendFile('file2.txt', 'Hi Humans', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data appended successfully');
}
)
console.log('Data append operation completed');

process.on('caughtException', (err) => {
    console.error(err);
    process.exit(1);
})

