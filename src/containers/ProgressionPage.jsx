import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
import { api, progressionCharting, getPreviousCharting, createCheckout, checkStillCharting } from '../utils/backend_configuration/BackendConfig'
import EmoProgressionCard from '../components/molecules/EmoProgressionCard'
import { connect } from 'react-redux'
import DateFormatter from '../utils/DateFormatter'
import ClipLoader from 'react-spinners/ClipLoader'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import { clearCreditDataLarge } from '../store/Slices/CreditSlice'
import { setProgressionTimeoutState } from '../store/Slices/ProgressionTimeoutSlice'
import ProcessCredits from '../utils/ProcessCredits'
import { testingLocally } from '../utils/front_end_configuration/FrontendConfig'
import { setCreditData } from '../store/Slices/CreditSlice'

class ProgressionPage extends Component {
  constructor (props) {
    super(props)

    const relevantDate = new Date()

    relevantDate.setDate(relevantDate.getDate() - 1)
    const yesterday = DateFormatter(relevantDate)

    const newAnonSessionId = this.props.anonSession.anonSession
    const usernameToUse = newAnonSessionId.payload

    this.state = {
      searchInput: '',
      angerProgressionData: [],
      disgustProgressionData: [],
      fearProgressionData: [],
      joyProgressionData: [],
      neutralProgressionData: [],
      sadnessProgressionData: [],
      surpriseProgressionData: [],
      angerProgressionKeywords: [],
      disgustProgressionKeywords: [],
      fearProgressionKeywords: [],
      joyProgressionKeywords: [],
      neutralProgressionKeywords: [],
      sadnessProgressionKeywords: [],
      surpriseProgressionKeywords: [],
      progressionDates: [],
      dateInput: yesterday,
      nothingToShow: true,
      chartingInitiated: false,
      chartingFailed: false,
      attemptAddCredits: false,
      usernameToUse
    }

    this.populateChartingData.bind(this)

    // const usernameToUse = 'antoine186@hotmail.com'
    if (!CheckEmptyObject(this.props.anonSession.anonSession)) {
      const query = new URLSearchParams(window.location.search)

      if (query.get('success')) {
        console.log('Added 1 dollar')
        if (this.props.creditData.creditData.payload !== undefined) {
          this.props.setCreditData(this.props.creditData.creditData.payload + 1)
        } else {
          this.props.setCreditData(1)
        }
        query.delete('success')
        window.location.replace(window.location.origin + '/' + query.toString())
      }

      if (query.get('canceled')) {
        console.log('Didnt manage to add 1 dollar')
      }

      const oneSecond = 1000

      api.post(checkStillCharting, {
        username: usernameToUse
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Found currently ongoing charting')

          this.setState({ chartingInitiated: true })
          this.setState({ chartingFailed: false })
          this.setState({ nothingToShow: true })

          console.log(this.props.progressionTimeoutState.progressionTimeoutState.payload)

          clearTimeout(this.props.progressionTimeoutState.progressionTimeoutState.payload)

          const currentTimeout = setTimeout(
            () => {
              console.log('Triggered timeout recovery')

              api.post(getPreviousCharting, {
                username: usernameToUse
              }, {
                withCredentials: true
              }
              ).then(response => {
                if (response.data.operation_success) {
                  console.log('Retrieved previous charting')
                  this.setState({ nothingToShow: false })
                  this.populateChartingData(response.data.responsePayload.previous_chart_result)
                  this.setState({ searchInput: response.data.responsePayload.previous_chart_result.emo_breakdown_result_metadata_1.search_input })

                  this.setState({ chartingInitiated: false })
                  this.setState({ chartingFailed: false })
                  this.setState({ nothingToShow: false })
                } else {
                  console.log('Retrieving previous charting failed')

                  this.setState({ chartingInitiated: false })
                  this.setState({ chartingFailed: true })
                  this.setState({ nothingToShow: true })
                }
              }
              )
            }, oneSecond * 60 * 15)

            this.props.setProgressionTimeoutState(currentTimeout)
        } else {
          console.log('No charting currently ongoing')

          api.post(getPreviousCharting, {
            username: usernameToUse
          }, {
            withCredentials: true
          }
          ).then(response => {
            if (response.data.operation_success) {
              console.log('Retrieved previous charting')
              this.setState({ nothingToShow: false })
              this.populateChartingData(response.data.responsePayload.previous_chart_result)
              this.setState({ searchInput: response.data.responsePayload.previous_chart_result.emo_breakdown_result_metadata_1.search_input })
            } else {
              console.log('Retrieving previous charting failed')
              this.setState({ nothingToShow: true })
            }
          }
          )
        }
      }
      )
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.anonSession !== this.props.anonSession) {
      const newAnonSessionId = this.props.anonSession.anonSession
      const usernameToUse = newAnonSessionId.payload
      this.setState({ usernameToUse })
    }
  }

  populateChartingData (data) {
    let newAngerProgressionData = []
    newAngerProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.anger_percentage)
    newAngerProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.anger_percentage)
    newAngerProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.anger_percentage)
    newAngerProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.anger_percentage)
    newAngerProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.anger_percentage)
    newAngerProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.anger_percentage)
    newAngerProgressionData = newAngerProgressionData.reverse()
    let newAngerProgressionKeywords = []
    newAngerProgressionKeywords.push(data.emo_breakdown_result_metadata_1.most_angry_article.extracted_keywords)
    newAngerProgressionKeywords.push(data.emo_breakdown_result_metadata_2.most_angry_article.extracted_keywords)
    newAngerProgressionKeywords.push(data.emo_breakdown_result_metadata_3.most_angry_article.extracted_keywords)
    newAngerProgressionKeywords.push(data.emo_breakdown_result_metadata_4.most_angry_article.extracted_keywords)
    newAngerProgressionKeywords.push(data.emo_breakdown_result_metadata_5.most_angry_article.extracted_keywords)
    newAngerProgressionKeywords.push(data.emo_breakdown_result_metadata_6.most_angry_article.extracted_keywords)
    newAngerProgressionKeywords = newAngerProgressionKeywords.reverse()

    let newDisgustProgressionData = []
    newDisgustProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.disgust_percentage)
    newDisgustProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.disgust_percentage)
    newDisgustProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.disgust_percentage)
    newDisgustProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.disgust_percentage)
    newDisgustProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.disgust_percentage)
    newDisgustProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.disgust_percentage)
    newDisgustProgressionData = newDisgustProgressionData.reverse()
    let newDisgustProgressionKeywords = []
    newDisgustProgressionKeywords.push(data.emo_breakdown_result_metadata_1.most_disgusted_article.extracted_keywords)
    newDisgustProgressionKeywords.push(data.emo_breakdown_result_metadata_2.most_disgusted_article.extracted_keywords)
    newDisgustProgressionKeywords.push(data.emo_breakdown_result_metadata_3.most_disgusted_article.extracted_keywords)
    newDisgustProgressionKeywords.push(data.emo_breakdown_result_metadata_4.most_disgusted_article.extracted_keywords)
    newDisgustProgressionKeywords.push(data.emo_breakdown_result_metadata_5.most_disgusted_article.extracted_keywords)
    newDisgustProgressionKeywords.push(data.emo_breakdown_result_metadata_6.most_disgusted_article.extracted_keywords)
    newDisgustProgressionKeywords = newDisgustProgressionKeywords.reverse()

    let newFearProgressionData = []
    newFearProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.fear_percentage)
    newFearProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.fear_percentage)
    newFearProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.fear_percentage)
    newFearProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.fear_percentage)
    newFearProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.fear_percentage)
    newFearProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.fear_percentage)
    newFearProgressionData = newFearProgressionData.reverse()
    let newFearProgressionKeywords = []
    newFearProgressionKeywords.push(data.emo_breakdown_result_metadata_1.most_fearful_article.extracted_keywords)
    newFearProgressionKeywords.push(data.emo_breakdown_result_metadata_2.most_fearful_article.extracted_keywords)
    newFearProgressionKeywords.push(data.emo_breakdown_result_metadata_3.most_fearful_article.extracted_keywords)
    newFearProgressionKeywords.push(data.emo_breakdown_result_metadata_4.most_fearful_article.extracted_keywords)
    newFearProgressionKeywords.push(data.emo_breakdown_result_metadata_5.most_fearful_article.extracted_keywords)
    newFearProgressionKeywords.push(data.emo_breakdown_result_metadata_6.most_fearful_article.extracted_keywords)
    newFearProgressionKeywords = newFearProgressionKeywords.reverse()

    let newJoyProgressionData = []
    newJoyProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.joy_percentage)
    newJoyProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.joy_percentage)
    newJoyProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.joy_percentage)
    newJoyProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.joy_percentage)
    newJoyProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.joy_percentage)
    newJoyProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.joy_percentage)
    newJoyProgressionData = newJoyProgressionData.reverse()
    let newJoyProgressionKeywords = []
    newJoyProgressionKeywords.push(data.emo_breakdown_result_metadata_1.happiest_article.extracted_keywords)
    newJoyProgressionKeywords.push(data.emo_breakdown_result_metadata_2.happiest_article.extracted_keywords)
    newJoyProgressionKeywords.push(data.emo_breakdown_result_metadata_3.happiest_article.extracted_keywords)
    newJoyProgressionKeywords.push(data.emo_breakdown_result_metadata_4.happiest_article.extracted_keywords)
    newJoyProgressionKeywords.push(data.emo_breakdown_result_metadata_5.happiest_article.extracted_keywords)
    newJoyProgressionKeywords.push(data.emo_breakdown_result_metadata_6.happiest_article.extracted_keywords)
    newJoyProgressionKeywords = newJoyProgressionKeywords.reverse()

    let newNeutralProgressionData = []
    newNeutralProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.neutral_percentage)
    newNeutralProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.neutral_percentage)
    newNeutralProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.neutral_percentage)
    newNeutralProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.neutral_percentage)
    newNeutralProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.neutral_percentage)
    newNeutralProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.neutral_percentage)
    newNeutralProgressionData = newNeutralProgressionData.reverse()
    let newNeutralProgressionKeywords = []
    newNeutralProgressionKeywords.push(data.emo_breakdown_result_metadata_1.most_neutral_article.extracted_keywords)
    newNeutralProgressionKeywords.push(data.emo_breakdown_result_metadata_2.most_neutral_article.extracted_keywords)
    newNeutralProgressionKeywords.push(data.emo_breakdown_result_metadata_3.most_neutral_article.extracted_keywords)
    newNeutralProgressionKeywords.push(data.emo_breakdown_result_metadata_4.most_neutral_article.extracted_keywords)
    newNeutralProgressionKeywords.push(data.emo_breakdown_result_metadata_5.most_neutral_article.extracted_keywords)
    newNeutralProgressionKeywords.push(data.emo_breakdown_result_metadata_6.most_neutral_article.extracted_keywords)
    newNeutralProgressionKeywords = newNeutralProgressionKeywords.reverse()

    let newSadnessProgressionData = []
    newSadnessProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.sadness_percentage)
    newSadnessProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.sadness_percentage)
    newSadnessProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.sadness_percentage)
    newSadnessProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.sadness_percentage)
    newSadnessProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.sadness_percentage)
    newSadnessProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.sadness_percentage)
    newSadnessProgressionData = newSadnessProgressionData.reverse()
    let newSadnessProgressionKeywords = []
    newSadnessProgressionKeywords.push(data.emo_breakdown_result_metadata_1.sadest_article.extracted_keywords)
    newSadnessProgressionKeywords.push(data.emo_breakdown_result_metadata_2.sadest_article.extracted_keywords)
    newSadnessProgressionKeywords.push(data.emo_breakdown_result_metadata_3.sadest_article.extracted_keywords)
    newSadnessProgressionKeywords.push(data.emo_breakdown_result_metadata_4.sadest_article.extracted_keywords)
    newSadnessProgressionKeywords.push(data.emo_breakdown_result_metadata_5.sadest_article.extracted_keywords)
    newSadnessProgressionKeywords.push(data.emo_breakdown_result_metadata_6.sadest_article.extracted_keywords)
    newSadnessProgressionKeywords = newSadnessProgressionKeywords.reverse()

    let newSurpriseProgressionData = []
    newSurpriseProgressionData.push(data.emo_breakdown_result_metadata_1.average_emo_breakdown.surprise_percentage)
    newSurpriseProgressionData.push(data.emo_breakdown_result_metadata_2.average_emo_breakdown.surprise_percentage)
    newSurpriseProgressionData.push(data.emo_breakdown_result_metadata_3.average_emo_breakdown.surprise_percentage)
    newSurpriseProgressionData.push(data.emo_breakdown_result_metadata_4.average_emo_breakdown.surprise_percentage)
    newSurpriseProgressionData.push(data.emo_breakdown_result_metadata_5.average_emo_breakdown.surprise_percentage)
    newSurpriseProgressionData.push(data.emo_breakdown_result_metadata_6.average_emo_breakdown.surprise_percentage)
    newSurpriseProgressionData = newSurpriseProgressionData.reverse()
    let newSurpriseProgressionKeywords = []
    newSurpriseProgressionKeywords.push(data.emo_breakdown_result_metadata_1.most_surprised_article.extracted_keywords)
    newSurpriseProgressionKeywords.push(data.emo_breakdown_result_metadata_2.most_surprised_article.extracted_keywords)
    newSurpriseProgressionKeywords.push(data.emo_breakdown_result_metadata_3.most_surprised_article.extracted_keywords)
    newSurpriseProgressionKeywords.push(data.emo_breakdown_result_metadata_4.most_surprised_article.extracted_keywords)
    newSurpriseProgressionKeywords.push(data.emo_breakdown_result_metadata_5.most_surprised_article.extracted_keywords)
    newSurpriseProgressionKeywords.push(data.emo_breakdown_result_metadata_6.most_surprised_article.extracted_keywords)
    newSurpriseProgressionKeywords = newSurpriseProgressionKeywords.reverse()

    let newProgressionDates = []
    newProgressionDates.push({ month: data.emo_breakdown_result_metadata_1.emo_month, year: data.emo_breakdown_result_metadata_1.emo_year })
    newProgressionDates.push({ month: data.emo_breakdown_result_metadata_2.emo_month, year: data.emo_breakdown_result_metadata_2.emo_year })
    newProgressionDates.push({ month: data.emo_breakdown_result_metadata_3.emo_month, year: data.emo_breakdown_result_metadata_3.emo_year })
    newProgressionDates.push({ month: data.emo_breakdown_result_metadata_4.emo_month, year: data.emo_breakdown_result_metadata_4.emo_year })
    newProgressionDates.push({ month: data.emo_breakdown_result_metadata_5.emo_month, year: data.emo_breakdown_result_metadata_5.emo_year })
    newProgressionDates.push({ month: data.emo_breakdown_result_metadata_6.emo_month, year: data.emo_breakdown_result_metadata_6.emo_year })
    newProgressionDates = newProgressionDates.reverse()

    this.setState({ angerProgressionData: newAngerProgressionData })
    this.setState({ disgustProgressionData: newDisgustProgressionData })
    this.setState({ fearProgressionData: newFearProgressionData })
    this.setState({ joyProgressionData: newJoyProgressionData })
    this.setState({ neutralProgressionData: newNeutralProgressionData })
    this.setState({ sadnessProgressionData: newSadnessProgressionData })
    this.setState({ surpriseProgressionData: newSurpriseProgressionData })

    this.setState({ angerProgressionKeywords: newAngerProgressionKeywords })
    this.setState({ disgustProgressionKeywords: newDisgustProgressionKeywords })
    this.setState({ fearProgressionKeywords: newFearProgressionKeywords })
    this.setState({ joyProgressionKeywords: newJoyProgressionKeywords })
    this.setState({ neutralProgressionKeywords: newNeutralProgressionKeywords })
    this.setState({ sadnessProgressionKeywords: newSadnessProgressionKeywords })
    this.setState({ surpriseProgressionKeywords: newSurpriseProgressionKeywords })

    this.setState({ progressionDates: newProgressionDates })
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

  handleSubmit = (e) => {
    e.preventDefault()

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      console.log('No anon session set')
      return
    }

    if (!testingLocally) {
      if (this.props.creditData.creditData === undefined) {
        console.log('Not enough credits')
        return
      } else {
        if (this.props.creditData.creditData - 0.2 < 0) {
          console.log('Not enough credits')
          return
        }
      }
    }

    this.props.clearCreditDataLarge(this.props.creditData.creditData.payload - 0.2)

    this.setState({ chartingInitiated: true })
    this.setState({ chartingFailed: false })
    this.setState({ nothingToShow: true })

    const oneSecond = 1000

    api.post(progressionCharting, {
      searchInput: this.state.searchInput,
      dateInput: this.state.dateInput,
      username: this.state.usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Charting succeeded')
        const newProgressionData = []
        newProgressionData.push(response.data.responsePayload.emo_breakdown_result_metadata_dict.emo_breakdown_result_metadata_1)
        newProgressionData.push(response.data.responsePayload.emo_breakdown_result_metadata_dict.emo_breakdown_result_metadata_2)
        newProgressionData.push(response.data.responsePayload.emo_breakdown_result_metadata_dict.emo_breakdown_result_metadata_3)
        newProgressionData.push(response.data.responsePayload.emo_breakdown_result_metadata_dict.emo_breakdown_result_metadata_4)
        newProgressionData.push(response.data.responsePayload.emo_breakdown_result_metadata_dict.emo_breakdown_result_metadata_5)
        newProgressionData.push(response.data.responsePayload.emo_breakdown_result_metadata_dict.emo_breakdown_result_metadata_6)

        this.populateChartingData(response.data.responsePayload.emo_breakdown_result_metadata_dict)

        this.setState({ progressionData: newProgressionData })
        this.setState({ chartingInitiated: false })
        this.setState({ nothingToShow: false })
      } else {
        console.log('Charting failed')
        this.setState({ nothingToShow: true })
        this.setState({ chartingInitiated: false })
        this.setState({ chartingFailed: true })
      }
    }
    ).catch(error => {
      if (error.code === 'ERR_BAD_RESPONSE') {
      }
      console.log(this.props.progressionTimeoutState.progressionTimeoutState.payload)

      clearTimeout(this.props.progressionTimeoutState.progressionTimeoutState.payload)

      const currentTimeout = setTimeout(
        () => {
          console.log('Triggered timeout recovery')
          api.post(getPreviousCharting, {
            username: this.state.usernameToUse
          }, {
            withCredentials: true
          }
          ).then(response => {
            if (response.data.operation_success) {
              console.log('Retrieved previous charting')
              this.setState({ nothingToShow: false })
              this.setState({ chartingInitiated: false })
              this.populateChartingData(response.data.responsePayload.previous_chart_result)
              this.setState({ searchInput: response.data.responsePayload.previous_chart_result.emo_breakdown_result_metadata_1.search_input })
              this.forceUpdate()
            } else {
              console.log('Retrieving previous charting failed')
              this.setState({ nothingToShow: true })
              this.setState({ chartingInitiated: false })
              this.setState({ chartingFailed: true })
            }
          }
          ).catch(error => {
            console.log('Retrieving previous charting failed')
            this.setState({ nothingToShow: true })
            this.setState({ chartingInitiated: false })
            this.setState({ chartingFailed: true })
          })
        }, oneSecond * 60 * 15)

        this.props.setProgressionTimeoutState(currentTimeout)
    })
  }

  render () {
    return (
        <View style={styles.innerContainer}>
          <Text style={styles.text}>Credit only valid for your session. Please spend within 2 hours and do not clear browser cookies.</Text>
          <Text style={styles.text}>For support, please email antoine.tian@emomachines.xyz</Text>
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
                        placeholder={'Try charting \'ChatGPT\'... (charting might take a few hours)'}
                        style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
                    />
                    <br></br>
                    {!this.state.chartingInitiated &&
                        <TouchableOpacity style={styles.searchBtn} onPress={this.handleSubmit}>
                            <Text style={styles.text}>CHART $0.60</Text>
                        </TouchableOpacity>
                    }
                    {!this.state.searchingInitiated && this.props.creditData !== undefined &&
                      <Text style={styles.text}>Credits: ${this.props.creditData.creditData === undefined ? 0 : ProcessCredits(this.props.creditData.creditData)}</Text>
                    }
                    {!this.state.chartingInitiated &&
                    <View>
                      <TouchableOpacity style={styles.searchBtn} onPress={this.addCredits.bind(this)}>
                        <Text style={styles.text}>Add $1 Credit</Text>
                      </TouchableOpacity>
                    </View>
                    }
                </View>
            </View>
            <br></br>
            <br></br>
            <br></br>
            <View>
              <Text style={styles.text}>How To Chart Emotionality Over the Past 6 Months</Text>
            </View>
            <View>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/mttGtRwPPNk"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
            </View>
            <br></br>
            {!this.state.nothingToShow && !this.state.chartingInitiated &&
                <View style={styles.innerContainer}>
                    <br></br>
                    <Text style={styles.titleText2}>
                        Emotional Progression Charts
                    </Text>
                    <br></br>
                    <br></br>
                    <View>
                        <EmoProgressionCard
                            progressionDataLine={this.state.joyProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'😃'}
                            progressionKeyWords={this.state.joyProgressionKeywords}
                        />
                        <EmoProgressionCard
                            progressionDataLine={this.state.angerProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'😡'}
                            progressionKeyWords={this.state.angerProgressionKeywords}
                        />
                        <EmoProgressionCard
                            progressionDataLine={this.state.neutralProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'😐'}
                            progressionKeyWords={this.state.neutralProgressionKeywords}
                        />
                        <EmoProgressionCard
                            progressionDataLine={this.state.fearProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'😱'}
                            progressionKeyWords={this.state.fearProgressionKeywords}
                        />
                        <EmoProgressionCard
                            progressionDataLine={this.state.surpriseProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'😯'}
                            progressionKeyWords={this.state.surpriseProgressionKeywords}
                        />
                        <EmoProgressionCard
                            progressionDataLine={this.state.sadnessProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'😢'}
                            progressionKeyWords={this.state.sadnessProgressionKeywords}
                        />
                        <EmoProgressionCard
                            progressionDataLine={this.state.disgustProgressionData}
                            progressionDates={this.state.progressionDates}
                            progressionEmoIcon={'🤢'}
                            progressionKeyWords={this.state.disgustProgressionKeywords}
                        />
                        <br></br>
                    </View>
                </View>
            }
            {this.state.chartingInitiated && this.state.nothingToShow && !this.state.chartingFailed &&
            <View>
              <br></br>
              <br></br>
              <Text style={styles.text}>
                Still charting... Please come back in 10 minutes and !REFRESH! the page.
              </Text>
              <Text style={styles.text}>
                Don't reissue the same query. If the page is blank within 15 min, we might still be searching!
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
            {this.state.nothingToShow && !this.state.chartingInitiated && this.state.chartingFailed &&
            <Text style={styles.text}>
              Not enough results found!
            </Text>
          }
        </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    accountData: state.accountData,
    anonSession: state.anonSession,
    creditData: state.creditData,
    progressionTimeoutState: state.progressionTimeoutState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAnonSession: (value) => dispatch(setAnonSession(value)),
    setAccountData: (value) => dispatch(setAccountData(value)),
    setCreditData: (value) => dispatch(setCreditData(value)),
    clearCreditDataLarge: (value) => dispatch(clearCreditDataLarge(value)),
    setProgressionTimeoutState: (value) => dispatch(setProgressionTimeoutState(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressionPage)
