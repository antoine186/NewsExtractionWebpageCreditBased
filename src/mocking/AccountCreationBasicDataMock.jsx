
function AccountCreationBasicDataMock (instance) {
  instance.state.firstName = 'Potato'
  instance.state.lastName = 'Salad'
  instance.state.emailAddress = 'potato@salad.com'
  instance.state.password = 'Pass123@&'
  instance.state.confirmedPassword = 'Pass123@&'
  instance.state.dateBirth = '2000-01-01'
  instance.state.telephoneNumber = '+12025550162'
}

export default AccountCreationBasicDataMock
