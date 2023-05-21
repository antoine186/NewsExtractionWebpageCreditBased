
function DateFormatter (dateToBeFormatted) {
  const dd = String(dateToBeFormatted.getDate()).padStart(2, '0')
  const mm = String(dateToBeFormatted.getMonth() + 1).padStart(2, '0')
  const yyyy = dateToBeFormatted.getFullYear()

  const formattedDate = yyyy + '-' + mm + '-' + dd

  return formattedDate
}

export default DateFormatter
