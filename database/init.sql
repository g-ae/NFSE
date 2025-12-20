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
  "npa" varchar(10) NOT NULL,
  "street" varchar(50) NOT NULL,
  "street_no" varchar(10) NOT NULL,
  "telephone" varchar(20) NOT NULL
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
  "confirmed" boolean default false,
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

INSERT INTO "seller"("name", "email", "password", "country", "state", "npa", "street", "street_no", "telephone")
  VALUES('Coop City', 'city@coop.ch', '$2b$10$UAz4xfmMBHCmATgxBbVccOPyDqp8LSWHzRUY3jG0f8m2bkbsyCZti', 'CH', 'VS', '1950', 'Avenue de la Planta', '50', '+41272928496');

INSERT INTO "bundle"("sellerId", "content", "pickupStartTime", "pickupEndTime", "price", "image_url")
  VALUES(1, '3 pains au chocolat', '2025-12-17 20:00:00', '2025-12-17 23:00:00', 6.70, 'https://api.swissmilk.ch/wp-content/uploads/2019/06/schinkengipfeli-2560x1706.jpg');

INSERT INTO "bundle"("sellerId", "content", "pickupStartTime", "pickupEndTime", "price")
  VALUES(1, 'Panier Surprise', '2025-12-17 20:00:00', '2025-12-17 23:00:00', 14.50);