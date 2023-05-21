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

const ScreenHeight = Dimensions.get('window').height

const styles = returnStyles()

function returnStyles () {
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
      backgroundColor: '#FFC0CB',
      borderRadius: 30,
      width: 8 * sizeScaler * vw,
      height: 1.8 * sizeScaler * vw,
      marginBottom: 0.7 * vw,
      alignItems: 'center'
    },
    textInput: {
      height: '100%',
      width: '100%',
      flex: 1,
      padding: 0.5 * vw,
      marginLeft: 1 * vw
    },
    textButton: {
      height: 1.5 * sizeScaler * vw,
      marginBottom: 0
    },
    companyName: {
      height: 0.5 * sizeScaler * vw,
      marginBottom: 50
    },
    loginBtn: {
      width: 8 * sizeScaler * vw,
      borderRadius: 25,
      height: 2 * sizeScaler * vw,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2 * vw,
      backgroundColor: '#FF1493'
    },
    text: {
      color: '#DC143C'
    }
  })

  return styles
}

export default styles
