import styles from '../utils/style_guide/AccountDetailsInputPageStyle'
import React, { useState } from 'react'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import { userInputFieldMaxCharacter } from '../utils/user_input_config/UserInputConfig'
import TopBar from '../components/molecules/TopBar'
import { api, passwordReset } from '../utils/backend_configuration/BackendConfig'
import validator from 'validator'
import { useSelector } from 'react-redux'

import { useNavigate, Navigate } from 'react-router-dom'

function PasswordResetPage () {
  const [password, setPassword] = useState('')
  const [passwordWeak, setPasswordWeak] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [tokenIncorrect, setTokenIncorrect] = useState(false)
  const [emptyToken, setEmptyToken] = useState(false)

  const [submitAllowed, setSubmitAllowed] = useState(false)

  const navigate = useNavigate()

  const passwordResetAccount = useSelector(state => state.passwordResetAccountState)

  const handleSubmit = (e) => {
    e.preventDefault()

    setTokenIncorrect(false)
    setEmptyToken(false)

    if (resetToken === '') {
      setEmptyToken(true)
    }

    if (validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      console.log('Password strong enough')
      setSubmitAllowed(true)
      setPasswordWeak(false)
    } else {
      console.log('Password too weak')
      setPasswordWeak(true)
    }

    if (submitAllowed) {
      api.post(passwordReset, {
        username: passwordResetAccount,
        resetToken,
        password
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Password changed')

          navigate('/')
        } else {
          console.log('Reset token incorrect')

          setTokenIncorrect(true)
        }
      }
      )
    }
  }

  return (
    <View style={styles.container}>
        <TopBar settingsEnabled={false} />
        <View style={styles.container}>
            <Text style={styles.titleText}>
                Reset Your Password
            </Text>
            <Text style={styles.titleText2}>
                Please enter your new password and reset token. Check your spam mail.
            </Text>
            <br></br>
            <br></br>
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
            {passwordWeak &&
            <View>
                <Text style={styles.errorText}>
                    Passwords should be at least 8 characters long and have at least 1 uppercase, 1 lowercase character, and finally 1 number *
                </Text>
                <br></br>
            </View>
            }
            <br></br>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Reset Token"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(token) => setResetToken(token)}
                    maxLength={userInputFieldMaxCharacter}
                />
            </View>
            {tokenIncorrect &&
            <View>
                <Text style={styles.errorText}>
                    Token incorrect. Please check your email again.
                </Text>
                <br></br>
            </View>
            }
            {emptyToken &&
            <View>
                <Text style={styles.errorText}>
                    Token cannot be empty
                </Text>
                <br></br>
            </View>
            }
            <br></br>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.loginText}>Reset</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default PasswordResetPage
