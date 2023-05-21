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
let sizeCardScaler = 1

if (aspectRatio < 1.3 && windowWidthCm < 25) {
  largeWebBrowser = false
  sizeScaler = 1.8
  sizeCardScaler = 1.2
  if (aspectRatio < 0.6 && windowWidthCm < 15) {
    mobileBrowser = true
    sizeScaler = 3.5
    sizeCardScaler = 2.8
  }
}

const styles = returnStyles()

function returnStyles () {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: ScreenHeight,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      width: Dimensions.get('window').width
    },
    innerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    header: {
      padding: 1 * sizeScaler * vw
    },
    title: {
      fontWeight: 'bold',
      fontSize: 1.2 * sizeScaler * vw,
      marginVertical: 1.2 * vw,
      textAlign: 'center'
    },
    titleText: {
      color: '#AD3978',
      fontSize: 1.2 * sizeScaler * vw
    },
    text: {
      lineHeight: 1 * vw,
      fontSize: 0.8 * sizeScaler * vw,
      marginVertical: 1 * vw,
      textAlign: 'center'
    },
    tagText: {
      lineHeight: 1 * vw,
      fontSize: 0.8 * sizeScaler * vw,
      marginVertical: 1 * vw,
      marginLeft: 1 * vw,
      textAlign: 'center'
    },
    link: {
      color: '#1B95E0'
    },
    code: {
      fontFamily: 'monospace, monospace'
    },
    searchBtn: {
      width: 8 * sizeScaler * vw,
      borderRadius: 25,
      height: 2 * sizeScaler * vw,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2 * vw,
      backgroundColor: '#FF1493'
    },
    image: {
      marginBottom: 0.5 * vw,
      height: 2.5 * sizeScaler * vw,
      width: 2.5 * sizeScaler * vw
    },
    articleCard: {
      marginBottom: 0.5 * vw,
      width: 25 * sizeScaler * vw
    },
    titleText2: {
      color: '#AD3978',
      fontSize: 0.8 * sizeScaler * vw
    },
    rowContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      overflow: 'visible',
      alignContent: 'center'
    },
    imageTag: {
      marginBottom: 0.5 * vw,
      width: 3.5 * sizeScaler * vw,
      height: '100%'
    },
    chartCard: {
      marginBottom: 0.5 * vw,
      width: 35 * sizeCardScaler * vw
    },
    errorText: {
      color: '#DC143C'
    }
  })

  return styles
}

export default styles
