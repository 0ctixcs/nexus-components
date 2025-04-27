document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grandTotal');
    
    // Display cart items
    function displayOrderItems() {
        if (cart.length === 0) {
            orderItems.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        let subtotal = 0;
        orderItems.innerHTML = cart.map(item => {
            const price = parseFloat(item.price.replace('RM', '').replace(',', ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            
            return `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-details">
                        <div class="order-item-title">${item.name}</div>
                        <div class="order-item-price">RM${price.toFixed(2)}</div>
                        <div class="order-item-quantity">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        const shipping = 10.00;
        const grandTotal = subtotal + shipping;
        
        subtotalEl.textContent = `RM${subtotal.toFixed(2)}`;
        grandTotalEl.textContent = `RM${grandTotal.toFixed(2)}`;
    }
    
    // Add this line to actually display the items when the page loads
    displayOrderItems();
    
    // Form submit handler remains the same
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Gather all form data
        const orderData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postcode: document.getElementById('postcode').value,
            state: document.getElementById('state').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent,
            cart: JSON.parse(localStorage.getItem('cart')) || []
        };
        
        // Save order data to localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    });
});