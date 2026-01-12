# Documentation de l'API Backend

Ce document décrit les endpoints disponibles dans l'API du backend NFSE.

## Base URL
Par défaut en local : `http://localhost:4000`

## Authentification
Certaines routes nécessitent un header `Authorization`.
Le format attendu est : `Authorization: Bearer <token>`

Le token est renvoyé lors du login et a le format suivant :
- Pour un acheteur : `b/<buyerId>`
- Pour un vendeur : `s/<sellerId>`

---

## Table des matières
1. [Compte (Account)](#1-compte-account)
2. [Paniers (Bundles)](#2-paniers-bundles)
3. [Acheteurs (Buyers)](#3-acheteurs-buyers)
4. [Vendeurs (Sellers)](#4-vendeurs-sellers)
5. [Notes (Ratings)](#5-notes-ratings)

---

## 1. Compte (Account)

### Login Acheteur
Authentifie un acheteur et retourne un token.

- **URL** : `/account/buyer/`
- **Méthode** : `POST`
- **Body** (JSON) :
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Réponses** :
  - `200 OK` : `{ "token": "b/123" }`
  - `401 Unauthorized` : Identifiants incorrects.
  - `400 Bad Request` : Données manquantes.

### Inscription Acheteur
Crée un nouveau compte acheteur.

- **URL** : `/account/buyer/register`
- **Méthode** : `POST`
- **Body** (JSON) :
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Jean Dupont",
    "telephone": "0791234567"
  }
  ```
- **Réponses** :
  - `200 OK` : Compte créé avec succès.
  - `400 Bad Request` : Email déjà utilisé ou données manquantes.

### Login Vendeur
Authentifie un vendeur et retourne un token.

- **URL** : `/account/seller/`
- **Méthode** : `POST`
- **Body** (JSON) :
  ```json
  {
    "email": "shop@example.com",
    "password": "password123"
  }
  ```
- **Réponses** :
  - `200 OK` : `{ "token": "s/456" }`
  - `401 Unauthorized` : Identifiants incorrects.

### Inscription Vendeur
Crée un nouveau compte vendeur.

- **URL** : `/account/seller/register`
- **Méthode** : `POST`
- **Body** (JSON) :
  ```json
  {
    "email": "shop@example.com",
    "password": "password123",
    "name": "Ma Boulangerie",
    "telephone": "0211234567",
    "country": "Switzerland",
    "state": "Vaud",
    "city": "Lausanne",
    "npa": "1000",
    "street": "Rue de Bourg",
    "street_no": "10",
    "latitude": 46.519, 
    "longitude": 6.632
  }
  ```
- **Réponses** :
  - `200 OK` : Compte créé.
  - `400 Bad Request` : Email déjà utilisé ou données manquantes.

---

## 2. Paniers (Bundles)

### Liste des paniers disponibles
Récupère tous les paniers non réservés.

- **URL** : `/bundles/`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : Liste des paniers (JSON array).
    ```json
    [
      {
        "bundleId": 1,
        "sellerId": 456,
        "content": "Pain surprise",
        "pickupStartTime": "2023-10-27T10:00:00.000Z",
        "pickupEndTime": "2023-10-27T18:00:00.000Z",
        "price": 5.50,
        "image_url": "http://...",
        "latitude": 46.5,
        "longitude": 6.6
      }
    ]
    ```

### Détail d'un panier
Récupère les infos d'un panier spécifique.

- **URL** : `/bundles/:id`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : Objet panier.
  - `204 No Content` : Aucun panier trouvé.
  - `404 Not Found` : ID invalide.

### Créer un panier (Nouveau)
Ajoute un panier à la vente.
*🔒 Auth requise (Vendeur)*

- **URL** : `/bundles/new`
- **Méthode** : `POST`
- **Header** : `Authorization: Bearer s/<id>`
- **Body** (JSON) :
  ```json
  {
    "content": "Assortiment de viennoiseries",
    "pickupStartTime": "2023-10-28T08:00:00.000Z",
    "pickupEndTime": "2023-10-28T12:00:00.000Z",
    "price": "12.00",
    "image_url": "http://..."
  }
  ```
- **Réponses** :
  - `200 OK` : Panier créé.
  - `400 Bad Request` : Plage horaire trop courte (< 30 min) ou données manquantes.
  - `401 Unauthorized` : Token invalide ou type de compte incorrect.

### Paniers Réservés
Récupère les paniers réservés mais non confirmés pour l'utilisateur courant.
*🔒 Auth requise*

- **URL** : `/bundles/reserved`
- **Méthode** : `GET`
- **Header** : `Authorization: Bearer <token>`
- **Réponses** :
  - `200 OK` : Liste des paniers.

### Paniers Confirmés
Récupère les paniers payés/confirmés en attente de retrait.
*🔒 Auth requise*

- **URL** : `/bundles/confirmed`
- **Méthode** : `GET`
- **Header** : `Authorization: Bearer <token>`
- **Réponses** :
  - `200 OK` : Liste des paniers.

### Historique des paniers
Récupère les paniers passés (retirés).
*🔒 Auth requise*

- **URL** : `/bundles/history`
- **Méthode** : `GET`
- **Header** : `Authorization: Bearer <token>`
- **Réponses** :
  - `200 OK` : Liste des paniers.

### Réserver un panier
Réserve un panier temporairement (15 min).
*🔒 Auth requise (Acheteur)*

- **URL** : `/bundles/reserve`
- **Méthode** : `PATCH`
- **Header** : `Authorization: Bearer b/<id>`
- **Body** (JSON) : `{ "bundleId": 1 }`
- **Réponses** :
  - `200 OK` : Réservation effectuée.

### Annuler une réservation
Libère un panier réservé.
*🔒 Auth requise (Acheteur)*

- **URL** : `/bundles/unreserve`
- **Méthode** : `PATCH`
- **Header** : `Authorization: Bearer b/<id>`
- **Body** (JSON) : `{ "bundleId": 1 }`
- **Réponses** :
  - `200 OK` : Réservation annulée.

### Confirmer (Payer) un panier
Valide l'achat d'un panier réservé.
*🔒 Auth requise (Acheteur)*

- **URL** : `/bundles/confirm`
- **Méthode** : `PATCH`
- **Header** : `Authorization: Bearer b/<id>`
- **Body** (JSON) : `{ "bundleId": 1 }`
- **Réponses** :
  - `200 OK` : Achat confirmé.

### Valider le retrait
Le vendeur confirme que le panier a été remis.
*🔒 Auth requise (Vendeur)*

- **URL** : `/bundles/confirmPickup`
- **Méthode** : `PATCH`
- **Header** : `Authorization: Bearer s/<id>`
- **Body** (JSON) : `{ "bundleId": 1 }`
- **Réponses** :
  - `200 OK` : Retrait validé.

---

## 3. Acheteurs (Buyers)

### Info acheteur public
- **URL** : `/buyers/:id`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : `{ "buyerId", "name", "email", "telephone" }`
  - `204 No Content` : Pas trouvé.

---

## 4. Vendeurs (Sellers)

### Liste des vendeurs
- **URL** : `/sellers/`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : Liste des vendeurs (nom, adresse, ville...).

### Info vendeur public
- **URL** : `/sellers/:id`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : Info détaillée du vendeur.
  - `204 No Content` : Pas trouvé.

---

## 5. Notes (Ratings)

### Vérifier si déjà noté
Vérifie si l'utilisateur courant a déjà noté une transaction avec l'autre partie.
*🔒 Auth requise*

- **URL** : `/ratings/hasRated`
- **Méthode** : `GET`
- **Header** : `Authorization: Bearer <token>`
- **Query Param** : `?id=<otherUserId>`
- **Réponses** :
  - `200 OK` : Liste des feedbacks existants (si vide, pas encore noté).

### Soumettre une note
Envoie une note (étoiles) pour un utilisateur.
*🔒 Auth requise*

- **URL** : `/ratings/rate`
- **Méthode** : `POST`
- **Header** : `Authorization: Bearer <token>`
- **Body** (JSON) :
  ```json
  {
    "userId": 123,  // ID de la personne qu'on note
    "stars": 5
  }
  ```
- **Réponses** :
  - `200 OK` : Note enregistrée.

### Moyenne des notes (Acheteur)
- **URL** : `/ratings/buyer/:id`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : `{ "rating": 4.5 }`

### Moyenne des notes (Vendeur)
- **URL** : `/ratings/seller/:id`
- **Méthode** : `GET`
- **Réponses** :
  - `200 OK` : `{ "rating": 4.8 }`
