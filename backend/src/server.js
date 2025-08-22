const path = require('path'); // 1. Impor modul 'path' bawaan Node.js

// 2. Buat path yang absolut dan anti-gagal ke file .env
const envPath = path.resolve(__dirname, '../.env');

// 3. Muat dotenv menggunakan path yang sudah pasti benar
require('dotenv').config({ path: envPath });


const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('DB_USER check:', process.env.DB_USER);
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});