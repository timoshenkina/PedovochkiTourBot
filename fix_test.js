const fs = require('fs');

const fileContent = fs.readFileSync('index.html', 'utf-8');
const loadPlacesContent = fileContent.match(/async function loadPlaces\(\) \{[\s\S]*?\n\}/)[0];
console.log(loadPlacesContent);
