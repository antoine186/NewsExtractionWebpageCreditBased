import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../utils/style_guide/LoginPageStyle'
import { api, loginAuthUrl, retrieveSubscriptionDetails, getSubscriptionStatus, retrieveAccountData } from '../utils/backend_configuration/BackendConfig'
import { useSelector, useDispatch } from 'react-redux'
import { validateUserSession } from '../store/Slices/UserSessionSlice'
import { useNavigate, Navigate } from 'react-router-dom'
import { userInputFieldMaxCharacter } from '../utils/user_input_config/UserInputConfig'
import { setValidSubscription } from '../store/Slices/ValidSubscriptionSlice'
import { setstripeSubscription } from '../store/Slices/StripeSubscriptionSlice'
import { setAccountData } from '../store/Slices/AccountDataSlice'
import { userInputFieldMaxCharacterEmail } from '../utils/user_input_config/UserInputConfig'

function Login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passIncorrect, setPassIncorrect] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userSessionValidated = useSelector(state => state.userSession.validated)

  const loginButtonRef = React.useRef()

  window.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (loginButtonRef.current !== undefined && loginButtonRef.current !== null) {
        loginButtonRef.current.click()
      }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    api.post(loginAuthUrl, {
      username,
      password
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data) {
        dispatch(validateUserSession())

        api.post(retrieveAccountData, {
          username
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            dispatch(setAccountData(response.data.responsePayload))
          }
        }
        )

        api.post(retrieveSubscriptionDetails, {
          username
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            dispatch(setstripeSubscription(response.data.responsePayload))

            api.post(getSubscriptionStatus, {
              stripeSubscriptionId: response.data.responsePayload.stripe_subscription_id
            }, {
              withCredentials: true
            }
            ).then(response => {
              if (response.data.operation_success) {
                if (response.data.responsePayload.stripe_subscription_status === 'active' ||
                response.data.responsePayload.stripe_subscription_status === 'trialing') {
                  console.log('Found valid subscription')
                  dispatch(setValidSubscription(true))
                } else {
                  console.log('No valid subscriptions found')
                  dispatch(setValidSubscription(false))
                }
              } else { /* empty */ }
            }
            )
          } else {
            console.log('No valid subscriptions found')
            dispatch(setValidSubscription(false))
          }
        }
        )

        navigate('/')
      } else {
        setPassIncorrect(true)
      }
    }
    )
  }

  function accountCreate () {
    dispatch(setValidSubscription(false))
    navigate('/account-create')
  }

  function passwordForget () {
    dispatch(setValidSubscription(false))
    navigate('/forgot-password')
  }

  if (userSessionValidated) {
    return <Navigate to='/' />
  } else {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/images/EMOfficialLogo.png')} />
        <Text style={styles.companyName}>Emotional Machines</Text>
        <StatusBar style="auto" />
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setUsername(email)}
            maxLength={userInputFieldMaxCharacterEmail}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            maxLength={userInputFieldMaxCharacter}
          />
        </View>
        {passIncorrect &&
          <View>
            <Text style={styles.text}>
              Incorrect credentials
            </Text>
            <br></br>
          </View>
        }
        <TouchableOpacity>
          <Text style={styles.textButton} onPress={passwordForget}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.textButton} onPress={accountCreate}>
            {"Don't have an account? Create an account here"}
          </Text>
        </TouchableOpacity>
        <br></br>
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit} ref={loginButtonRef}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Login
