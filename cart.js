/**
 * Cart Logic for MS Innovatics
 */

const Cart = {
    // Get cart from storage
    getCart: () => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    // Add item to cart
    add: (product) => {
        const cart = Cart.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        Cart.updateCount();
        alert('Item added to cart!');
    },

    // Remove item
    remove: (productId) => {
        let cart = Cart.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.reload(); // Refresh to show changes
    },

    // Clear cart
    clear: () => {
        localStorage.removeItem('cart');
    },

    // Update Cart Count in Header
    updateCount: () => {
        const cart = Cart.getCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);

        // Check if cart icon exists
        let cartIcon = document.getElementById('cart-icon-nav');
        const navLinks = document.querySelector('.nav-links');

        if (!cartIcon && navLinks) {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="cart.html" id="cart-icon-nav">
                    <i class="fas fa-shopping-cart"></i> 
                    <span id="cart-count" style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 50%; font-size: 0.8rem;">0</span>
                </a>
            `;
            // Insert before the last item (Auth) or at end
            navLinks.insertBefore(li, navLinks.lastElementChild);
        }

        const countEl = document.getElementById('cart-count');
        if (countEl) countEl.innerText = count;
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', Cart.updateCount);
