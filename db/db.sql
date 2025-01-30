CREATE TABLE products (
    ID SERIAL PRIMARY KEY,
    quantity_available INT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    product_name VARCHAR(255) NOT NULL
);