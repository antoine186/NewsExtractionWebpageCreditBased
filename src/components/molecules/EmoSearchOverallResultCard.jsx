import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image, Dimensions } from 'react-native'
import styles from '../../utils/style_guide/MainWebpageStyle'
// import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

class EmoSearchOverallResultCard extends Component {
  constructor (props) {
    super(props)

    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    const aspectRatio = windowWidth / windowHeight

    const windowWidthCm = (windowWidth / 160) * 2.54

    let largeWebBrowser = true
    let mobileBrowser = false
    let sizeScaler = 1

    if (aspectRatio < 1.3 && windowWidthCm < 25) {
      largeWebBrowser = false
      sizeScaler = 1
      if (aspectRatio < 0.6 && windowWidthCm < 15) {
        mobileBrowser = true
        sizeScaler = 0.8
      }
    }

    this.state = {
      resultData: this.props.resultData,
      sizeScaler
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.resultData !== this.props.resultData) {
      this.setState({ resultData: this.props.resultData })
    }
  }

  render () {
    return (
        <View>
            <Card style={styles.articleCard}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontSize: 1.6 * this.state.sizeScaler * vh }}>
                        Overall Emotional Engagement with Search Topic
                    </Typography>
                    <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary">
                        Emotional Engagement
                    </Typography>
                    <br></br>
                    <Typography variant="body2" sx={{ fontSize: 1.4 * this.state.sizeScaler * vh }}>
                        {this.state.resultData[0] !== undefined &&
                            this.state.resultData[0].emotional_engagement
                        }
                    </Typography>
                    {this.state.resultData[0] !== undefined && this.state.resultData[0].emotional_engagement_percentage_change !== undefined &&
                      <View>
                        <br></br>
                        <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary">
                          Daily Change
                        </Typography>
                        <br></br>
                      </View>
                    }
                    <Typography variant="body2" sx={{ fontSize: 1.4 * this.state.sizeScaler * vh }}>
                      {this.state.resultData[0] !== undefined && this.state.resultData[0].emotional_engagement_percentage_change !== undefined &&
                        this.state.resultData[0].emotional_engagement_percentage_change
                      }
                    </Typography>
                </CardContent>
            </Card>
        </View>
    )
  }
}

export default EmoSearchOverallResultCard
