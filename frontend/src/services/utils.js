import {sha256 as sha256Lib} from 'js-sha256'

/**
 * Computes the SHA-256 hash of a message.
 * @param {string} message - The message to hash.
 * @returns {string} The SHA-256 hash of the message.
 */
async function sha256(message) {
    return sha256Lib(message)
}

/**
 * Determines the account type from a token.
 * @param {string} token - The authentication token.
 * @returns {string} The account type ("Buyer", "Seller", or "Unknown").
 */
const getAccountTypeFromToken = (token) => {

  // If no token, return Unknown.
  if (!token) return "Unknown";

  // Check the first character of the token to determine account type.
  switch (token[0]) {
    case "b":
      return "Buyer"
    case "s":
      return "Seller"
    default:
      return "Unknown"
  }
}

export {
  sha256,
  getAccountTypeFromToken
}