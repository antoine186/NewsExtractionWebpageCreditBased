
function CheckEmptyObject (object) {
  if (Object.keys(object).length === 0 && object.constructor === Object) {
    return true
  } else {
    return false
  }
}

export default CheckEmptyObject
