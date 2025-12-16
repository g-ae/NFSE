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

export {
  isLoggedIn,
  saveToken,
  clearToken
}