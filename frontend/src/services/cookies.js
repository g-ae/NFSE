import Cookies from 'universal-cookie'

const cookies = new Cookies()

const TOKEN_NAME = 'nfse-token'
  
function isLoggedIn() {
  const token = cookies.get(TOKEN_NAME)
  return !!token
}

function saveToken(token) {
  cookies.set(TOKEN_NAME, token)
}

function clearToken() {
  cookies.remove(TOKEN_NAME)
}

function getToken() {
  return cookies.get(TOKEN_NAME)
}

function getUserId(token) {
  if (!token || typeof token !== "string") return null;
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