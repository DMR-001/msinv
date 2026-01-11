require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Helper: Generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Test Route to verify server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db_configured: !!process.env.DATABASE_URL });
});

// --- API Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Insert User
        // Default role is 'user'. First user could be admin manually updated in DB or via secret code.
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hash, 'user']
        );

        const token = generateToken(newUser.rows[0]);
        res.status(201).json({ success: true, user: newUser.rows[0], token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Products
app.get('/api/products', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = 'SELECT * FROM products';
        let params = [];
        let conditions = [];

        if (category) {
            conditions.push(`category = $${params.length + 1}`);
            params.push(category);
        }

        if (search) {
            conditions.push(`name ILIKE $${params.length + 1}`);
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Product (Admin Only)
// Note: Middleware for auth should be added for security in prod. simplified here.
app.post('/api/products', async (req, res) => {
    const { name, description, category, price, image_url, token } = req.body;

    // Quick Auth Check
    try {
        if (!token) return res.status(401).json({ message: 'No token' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

        const newProduct = await pool.query(
            'INSERT INTO products (name, description, category, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, category, price, image_url]
        );
        res.status(201).json({ success: true, product: newProduct.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error or Unauthorized' });
    }
});

// Export for Vercel
module.exports = app;

// Start Server if running directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
