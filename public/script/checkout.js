document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleksi elemen-elemen penting dari halaman
    const orderSummaryDiv = document.getElementById('order-summary');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');
    
    let cartItems = []; // Variabel untuk menyimpan item yang akan di-checkout

    // 2. Logika untuk mendapatkan data item (bisa dari localStorage atau URL)
    const itemsFromStorage = JSON.parse(localStorage.getItem('cartForCheckout'));

    if (itemsFromStorage && itemsFromStorage.length > 0) {
        cartItems = itemsFromStorage;
    } else {
        const params = new URLSearchParams(window.location.search);
        const productFromUrl = {
            id: params.get('id'),
            name: params.get('name'),
            price: parseFloat(params.get('price')),
            size: params.get('size'),
            quantity: parseInt(params.get('quantity')) || 1,
            image_url: params.get('image_url')
        };

        if (productFromUrl.name && productFromUrl.price) {
            cartItems = [productFromUrl];
        }
    }

    // 3. Tampilkan data item di Ringkasan Pesanan
    if (!cartItems || cartItems.length === 0) {
        orderSummaryDiv.innerHTML = '<p class="text-gray-400">Tidak ada item untuk di-checkout.</p>';
        totalPriceSpan.textContent = '$0.00'; // Ubah default menjadi Dolar
        return;
    }

    let totalPrice = 0;
    orderSummaryDiv.innerHTML = ''; 

    // BUAT FORMATTER UNTUK USD
    const usdFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    cartItems.forEach(item => {
        const itemPrice = item.price * item.quantity;
        totalPrice += itemPrice;

        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center text-sm py-2';
        itemElement.innerHTML = `
            <div>
                <p class="font-semibold text-white">${item.name}</p>
                <p class="text-gray-400">Jumlah: ${item.quantity}</p>
            </div>
            <p class="text-gray-200">${usdFormatter.format(itemPrice)}</p>
        `;
        orderSummaryDiv.appendChild(itemElement);
    });

    // GUNAKAN FORMATTER USD UNTUK TOTAL
    totalPriceSpan.textContent = usdFormatter.format(totalPrice);

    // 4. Logika untuk submit form checkout (tidak ada perubahan di sini)
    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const authToken = localStorage.getItem('authToken');
        const submitButton = checkoutForm.querySelector('button[type="submit"]');
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
            window.location.href = `order-success.html?orderId=${result.orderId}`;

        } catch (error) {
            alert(error.message);
            submitButton.innerText = 'Place Order';
            submitButton.disabled = false;
        }
    });
});