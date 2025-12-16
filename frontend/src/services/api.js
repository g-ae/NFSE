import { sha256 } from "./utils";

const BASE_URL = "http://localhost:4000";
const jsonHeaders = new Headers();
jsonHeaders.append('Content-Type', 'application/json');

export const getPopularBundles = async () => {
  console.log("try")
  const response = await fetch(`${BASE_URL}/bundles`);
  const data = await response.json();
  console.log(data)
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