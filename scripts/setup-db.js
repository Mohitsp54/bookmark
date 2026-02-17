const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function setupDatabase() {
  // Load env vars
  const envPath = path.resolve(__dirname, "..", ".env.local");
  const envContent = fs.readFileSync(envPath, "utf8");

  const env = {};
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[match[1].trim()] = value;
    }
  });

  let connectionString = env["POSTGRES_URL"];
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    connectionString = url.toString();
  } catch (e) {
    // If URL parsing fails, fallback to simple replacement
    connectionString = connectionString.replace("sslmode=require", "");
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    const sqlPath = path.resolve(__dirname, "setup_db.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Running SQL setup...");
    await client.query(sql);
    console.log("Database setup completed successfully.");
  } catch (err) {
    console.error("Error running database setup:", err);
  } finally {
    await client.end();
  }
}

setupDatabase();
