-- Total que chaque vendeur a gagné sur le site
--  name                  | total_revenue
--  Boulangerie Zenhäusern| 5.00
--  Manor Sion            | 5.00
SELECT s.name, SUM(b.price) as total_revenue
FROM seller s
JOIN bundle b ON s."sellerId" = b."sellerId"
WHERE b."pickupRealTime" IS NOT NULL
GROUP BY s.name
ORDER BY total_revenue DESC;

-- Moyenne de rating par seller
--  name                  | average_rating
--  Boulangerie Zenhäusern| 5.00
--  Coop City             | 4.00
SELECT s.name, ROUND(AVG(bf.stars), 2) as average_rating
FROM seller s
JOIN buyer_feedback bf ON s."sellerId" = bf."sellerId"
GROUP BY s.name
ORDER BY average_rating DESC;

-- Nombre de bundles complétés (récupérés) par buyer
--  name       | bundles_completed
--  devs       | 1
--  Alice Smith| 1
SELECT bu.name, COUNT(b."bundleId") as bundles_completed
FROM buyer bu
JOIN bundle b ON bu."buyerId" = b."buyerId"
WHERE b."pickupRealTime" IS NOT NULL
GROUP BY bu.name
ORDER BY bundles_completed DESC;

-- Nombre de bundles actuellement en vente par seller
--  name                  | available_bundles
--  Coop City             | 2
--  migrolino Sion        | 1
--  Boulangerie Zenhäusern| 1
SELECT s.name, COUNT(b."bundleId") as available_bundles
FROM seller s
JOIN bundle b ON s."sellerId" = b."sellerId"
WHERE b."reservedTime" IS NULL
GROUP BY s.name
ORDER BY available_bundles DESC;

-- Total de revenu par ville
--  city | total_sales
--  Sion | 10.00
SELECT s.city, SUM(b.price) as total_sales
FROM seller s
JOIN bundle b ON s."sellerId" = b."sellerId"
WHERE b."pickupRealTime" IS NOT NULL
GROUP BY s.city;

-- Bundles confirmés par jour
--  date       | bundles_confirmed
--  2026-01-11 | 2
--  2026-01-12 | 1
SELECT DATE("confirmedTime") as date, COUNT(*) as bundles_confirmed
FROM bundle
WHERE "confirmedTime" IS NOT NULL
GROUP BY DATE("confirmedTime")
ORDER BY date DESC;

-- Nombre de ratings laissés par chaque
--  source               | total_reviews
--  Feedback from buyer  | 2
--  Feedback from seller | 2
SELECT 'Feedback from buyer' as source, COUNT(*) as total_reviews FROM buyer_feedback
UNION ALL
SELECT 'Feedback from seller' as source, COUNT(*) as total_reviews FROM seller_feedback;
