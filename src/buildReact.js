const path = require('path');
const fs = require('fs');
const Utils = require('./util/utils');
const inputFolder = './build/svg/';
const outputFolder = './build/jsx/';

const camelCaseFilename = (str) => {
  // Remove properities, e.g, 'size=small' to 'small'
  const cleaned = str.replace(/[A-Za-z]+=/g, '');
  // Conver to array to remove extenstion and use remaining values
  const arr = cleaned.split('.')[0].split(',');
  // Capitalize first letter and join items into string
  const camelCase = arr.map((item) => Utils.capitalize(item)).join('');
  return camelCase;
};

const reactTemplate = (svgData, filename) => {
  //  TODO: SVG data should have 'fill=...' to 'fill=currentColor'
  return `
import React from 'react';

const ${filename} = () => {
  return (
    ${svgData}
  );
}

export default ${filename};  
`;
};

const writeFiles = (filename, data) => {
  fs.writeFile(outputFolder + filename + '.jsx', data, (err) => {
    if (err) console.log(err);
    else {
      console.log(`✓ ${filename}.jsx`);
    }
  });
};

const makeFiles = (files) => {
  files.forEach(function (file) {
    fs.readFile(inputFolder + file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const filename = camelCaseFilename(file);
      const reactFileData = reactTemplate(data, filename);
      writeFiles(filename, reactFileData);
    });
  });
};

Utils.createFolder(outputFolder);

fs.readdir(inputFolder, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  // Remove hidden files
  const list = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
  makeFiles(list);
});
