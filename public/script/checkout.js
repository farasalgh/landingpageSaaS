document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryDiv = document.getElementById('order-summary');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');

    const cartItems = JSON.parse(localStorage.getItem('cartForCheckout'));

    if (!cartItems || cartItems.length === 0) {
        orderSummaryDiv.innerHTML = '<p>Tidak ada item untuk di-checkout.</p>';
        return;
    }

    let totalPrice = 0;
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between text-gray-300';
        itemElement.innerHTML = `<span>${item.name} x ${item.quantity}</span> <span>$${(item.price * item.quantity).toFixed(2)}</span>`;
        orderSummaryDiv.appendChild(itemElement);
        totalPrice += item.price * item.quantity;
    });
    totalPriceSpan.innerText = `$${totalPrice.toFixed(2)}`;

    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const authToken = localStorage.getItem('authToken');
        const submitButton = checkoutForm.querySelector('button');
        submitButton.innerText = 'Processing...';
        submitButton.disabled = true;

        const orderPayload = {
            customerName: document.getElementById('customer-name').value,
            shippingAddress: document.getElementById('shipping-address').value,
            phoneNumber: document.getElementById('phone-number').value,
            totalPrice: totalPrice,
            items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(orderPayload)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Gagal membuat pesanan.');
            }

            localStorage.removeItem('cartForCheckout');
            localStorage.removeItem('cart');
            window.location.href = `/public/order-success.html?orderId=${result.orderId}`;
        } catch (error) {
            alert(error.message);
            submitButton.innerText = 'Place Order';
            submitButton.disabled = false;
        }
    });
});