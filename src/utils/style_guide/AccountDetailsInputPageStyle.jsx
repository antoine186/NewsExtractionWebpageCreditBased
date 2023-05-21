import { StyleSheet, Dimensions } from 'react-native'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const aspectRatio = windowWidth / windowHeight

const windowWidthCm = (windowWidth / 160) * 2.54

let largeWebBrowser = true
let mobileBrowser = false
let sizeScaler = 1

if (aspectRatio < 1.3 && windowWidthCm < 25) {
  largeWebBrowser = false
  sizeScaler = 1.8
  if (aspectRatio < 0.6 && windowWidthCm < 15) {
    mobileBrowser = true
    sizeScaler = 5
  }
}

const styles = returnStyles()

function returnStyles () {
  const inputViewBaseStyle = {
    backgroundColor: '#FFC0CB',
    borderRadius: 30,
    width: 8 * sizeScaler * vw,
    height: 1.8 * sizeScaler * vw,
    marginBottom: 0.7 * vw,
    alignItems: 'center'
  }

  const selectViewBaseStyle = {
    width: 8 * sizeScaler * vw
  }

  const ScreenHeight = Dimensions.get('window').height
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: ScreenHeight,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      marginBottom: 0.5 * vw,
      height: 6.5 * sizeScaler * vw,
      width: 7 * sizeScaler * vw
    },
    inputView: {
      ...inputViewBaseStyle
    },
    textInput: {
      // height: 10 * sizeScaler * vw,
      height: '100%',
      width: '100%'
    },
    textButton: {
      height: 1.5 * sizeScaler * vw,
      marginBottom: 0
    },
    companyName: {
      height: 0.5 * sizeScaler * vw,
      marginBottom: 50
    },
    submitBtn: {
      width: 8 * sizeScaler * vw,
      borderRadius: 25,
      height: 2 * sizeScaler * vw,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2 * vw,
      backgroundColor: '#FF1493'
    },
    text: {
      color: '#AD3978',
      fontSize: 0.7 * sizeScaler * vw
    },
    titleText: {
      color: '#AD3978',
      fontSize: 1.2 * sizeScaler * vw
    },
    titleText2: {
      color: '#AD3978',
      fontSize: 0.8 * sizeScaler * vw
    },
    rowContainer: {
      flexDirection: 'row'
    },
    dualRowInputViewLeft: {
      ...inputViewBaseStyle,
      marginRight: 1.5 * vw
    },
    selectView: {
      ...selectViewBaseStyle
    },
    rowSelectViewLeft: {
      ...selectViewBaseStyle,
      marginRight: 1.5 * vw
    },
    selectViewHighlight: {
      control: (provided, state) => ({
        ...provided,
        boxShadow: 'none',
        border: state.isFocused && 'none'
      }),
      menu: (provided, state) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none'
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused && 'lightgray',
        color: state.isFocused && 'black'
      })
    },
    stripeCardElement: {
      width: 15 * sizeScaler * vw
    },
    subcontainer: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    errorText: {
      color: '#DC143C'
    },
    errorTextViewLeft: {
      marginRight: 1.5 * vw
    },
    button: {
      width: 6 * sizeScaler * vw,
      borderRadius: 25,
      height: 2 * sizeScaler * vw,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2 * vw,
      backgroundColor: '#FF1493'
    }
  })

  return styles
}

export default styles
