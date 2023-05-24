
function ProcessCredits (creditAmount) {
  let result = 0
  if (creditAmount < 0) {
    return result
  }

  result = creditAmount.toFixed(1)

  return result
}

export default ProcessCredits
