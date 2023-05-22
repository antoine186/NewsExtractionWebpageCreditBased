import React, { Component } from 'react'

import styles from '../../utils/style_guide/MainWebpageStyle'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import { api, taggingSearch, getPreviousTaggingResult } from '../../utils/backend_configuration/BackendConfig'
import TagSearchResult from '../atoms/TagSearchResult'
import { SpinnerRoundFilled } from 'spinners-react'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')
import EmoEngagementStringFormatter from '../../containers/search_helper_functions/EmoEngagementStringFormatter'
import ArticlesResultTableDataWrangler from '../../containers/search_helper_functions/ArticlesResultTableDataWrangler'
import { connect } from 'react-redux'
import EmoChangeStringFormatter from '../../containers/search_helper_functions/EmoChangeStringFormatter'
import Button from '@mui/material/Button'

class TagLine extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchInput: this.props.searchInput,
      searchDate: this.props.searchDate,
      dayBeforeSearchDate: this.props.dayBeforeSearchDate,
      accountData: this.props.accountData,
      showResults: false,
      existingTaggingInput: this.props.existingTaggingInput,
      searchOverallEmoResultTableData: '',
      searchArticlesResultTableData: '',
      removeTagFromList: this.props.removeTagFromList,
      stillTagging: false,
      setAlreadyTagging: this.props.setAlreadyTagging,
      alreadyTagging: this.props.alreadyTagging
    }

    this.getTaggingResults.bind(this)

    if (!this.props.alreadyTagging) {
      this.initiateSearch.bind(this)
    }

    this.getTaggingResults()
  }

  populateOverallEmoResultTable (data) {
    const searchOverallEmoResultTableData = []

    const overallEmoResultDict = {
      overall_emo: 'Overall Emotional Engagement with Search Topic Over All Articles Found!',
      emotional_engagement: EmoEngagementStringFormatter(data.average_emo_breakdown),
      emotional_engagement_percentage_change: EmoChangeStringFormatter(data.average_emo_breakdown, data.previous_average_emo_breakdown)
    }

    searchOverallEmoResultTableData.push(overallEmoResultDict)

    this.setState({ searchOverallEmoResultTableData })
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

  getTaggingResults () {
    this.state.setAlreadyTagging(this.state.searchInput)

    api.post(getPreviousTaggingResult, {
      username: 'antoine186@hotmail.com',
      searchInput: this.state.searchInput
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        if (response.data.responsePayload.previous_search_result === 'No results') {
          console.log('No tagging results')
          this.setState({ noResultsToReturn: true })
          this.setState({ stillTagging: false })
        } else {
          console.log('Tagging returned something!')
          this.populateOverallEmoResultTable(response.data.responsePayload.previous_search_result)
          this.populateArticlesResultTable(response.data.responsePayload.previous_search_result)
          this.setState({ noResultsToReturn: false })
          this.setState({ stillTagging: false })
        }
      } else {
        console.log('No pre-existing tag')
        console.log('Still tagging')
        this.setState({ stillTagging: true })

        if (!this.state.alreadyTagging) {
          this.initiateSearch()
        }
      }
    }
    )
  }

  initiateSearch () {
    api.post(taggingSearch, {
      username: 'antoine186@hotmail.com',
      searchInput: this.state.searchInput,
      searchDate: this.state.searchDate,
      dayBeforeSearchDate: this.state.dayBeforeSearchDate
    }, {
      withCredentials: true
    }
    )
  }

  deleteTag () {
    console.log('Attempting to delete tag line')
    this.state.removeTagFromList(this.state.searchInput)
  }

  midFlightResultsPeak () {
    if (!this.state.showResults && this.state.stillTagging) {
      this.getTaggingResults()
    }

    this.setState({ showResults: !this.state.showResults })
  }

  render () {
    return (
      <View style={styles.innerContainer}>
        <View style={styles.rowContainer}>
          <SpinnerRoundFilled
            style={{
              marginRight: 0.5 * vw,
              alignItems: 'center',
              display: 'flex',
              height: '100%'
            }}
            color="#B533FF"
          />
          <TouchableOpacity
            onPress={this.midFlightResultsPeak.bind(this)}
            style={{}}
          >
            <Image
              style={styles.imageTag}
              source={require('../../assets/images/red-tag.png')}
            />
          </TouchableOpacity>
          <Text style={styles.tagText}>
              "{this.state.searchInput}"
          </Text>
        </View>
        {this.state.showResults &&
          <TagSearchResult
          startDateString={this.state.dayBeforeSearchDate}
          endDateString={this.state.searchDate}
          searchInput={this.state.searchInput}
          existingTaggingInput={this.state.existingTaggingInput}
          searchOverallEmoResultTableData={this.state.searchOverallEmoResultTableData}
          searchArticlesResultTableData={this.state.searchArticlesResultTableData}
          noResultsToReturn={this.state.noResultsToReturn}
          stillTagging={this.state.stillTagging}
        />
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

export default connect(mapStateToProps)(TagLine)
