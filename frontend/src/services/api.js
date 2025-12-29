import { getToken } from "./cookies";
import { sha256 } from "./utils";

const BASE_URL = "/api";
const jsonHeaders = new Headers();
jsonHeaders.append('Content-Type', 'application/json');

export const getPopularBundles = async () => {
  const response = await fetch(`${BASE_URL}/bundles`);
  const data = await response.json();
  return data;
};

export const searchBundles = async (query) => {
  const response = await fetch(`${BASE_URL}/bundles`);
  const data = await response.json();
  return data;
};

async function login(accountType, query) {
  if (!query.email || !query.password) return null

  const passwordSHA = await sha256(query.password)
  const res = await fetch(`${BASE_URL}/account/${accountType}`, {
    mode: 'cors',
    headers: jsonHeaders,
    body: JSON.stringify({"email": query.email, "password": passwordSHA}),
    method: 'POST'
  })
  if (parseInt(res.status / 100) != 2) return null
  else return await res.json()
}

export const loginBuyer = async (query) => {
  return await login("buyer", query)
}

export const loginSeller = async (query) => {
  return await login("seller", query)
}

/**
 * 
 * @param {*} query 
 * @returns bool true if OK, else false
 */
export const registerBuyer = async (query) => {
  const passwordSHA = await sha256(query.password)
  const body = { ...query, password: passwordSHA }
  const res = await fetch(`${BASE_URL}/account/buyer/register`, {
    method: "POST",
    mode: 'cors',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  })
  if (parseInt(res.status / 100) != 2) return false
  else return true
}

export const registerSeller = async (query) => {
  const passwordSHA = await sha256(query.password)
  const body = { ...query, password: passwordSHA }
  const res = await fetch(`${BASE_URL}/account/seller/register`, {
    method: "POST",
    mode: 'cors',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  })
  if (parseInt(res.status / 100) != 2) return false
  else return true
}

export const getUser = async (type, id) => {
  const res = await fetch(`${BASE_URL}/${type}/${id}`)
  if (parseInt(res.status / 100) != 2) return null
  else return await res.json()
}

export const getBuyer = async (id) => {
  return await getUser("buyers", id)
}

export const getSeller = async (id) => {
  return await getUser("sellers", id)
}

export const getAccountEmail = async () => {
  const token = getToken()
  
  if (!token) return null
  
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

export const getReservedBundles = async () => {
  const token = getToken()
  
  if (!token) return []
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  
  const res = await fetch(`${BASE_URL}/bundles/reserved`, {
    headers: headers
  })
  console.log(res)
  if (parseInt(res.status / 100) != 2) return []
  
  return await res.json()
}

export const getConfirmedBundles = async () => {
  const token = getToken()
  
  if (!token) return []
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  
  const res = await fetch(`${BASE_URL}/bundles/confirmed`, {
    headers: headers
  })
  
  if (parseInt(res.status / 100) != 2) return []
  
  return await res.json()
}

export const reserveBundle = async (bundleId) => {
  const token = getToken()
  
  if (!token) return false
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/bundles/reserve`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({
      bundleId: bundleId
    })
  })
  
  if (parseInt(res.status / 100) != 2) return false
  return true
}

export const unreserveBundle = async (bundleId) => {
  const token = getToken()
  
  if (!token) return false
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/bundles/unreserve`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({
      bundleId: bundleId
    })
  })
  
  if (parseInt(res.status / 100) != 2) return false
  return true
}

export const createBundle = async (bundleData) => {
  const token = getToken()
  
  if (!token) return false
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/bundles/new`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(bundleData)
  })
  
  if (parseInt(res.status / 100) != 2) return false
  return true
}

export const confirmBundle = async(bundleId) => {
  const token = getToken()
  
  if (!token) return false
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/bundles/confirm`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({bundleId: bundleId})
  })
  
  if (parseInt(res.status / 100) != 2) return false
  return true
}

export const getOldBundles = async () => {
  const token = getToken()
  
  if (!token) return []
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  
  const res = await fetch(`${BASE_URL}/bundles/history`, {
    headers: headers
  })
  
  if (parseInt(res.status / 100) != 2) return []
  
  return await res.json()
}

export const confirmPickup = async(bundleId) => {
  const token = getToken()

  if(!token) return false 

  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/bundles/confirmPickup`, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({bundleId: bundleId})
  })

  if (parseInt(res.status / 100) != 2) return false
  return true
}

export const getIsRatedFrom = async(userId) => {
  const token = getToken()
  
  if (!token || !userId) return false
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/ratings/hasRated?id=${userId}`, {
    method: 'GET',
    headers: headers
  })
  
  if (parseInt(res.status / 100) != 2) return null
  return (await res.json()).length != 0
}

export const postRate = async(userId, stars) => {
  const token = getToken()
  
  if (!token || !userId || !stars) throw "missing args"
  
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  headers.append('Content-Type', 'application/json')
  
  const res = await fetch(`${BASE_URL}/ratings/rate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({userId: userId, stars: stars})
  })
  
  if (parseInt(res.status / 100) != 2) throw res
}

export const getBuyerRating = async (id) => {
  const res = await fetch(`${BASE_URL}/ratings/buyer/${id}`)
  if (parseInt(res.status / 100) != 2) return null
  return await res.json()
}

export const getSellerRating = async (id) => {
  const res = await fetch(`${BASE_URL}/ratings/seller/${id}`)
  if (parseInt(res.status / 100) != 2) return null
  return await res.json()
}