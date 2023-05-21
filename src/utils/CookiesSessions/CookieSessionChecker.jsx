import Cookies from 'js-cookie'
import { api, sessionAuthUrl } from '../backend_configuration/BackendConfig'
import CookieString2DictConverter from './CookieString2DictConverter'

function CookieSessionChecker () {
  let userSessionCookie = Cookies.get('user_session_cookie')

  if (userSessionCookie != null) {
    userSessionCookie = CookieString2DictConverter(userSessionCookie)
    const userId = userSessionCookie.user_id
    const secretToken1 = userSessionCookie.secret_token_1
    const secretToken2 = userSessionCookie.secret_token_2

    api.post(sessionAuthUrl, {
      userId,
      secretToken1,
      secretToken2
    }, {
      withCredentials: true
    }
    ).then(response => {
      console.log(response)
      if (response['data'] === true) {
        return true
      } else {
        return false
      }
    }
    )
  }
}

export default CookieSessionChecker
