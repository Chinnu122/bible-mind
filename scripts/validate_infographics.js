const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/public/data/infographic_books.json');

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    JSON.parse(raw);
    console.log("SUCCESS: JSON is valid.");
} catch (e) {
    console.error("ERROR: JSON is invalid.");
    console.error(e.message);
}
