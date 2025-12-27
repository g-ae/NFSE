async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); 
}

const getAccountTypeFromToken = (token) => {
  if (!token || typeof token !== "string") return "Unknown";
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