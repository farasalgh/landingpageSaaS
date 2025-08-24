document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const orderIdElement = document.getElementById('order-id');

    if (orderId && orderIdElement) {
        orderIdElement.textContent = `#${orderId}`;
    } else if (orderIdElement) {
        orderIdElement.textContent = 'Tidak Ditemukan';
    }
});