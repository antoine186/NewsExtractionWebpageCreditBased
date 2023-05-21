import { formatPhoneNumber, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input'

function TelephoneNumberSplitter (fullTelephoneNumber) {
  const parsedPhoneNumber = parsePhoneNumber(fullTelephoneNumber)
  const telephoneAreaCode = getCountryCallingCode(parsedPhoneNumber.country)
  const formattedPhoneNumber = formatPhoneNumber(fullTelephoneNumber)

  const result = {
    telephoneAreaCode,
    formattedPhoneNumber
  }

  return result
}

export default TelephoneNumberSplitter
