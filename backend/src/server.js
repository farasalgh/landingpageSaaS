const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });


const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('DB_USER check:', process.env.DB_USER);
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});