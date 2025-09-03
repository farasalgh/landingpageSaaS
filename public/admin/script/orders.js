// public/admin/orders.js
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://localhost:3000";
  const ordersList = document.getElementById("orders-list");
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    window.location.href = "../login.html";
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  async function loadOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/admin`, {
        headers,
      });
      if (!response.ok) throw new Error("Gagal memuat data pesanan.");

      const orders = await response.json();
      ordersList.innerHTML = "";

      if (orders.length === 0) {
        ordersList.innerHTML =
          '<tr><td colspan="6" class="p-4 text-center">Tidak ada pesanan.</td></tr>';
        return;
      }

      orders.forEach((order) => {
        const row = document.createElement("tr");
        row.className = "border-b border-gray-800";
        const itemsHtml = `
            <ul class="list-disc list-inside text-sm text-white">
                ${order.items
                .map((item) => `<li>${item.quantity}x ${item.product_name}</li>`)
                .join("")}
            </ul>
        `;
        row.innerHTML = `
                    <td class="p-4">${order.id}</td>
                    <td class="p-4">${order.customer_name}</td>
                    <td class="p-4">${itemsHtml}</td>
                    <td class="p-4">$${order.total_price}</td>
                    <td class="p-4">
                        <select class="status-dropdown bg-gray-700 rounded p-1" data-id="${
                          order.id
                        }">
                            <option value="Pending" ${
                              order.status === "Pending" ? "selected" : ""
                            }>Pending</option>
                            <option value="Shipped" ${
                              order.status === "Shipped" ? "selected" : ""
                            }>Shipped</option>
                            <option value="Completed" ${
                              order.status === "Completed" ? "selected" : ""
                            }>Completed</option>
                            <option value="Cancelled" ${
                              order.status === "Cancelled" ? "selected" : ""
                            }>Cancelled</option>
                        </select>
                    </td>
                    <td class="p-4">${new Date(
                      order.order_date
                    ).toLocaleDateString()}</td>
                    <td class="p-4">
                        <button class="text-red-500 hover:underline delete-btn" data-id="${
                          order.id
                        }">Hapus</button>
                    </td>
                `;
        ordersList.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      ordersList.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">${error.message}</td></tr>`;
    }
  }

  ordersList.addEventListener("click", async (e) => {
    const orderId = e.target.dataset.id;
    if (e.target.classList.contains("delete-btn")) {
      if (confirm(`Anda yakin ingin menghapus pesanan #${orderId}?`)) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/orders/${orderId}`,
            { method: "DELETE", headers }
          );
          const result = await response.json();
          alert(result.message);
          if (response.ok) loadOrders();
        } catch (error) {
          alert("Gagal menghapus pesanan.");
        }
      }
    }
  });

  ordersList.addEventListener("change", async (e) => {
    const orderId = e.target.dataset.id;
    if (e.target.classList.contains("status-dropdown")) {
      const newStatus = e.target.value;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders/${orderId}/status`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ status: newStatus }),
          }
        );
        const result = await response.json();
        alert(result.message);
        if (response.ok) loadOrders();
      } catch (error) {
        alert("Gagal mengubah status pesanan.");
      }
    }
  });
  loadOrders();
});
