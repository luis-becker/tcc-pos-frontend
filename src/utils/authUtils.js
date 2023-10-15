'use client'

function saveAuthToken (authToken) {
  console.log(authToken)
  localStorage.setItem('authToken.value', authToken.value)
  localStorage.setItem('authToken.expires', authToken.expires)

}

function getAuthToken () {
  return {
    value: localStorage.getItem('authToken.value'),
    expires: localStorage.getItem('authToken.expires')
  }
}

async function fetchAuth (url, opt) {
  opt.headers = {
    ...opt.headers,
    'authtoken': getAuthToken().value
  }
  return fetch(url, opt)
}

export default {
  saveAuthToken,
  getAuthToken,
  fetchAuth
}