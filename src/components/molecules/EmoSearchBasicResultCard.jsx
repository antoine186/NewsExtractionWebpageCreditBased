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

class EmoSearchBasicResultCard extends Component {
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
      articleExpand: false,
      articleData: this.props.articleData,
      emoIcon: this.props.emoIcon,
      sizeScaler
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.articleData !== this.props.articleData) {
      this.setState({ articleData: this.props.articleData })
    }
  }

  render () {
    return (
        <View>
            <Card style={styles.articleCard}>
                <CardContent>
                    <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.primary" gutterBottom>
                        Most {this.state.emoIcon} out of all articles found
                    </Typography>
                    <Typography variant="h5" sx={{ fontSize: 1.6 * this.state.sizeScaler * vh }}>
                        {this.state.articleData !== undefined &&
                            <a href={this.state.articleData.url} style={{ color: '#808B96' }}>{this.state.articleData.title}</a>
                        }
                    </Typography>
                    <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.primary">
                        {this.state.articleData !== undefined &&
                            this.state.articleData.publisher
                        }
                        <br></br>
                        {this.state.articleData !== undefined &&
                            this.state.articleData.published_date
                        }
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => this.setState({ articleExpand: !this.state.articleExpand })}>Learn More</Button>
                </CardActions>
                <Collapse in={this.state.articleExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                            Emotional Engagement
                        </Typography>
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            {this.state.articleData !== undefined &&
                                this.state.articleData.emotional_engagement
                            }
                            <br></br>
                            <br></br>
                            <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                Extracted Concepts
                            </Typography>
                            {this.state.articleData !== undefined &&
                            <ul>
                                {this.state.articleData.extracted_keywords.map(keywords => (
                                    <li>{keywords[0]}</li>
                                ))}
                            </ul>
                            }
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </View>
    )
  }
}

export default EmoSearchBasicResultCard
