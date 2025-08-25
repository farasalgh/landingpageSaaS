# Apparels 16 - Minimalist Fashion E-commerce

A full-stack e-commerce web application designed for the bold generation. Apparels 16 provides a seamless shopping experience with a focus on minimalist and trendy fashion, featuring a complete user authentication system, an admin panel for product management, and a streamlined checkout process.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

### General Features
- **Responsive Design:** Fully functional on both desktop and mobile devices.
- **Modern UI/UX:** Clean, minimalist interface with smooth animations (AOS).
- **Contact Form:** Allows users to send inquiries.
- **Subscription:** Feature for users to subscribe to newsletters.

### User Features
- **Secure User Authentication:** JWT-based login and registration system.
- **Password Encryption:** User passwords are securely hashed using bcrypt.
- **Shopping Cart:** Users can add and manage products in their cart.
- **Streamlined Checkout:** A simple, multi-step process to place an order.
- **User Panel (WIP):** A dedicated page for users to view their order history and check order status.

### Admin Features
- **Role-Based Authorization:** Separate access control for regular users and administrators.
- **Admin Dashboard:** A protected panel for managing the application's content.
- **Product Management (CRUD):** Admins can create, read, update, and delete products.
- **Order Management (WIP):** Admins can view and update the status of user orders.

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt.js
- **Database Driver:** mysql2
- **Environment Variables:** dotenv

### Frontend
- **Core:** HTML5, CSS3, Vanilla JavaScript
- **Styling:** Tailwind CSS
- **Animations:** Animate On Scroll (AOS)
- **API Communication:** Fetch API

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- npm
- MySQL Server

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/farasalgh/landingpageSaaS.git ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install NPM packages
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Open the `.env` file and fill in your database credentials:
    ```env
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=apparels16_db
    JWT_SECRET=your_super_long_and_secret_jwt_key
    PORT=3000
    ```

3.  **Database Setup:**
    - Create a new database in MySQL named `apparels16_db`.
    - Run the SQL queries from the [Database Schema](#database-schema) section below to create all necessary tables.

4.  **Run the Servers:**
    ```bash
    # Run the backend server (from /backend directory)
    node server.js
    ```
    - For the frontend, open the `/public` directory and run `index.html` using the **Live Server** extension in VS Code.

## Database Schema

Save the following code as `schema.sql` or run it directly in your MySQL client to set up the tables.

```sql
-- Create a new database (optional)
CREATE DATABASE IF NOT EXISTS apparels16_db;
USE apparels16_db;

-- Table for storing user data and roles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing product information
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing the main order information
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table for storing individual items within each order
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price_per_item DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

## API Endpoints
- Method	Endpoint	Description	Access
- POST	/api/users/register	Register a new user.	Public
- POST	/api/users/login	Authenticate a user and get a JWT.	Public
- GET	/api/products	Get a list of all products.	Public
- POST	/api/products	Create a new product.	Admin Only
- PUT	/api/products/:id	Update an existing product.	Admin Only
- DELETE	/api/products/:id	Delete a product.	Admin Only
- POST	/api/orders	Place a new order.	User Only
- GET	/api/orders/myorders	Get the logged-in user's order history.	User Only

## Project Structure
```
/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── *.html
│
├── src/
│   ├── input.css
│   └── output.css
│
├── .gitignore
└── README.md
``` 

## Contributing
Contributions are welcome! Please feel free to fork the repository and open a pull request.
- Fork the Project
- Create your Feature Branch (git checkout -b feature/NewFeature)
- Commit your Changes (git commit -m 'Add some NewFeature')
- Push to the Branch (git push origin feature/NewFeature)
- Open a Pull Request
