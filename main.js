const request = require('request');
const fs = require('fs');
const https = require('https');
const path = require('path');
const generatePairs = require('./generatePairs');

const URL = 'https://dou.ua/';
const startRedomendedBlock = '<div class="b-footer-slider m-hide">';
const endRedomendedBlock = '<footer class="b-footer">';
const startUrl = '<img class="img" loading="lazy" src="';
const endUrl = '" srcset=';

const FILE_IMAGE = 'image.svg';
const ALL_IMAGES = 'arr.txt';
const NUMBERS = 'numbers.txt';
const FOLDER1 = 'folder1';
const FOLDER2 = 'folder2';
const dir = path.join(__dirname, FOLDER1);
const initialFileContent = '';

// utils
const createFolders = (...folders) => {
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, (err) => {
        if (err) throw err;
      });
    }
  });
};

const moveFileToFolder = (file, newPath) => {
  if (fs.existsSync(file)) {
    fs.renameSync(file, `${newPath}/${file}`, (err) => {
      if (err) throw err;
    });
  }
};

// STEPS
// step 1 - try to create the folders
createFolders(FOLDER1, FOLDER2);

// step 2 - try to create the file in the root path
fs.writeFileSync(FILE_IMAGE, initialFileContent, (err) => {
  if (err) throw err;
});

// step 3 - move the file to another folder
moveFileToFolder(FILE_IMAGE, FOLDER1);

// GENERATE NUMBERS FILE
const allNumbers = generatePairs(1, 5, 10, 20);
const isCorrectValues = typeof allNumbers === 'object';

if (isCorrectValues) {
  fs.writeFileSync(`${FOLDER1}/${NUMBERS}`, initialFileContent);

  allNumbers.forEach(([min, max]) => {
    for (let i = min; i <= max; i++) {
      fs.appendFileSync(`${FOLDER1}/${NUMBERS}`, `${i}\n`);
    }
  });
}

request(URL, (error, res, body) => {
  if (!error && res.statusCode === 200) {
    const findstartIndex = body.indexOf(startRedomendedBlock);
    const findEndIndex = body.indexOf(endRedomendedBlock);
    const recomendedBody = body.slice(findstartIndex, findEndIndex);

    const removeChars = recomendedBody
      .replace(/^\s*\n/gm, '')
      .replace(/\t/g, '')
      .replace(/\n/g, '');

    const findStartImage = removeChars.split(startUrl);
    const removeWelcomeText = findStartImage.splice(1);

    const result = removeWelcomeText.map((text) => {
      const endIndex = text.indexOf(endUrl);

      if (endIndex) {
        const imgUrl = text.slice(0, endIndex);
        return imgUrl;
      }
      return null;
    });

    // step 4 - add images to the file
    result.forEach((str) => {
      fs.appendFileSync(
        `${FOLDER1}/${ALL_IMAGES}`,
        `<img src="${str}" />\n`,
        (err) => {
          if (err) throw err;
        }
      );
    });

    // step 4 - add server
    // settings for server
    const PORT = 3000;
    const options = {
      key: fs.readFileSync('key.pem').toString(),
      cert: fs.readFileSync('cert.pem').toString()
    };
    const file = path.join(dir, '/arr.txt');

    const server = https.createServer(options, (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      var s = fs.createReadStream(file);
      s.on('open', function () {
        s.pipe(res);
      });
    });

    // start server
    server.listen(PORT, 'localhost', (err) => {
      if (err) throw err;
      console.log('https server start');
    });
  }
});
