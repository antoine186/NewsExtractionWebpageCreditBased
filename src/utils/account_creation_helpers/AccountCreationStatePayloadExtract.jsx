
function AccountCreationStatePayloadExtract (instance, telephoneNumber, telephoneAreaCode) {
  const payload = {
    firstName: instance.state.firstName,
    lastName: instance.state.lastName,
    emailAddress: instance.state.emailAddress,
    password: instance.state.password,
    dateBirth: instance.state.dateBirth,
    telephoneNumber,
    telephoneAreaCode,
    selectedCountryName: instance.state.selectedCountryName,
    selectedCountryCode: instance.state.selectedCountryCode,
    selectedStateCode: instance.state.selectedStateCode,
    selectedStateName: instance.state.selectedStateName,
    selectedCityName: instance.state.selectedCityName,
    addressLine1: instance.state.addressLine1,
    addressLine2: instance.state.addressLine2,
    zipCode: instance.state.zipCode
  }

  return payload
}

export default AccountCreationStatePayloadExtract
