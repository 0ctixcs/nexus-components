document.addEventListener('DOMContentLoaded', function() {
    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData')) || {};
    const cart = orderData.cart || []; // Get cart from orderData
    
    // Generate random order number
    const orderNumber = 'NC-' + Math.floor(Math.random() * 1000000);
    document.getElementById('orderNumber').textContent = orderNumber;
    
    // Display order items
    const orderSummary = document.getElementById('orderSummary');
    let subtotal = 0;
    
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>No items in this order</p>';
    } else {
        orderSummary.innerHTML = cart.map(item => {
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
    }
    
    // Display customer information - UPDATED THIS SECTION
    if (orderData.fullName) { // Check for any required field instead of 'shipping'
        document.getElementById('shippingAddress').innerHTML = `
            ${orderData.fullName}<br>
            ${orderData.address}<br>
            ${orderData.postcode} ${orderData.city}<br>
            ${orderData.state}
        `;
        
        document.getElementById('contactInfo').innerHTML = `
            ${orderData.email}<br>
            ${orderData.phone}
        `;
        
        document.getElementById('paymentMethod').textContent = 
            orderData.paymentMethod || 'Credit Card';
    }
    
    // Calculate and display totals
    const shipping = 10.00;
    const total = subtotal + shipping;
    
    document.getElementById('orderSubtotal').textContent = `RM${subtotal.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `RM${total.toFixed(2)}`;
    
    // Clear cart after showing thank you page
    localStorage.removeItem('cart');
    
    // Print receipt functionality
    document.querySelector('.print-receipt-btn').addEventListener('click', function(e) {
        e.preventDefault();
        window.print();
    });
});