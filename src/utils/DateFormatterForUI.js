
function DateFormatterForUI (dateToBeFormatted) {
  const dd = String(dateToBeFormatted.getDate()).padStart(2, '0')
  const mm = String(dateToBeFormatted.getMonth() + 1).padStart(2, '0')
  const yyyy = dateToBeFormatted.getFullYear()

  const formattedDate = mm + '/' + dd + '/' + yyyy

  return formattedDate
}

export default DateFormatterForUI
