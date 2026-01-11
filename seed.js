require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const products = [
    {
        name: "Hospital Management System",
        category: "Web",
        price: 49,
        description: "Complete admin and patient portal built with PHP/MySQL. Includes appointment booking and billing.",
        image_url: ""
    },
    {
        name: "Smart Agriculture IoT",
        category: "IoT",
        price: 65,
        description: "Soil moisture and temperature monitoring system using Arduino and ESP8266.",
        image_url: ""
    },
    {
        name: "E-Commerce Website",
        category: "Web",
        price: 99,
        description: "Fully functional e-commerce store with React, Node.js, and MongoDB. Includes cart and admin panel.",
        image_url: ""
    },
    {
        name: "Face Recognition System",
        category: "Python",
        price: 55,
        description: "Python-based attendance system using OpenCV and Face Recognition libraries.",
        image_url: ""
    }
];

async function seed() {
    try {
        const client = await pool.connect();

        console.log("Seeding products...");
        for (const p of products) {
            await client.query(
                'INSERT INTO products (name, category, price, description, image_url) VALUES ($1, $2, $3, $4, $5)',
                [p.name, p.category, p.price, p.description, p.image_url]
            );
        }

        console.log("Seeding complete!");
        client.release();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
