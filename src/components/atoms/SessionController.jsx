import React, { useEffect } from 'react'
import ManualStoreClearing from '../../utils/session_helpers/ManualStoreClearing'

import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'

function SessionController () {
  const [autoLogout, setAutoLogout] = React.useState(false)

  const oneSecond = 1000
  const timeTowardsAutoLogout = 7200 * oneSecond

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoLogout(true)
    }, timeTowardsAutoLogout)

    return () => clearInterval(interval)
  }, [])

  return (
    <View>
    {autoLogout &&
        <View>
            <ManualStoreClearing />
        </View>
    }
    </View>
  )
}

export default SessionController
