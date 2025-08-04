const fs = require('fs');

// Read the test file
let content = fs.readFileSync('test/MedChain.test.js', 'utf8');

// Fix createDrugBatch calls that don't have the new parameters
content = content.replace(
  /createDrugBatch\(\s*"([^"]+)",\s*([^,]+),\s*"([^"]+)",\s*(\d+),\s*([^)]+)\s*\)/g,
  'createDrugBatch("$1", "$1_CODE", "FDA-$1-001", $2, "$3", $4, $5)'
);

// Fix registerHospital calls that don't have the new parameters
content = content.replace(
  /registerHospital\(\s*([^,]+),\s*"([^"]+)",\s*(\d+),\s*(\d+)\s*\)/g,
  'registerHospital($1, "$2", "REG_$2", $3, $4, 100)'
);

// Fix requestDrugs calls that don't have the new urgency parameter
content = content.replace(
  /requestDrugs\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*"([^"]+)"\s*\)/g,
  'requestDrugs($1, $2, $3, "$4", "Normal")'
);

// Write the fixed content back
fs.writeFileSync('test/MedChain.test.js', content);
console.log('Test file updated successfully!');
