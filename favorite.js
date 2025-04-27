document.addEventListener('DOMContentLoaded', function() {
    console.log("Favorites script initialized");
    
    // Elements
    const favoriteIcon = document.getElementById('favorite-icon');
    const favoriteDropdown = document.getElementById('favorite-dropdown');
    const favoriteItemsList = document.getElementById('favorite-items-list');
    const favoriteCount = document.querySelector('.favorite-count');
    
    // State
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Update UI functions
    function updateUI() {
        updateFavoriteCount();
        renderFavoriteItems();
        updateFavoriteButtons();
    }
    
    function updateFavoriteCount() {
        const count = favorites.length;
        favoriteCount.textContent = count;
        favoriteIcon.classList.toggle('active', count > 0);
    }
    
    function renderFavoriteItems() {
        favoriteItemsList.innerHTML = favorites.length ? 
            favorites.map(item => `
                <div class="favorite-item" data-id="${item.id}">
                    <img src="${item.image}" class="favorite-item-image">
                    <div class="favorite-item-details">
                        <div class="favorite-item-title">${item.name}</div>
                        <div class="favorite-item-price">${item.price}</div>
                        <button class="favorite-item-remove">Remove</button>
                    </div>
                </div>
            `).join('') :
            '<p class="empty-favorite-message">Your favorites list is empty</p>';
    }
    
    function updateFavoriteButtons() {
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const popup = button.closest('.product-popup');
            if (!popup) return;
            
            const productId = popup.id.replace('popup-', ''); // Remove 'popup-' prefix
            const isFavorite = favorites.some(item => item.id === productId);
            
            button.classList.toggle('added', isFavorite);
            button.textContent = isFavorite ? '❤ REMOVE FROM FAVORITES' : '❤ ADD TO FAVORITES';
        });
    }
    
    // Core functionality
    function toggleFavorite(product) {
        const index = favorites.findIndex(item => item.id === product.id);
        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(product);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateUI();
    }
    
    // Event handlers
    favoriteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        favoriteDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!favoriteIcon.contains(e.target) && !favoriteDropdown.contains(e.target)) {
            favoriteDropdown.classList.remove('show');
        }
    });
    
    document.addEventListener('click', (e) => {
        // Handle remove button clicks
        if (e.target.classList.contains('favorite-item-remove')) {
            e.preventDefault();
            e.stopPropagation();
            const itemId = e.target.closest('.favorite-item').dataset.id;
            favorites = favorites.filter(item => item.id !== itemId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateUI();
        }
        
        // Handle add to favorite button clicks
        if (e.target.classList.contains('add-to-favorite')) {
            e.preventDefault();
            e.stopPropagation();
            const popup = e.target.closest('.product-popup');
            if (!popup) return;
            
            const productId = popup.id.replace('popup-', ''); // Remove 'popup-' prefix
            const product = {
                id: productId,
                name: popup.querySelector('.product-title').textContent,
                price: popup.querySelector('.price').textContent,
                image: popup.querySelector('.product-image-container img').src
            };
            
            toggleFavorite(product);
            
            // Show notification
            const isFavorite = favorites.some(item => item.id === productId);
            showNotification(
                isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
                isFavorite ? `${product.name} was added to your favorites` : `${product.name} was removed from favorites`,
                isFavorite ? 'success' : 'warning',
                3000
            );
        }
    });
    
    // Notification function (similar to cart notifications)
    function showNotification(title, message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <div class="cart-notification-icon">${type === 'success' ? '❤' : '✖'}</div>
            <div class="cart-notification-content">
                <div class="cart-notification-title">${title}</div>
                <div class="cart-notification-message">${message}</div>
            </div>
            <div class="cart-notification-close">&times;</div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close button handler
        notification.querySelector('.cart-notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }
    
    // Initialize
    updateUI();
});