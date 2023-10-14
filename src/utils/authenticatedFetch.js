export default function authenticatedFetch(authToken) {
  return async function (url, opt = {}) {
    if(opt.headers){
      opt.headers["authtoken"] = authToken
    } else {
      opt.headers = {authtoken: authToken}
    }
    return fetch(url, opt)
  }
}