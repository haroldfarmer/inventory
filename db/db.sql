CREATE TABLE products (
    ID SERIAL PRIMARY KEY,
    quantity_available INT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    product_name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    hashed_password TEXT NOT NULL
);