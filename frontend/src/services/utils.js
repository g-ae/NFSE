import {sha256 as sha256Lib} from 'js-sha256'

async function sha256(message) {
    return sha256Lib(message)
}

const getAccountTypeFromToken = (token) => {
  if (!token) return "Unknown";
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