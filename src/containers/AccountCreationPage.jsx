import React from 'react'
import AccountBasicInfoInputView from '../components/molecules/AccountBasicInfoInputView'
import UserBillingAddressInputView from '../components/atoms/UserBillingAddressInputView'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../utils/style_guide/AccountDetailsInputPageStyle'
import validator from 'validator'
import { isValidPhoneNumber } from 'react-phone-number-input'
import PasswordValidate from '../utils/PasswordValidate'
import { setAccountData } from '../store/Slices/AccountDataSlice'
import { connect } from 'react-redux'
import TelephoneNumberSplitter from '../utils/TelephoneNumberSplitter'
import AccountCreationStatePayloadExtract from '../utils/account_creation_helpers/AccountCreationStatePayloadExtract'
import { api, basicAccountCreateUrl } from '../utils/backend_configuration/BackendConfig'
import { mockingConfig } from '../utils/debug_configuration/MockingConfig'
import { Navigate } from 'react-router-dom'
import TopBar from '../components/molecules/TopBar'
import StripeCustomerCreate from '../utils/account_creation_helpers/StripeCustomerCreate'
import { setStripeCustomerId } from '../store/Slices/StripeCustomerIdSlice'

class AccountCreationPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      emailAddress: this.props.emailAddress,
      password: this.props.password,
      confirmedPassword: this.props.confirmedPassword,
      dateBirth: this.props.dateBirth,
      telephoneNumber: this.props.telephoneNumber,
      telephoneAreaCode: this.props.telephoneAreaCode,
      selectedCountryName: this.props.selectedCountryName,
      selectedCountryCode: this.props.selectedCountryCode,
      selectedStateCode: this.props.selectedStateCode,
      selectedStateName: this.props.selectedStateName,
      selectedCityName: this.props.selectedCityName,
      addressLine1: this.props.addressLine1,
      addressLine2: this.props.addressLine2,
      zipCode: this.props.zipCode,
      firstNameEmpty: false,
      lastNameEmpty: false,
      emailEmpty: false,
      emailAlreadyExists: false,
      somethingWentWrong: false,
      validEmail: true,
      telephoneEmpty: false,
      validTelephone: true,
      passwordEmpty: false,
      passwordsMatch: true,
      passwordFormatIncorrect: false,
      dateBirthEmpty: false,
      addressLine1Empty: false,
      countryEmpty: false,
      stateEmpty: false,
      cityEmpty: false,
      zipCodeEmpty: false,
      goToPayment: false,
      errorCreateStripeCustomer: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  firstNameGrabber (firstName) {
    this.setState({ firstName })
  }

  lastNameGrabber (lastName) {
    this.setState({ lastName })
  }

  userEmailGrabber (email) {
    this.setState({ emailAddress: email })
  }

  passwordGrabber (password) {
    this.setState({ password })
  }

  confirmedPasswordGrabber (password) {
    this.setState({ confirmedPassword: password })
  }

  dateBirthGrabber (dateBirth) {
    this.setState({ dateBirth })
  }

  telNumberGrabber (telephoneNumber) {
    this.setState({ telephoneNumber })
  }

  selectedCountryGrabber (selectedCountryName, selectedCountryCode) {
    this.setState({ selectedCountryName })
    this.setState({ selectedCountryCode })
  }

  selectedStateGrabber (selectedStateName, selectedStateCode) {
    this.setState({ selectedStateName })
    this.setState({ selectedStateCode })
  }

  selectedCityGrabber (selectedCityName) {
    this.setState({ selectedCityName })
  }

  addressLine1Grabber (addressLine1) {
    this.setState({ addressLine1 })
  }

  addressLine2Grabber (addressLine2) {
    this.setState({ addressLine2 })
  }

  zipCodeGrabber (zipCode) {
    this.setState({ zipCode })
  }

  errorCreateStripeCustomerGrabber (error) {
    this.setState({ errorCreateStripeCustomer: error })
  }

  goToPaymentGrabber (goToPayment) {
    this.setState({ goToPayment })
  }

  handleSubmit () {
    let handleSubmitProceed = true
    let parseTelephoneNumberObject

    if (this.state.firstName === undefined) {
      handleSubmitProceed = false
      this.setState({ firstNameEmpty: true })
    } else {
      this.setState({ firstNameEmpty: false })
    }

    if (this.state.lastName === undefined) {
      handleSubmitProceed = false
      this.setState({ lastNameEmpty: true })
    } else {
      this.setState({ lastNameEmpty: false })
    }

    if (this.state.dateBirth === undefined) {
      handleSubmitProceed = false
      this.setState({ dateBirthEmpty: true })
    } else {
      this.setState({ dateBirthEmpty: false })
    }

    if (this.state.emailAddress === undefined) {
      handleSubmitProceed = false
      this.setState({ emailEmpty: true })
    } else {
      if (!validator.isEmail(this.state.emailAddress)) {
        handleSubmitProceed = false
        this.setState({ validEmail: false })
      } else {
        this.setState({ validEmail: true })
      }

      this.setState({ emailEmpty: false })
    }

    if (this.state.telephoneNumber === undefined) {
      handleSubmitProceed = false
      this.setState({ telephoneEmpty: true })
    } else {
      if (!isValidPhoneNumber(this.state.telephoneNumber)) {
        handleSubmitProceed = false
        this.setState({ validTelephone: false })
      } else {
        this.setState({ validTelephone: true })

        parseTelephoneNumberObject = TelephoneNumberSplitter(this.state.telephoneNumber)
      }

      this.setState({ telephoneEmpty: false })
    }

    if (this.state.password === undefined) {
      handleSubmitProceed = false
      this.setState({ passwordEmpty: true })
    } else {
      if (!PasswordValidate(this.state.password, this.state.confirmedPassword)) {
        handleSubmitProceed = false
        this.setState({ passwordsMatch: false })
      } else {
        this.setState({ passwordsMatch: true })
      }

      if (!validator.isStrongPassword(this.state.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })) {
        handleSubmitProceed = false
        this.setState({ passwordFormatIncorrect: true })
      } else {
        this.setState({ passwordFormatIncorrect: false })
      }

      this.setState({ passwordEmpty: false })
    }

    if (this.state.addressLine1 === undefined) {
      handleSubmitProceed = false
      this.setState({ addressLine1Empty: true })
    } else {
      this.setState({ addressLine1Empty: false })
    }

    if (this.state.addressLine2 === undefined) {
      this.setState({ addressLine2: '' })
    }

    if (this.state.selectedCountryName === undefined) {
      handleSubmitProceed = false
      this.setState({ countryEmpty: true })
    } else {
      this.setState({ countryEmpty: false })
    }

    if (this.state.selectedStateName === undefined) {
      handleSubmitProceed = false
      this.setState({ stateEmpty: true })
    } else {
      this.setState({ stateEmpty: false })
    }

    if (this.state.selectedCityName === undefined) {
      handleSubmitProceed = false
      this.setState({ cityEmpty: true })
    } else {
      this.setState({ cityEmpty: false })
    }

    if (this.state.zipCode === undefined) {
      handleSubmitProceed = false
      this.setState({ zipCodeEmpty: true })
    } else {
      this.setState({ zipCodeEmpty: false })
    }

    if (handleSubmitProceed) {
      const accountCreationData = AccountCreationStatePayloadExtract(this, parseTelephoneNumberObject.formattedPhoneNumber, parseTelephoneNumberObject.telephoneAreaCode)

      api.post(basicAccountCreateUrl, {
        accountCreationData
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          this.props.setAccountData(accountCreationData)

          StripeCustomerCreate(accountCreationData, this.props.setStripeCustomerId,
            this.goToPaymentGrabber.bind(this), this.errorCreateStripeCustomerGrabber.bind(this))
        } else {
          console.log(response.data.error_message)
          if (response.data.error_message === 'The account associated with your email already exists') {
            this.setState({ emailAlreadyExists: true })
          } else if (response.data.error_message === 'Something went wrong, please try again later') {
            this.setState({ somethingWentWrong: true })
            this.setState({ emailAlreadyExists: false })
          }
        }
      }
      )
    }
  }

  render () {
    if (!this.state.goToPayment) {
      return (
      <View style={styles.container}>
      <TopBar settingsEnabled={false} />
        <View style={styles.container}>
          <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
          <AccountBasicInfoInputView
            firstNameGrabber={this.firstNameGrabber.bind(this)}
            lastNameGrabber={this.lastNameGrabber.bind(this)}
            userEmailGrabber={this.userEmailGrabber.bind(this)}
            passwordGrabber={this.passwordGrabber.bind(this)}
            confirmedPasswordGrabber={this.confirmedPasswordGrabber.bind(this)}
            dateBirthGrabber={this.dateBirthGrabber.bind(this)}
            telNumberGrabber={this.telNumberGrabber.bind(this)}
            firstNameEmpty={this.state.firstNameEmpty}
            lastNameEmpty={this.state.lastNameEmpty}
            dateBirthEmpty={this.state.dateBirthEmpty}
            emailEmpty={this.state.emailEmpty}
            emailAlreadyExists={this.state.emailAlreadyExists}
            somethingWentWrong={this.state.somethingWentWrong}
            validEmail={this.state.validEmail}
            telephoneEmpty={this.state.telephoneEmpty}
            validTelephone={this.state.validTelephone}
            passwordsMatch={this.state.passwordsMatch}
            passwordFormatIncorrect={this.state.passwordFormatIncorrect}
            passwordEmpty={this.state.passwordEmpty}
          />
          <br></br>
          <UserBillingAddressInputView
            selectedCountryGrabber={this.selectedCountryGrabber.bind(this)}
            selectedStateGrabber={this.selectedStateGrabber.bind(this)}
            selectedCityGrabber={this.selectedCityGrabber.bind(this)}
            addressLine1Grabber={this.addressLine1Grabber.bind(this)}
            addressLine2Grabber={this.addressLine2Grabber.bind(this)}
            zipCodeGrabber={this.zipCodeGrabber.bind(this)}
            addressLine1Empty={this.state.addressLine1Empty}
            countryEmpty={this.state.countryEmpty}
            stateEmpty={this.state.stateEmpty}
            cityEmpty={this.state.cityEmpty}
            zipCodeEmpty={this.state.zipCodeEmpty}
          />
          <br></br>
          <TouchableOpacity style={styles.submitBtn} onPress={this.handleSubmit}>
            <Text>Next</Text>
          </TouchableOpacity>
          {this.state.errorCreateStripeCustomer &&
            <Text style={styles.errorText}>
              There was a processing error whilst creating your account.
              Please try again in a few moments.
            </Text>
          }
        </View>
      </View>
      )
    } else {
      return (
        <View>
          <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
          <Navigate to='/payment' />
        </View>
      )
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAccountData: (value) => dispatch(setAccountData(value)),
    setStripeCustomerId: (value) => dispatch(setStripeCustomerId(value))
  }
}
export default connect(null, mapDispatchToProps)(AccountCreationPage)
