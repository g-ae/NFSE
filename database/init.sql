CREATE TABLE "buyer" (
  "buyerId" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "email" varchar(50) NOT NULL,
  "password" varchar(255) NOT NULL,
  "charity" boolean default false,
  "telephone" varchar(20) NOT NULL,
  "strikeCount" integer default 0,
  "lastStrikeDate" timestamp
);

CREATE TABLE "seller" (
  "sellerId" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "email" varchar(50) NOT NULL,
  "password" varchar(255) NOT NULL,
  "country" varchar(30) NOT NULL,
  "state" varchar(30) NOT NULL,
  "city" varchar(50) NOT NULL,
  "npa" varchar(10) NOT NULL,
  "street" varchar(50) NOT NULL,
  "street_no" varchar(10) NOT NULL,
  "telephone" varchar(20) NOT NULL,
  "latitude" decimal(9,6),
  "longitude" decimal(9,6)
);

CREATE TABLE "openinghours" (
  "sellerId" integer,
  "day" text,
  "openTime" time NOT NULL,
  "closingTime" time NOT NULL,
  PRIMARY KEY ("sellerId", "day")
);

CREATE TABLE "buyer_feedback" (
  "bfId" SERIAL PRIMARY KEY,
  "sellerId" integer NOT NULL,
  "buyerId" integer NOT NULL,
  "stars" integer NOT NULL
);

CREATE TABLE "seller_feedback" (
  "sfId" SERIAL PRIMARY KEY,
  "sellerId" integer NOT NULL,
  "buyerId" integer NOT NULL,
  "stars" integer NOT NULL
);

CREATE TABLE "bundle" (
  "bundleId" SERIAL PRIMARY KEY,
  "sellerId" integer NOT NULL,
  "buyerId" integer,
  "paymentMethodId" integer,
  "content" text NOT NULL,
  "pickupStartTime" timestamp NOT NULL,
  "pickupEndTime" timestamp NOT NULL,
  "reservedTime" timestamp,
  "confirmedTime" timestamp,
  "price" decimal(10,2) NOT NULL,
  "pickupRealTime" timestamp,
  "image_url" text
);

CREATE TABLE "payment_method" (
  "paymentMethodId" SERIAL PRIMARY KEY,
  "name" varchar(30) NOT NULL
);

ALTER TABLE "openinghours" ADD CONSTRAINT "seller_horaire" FOREIGN KEY ("sellerId") REFERENCES "seller" ("sellerId");

ALTER TABLE "buyer_feedback" ADD CONSTRAINT "buyer_buyer_feedback" FOREIGN KEY ("buyerId") REFERENCES "buyer" ("buyerId");

ALTER TABLE "buyer_feedback" ADD CONSTRAINT "seller_buyer_feedback" FOREIGN KEY ("sellerId") REFERENCES "seller" ("sellerId");

ALTER TABLE "seller_feedback" ADD CONSTRAINT "seller_seller_feedback" FOREIGN KEY ("sellerId") REFERENCES "seller" ("sellerId");

ALTER TABLE "seller_feedback" ADD CONSTRAINT "buyer_seller_feedback" FOREIGN KEY ("buyerId") REFERENCES "buyer" ("buyerId");

ALTER TABLE "bundle" ADD CONSTRAINT "seller_bundle" FOREIGN KEY ("sellerId") REFERENCES "seller" ("sellerId");

ALTER TABLE "bundle" ADD CONSTRAINT "buyer_bundle" FOREIGN KEY ("buyerId") REFERENCES "buyer" ("buyerId");

ALTER TABLE "bundle" ADD CONSTRAINT "bundle_payment_method" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method" ("paymentMethodId");

-- Mock Data

-- Sellers
INSERT INTO "seller"("name", "email", "password", "country", "state", "city", "npa", "street", "street_no", "telephone", "latitude", "longitude")
  VALUES('Coop City', 'city@coop.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', 'CH', 'Valais', 'Sion', '1950', 'Avenue de la Planta', '50', '+41272928496', 46.2262, 7.3607);
  
INSERT INTO "seller"("name", "email", "password", "country", "state", "city", "npa", "street", "street_no", "telephone", "latitude", "longitude")
  VALUES('migrolino Sion', 'migrolino@migros.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', 'CH', 'Valais', 'Sion', '1950', 'Avenue de la Planta', '22', '+41272928496', 46.224399, 7.301451);

INSERT INTO "seller"("name", "email", "password", "country", "state", "city", "npa", "street", "street_no", "telephone", "latitude", "longitude")
  VALUES('Manor Sion', 'info@manor.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', 'CH', 'Valais', 'Sion', '1950', 'Place du Midi', '10', '+41273272611', 46.2309, 7.3588);

INSERT INTO "seller"("name", "email", "password", "country", "state", "city", "npa", "street", "street_no", "telephone", "latitude", "longitude")
  VALUES('Boulangerie Zenhäusern', 'contact@zenhausern.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', 'CH', 'Valais', 'Sion', '1950', 'Place de la Gare', '2', '+41273223123', 46.23192, 7.361842);

-- Buyers
INSERT INTO "buyer"("name", "email", "password", "telephone")
  VALUES('devs', 'dev@genlog.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', '0790797979');
INSERT INTO "buyer"("name", "email", "password", "telephone")
  VALUES('Alice Smith', 'alice@example.com', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', '0781234567');
INSERT INTO "buyer"("name", "email", "password", "telephone", "charity")
  VALUES('Caritas Sion', 'sion@caritas.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', '0273233535', true);

-- Bundles
-- Unreserved
INSERT INTO "bundle"("sellerId", "content", "pickupStartTime", "pickupEndTime", "price", "image_url")
  VALUES(1, '3 croissants au jambon', '2026-01-12 18:00:00', '2026-01-12 20:00:00', 6.70, 'https://api.swissmilk.ch/wp-content/uploads/2019/06/schinkengipfeli-2560x1706.jpg');

INSERT INTO "bundle"("sellerId", "content", "pickupStartTime", "pickupEndTime", "price", "image_url")
  VALUES(1, 'Panier Surprise Fruits & Légumes', '2026-01-12 18:00:00', '2026-01-12 20:00:00', 12.00, 'https://www.fleuriste.ca/media/catalog/product/i/m/img_1561.jpg?width=265&height=265&store=francais&image-type=image');

INSERT INTO "bundle"("sellerId", "content", "pickupStartTime", "pickupEndTime", "price", "image_url")
  VALUES(2, 'Sandwiches variés x4', '2026-01-12 20:00:00', '2026-01-12 22:00:00', 15.00, 'https://pretatable.ca/cdn/shop/products/SocieteTraiteur_-461.jpg?v=1681948073');

INSERT INTO "bundle"("sellerId", "content", "pickupStartTime", "pickupEndTime", "price", "image_url")
  VALUES(4, 'Lot de pâtisseries du jour', '2026-01-12 17:30:00', '2026-01-12 18:30:00', 8.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIS5huzWI-O54vZ-u4BONjESeTvCFbWjgA0Q&s');


-- Confirmed/Completed
INSERT INTO "bundle"("sellerId", "buyerId", "content", "pickupStartTime", "pickupEndTime", "reservedTime", "confirmedTime", "pickupRealTime", "price", "image_url")
  VALUES(4, 2, '2 pains de seigle', '2026-01-11 17:00:00', '2026-01-11 18:30:00', '2026-01-11 09:15:00', '2026-01-11 17:45:00', '2026-01-11 17:45:00', 5.00, 'https://s3-eu-west-1.amazonaws.com/images-ca-1-0-1-eu/recipe_photos/original/687/pain-de-seigle-recette-AdobeStock_279462084.jpg');

INSERT INTO "bundle"("sellerId", "buyerId", "content", "pickupStartTime", "pickupEndTime", "reservedTime", "confirmedTime", "pickupRealTime", "price", "image_url")
  VALUES(3, 1, 'Grand Panier Légumes', '2026-01-11 17:00:00', '2026-01-11 18:30:00', '2026-01-11 09:15:00', '2026-01-11 17:45:00', '2026-01-11 17:45:00', 5.00, 'https://www.mimelis.ch/_next/image?url=https%3A%2F%2Fapi.mimelis.ch%2Fassets%2F52ecedca-d859-4d42-86be-ed14821591f8&w=3840&q=85');

INSERT INTO "bundle"("sellerId", "buyerId", "content", "pickupStartTime", "pickupEndTime", "reservedTime", "confirmedTime", "price", "image_url")
  VALUES(3, 1, 'Panier Gourmet Manor', '2026-01-12 18:30:00', '2026-01-12 19:30:00', '2026-01-12 10:00:00', '2026-01-12 19:02:23', 56.00, 'https://cestcela.fr/cdn/shop/collections/nos-paniers-gourmands-186228.jpg?v=1754581382');

-- Feedback
INSERT INTO "buyer_feedback"("sellerId", "buyerId", "stars") VALUES (4, 2, 5);
INSERT INTO "buyer_feedback"("sellerId", "buyerId", "stars") VALUES (1, 1, 4);

INSERT INTO "seller_feedback"("sellerId", "buyerId", "stars") VALUES (4, 2, 5);
INSERT INTO "seller_feedback"("sellerId", "buyerId", "stars") VALUES (3, 1, 3);
