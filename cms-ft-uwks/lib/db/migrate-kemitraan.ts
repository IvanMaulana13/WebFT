import mysql from "mysql2/promise";

async function runMigration() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const connection = await mysql.createConnection(url);

  console.log("🚀 Menjalankan migrasi kolom kategori_mitra pada tabel kemitraan...");

  try {
    // Check if column already exists
    const [columns]: any = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'kemitraan' 
        AND COLUMN_NAME = 'kategori_mitra'
    `);

    if (columns.length === 0) {
      console.log("➕ Menambahkan kolom kategori_mitra ke tabel kemitraan...");
      await connection.query(`
        ALTER TABLE kemitraan 
        ADD COLUMN kategori_mitra enum('universitas','lembaga') NOT NULL DEFAULT 'universitas'
      `);
      console.log("✅ Kolom kategori_mitra berhasil ditambahkan.");
    } else {
      console.log("ℹ️  Kolom kategori_mitra sudah ada di tabel kemitraan.");
    }

    // Set default value for existing data
    await connection.query(`
      UPDATE kemitraan 
      SET kategori_mitra = 'universitas' 
      WHERE kategori_mitra IS NULL
    `);
    console.log("✅ Update default 'universitas' untuk data lama berhasil.");

  } catch (error) {
    console.error("❌ Migrasi gagal:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }

  console.log("🎉 Migrasi kemitraan selesai!");
  process.exit(0);
}

runMigration();
