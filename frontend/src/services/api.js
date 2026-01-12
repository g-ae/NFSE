import { getToken } from "./cookies";
import { sha256 } from "./utils";

const BASE_URL = "/api";
const jsonHeaders = new Headers();
jsonHeaders.append('Content-Type', 'application/json');

/**
 * Fetches all popular bundles.
 * @returns {Promise<Array>} An array of popular bundles.
 */
export const getPopularBundles = async () => {
  const response = await fetch(`${BASE_URL}/bundles`);
  const data = await response.json();
  return data;
};

/**
 * Search bundles based on a query  .
 * @param {string} query - The search query (city name).
 * @returns {Promise<Array>} An array of bundles matching the query.
 */
export const searchBundles = async (query) => {
  const q = (query ?? "").trim().toLowerCase();

  // Fetch both bundles and sellers in parallel.
  const [bundlesRes, sellersRes] = await Promise.all([
    fetch(`${BASE_URL}/bundles`),
    fetch(`${BASE_URL}/sellers`)
  ]);
  
  // Parse JSON responses.
  const [bundles, sellers] = await Promise.all([
    bundlesRes.json(),
    sellersRes.json()
  ]);

  // Filter sellers whose city starts with the query.
  const filteredSellers = sellers.filter(seller => {
    const city = (seller.city ?? "").trim().toLowerCase();
    return city.startsWith(q);
  });
  
  // Create a set of seller IDs from the filtered sellers.
  const sellersIds = new Set(filteredSellers.map(seller => seller.sellerId));

  // Filter bundles sold by the filtered sellers.
  return bundles.filter(bundle => {
    return sellersIds.has(bundle.sellerId);
  });
};

/**
 * Logs in a user (buyer or seller) based on account type.
 * @param {string} accountType - The type of account to log in (buyer or seller).
 * @param {*} query - The login credentials (email and password).
 * @returns {Promise<Object>} The user object if login is successful, otherwise null.
 */
async function login(accountType, query) {

  // If email or password missing, return null.
  if (!query.email || !query.password) return null

  // Hash the password before sending.
  const passwordSHA = await sha256(query.password)

  // Make the login request.
  const res = await fetch(`${BASE_URL}/account/${accountType}`, {
    mode: 'cors',
    headers: jsonHeaders,
    body: JSON.stringify({"email": query.email, "password": passwordSHA}),
    method: 'POST'
  })

  // If login fails, return null.
  if (parseInt(res.status / 100) != 2) return null
  else return await res.json()
}

/**
 * Logs in a buyer.
 * @param {Object} query - The login credentials (email and password).
 * @returns {Promise<Object>} The buyer object if login is successful, otherwise null.
 */
export const loginBuyer = async (query) => {
  return await login("buyer", query)
}

/**
 * Logs in a seller.
 * @param {Object} query - The login credentials (email and password).
 * @returns {Promise<Object>} The seller object if login is successful, otherwise null.
 */
export const loginSeller = async (query) => {
  return await login("seller", query)
}

/**
 * Registers a buyer.
 * @param {Object} query - The registration details (email, password, etc.).
 * @returns bool true if registration is successful, else false.
 */
export const registerBuyer = async (query) => {

  // Hash the password before sending.
  const passwordSHA = await sha256(query.password)

  // Make the registration request.
  const body = { ...query, password: passwordSHA }
  const res = await fetch(`${BASE_URL}/account/buyer/register`, {
    method: "POST",
    mode: 'cors',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  })

  // If registration fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  else return true
}

/**
 * Registers a seller.
 * @param {object} query - The registration details (email, password, etc.).
 * @returns bool true if registration is successful, else false.
 */
export const registerSeller = async (query) => {

  // Hash the password before sending.
  const passwordSHA = await sha256(query.password)

  // Make the registration request.
  const body = { ...query, password: passwordSHA }
  const res = await fetch(`${BASE_URL}/account/seller/register`, {
    method: "POST",
    mode: 'cors',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  })

  // If registration fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  else return true
}

/**
 * Gets user information with the specified type and ID.
 * @param {string} type - The type of user ("buyers" or "sellers").
 * @param {number} id - The user ID.
 * @returns {Promise<Object>} The user object if successful, otherwise null.
 */
export const getUser = async (type, id) => {
  const res = await fetch(`${BASE_URL}/${type}/${id}`)
  if (parseInt(res.status / 100) != 2) return null
  else return await res.json()
}

/**
 * Gets buyer information with the specified ID.
 * @param {number} id - The buyer ID.
 * @returns {Promise<Object>} The buyer object if successful, otherwise null.
 */
export const getBuyer = async (id) => {
  return await getUser("buyers", id)
}

/**
 * Gets all buyers.
 * @returns {Promise<Object>} All buyers, otherwise null.
 */
export const getAllBuyers = async () => {
  const res = await fetch(`${BASE_URL}/buyers`)
  if (parseInt(res.status / 100) != 2) return null
  else return await res.json()
}

/**
 * Gets seller information with the specified ID.
 * @param {number} id - The seller ID.
 * @returns {Promise<Object>} The seller object if successful, otherwise null.
 */
export const getSeller = async (id) => {
  return await getUser("sellers", id)
}

/** Extracts account type from the token.
 * @param {string} token - The authentication token.
 * @returns {string} The account type ("Buyer", "Seller", or "unknown").
 */
export const getAccountEmail = async () => {
  const token = getToken()
  
  // If no token, return null.
  if (!token) return null

  // Compare first character to determine account type and fetch email.
  const id = token.split('/')[1]
  switch (token[0]) {
    case "b":
      return (await getBuyer(id)).email
    case "s":
      return (await getSeller(id)).email
    default:
      "unknown"
  }
}

/** Get reserved bundles of the current user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The reserved bundles.
 */
export const getReservedBundles = async () => {
  const token = getToken()
  
  // If no token, return empty array.
  if (!token) return []
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  
  // Fetch reserved bundles.
  const res = await fetch(`${BASE_URL}/bundles/reserved`, {
    headers: headers
  })
  console.log(res)

  // If request fails, return empty array.
  if (parseInt(res.status / 100) != 2) return []
  
  return await res.json()
}

/**
 * Get confirmed bundles of the current user.
 * @returns {Promise<Object>} - The confirmed bundles.
 */
export const getConfirmedBundles = async () => {
  const token = getToken()
  
  // If no token, return empty array.
  if (!token) return []
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  
  // Fetch confirmed bundles.
  const res = await fetch(`${BASE_URL}/bundles/confirmed`, {
    headers: headers
  })
  
  // If request fails, return empty array.
  if (parseInt(res.status / 100) != 2) return []
  
  return await res.json()
}

/** Reserve a bundle with the specified ID.
 * @param {number} bundleId - The ID of the bundle to reserve.
 * @returns {Promise<boolean>} True if successful, otherwise false.
 */
export const reserveBundle = async (bundleId) => {
  const token = getToken()
  
  // If no token, return false.
  if (!token) return false
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the reserve request.
  const res = await fetch(`${BASE_URL}/bundles/reserve`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({
      bundleId: bundleId
    })
  })
  
  // If request fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  return true
}

/**
 * Unreserve a bundle with the specified ID.
 * @param {number} bundleId - The ID of the bundle to unreserve.
 * @returns {Promise<boolean>} True if successful, otherwise false.
 */
export const unreserveBundle = async (bundleId) => {
  const token = getToken()
  
  // If no token, return false.
  if (!token) return false
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the unreserve request.
  const res = await fetch(`${BASE_URL}/bundles/unreserve`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({
      bundleId: bundleId
    })
  })
  
  // If request fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  return true
}

/**
 * Create a new bundle.
 * @param {Object} bundleData - The data for the new bundle.
 * @returns {Promise<boolean>} True if successful, otherwise false.
 */
export const createBundle = async (bundleData) => {
  const token = getToken()
  
  // If no token, return false.
  if (!token) return false
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the create bundle request.
  const res = await fetch(`${BASE_URL}/bundles/new`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(bundleData)
  })
  
  // If request fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  return true
}

/**
 * Confirm a bundle with the specified ID.
 * @param {number} bundleId - The ID of the bundle to confirm.
 * @returns {Promise<boolean>} True if successful, otherwise false.
 */
export const confirmBundle = async(bundleId) => {
  const token = getToken()
  
  // If no token, return false.
  if (!token) return false
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the confirm request.
  const res = await fetch(`${BASE_URL}/bundles/confirm`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({bundleId: bundleId})
  })

  // If request fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  return true
}

/**
 * Get a list of old bundles.
 * @returns {Promise<Array>} A list of old bundles.
 */
export const getOldBundles = async () => {
  const token = getToken()
  
  // If no token, return empty array.
  if (!token) return []
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  
  // Fetch old bundles.
  const res = await fetch(`${BASE_URL}/bundles/history`, {
    headers: headers
  })
  
  // If request fails, return empty array.
  if (parseInt(res.status / 100) != 2) return []
  
  return await res.json()
}

/**
 * Confirm a pickup for a bundle with the specified ID.
 * @param {number} bundleId - The ID of the bundle to confirm pickup for.
 * @returns {Promise<boolean>} True if successful, otherwise false.
 */
export const confirmPickup = async(bundleId) => {
  const token = getToken()

  // If no token, return false.
  if(!token) return false 

  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the confirm pickup request.
  const res = await fetch(`${BASE_URL}/bundles/confirmPickup`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({bundleId: bundleId})
  })

  // If request fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  return true
}

/**
 * Get whether the user has rated another user.
 * @param {number} userId - The ID of the user to check.
 * @returns {Promise<boolean>} True if the user has rated another user, otherwise false.
 */
export const getIsRatedFrom = async(userId) => {
  const token = getToken()
  
  // If no token or userId, return false.
  if (!token || !userId) return false
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the get is rated request.
  const res = await fetch(`${BASE_URL}/ratings/hasRated?id=${userId}`, {
    method: 'GET',
    headers: headers
  })
  
  // If request fails, return null.
  if (parseInt(res.status / 100) != 2) return null
  return (await res.json()).length != 0
}

/**
 * Post a rating for a user.
 * @param {number} userId - The ID of the user to rate.
 * @param {number} stars - The number of stars to give.
 */
export const postRate = async(userId, stars) => {
  const token = getToken()
  
  // If no token, userId, or stars, throw error.
  if (!token || !userId || !stars) throw "missing args"
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  // Make the post rate request.
  const res = await fetch(`${BASE_URL}/ratings/rate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({userId: userId, stars: stars})
  })
  
  // If request fails, throw error.
  if (parseInt(res.status / 100) != 2) throw res
}

/**
 * Get the rating of a buyer with the specified ID.
 * @param {number} id - The ID of the buyer.
 * @returns {Promise<Object>} The buyer's rating.
 */
export const getBuyerRating = async (id) => {

  // Fetch the buyer's rating.
  const res = await fetch(`${BASE_URL}/ratings/buyer/${id}`)

  // If request fails, return null.
  if (parseInt(res.status / 100) != 2) return null
  return await res.json()
}

/**
 * Get the rating of a seller with the specified ID.
 * @param {number} id - The ID of the seller.
 * @returns {Promise<Object>} The seller's rating.
 */
export const getSellerRating = async (id) => {
  // Fetch the seller's rating.
  const res = await fetch(`${BASE_URL}/ratings/seller/${id}`)

  // If request fails, return null.
  if (parseInt(res.status / 100) != 2) return null
  return await res.json()
}

/**
 * Share an order with a new buyer.
 * @param {Object} param0 - The parameters for sharing the order.
 * @param {number} param0.newBuyerId - The ID of the new buyer.
 * @param {number} param0.bundleId - The ID of the bundle to share.
 * @returns {Promise<boolean>} True if successful, otherwise false.
 */
export const shareOrder = async ({ newBuyerId, bundleId }) => {
  const token = getToken()

  // If no token, return false.
  if (!token) return false
  
  // Set up authorization headers.
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')

  // Make the share order request.
  const res = await fetch(`${BASE_URL}/bundles/shareOrder`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({ newBuyerId, bundleId })
  })

  // If request fails, return false.
  if (parseInt(res.status / 100) != 2) return false
  return true
}