require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const email = process.argv[2];

if (!email) {
    console.log('Usage: node promote-admin.js <email>');
    process.exit(1);
}

async function promote() {
    try {
        const client = await pool.connect();
        const res = await client.query("UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *", [email]);

        if (res.rows.length > 0) {
            console.log(`Success! User ${email} is now an ADMIN.`);
        } else {
            console.log(`User ${email} not found.`);
        }
        client.release();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

promote();
