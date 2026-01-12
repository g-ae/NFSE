import Cookies from 'universal-cookie'

// Initialize cookies instance.
const cookies = new Cookies()

// Define the token name constant.
const TOKEN_NAME = 'nfse-token'

/**
 * Checks if the user is logged in.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
function isLoggedIn() {
  const token = cookies.get(TOKEN_NAME)
  return !!token
}

/**
 * Saves the authentication token.
 * @param {string} token - The authentication token.
 */
function saveToken(token) {
  cookies.set(TOKEN_NAME, token)
}

/**
 * Clears the authentication token.
 */
function clearToken() {
  cookies.remove(TOKEN_NAME)
}

/**
 * Retrieves the authentication token.
 * @returns {string} The authentication token.
 */
function getToken() {
  return cookies.get(TOKEN_NAME)
}

/**
 * Extracts the user ID from the authentication token.
 * @param {string} token - The authentication token.
 * @returns {number|null} The user ID if the token is valid, otherwise null.
 */
function getUserId(token) {
  // If token is invalid, return null.
  if (!token || typeof token !== "string") return null;

  // Split the token and extract the user ID and check if it's a valid number.
  const elements = token.split("/");
  if (elements.length !== 2) return null;
  const id = Number(elements[1]);
  return id;
}

export {
  isLoggedIn,
  saveToken,
  clearToken,
  getToken,
  getUserId
}