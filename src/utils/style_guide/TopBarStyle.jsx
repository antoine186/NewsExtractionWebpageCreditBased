import { StyleSheet, Dimensions } from 'react-native'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

const ScreenHeight = Dimensions.get('window').height

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const aspectRatio = windowWidth / windowHeight

const windowWidthCm = (windowWidth / 160) * 2.54

let largeWebBrowser = true
let mobileBrowser = false
let sizeScaler = 1

if (aspectRatio < 1.3 && windowWidthCm < 25) {
  largeWebBrowser = false
  sizeScaler = 5
  if (aspectRatio < 0.6 && windowWidthCm < 15) {
    mobileBrowser = true
    sizeScaler = 8
  }
}

const styles = returnStyles()

function returnStyles () {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 4 * vh,
      margin: 0,
      padding: 0,
      position: '-webkit-sticky',
      top: 0,
      backgroundColor: '#C576F6',
      overflow: 'visible'
    },
    image: {
      marginTop: 0.35 * sizeScaler * vw,
      marginLeft: 0.4 * sizeScaler * vw,
      height: 0.6 * 2 * sizeScaler * vw,
      width: 0.6 * 2 * sizeScaler * vw
    },
    settings: {
      marginTop: 0.35 * sizeScaler * vw,
      marginRight: 0.4 * sizeScaler * vw,
      float: 'right',
      height: 0.6 * 2 * sizeScaler * vw,
      width: 0.6 * 2 * sizeScaler * vw
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      overflow: 'visible'
    },
    allowOverflow: {
      overflow: 'visible'
    }
  })

  return styles
}

export default styles
