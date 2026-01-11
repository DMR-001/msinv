/**
 * Auth Logic for MS Innovatics - Backend Integration
 */

const API_URL = 'http://localhost:3001/api';

const Auth = {
    // Register
    register: async (name, email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.success) {
                Auth.saveSession(data.user, data.token);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: 'Server connection failed' };
        }
    },

    // Login
    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                Auth.saveSession(data.user, data.token);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: 'Server connection failed' };
        }
    },

    // Save Session
    saveSession: (user, token) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', token);
        Auth.updateUI();
    },

    // Logout
    logout: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        Auth.updateUI();
        window.location.href = 'index.html';
    },

    // Get Current User
    getUser: () => {
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    // Update UI (Header)
    updateUI: () => {
        const user = Auth.getUser();
        const navLinks = document.querySelector('.nav-links');

        // Remove existing auth item
        const existingAuth = document.getElementById('auth-nav-item');
        if (existingAuth) existingAuth.remove();

        const li = document.createElement('li');
        li.id = 'auth-nav-item';

        if (user) {
            let adminLink = '';
            if (user.role === 'admin') {
                adminLink = `<a href="admin.html" style="color: #10b981; margin-right: 15px;">Admin</a>`;
            }

            li.innerHTML = `
                ${adminLink}
                <a href="#" style="color: var(--accent);"><i class="fas fa-user"></i> ${user.name}</a>
                <a href="#" onclick="Auth.logout()" style="margin-left: 15px; font-size: 0.9rem; color: var(--text-muted);">Logout</a>
            `;
        } else {
            li.innerHTML = `<a href="login.html" class="btn btn-outline" style="padding: 5px 20px; border-radius: 4px;">Login</a>`;
        }

        // Insert at end
        if (navLinks) {
            navLinks.appendChild(li);
        }
    }
};

// Init
document.addEventListener('DOMContentLoaded', Auth.updateUI);
