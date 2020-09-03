-- CREATE TABLE products (
--   id INT,
--   name VARCHAR(50),
--   price INT,
--   on_sale boolean
-- );
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  price_range INT NOT NULL check(
    price_range >= 1
    and price_range <= 5
  )
);
INSERT INTO restaurants (name, location, price_range)
VALUES ('wendys', 'denver', 3);
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  name VARCHAR(50) NOT NULL,
  review TEXT NOT NULL,
  rating INT NOT NULL check(
    rating >= 1
    and rating <= 5
  )
);