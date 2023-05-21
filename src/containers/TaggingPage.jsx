import React from 'react'
import styles from '../utils/style_guide/MainWebpageStyle'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import TagLine from '../components/molecules/TagLine'
import DateFormatterForUI from '../utils/DateFormatterForUI'
import DateFormatter from '../utils/DateFormatter'
import { connect } from 'react-redux'
import { api, getTaggingInputs, saveTaggingInputs, updateTaggingInputs, deleteTag, deleteTaggingInputs } from '../utils/backend_configuration/BackendConfig'

class TaggingPage extends React.Component {
  constructor (props) {
    super(props)

    const relevantDate = new Date()

    relevantDate.setDate(relevantDate.getDate() - 1)
    const yesterdayString = DateFormatterForUI(relevantDate)
    const yesterday = DateFormatter(relevantDate)

    relevantDate.setDate(relevantDate.getDate() - 1)

    const dayBeforeYesterday = DateFormatter(relevantDate)

    this.state = {
      searchInput: '',
      searchInputs: [],
      yesterdayString,
      yesterday,
      dayBeforeYesterday,
      existingTaggingInput: false
    }

    api.post(getTaggingInputs, {
      username: this.props.accountData.accountData.payload.emailAddress
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Retrieved existing tags list')
        this.setState({ searchInputs: response.data.responsePayload.previous_tagging_input })
        this.setState({ existingTaggingInput: true })
      } else {
        console.log('No existing tags list found')
      }
    }
    )
  }

  handleSubmit () {
    if (this.state.searchInputs.length < 3) {
      const newSearchInputs = this.state.searchInputs
      newSearchInputs.push({
        searchInput: this.state.searchInput,
        searchDate: this.state.yesterday,
        dayBeforeSearchDate: this.state.dayBeforeYesterday,
        alreadyTagging: false
      })

      if (!this.state.existingTaggingInput) {
        api.post(saveTaggingInputs, {
          username: this.props.accountData.accountData.payload.emailAddress,
          taggingInputList: newSearchInputs
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            console.log('Saved the new tags list')
            this.setState({ existingTaggingInput: true })
          } else {
            console.log('Saving the new tags list failed')
          }
        }
        )
      } else {
        api.post(updateTaggingInputs, {
          username: this.props.accountData.accountData.payload.emailAddress,
          taggingInputList: newSearchInputs
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            console.log('Updated the new tags list')
          } else {
            console.log('Updating the new tags list failed')
          }
        }
        )
      }

      this.setState({
        searchInputs: newSearchInputs
      })
    }
  }

  setAlreadyTagging (searchInput) {
    const newSearchInputs = this.state.searchInputs
    const newSearchInputsTaggingSet = newSearchInputs.map(input => {
      if (input.searchInput === searchInput) {
        input.alreadyTagging = true
      }
      return input
    })

    api.post(updateTaggingInputs, {
      username: this.props.accountData.accountData.payload.emailAddress,
      taggingInputList: newSearchInputsTaggingSet
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Updated the new tags list')
      } else {
        console.log('Updating the new tags list failed')
      }
    }
    )

    this.setState({
      searchInputs: newSearchInputsTaggingSet
    })
  }

  removeTagFromList (searchInput) {
    const newSearchInputs = this.state.searchInputs.filter(input => input.searchInput !== searchInput)

    if (newSearchInputs.length < 1) {
      console.log('Tags list now sized zero')
      this.setState({ existingTaggingInput: false })

      api.post(deleteTag, {
        username: this.props.accountData.accountData.payload.emailAddress,
        searchInput
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Tag successfully deleted')
        }
      }
      )

      api.post(deleteTaggingInputs, {
        username: this.props.accountData.accountData.payload.emailAddress
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Tags list successfully deleted')
        }
      }
      )
    } else {
      api.post(deleteTag, {
        username: this.props.accountData.accountData.payload.emailAddress,
        searchInput
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Tag successfully deleted')
        }
      }
      )

      api.post(updateTaggingInputs, {
        username: this.props.accountData.accountData.payload.emailAddress,
        taggingInputList: newSearchInputs
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Updated the new tags list')
        } else {
          console.log('Updating the new tags list failed')
        }
      }
      )
    }

    this.setState({
      searchInputs: newSearchInputs
    })
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
                        maxLength={40}
                        value={this.state.searchInput}
                        onChangeText={text => this.setState({ searchInput: text })}
                        placeholder={'Try tagging \'ChatGPT\'... (tagging might take a few hours)'}
                        style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
                    />
                    <br></br>
                    {!this.state.searchingInitiated &&
                        <TouchableOpacity style={styles.searchBtn} onPress={this.handleSubmit.bind(this)}>
                            <Text style={styles.text}>TAG</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <br></br>
            {true &&
                <View style={styles.innerContainer}>
                    <br></br>
                    {this.state.searchInputs.length > 0 &&
                      <Text style={styles.titleText2}>
                        Below are your active tags
                      </Text>
                    }
                    <br></br>
                    <br></br>
                    {
                      this.state.searchInputs.map((searchInputs) => (
                        <View>
                          <TagLine
                              searchInput={searchInputs.searchInput}
                              searchDate={searchInputs.searchDate}
                              dayBeforeSearchDate={searchInputs.dayBeforeSearchDate}
                              accountData={this.props.accountData}
                              existingTaggingInput={this.state.existingTaggingInput}
                              removeTagFromList={this.removeTagFromList.bind(this)}
                              setAlreadyTagging={this.setAlreadyTagging.bind(this)}
                              alreadyTagging={searchInputs.alreadyTagging}
                          />
                          <br></br>
                        </View>
                      ))
                    }
                </View>
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

export default connect(mapStateToProps)(TaggingPage)
