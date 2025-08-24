// public/admin/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';
    const authToken = localStorage.getItem('authToken');

    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productDescInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productStockInput = document.getElementById('product-stock');
    const productImageUrlInput = document.getElementById('product-image-url');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };

    let allProducts = [];

    async function loadProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`);
            allProducts = await response.json();
            
            productList.innerHTML = '';
            if (allProducts.length === 0) {
                productList.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Belum ada produk.</td></tr>';
                return;
            }

            allProducts.forEach(product => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-800';
                row.innerHTML = `
                    <td class="p-3">${product.name}</td>
                    <td class="p-3">$${product.price}</td>
                    <td class="p-3">${product.stock}</td>
                    <td class="p-3 flex gap-2">
                        <button class="btn btn-edit text-sm btn-edit" data-id="${product.id}">Edit</button>
                        <button class="btn btn-delete text-sm btn-delete" data-id="${product.id}">Hapus</button>
                    </td>
                `;
                productList.appendChild(row);
            });
        } catch (error) {
            console.error('Gagal memuat produk:', error);
            productList.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Gagal memuat produk.</td></tr>';
        }
    }

    function populateFormForEdit(productId) {
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;

        productIdInput.value = product.id;
        productNameInput.value = product.name;
        productDescInput.value = product.description;
        productPriceInput.value = product.price;
        productStockInput.value = product.stock;
        productImageUrlInput.value = product.image_url;

        formTitle.textContent = 'Edit Produk';
        submitButton.textContent = 'Update Produk';
        cancelEditButton.classList.remove('hidden');
        window.scrollTo(0, 0); // Gulir ke atas ke form
    }
    
    function resetForm() {
        productForm.reset();
        productIdInput.value = '';
        formTitle.textContent = 'Tambah Produk Baru';
        submitButton.textContent = 'Tambah Produk';
        cancelEditButton.classList.add('hidden');
    }

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = productIdInput.value;
        const productData = {
            name: productNameInput.value,
            description: productDescInput.value,
            price: parseFloat(productPriceInput.value),
            stock: parseInt(productStockInput.value),
            image_url: productImageUrlInput.value
        };

        const url = id ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, headers, body: JSON.stringify(productData) });
            if (!response.ok) {
                throw new Error(id ? 'Gagal mengupdate produk.' : 'Gagal menambah produk.');
            }
            resetForm();
            loadProducts();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    productList.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('btn-edit')) {
            populateFormForEdit(id);
        }

        if (target.classList.contains('btn-delete')) {
            if (confirm(`Anda yakin ingin menghapus produk dengan ID ${id}?`)) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE', headers });
                    if (!response.ok) throw new Error('Gagal menghapus produk.');
                    loadProducts();
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            }
        }
    });

    cancelEditButton.addEventListener('click', resetForm);

    loadProducts();
});