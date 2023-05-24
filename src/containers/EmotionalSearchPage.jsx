import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import CappedDatePicker from '../components/atoms/CappedDatePicker'
import styles from '../utils/style_guide/MainWebpageStyle'
import PropTypes from 'prop-types'
import { api, searchUrl, getPreviousSearchResult, createCheckout, checkStillSearching } from '../utils/backend_configuration/BackendConfig'
import DateFormatter from '../utils/DateFormatter'
import SearchArticlesResultTable from '../components/molecules/SearchArticlesResultTable'
import ArticlesResultTableDataWrangler from './search_helper_functions/ArticlesResultTableDataWrangler'
import ClipLoader from 'react-spinners/ClipLoader'
import SearchOverallEmoResultTable from '../components/molecules/SearchOverallEmoResultTable'
import EmoEngagementStringFormatter from './search_helper_functions/EmoEngagementStringFormatter'
import EmoSearchBasicResultCard from '../components/molecules/EmoSearchBasicResultCard'
import { connect } from 'react-redux'
import EmoSearchOverallResultCard from '../components/molecules/EmoSearchOverallResultCard'
import { setAnonSession } from '../store/Slices/AnonSessionSlice'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import GenerateRandomString from '../utils/GenerateRandomString'
import { setCreditData, clearCreditDataSimple } from '../store/Slices/CreditSlice'
import { setSearchTimeoutState } from '../store/Slices/SearchTimeoutSlice'

function Link (props) {
  return <Text {...props} accessibilityRole="link" style={StyleSheet.compose(styles.link, props.style)} />
}

class EmotionalSearchPage extends Component {
  constructor (props) {
    super(props)

    /*
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
        zipCode: newAnonSessionId
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
        } else {
          this.forceUpdate()
        }
      }
      )
    } else {
      const newAnonSessionId = this.props.anonSession.anonSession
      usernameToUse = newAnonSessionId.payload
    } */

    const newAnonSessionId = this.props.anonSession.anonSession
    const usernameToUse = newAnonSessionId.payload

    this.state = {
      searchInput: '',
      dateInput: this.props.defaultDate,
      minDate: this.props.minDate,
      searchOverallEmoResultTableData: [],
      searchArticlesResultTableData: [],
      noResultsToReturn: false,
      noPreviousResults: true,
      searchingInitiated: false,
      anyResponseFromServer: false,
      startDateString: '',
      endDateString: '',
      usernameToUse,
      attemptAddCredits: false
    }

    const query = new URLSearchParams(window.location.search)

    if (query.get('success')) {
      console.log('Added 1 dollar')
      if (this.props.creditData.creditData !== undefined && this.props.creditData.creditData !== null) {
        this.props.setCreditData(1)
      } else {
        this.props.setCreditData(1)
      }
      query.delete('success')
      window.location.replace(window.location.origin + '/' + query.toString())
    }

    if (query.get('canceled')) {
      console.log('Didnt manage to add 1 dollar')
    }

    api.post(checkStillSearching, {
      username: usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Still searching')

        const oneSecond = 1000

        console.log(this.props.searchTimeoutState.searchTimeoutState.payload)

        clearTimeout(this.props.searchTimeoutState.searchTimeoutState.payload)

        const currentTimeout = setTimeout(
          () => {
            console.log('Triggered timeout recovery')
            api.post(getPreviousSearchResult, {
              username: usernameToUse
            }, {
              withCredentials: true
            }
            ).then(response => {
              if (response.data.operation_success) {
                console.log('Retrieved previous search returned something!')
                this.setState({ searchInput: response.data.responsePayload.previous_search_result.search_input })
                this.setState({ startDateString: this.date2String(response.data.responsePayload.previous_search_result.search_start_date) })
                this.setState({ endDateString: this.date2String(response.data.responsePayload.previous_search_result.search_end_date) })
                this.setState({ noPreviousResults: false })
                this.populateOverallEmoResultTable(response.data.responsePayload.previous_search_result)
                this.populateArticlesResultTable(response.data.responsePayload.previous_search_result)
              } else {
                console.log('Search failed for an internal reason')
                this.setState({ noResultsToReturn: true })
                this.setState({ searchingInitiated: false })
                this.setState({ noPreviousResults: true })
              }
            }
            ).catch(error => {
              console.log('No previous search results')
              this.setState({ noResultsToReturn: true })
              this.setState({ searchingInitiated: false })
              this.setState({ noPreviousResults: true })
            })
          }, oneSecond * 60)

        this.props.setSearchTimeoutState(currentTimeout)

        this.setState({ searchingInitiated: true })
      } else {
        console.log('No searches ongoing')

        api.post(getPreviousSearchResult, {
          username: usernameToUse
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            console.log('Retrieved previous search returned something!')
            this.setState({ searchInput: response.data.responsePayload.previous_search_result.search_input })
            this.setState({ startDateString: this.date2String(response.data.responsePayload.previous_search_result.search_start_date) })
            this.setState({ endDateString: this.date2String(response.data.responsePayload.previous_search_result.search_end_date) })
            this.setState({ noPreviousResults: false })
            this.populateOverallEmoResultTable(response.data.responsePayload.previous_search_result)
            this.populateArticlesResultTable(response.data.responsePayload.previous_search_result)
          } else {
            console.log('No previous search results')
            this.setState({ noPreviousResults: true })
          }
        }
        ).catch(error => {
          console.log('No previous search results')
          this.setState({ noPreviousResults: true })
        })
      }
    }
    ).catch(error => {
      console.log('Check search in progress failed')
      this.setState({ noPreviousResults: true })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      console.log('No anon session set')
      return
    }

    if (this.props.creditData.creditData === undefined) {
      console.log('Not enough credits')
      return
    } else {
      if (this.props.creditData.creditData - 0.2 < 0) {
        console.log('Not enough credits')
        return
      }
    }

    this.props.clearCreditDataSimple(this.props.creditData.creditData.payload - 0.2)

    this.setState({ searchingInitiated: true })
    this.setState({ noResultsToReturn: false })

    const oneSecond = 1000

    api.post(searchUrl, {
      searchInput: this.state.searchInput,
      dateInput: this.state.dateInput,
      username: this.state.usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
      this.setState({ anyResponseFromServer: true })

      if (response.data !== 'Error') {
        console.log('Search returned something!')
        this.setState({ searchingInitiated: false })
        this.setState({ noPreviousResults: false })
        this.populateOverallEmoResultTable(response.data)
        this.populateArticlesResultTable(response.data)
        clearTimeout(this.props.searchTimeoutState.searchTimeoutState.payload)
        this.forceUpdate()
      } else {
        this.setState({ noResultsToReturn: true })
        this.setState({ searchingInitiated: false })
        this.forceUpdate()
      }
    }
    ).catch(error => {
      // Also add 'ERR_EMPTY_RESPONSE'
      if (error.code === 'ERR_BAD_RESPONSE') {
      }
      console.log(this.props.searchTimeoutState.searchTimeoutState.payload)

      clearTimeout(this.props.searchTimeoutState.searchTimeoutState.payload)

      const currentTimeout = setTimeout(
        () => {
          console.log('Triggered timeout recovery')
          api.post(getPreviousSearchResult, {
            username: this.state.usernameToUse
          }, {
            withCredentials: true
          }
          ).then(response => {
            if (response.data.operation_success) {
              console.log('Retrieved previous search returned something!')
              this.setState({ searchInput: response.data.responsePayload.previous_search_result.search_input })
              this.setState({ startDateString: this.date2String(response.data.responsePayload.previous_search_result.search_start_date) })
              this.setState({ endDateString: this.date2String(response.data.responsePayload.previous_search_result.search_end_date) })
              this.setState({ noPreviousResults: false })
              this.populateOverallEmoResultTable(response.data.responsePayload.previous_search_result)
              this.populateArticlesResultTable(response.data.responsePayload.previous_search_result)
            } else {
              console.log('Search failed for an internal reason')
              this.setState({ noResultsToReturn: true })
              this.setState({ searchingInitiated: false })
              this.setState({ noPreviousResults: true })
            }
          }
          ).catch(error => {
            console.log('No previous search results')
            this.setState({ noResultsToReturn: true })
            this.setState({ searchingInitiated: false })
            this.setState({ noPreviousResults: true })
          })
        }, oneSecond * 60)

        this.props.setSearchTimeoutState(currentTimeout)
    })
  }

  onChange (event) {
    const selectedDate = new Date(event.target.value)
    this.setState({ dateInput: DateFormatter(selectedDate) })
  }

  populateOverallEmoResultTable (data) {
    const searchOverallEmoResultTableData = []

    const overallEmoResultDict = {
      overall_emo: 'Overall Emotional Engagement with Search Topic Over All Articles Found!',
      emotional_engagement: EmoEngagementStringFormatter(data.average_emo_breakdown)
    }

    searchOverallEmoResultTableData.push(overallEmoResultDict)

    this.setState({ searchOverallEmoResultTableData })
    this.setState({ searchingInitiated: false })
  }

  populateArticlesResultTable (data) {
    const searchArticlesResultTableData = []

    const articlesResultsDict = ArticlesResultTableDataWrangler(data)

    searchArticlesResultTableData.push(
      articlesResultsDict.Happiest,
      articlesResultsDict.Angriest,
      articlesResultsDict.Disgusted,
      articlesResultsDict.Fearful,
      articlesResultsDict.Neutral,
      articlesResultsDict.Sadest,
      articlesResultsDict.Surprised
    )

    this.setState({ searchArticlesResultTableData })
  }

  date2String (dateArray) {
    let dateString = ''

    dateString = dateString + dateArray[1] + '/'
    dateString = dateString + dateArray[2] + '/'
    dateString = dateString + dateArray[0]

    return dateString
  }

  addCredits () {
    this.setState({ attemptAddCredits: true })

    api.post(createCheckout, {
      empty: ''
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        window.location.replace(response.data.responsePayload.checkout_url)
      }
    }
    )
  }

  render () {
    return (
      <View style={styles.subcontainer}>
          <Text style={styles.text}>Credit only valid for your session. Please spend within 2 hours and do not clear browser cookies.</Text>
          <Text style={styles.text}>For support, please email antoine.tian@emomachines.xyz</Text>
        <View style={styles.innerContainer}>
          <View class="form-group form-row">
            <View class="col-10">
              <br></br>
              <br></br>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                value={this.state.searchInput}
                onChangeText={text => this.setState({ searchInput: text })}
                placeholder={'Try searching \'ChatGPT\'... (result might take a few minutes)'}
                style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
              />
              <br></br>
              <CappedDatePicker minDate={this.state.minDate} onChange={this.onChange.bind(this)} />
              {!this.state.searchingInitiated &&
                <TouchableOpacity style={styles.searchBtn} onPress={this.handleSubmit}>
                  <Text style={styles.text}>SEARCH $0.20</Text>
                </TouchableOpacity>
              }
              {!this.state.searchingInitiated && this.props.creditData !== undefined &&
                <Text style={styles.text}>Credits: ${this.props.creditData.creditData === undefined? 0 : this.props.creditData.creditData}</Text>
              }
              {!this.state.searchingInitiated &&
              <View>
                <TouchableOpacity style={styles.searchBtn} onPress={this.addCredits.bind(this)}>
                  <Text style={styles.text}>Add $1 Credit</Text>
                </TouchableOpacity>
              </View>
              }
            </View>
          </View>
          <br></br>
          {this.state.searchingInitiated &&
            <View>
              <br></br>
              <br></br>
              <Text style={styles.text}>
                Please Come Back in a Minute or Two...
              </Text>
              <Text style={styles.text}>
                Don't reissue the same query. If the page is blank within 5 min, we might still be searching!
              </Text>
              <br></br>
              <br></br>
              <View style={{ alignItems: 'center' }}>
                <ClipLoader
                  color={'#e75fa6'}
                  size={200}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </View>
            </View>
          }

          {!this.state.searchingInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults &&
            <Text style={styles.text}>
              From {this.state.startDateString} To {this.state.endDateString}
            </Text>
          }
          <br></br>
          {this.state.noResultsToReturn && !this.state.searchingInitiated &&
            <Text style={styles.text}>
              Not enough results found! Maybe the date is too recent...
            </Text>
          }
          {!this.state.searchingInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults &&
          <View>
            <EmoSearchOverallResultCard resultData={this.state.searchOverallEmoResultTableData} />
            <EmoSearchBasicResultCard
              emoIcon={'😃'}
              articleData={this.state.searchArticlesResultTableData[0]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😡'}
              articleData={this.state.searchArticlesResultTableData[1]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'🤢'}
              articleData={this.state.searchArticlesResultTableData[2]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😱'}
              articleData={this.state.searchArticlesResultTableData[3]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😐'}
              articleData={this.state.searchArticlesResultTableData[4]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😢'}
              articleData={this.state.searchArticlesResultTableData[5]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😯'}
              articleData={this.state.searchArticlesResultTableData[6]}
            />
          </View>
          }
        </View>
      </View>
    )
  }
}

const relevantDate = new Date()
relevantDate.setDate(relevantDate.getDate() - 1)
const yesterday = DateFormatter(relevantDate)

EmotionalSearchPage.propTypes = {
  minDate: PropTypes.string,
  defaultDate: PropTypes.string
}

EmotionalSearchPage.defaultProps = {
  minDate: '2006-01-01',
  defaultDate: yesterday
}

const mapStateToProps = state => {
  return {
    accountData: state.accountData,
    anonSession: state.anonSession,
    creditData: state.creditData,
    searchTimeoutState: state.searchTimeoutState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAnonSession: (value) => dispatch(setAnonSession(value)),
    setCreditData: (value) => dispatch(setCreditData(value)),
    clearCreditDataSimple: (value) => dispatch(clearCreditDataSimple(value)),
    setSearchTimeoutState: (value) => dispatch(setSearchTimeoutState(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmotionalSearchPage)
