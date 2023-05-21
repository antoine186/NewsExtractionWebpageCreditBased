function CookieString2DictConverter (userSessionCookie) {
  userSessionCookie = userSessionCookie.replaceAll('\\054', ',')
  userSessionCookie = userSessionCookie.replaceAll('\\', '')

  userSessionCookie = JSON.parse(userSessionCookie)

  return userSessionCookie
}

export default CookieString2DictConverter
