
function AccountCreationAddressMock (instance) {
  instance.state.selectedCountryName = 'United States'
  instance.state.selectedCountryCode = 'US'
  instance.state.selectedStateCode = 'CA'
  instance.state.selectedStateName = 'California'
  instance.state.selectedCityName = 'San Francisco'
  instance.state.addressLine1 = 'Lombard Street'
  instance.state.addressLine2 = ''
  instance.state.zipCode = '94111'
}

export default AccountCreationAddressMock
