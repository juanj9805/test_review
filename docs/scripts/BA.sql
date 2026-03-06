-- Supplier analysis

SELECT DISTINCT s.name 
FROM suppliers s
INNER JOIN TRANSACTION t 
ON t.supplier_id = s.id
GROUP BY s.name
ORDER BY TOTAL_SOLD DESC;

-- Customer behavior
SELECT 
    t.transaction_id,
    t.date,
    c.name 
    p.name 
    t.quantity,
FROM transaction t
INNER JOIN customer c 
ON c.id = t.customer_id
INNER JOIN product p 
ON p.id = t.product_id 
WHERE t.customer_id = $1
ORDER BY date ASC;

-- Top products
SELECT 
    p.name 
    c.name 
    SUM(t.quantity),
    (SUM(t.quantity) * p.unit_price) 
FROM transaction t
JOIN product p 
ON p.id = t.product_id
INNER JOIN category c 
ON c.id = p.category_id 
GROUP BY p.name , c.name, p.unit_price 
ORDER BY total_sold DESC;