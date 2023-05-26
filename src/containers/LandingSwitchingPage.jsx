import React, { Component } from 'react'
import SearchFunctionSwitchingPage from './SearchFunctionSwitchingPage'
import TopBar from '../components/molecules/TopBar'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import { Navigate } from 'react-router-dom'
import styles from '../utils/style_guide/MainWebpageStyle'
import { connect } from 'react-redux'
import TaggingPage from './TaggingPage'
import ProgressionPage from './ProgressionPage'
import LinkingPage from './LinkingPage'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import { api, basicAccountCreateUrl } from '../utils/backend_configuration/BackendConfig'
import GenerateRandomString from '../utils/GenerateRandomString'
import { setAnonSession } from '../store/Slices/AnonSessionSlice'

class LandingSwitchingPage extends Component {
  constructor (props) {
    super(props)

    let usernameToUse = ''

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      usernameToUse = 'antoine186@hotmail.com'

      const newAnonSessionId = GenerateRandomString(15)

      const payload = {
        firstName: newAnonSessionId,
        lastName: newAnonSessionId,
        emailAddress: newAnonSessionId,
        password: newAnonSessionId,
        dateBirth: new Date(),
        telephoneNumber: newAnonSessionId,
        telephoneAreaCode: newAnonSessionId,
        selectedCountryName: newAnonSessionId,
        selectedCountryCode: newAnonSessionId,
        selectedStateCode: newAnonSessionId,
        selectedStateName: newAnonSessionId,
        selectedCityName: newAnonSessionId,
        addressLine1: newAnonSessionId,
        addressLine2: newAnonSessionId,
        zipCode: newAnonSessionId,
        anonSessionSet: false
      }

      api.post(basicAccountCreateUrl, {
        accountCreationData: payload
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          // this.props.setAccountData(accountCreationData)
          this.props.setAnonSession(newAnonSessionId)
          this.setState({ anonSessionSet: true })
        } else {
          this.forceUpdate()
        }
      }
      )
    } // else {
      // const newAnonSessionId = this.props.anonSession.anonSession
      // usernameToUse = newAnonSessionId.payload
    //}

    this.state = {
      userSessionValidated: this.props.userSession.validated,
      searchShow: false,
      tagShow: false,
      progression: true,
      linking: false
    }

    this.clearToggleChoice = this.clearToggleChoice.bind(this)
    this.toggleClickSearch = this.toggleClickSearch.bind(this)
    this.toggleClickTag = this.toggleClickTag.bind(this)
    this.toggleClickProgression = this.toggleClickProgression.bind(this)
    this.toggleClickLinking = this.toggleClickLinking.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.userSession !== this.props.userSession) {
      this.setState({ userSessionValidated: this.props.userSession.validated })
    }
  }

  clearToggleChoice () {
    this.setState({ searchShow: false })
    this.setState({ tagShow: false })
    this.setState({ progression: false })
    this.setState({ linking: false })
  }

  toggleClickSearch () {
    console.log('Toggling to search')
    this.clearToggleChoice()
    this.setState({ searchShow: true })
  }

  toggleClickTag () {
    console.log('Toggling to tagging')
    this.clearToggleChoice()
    this.setState({ tagShow: true })
  }

  toggleClickProgression () {
    console.log('Toggling to progression')
    this.clearToggleChoice()
    this.setState({ progression: true })
  }

  toggleClickLinking () {
    console.log('Toggling to linking')
    this.clearToggleChoice()
    this.setState({ linking: true })
  }

  render () {
    return (
      <View>
          <TopBar settingsEnabled={true} />
          <View style={styles.container}>
              <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
              <View style={styles.header}>
                {this.state.searchShow &&
                  <Text style={styles.titleText}>Emotional Machines Search (Beta)</Text>
                }
                {this.state.tagShow &&
                  <Text style={styles.titleText}>Emotional Machines Tagging (Beta)</Text>
                }
                {this.state.progression &&
                  <Text style={styles.titleText}>Emotional Machines Progression Charting (Beta)</Text>
                }
                {this.state.linking &&
                  <Text style={styles.titleText}>Emotional Machines Link Analysis (Experimental)</Text>
                }
              </View>
              <ToggleButtonGroup
                  // value={alignment}
                  exclusive
                  // onChange={handleAlignment}
              >
                  <ToggleButton value="progression" onClick={this.toggleClickProgression}>
                    <View>
                      <Image style={styles.image} source={require('../assets/images/chart.jpg')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  <ToggleButton value="search" onClick={this.toggleClickSearch}>
                    <View>
                      <Image style={styles.image} source={require('../assets/images/magnifying-glass-search-icon-png-transparent.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  {/*
                  <ToggleButton value="tag" onClick={this.toggleClickTag}>
                      <Image style={styles.image} source={require('../assets/images/tag.jpg')} />
                  </ToggleButton>
                  */}
                  {/*
                  <ToggleButton value="linking" onClick={this.toggleClickLinking}>
                      <Image style={styles.image} source={require('../assets/images/node_graph.png')} />
                  </ToggleButton>
                  */}
              </ToggleButtonGroup>
              {this.state.searchShow &&
                <SearchFunctionSwitchingPage />
              }
              {this.state.tagShow &&
                <TaggingPage />
              }
              {this.state.progression &&
                <ProgressionPage />
              }
              {this.state.linking &&
                <LinkingPage />
              }
          </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    userSession: state.userSession,
    validSubscription: state.validSubscription,
    anonSession: state.anonSession
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAnonSession: (value) => dispatch(setAnonSession(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingSwitchingPage)
