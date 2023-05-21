import styles from '../utils/style_guide/AccountDetailsInputPageStyle'
import React, { useState } from 'react'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import { userInputFieldMaxCharacter } from '../utils/user_input_config/UserInputConfig'
import TopBar from '../components/molecules/TopBar'
import { api, forgotPassword } from '../utils/backend_configuration/BackendConfig'
import { useNavigate, Navigate } from 'react-router-dom'
import { setPasswordResetAccountState } from '../store/Slices/PasswordResetAccountSlice'
import { useSelector, useDispatch } from 'react-redux'
import { clearPasswordResetAccountState } from '../store/Slices/PasswordResetAccountSlice'

function ForgotPasswordPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [invalidAccount, setInvalidAccount] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(setPasswordResetAccountState(username))

    api.post(forgotPassword, {
      username
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Password reset email sent')

        navigate('/reset-password')
      } else {
        console.log('Email does not exist')
        setInvalidAccount(true)
        dispatch(clearPasswordResetAccountState())
      }
    }
    )
  }

  return (
    <View style={styles.container}>
    <TopBar settingsEnabled={false} />
    <View style={styles.container}>
        <Text style={styles.titleText}>
            Reset Your Password
        </Text>
        <Text style={styles.titleText2}>
            Please enter the email address to reset
        </Text>
        <br></br>
        <br></br>
        <View style={styles.inputView}>
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#003f5c"
                onChangeText={(email) => setUsername(email)}
                maxLength={userInputFieldMaxCharacter}
            />
        </View>
        {invalidAccount &&
          <View>
            <br></br>
            <Text style={styles.errorText}>
              This account does not exist.
            </Text>
            <br></br>
          </View>
        }
        <br></br>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.loginText}>Next</Text>
        </TouchableOpacity>
    </View>
    </View>
  )
}

export default ForgotPasswordPage
