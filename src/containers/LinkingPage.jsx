import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
import { api, linkingTopics, getPreviousLinking } from '../utils/backend_configuration/BackendConfig'
import { connect } from 'react-redux'
import DateFormatter from '../utils/DateFormatter'
import ClipLoader from 'react-spinners/ClipLoader'
import EmoEngagementStringFormatter from './search_helper_functions/EmoEngagementStringFormatter'
import EmoLinkingCard from '../components/molecules/EmoLinkingCard'

class LinkingPage extends Component {
  constructor (props) {
    super(props)

    const relevantDate = new Date()

    relevantDate.setDate(relevantDate.getDate() - 1)

    const searchEndDate = relevantDate

    const yesterday = DateFormatter(relevantDate)

    const searchStartDate = searchEndDate.setDate(searchEndDate.getDate() - 1)

    this.state = {
      linkingInput1: '',
      linkingInput2: '',
      dateInput: yesterday,
      dateInputInDateType: searchEndDate,
      startDateInputInDateType: searchStartDate,
      linkingInput1Empty: false,
      linkingInput2Empty: false,
      linkingInitiated: false,
      noResultsToShow: true,
      noResultsToReturn: false,
      linkingFailed: false,
      linkOverallEmoResultTableData: '',
      latentLinks: []
    }

    api.post(getPreviousLinking, {
      username: this.props.accountData.accountData.payload.emailAddress
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Retrieved previous linking result')

        this.setState({ linkOverallEmoResultTableData: EmoEngagementStringFormatter(response.data.responsePayload.linking_result.emo_breakdown_average) })
        this.setState({ latentLinks: response.data.responsePayload.linking_result.topic_linking_results })
        this.setState({ linkingInput1: response.data.responsePayload.linking_result.linkingInput1 })
        this.setState({ linkingInput2: response.data.responsePayload.linking_result.linkingInput2 })
        this.setState({ noResultsToShow: false })
      } else {
        console.log('Failed to retrieve previous linking result')

        this.setState({ noResultsToShow: true })
      }
    }
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    let validLinking = true

    const oneSecond = 1000

    if (this.state.linkingInput1 === '') {
      this.setState({ linkingInput1Empty: true })
      validLinking = false
    } else {
      this.setState({ linkingInput1Empty: false })
    }

    if (this.state.linkingInput2 === '') {
      this.setState({ linkingInput2Empty: true })
      validLinking = false
    } else {
      this.setState({ linkingInput2Empty: false })
    }

    if (validLinking) {
      console.log('Attempting linking')

      this.setState({ linkingInitiated: true })
      this.setState({ noResultsToShow: false })
      this.setState({ linkingFailed: false })

      api.post(linkingTopics, {
        linkingInput1: this.state.linkingInput1,
        linkingInput2: this.state.linkingInput2,
        dateInput: this.state.dateInput,
        username: this.props.accountData.accountData.payload.emailAddress
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Linking succeeded')

          this.setState({ linkingInitiated: false })
          this.setState({ noResultsToShow: false })
          this.setState({ linkingFailed: false })
          this.setState({ noResultsToReturn: false })
        } else {
          console.log('Linking failed')

          this.setState({ linkingInitiated: false })
          this.setState({ noResultsToShow: true })
          this.setState({ linkingFailed: true })
          this.setState({ noResultsToReturn: true })
        }
      }
      ).catch(error => {
        if (error.code === 'ERR_BAD_RESPONSE') {
        }
        setTimeout(
          () => {
            console.log('Triggered timeout recovery')
            api.post(getPreviousLinking, {
              username: this.props.accountData.accountData.payload.emailAddress
            }, {
              withCredentials: true
            }
            ).then(response => {
              if (response.data.operation_success) {
                console.log('Retrieved previous linking result')

                this.setState({ linkOverallEmoResultTableData: EmoEngagementStringFormatter(response.data.responsePayload.linking_result.emo_breakdown_average) })
                this.setState({ latentLinks: response.data.responsePayload.linking_result.topic_linking_results })
                this.setState({ linkingInput1: response.data.responsePayload.linking_result.linkingInput1 })
                this.setState({ linkingInput2: response.data.responsePayload.linking_result.linkingInput2 })
                this.setState({ noResultsToShow: false })
                this.setState({ linkingInitiated: false })
                this.setState({ linkingFailed: false })
                this.setState({ noResultsToReturn: true })
              } else {
                console.log('Linking failed')

                this.setState({ linkingInitiated: false })
                this.setState({ noResultsToShow: true })
                this.setState({ linkingFailed: true })
                this.setState({ noResultsToReturn: false })
              }
            }
            ).catch(error => {
              console.log('Linking failed')

              this.setState({ linkingInitiated: false })
              this.setState({ noResultsToShow: true })
              this.setState({ linkingFailed: true })
              this.setState({ noResultsToReturn: false })
            })
          }, oneSecond * 60 * 15)
      })
    }
  }

  render () {
    return (
        <View style={styles.innerContainer}>
            <View class="form-group form-row">
                <View class="col-10">
                    <br></br>
                    <br></br>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={20}
                        value={this.state.linkingInput1}
                        onChangeText={text => this.setState({ linkingInput1: text })}
                        placeholder={'Try linking \'ChatGPT\'... (linking might take a few hours)'}
                        style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
                    />
                    {this.state.linkingInput1Empty &&
                    <View>
                        <Text style={styles.errorText}>
                        Please add a first topic to link.
                        </Text>
                        <br></br>
                    </View>
                    }
                    <br></br>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={20}
                        value={this.state.linkingInput2}
                        onChangeText={text => this.setState({ linkingInput2: text })}
                        placeholder={'Try linking \'Sam Altman\'... (linking might take a few hours)'}
                        style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
                    />
                    {this.state.linkingInput2Empty &&
                    <View>
                        <Text style={styles.errorText}>
                        Please add a second topic to link.
                        </Text>
                        <br></br>
                    </View>
                    }
                </View>
            </View>
            <View style={styles.innerContainer}>
                  <br></br>
                  {!this.state.linkingInitiated &&
                      <TouchableOpacity style={styles.searchBtn} onPress={this.handleSubmit}>
                          <Text style={styles.text}>LINK</Text>
                      </TouchableOpacity>
                  }
                  <br></br>
                  {!this.state.linkingInitiated && !this.state.noResultsToShow &&
                    <View>
                      <br></br>
                      <Text style={styles.titleText2}>
                          Emotional & Semantic Links
                      </Text>
                      <br></br>
                    </View>
                  }
            </View>
            {this.state.linkingInitiated &&
            <View>
                <View>
                    <br></br>
                    <br></br>
                    <Text style={styles.text}>
                        Still linking... Please come back in half an hour and !REFRESH! the page.
                    </Text>
                    <Text style={styles.text}>
                        Don't reissue the same query. If the page is blank within 30 min, we might still be searching!
                    </Text>
                    <br></br>
                    <br></br>
                </View>
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
            {!this.state.noResultsToShow && !this.state.linkingInitiated &&
              <Text style={styles.text}>
                From {new Date(this.state.startDateInputInDateType).toLocaleDateString('en-US')} To {new Date(this.state.dateInputInDateType).toLocaleDateString('en-US')}
              </Text>
            }
            <br></br>
            {!this.state.noResultsToShow && !this.state.linkingInitiated &&
            <View>
                <EmoLinkingCard
                  linkOverallEmoResultTableData={this.state.linkOverallEmoResultTableData}
                  latentLinks={this.state.latentLinks}
                />
            </View>
            }
            <br></br>
            {this.state.noResultsToReturn && !this.state.linkingInitiated && this.state.noResultsToShow &&
              <Text style={styles.text}>
                Not enough results found! Maybe the date is too recent...
              </Text>
            }
        </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    accountData: state.accountData
  }
}

export default connect(mapStateToProps)(LinkingPage)
