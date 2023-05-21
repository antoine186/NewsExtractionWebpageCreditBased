import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import { Country, State, City } from 'country-state-city'
import Select from 'react-select'
import styles from '../../utils/style_guide/AccountDetailsInputPageStyle'
import { userInputFieldMaxCharacter } from '../../utils/user_input_config/UserInputConfig'
import { mockingConfig } from '../../utils/debug_configuration/MockingConfig'
import AccountCreationAddressMock from '../../mocking/AccountCreationAddressMock'

class UserBillingAddressInputView extends React.Component {
  constructor (props) {
    super(props)

    const countries = Country.getAllCountries()

    const updatedCountries = countries.map((country) => ({
      label: country.name,
      value: country.id,
      ...country
    }))

    this.state = {
      countries: updatedCountries,
      selectedCountryName: '',
      selectedCountryCode: '',
      selectedStateCode: '',
      selectedStateName: '',
      selectedCityName: '',
      states: '',
      cities: '',
      addressLine1: this.props.addressLine1,
      addressLine2: this.props.addressLine2,
      zipCode: this.props.zipCode,
      selectedCountryGrabber: this.props.selectedCountryGrabber,
      selectedStateGrabber: this.props.selectedStateGrabber,
      selectedCityGrabber: this.props.selectedCityGrabber,
      addressLine1Grabber: this.props.addressLine1Grabber,
      addressLine2Grabber: this.props.addressLine2Grabber,
      zipCodeGrabber: this.props.zipCodeGrabber,
      addressLine1Empty: this.props.addressLine1Empty,
      countryEmpty: this.props.countryEmpty,
      stateEmpty: this.props.stateEmpty,
      cityEmpty: this.props.cityEmpty,
      zipCodeEmpty: this.props.zipCodeEmpty
    }

    if (mockingConfig) {
      AccountCreationAddressMock(this)
      this.addressLine1Selected(this.state.addressLine1)
      this.addressLine2Selected(this.state.addressLine2)
      this.mockedCountrySelected(this.state.selectedCountryName, this.state.selectedCountryCode)
      this.mockedStateSelected(this.state.selectedStateName, this.state.selectedStateCode, this.state.selectedCountryCode)
      this.mockedCitySelected(this.state.selectedCityName)
      this.zipCodeSelected(this.state.zipCode)
    }
  }

  addressLine1Selected (addressLine1) {
    this.setState({ addressLine1 })
    this.state.addressLine1Grabber(addressLine1)
  }

  addressLine2Selected (addressLine2) {
    this.setState({ addressLine2 })
    this.state.addressLine2Grabber(addressLine2)
  }

  countrySelected (selectedCountry) {
    const countryCode = selectedCountry.isoCode

    const updatedStates = State
      .getStatesOfCountry(countryCode)
      .map((state) => ({ label: state.name, value: state.id, ...state }))

    this.setState({ states: updatedStates })
    this.setState({ selectedCountryCode: countryCode })
    this.setState({ selectedCountryName: selectedCountry.name })

    this.state.selectedCountryGrabber(selectedCountry.name, countryCode)
  }

  mockedCountrySelected (selectedCountryName, selectedCountryCode) {
    const countryCode = selectedCountryCode

    const updatedStates = State
      .getStatesOfCountry(countryCode)
      .map((state) => ({ label: state.name, value: state.id, ...state }))

    this.setState({ states: updatedStates })
    this.setState({ selectedCountryCode: countryCode })
    this.setState({ selectedCountryName: selectedCountryName })

    this.state.selectedCountryGrabber(selectedCountryName, selectedCountryCode)
  }

  stateSelected (selectedState) {
    const updatedCities = City
      .getCitiesOfState(this.state.selectedCountryCode, selectedState.isoCode)
      .map((city) => ({ label: city.name, value: city.id, ...city }))

    this.setState({ cities: updatedCities })
    this.setState({ selectedStateCode: selectedState.isoCode })
    this.setState({ selectedStateName: selectedState.name })

    this.state.selectedStateGrabber(selectedState.name, selectedState.isoCode)
  }

  mockedStateSelected (selectedStateName, selectedStateCode, selectedCountryCode) {
    const updatedCities = City
      .getCitiesOfState(selectedCountryCode, selectedStateCode)
      .map((city) => ({ label: city.name, value: city.id, ...city }))

    this.setState({ cities: updatedCities })
    this.setState({ selectedStateCode: selectedStateCode })
    this.setState({ selectedStateName: selectedStateName })

    this.state.selectedStateGrabber(selectedStateName, selectedStateCode)
  }

  citySelected (selectedCity) {
    this.setState({ selectedCityName: selectedCity.name })

    this.state.selectedCityGrabber(selectedCity.name)
  }

  mockedCitySelected (selectedCityName) {
    this.setState({ selectedCityName: selectedCityName })

    this.state.selectedCityGrabber(selectedCityName)
  }

  zipCodeSelected (zipCode) {
    this.setState({ zipCode })

    this.state.zipCodeGrabber(zipCode)
  }

  render () {
    return (
      <View style={styles.subcontainer}>
        <Text style={styles.titleText}>
          Your Billing Address
        </Text>
        <br></br>

        <View style={styles.rowContainer}>
          <View style={styles.dualRowInputViewLeft}>
            <TextInput
              style={styles.textInput}
              placeholder="Address Line 1"
              placeholderTextColor="#003f5c"
              value={this.state.addressLine1}
              onChangeText={addressLine1 => this.addressLine1Selected(addressLine1)}
              maxLength={userInputFieldMaxCharacter}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="Address Line 2"
              placeholderTextColor="#003f5c"
              value={this.state.addressLine2}
              onChangeText={addressLine2 => this.addressLine2Selected(addressLine2)}
              maxLength={userInputFieldMaxCharacter}
            />
          </View>
        </View>

        <View style={styles.rowContainer}>
          {this.props.addressLine1Empty &&
            <View style={styles.errorTextViewLeft}>
              <Text style={styles.errorText}>
                Please fill in your first line of address *
              </Text>
              <br></br>
            </View>
          }
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowSelectViewLeft}>
            <Select
              id="country"
              name="country"
              label="Country"
              placeholder="Country"
              options={this.state.countries}
              value={{ label: this.state.selectedCountryName, value: this.state.selectedCountryName }}
              onFocus={e => {
                if (e.target.autocomplete) {
                  e.target.autocomplete = 'nope'
                }
              }}
              onChange={(value) => {
                this.countrySelected(value)
              }}
              styles={styles.selectViewHighlight}
              menuPortalTarget={document.querySelector('body')}
            />
          </View>
          <View style={styles.rowSelectViewLeft}>
            <Select
              id="state"
              name="state"
              label="State"
              placeholder="State"
              options={this.state.states}
              value={{ label: this.state.selectedStateName, value: this.state.selectedStateName }}
              onFocus={e => {
                if (e.target.autocomplete) {
                  e.target.autocomplete = 'nope'
                }
              }}
              onChange={(value) => {
                this.stateSelected(value)
              }}
              styles={styles.selectViewHighlight}
              menuPortalTarget={document.querySelector('body')}
            />
          </View>
          <View style={styles.selectView}>
            <Select
              id="city"
              name="city"
              label="Cities"
              placeholder="City"
              options={this.state.cities}
              value={{ label: this.state.selectedCityName, value: this.state.selectedCityName }}
              onFocus={e => {
                if (e.target.autocomplete) {
                  e.target.autocomplete = 'nope'
                }
              }}
              onChange={(value) => {
                this.citySelected(value)
              }}
              styles={styles.selectViewHighlight}
              menuPortalTarget={document.querySelector('body')}
            />
          </View>
        </View>
        <br></br>

        {this.props.countryEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please select your country *
            </Text>
            <br></br>
          </View>
        }
        {this.props.stateEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please select your state *
            </Text>
            <br></br>
          </View>
        }
        {this.props.cityEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please select your city *
            </Text>
            <br></br>
          </View>
        }

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Zip code"
            placeholderTextColor="#003f5c"
            value={this.state.zipCode}
            onChangeText={zipCode => this.zipCodeSelected(zipCode)}
            maxLength={userInputFieldMaxCharacter}
          />
        </View>
        {this.props.zipCodeEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please fill in your zip/postal code *
            </Text>
            <br></br>
          </View>
        }
      </View>
    )
  }
}

export default UserBillingAddressInputView
