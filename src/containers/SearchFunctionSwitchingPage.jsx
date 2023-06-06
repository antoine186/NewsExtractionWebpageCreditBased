import React, { Component } from 'react'
import EmotionalSearchPage from './EmotionalSearchPage'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
// import TwitterSearchPage from './TwitterSearchPage'

class SearchFunctionSwitchingPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      worldwidewebShow: true
    }

    this.clearToggleChoice = this.clearToggleChoice.bind(this)
    this.toggleClickWorldwideWeb = this.toggleClickWorldwideWeb.bind(this)
  }

  clearToggleChoice () {
    this.setState({ worldwidewebShow: false })
  }

  toggleClickWorldwideWeb () {
    console.log('Toggling to world wide web')
    this.clearToggleChoice()
    this.setState({ worldwidewebShow: true })
  }

  render () {
    return (
        <View>
            <br></br>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.header}>
                    {this.state.worldwidewebShow &&
                        <Text style={styles.titleText}>Search the Worldwide Web</Text>
                    }
                </View>
            </View>
            <ToggleButtonGroup
                exclusive
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <ToggleButton value="worldwideweb" onClick={this.toggleClickWorldwideWeb}>
                <View>
                    <Image style={styles.image} source={require('../assets/images/worldwideweb_icon.png')} />
                    <Text>Click Me</Text>
                </View>
                </ToggleButton>
            </ToggleButtonGroup>

            {this.state.worldwidewebShow &&
                <EmotionalSearchPage />
            }
        </View>
    )
  }
}

export default SearchFunctionSwitchingPage
