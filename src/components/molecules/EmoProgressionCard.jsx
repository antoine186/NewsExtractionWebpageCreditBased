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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

class EmoProgressionCard extends Component {
  constructor (props) {
    super(props)

    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    const aspectRatio = windowWidth / windowHeight

    const windowWidthCm = (windowWidth / 160) * 2.54

    let largeWebBrowser = true
    let mobileBrowser = false
    let sizeScaler = 1
    let sizeChartWidthScaler = 1
    let sizeChartHeightScaler = 1
    let sizeMarginScaler = 1

    if (aspectRatio < 1.3 && windowWidthCm < 25) {
      largeWebBrowser = false
      sizeScaler = 1
      if (aspectRatio < 0.6 && windowWidthCm < 15) {
        mobileBrowser = true
        sizeScaler = 0.8
        sizeChartWidthScaler = 2
        sizeChartHeightScaler = 0.6
        sizeMarginScaler = 0
      }
    }

    const data = [
      {
        name: this.props.progressionDates[0].month + ' ' + this.props.progressionDates[0].year,
        emotion: this.props.progressionDataLine[0] * 100
      },
      {
        name: this.props.progressionDates[1].month + ' ' + this.props.progressionDates[1].year,
        emotion: this.props.progressionDataLine[1] * 100
      },
      {
        name: this.props.progressionDates[2].month + ' ' + this.props.progressionDates[2].year,
        emotion: this.props.progressionDataLine[2] * 100
      },
      {
        name: this.props.progressionDates[3].month + ' ' + this.props.progressionDates[3].year,
        emotion: this.props.progressionDataLine[3] * 100
      },
      {
        name: this.props.progressionDates[4].month + ' ' + this.props.progressionDates[4].year,
        emotion: this.props.progressionDataLine[4] * 100
      },
      {
        name: this.props.progressionDates[5].month + ' ' + this.props.progressionDates[5].year,
        emotion: this.props.progressionDataLine[5] * 100
      }
    ]

    this.state = {
      progressionDataLine: this.props.progressionDataLine,
      chartData: data,
      progressionDates: this.props.progressionDates,
      emoIcon: this.props.progressionEmoIcon,
      progressionKeyWords: this.props.progressionKeyWords,
      articleExpand: false,
      sizeScaler,
      sizeChartWidthScaler,
      sizeChartHeightScaler,
      sizeMarginScaler
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.progressionDataLine !== this.props.progressionDataLine) {
      const data = [
        {
          name: this.props.progressionDates[0].month + ' ' + this.props.progressionDates[0].year,
          emotion: this.props.progressionDataLine[0] * 100
        },
        {
          name: this.props.progressionDates[1].month + ' ' + this.props.progressionDates[1].year,
          emotion: this.props.progressionDataLine[1] * 100
        },
        {
          name: this.props.progressionDates[2].month + ' ' + this.props.progressionDates[2].year,
          emotion: this.props.progressionDataLine[2] * 100
        },
        {
          name: this.props.progressionDates[3].month + ' ' + this.props.progressionDates[3].year,
          emotion: this.props.progressionDataLine[3] * 100
        },
        {
          name: this.props.progressionDates[4].month + ' ' + this.props.progressionDates[4].year,
          emotion: this.props.progressionDataLine[4] * 100
        },
        {
          name: this.props.progressionDates[5].month + ' ' + this.props.progressionDates[5].year,
          emotion: this.props.progressionDataLine[5] * 100
        }
      ]
      this.setState({ chartData: data })
      this.setState({ progressionDataLine: this.props.progressionDataLine })
    }
  }

  render () {
    return (
        <View>
            <Card style={styles.chartCard}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontSize: 1.6 * this.state.sizeScaler * vh }}>
                        {this.state.emoIcon} Progression in %
                    </Typography>
                    <br></br>
                    <LineChart
                    width={32 * this.state.sizeChartWidthScaler * vw}
                    height={300 * this.state.sizeChartHeightScaler}
                    data={this.state.chartData}
                    margin={{
                      top: 5,
                      right: 30 * this.state.sizeMarginScaler,
                      left: 20 * this.state.sizeMarginScaler,
                      bottom: 5
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emotion" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => this.setState({ articleExpand: !this.state.articleExpand })}>Learn More</Button>
                </CardActions>
                <Collapse in={this.state.articleExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                Extracted Concepts
                            </Typography>
                            {this.props.progressionDates !== undefined && this.props.progressionDates.length > 0 &&
                                <Typography sx={{ fontSize: 1 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    {this.props.progressionDates[0].month} {this.props.progressionDates[0].year}
                                </Typography>
                            }
                            {this.props.progressionKeyWords !== undefined && this.props.progressionKeyWords.length > 0 &&
                            <ul>
                                {this.props.progressionKeyWords[0].map(keywords => (
                                    <li>{keywords[0]}</li>
                                ))}
                            </ul>
                            }
                            <br></br>
                            {this.props.progressionDates !== undefined && this.props.progressionDates.length > 1 &&
                                <Typography sx={{ fontSize: 1 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    {this.props.progressionDates[1].month} {this.props.progressionDates[1].year}
                                </Typography>
                            }
                            {this.props.progressionKeyWords !== undefined && this.props.progressionKeyWords.length > 1 &&
                            <ul>
                                {this.props.progressionKeyWords[1].map(keywords => (
                                    <li>{keywords[0]}</li>
                                ))}
                            </ul>
                            }
                            <br></br>
                            {this.props.progressionDates !== undefined && this.props.progressionDates.length > 2 &&
                                <Typography sx={{ fontSize: 1 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    {this.props.progressionDates[2].month} {this.props.progressionDates[2].year}
                                </Typography>
                            }
                            {this.props.progressionKeyWords !== undefined && this.props.progressionKeyWords.length > 2 &&
                            <ul>
                                {this.props.progressionKeyWords[2].map(keywords => (
                                    <li>{keywords[0]}</li>
                                ))}
                            </ul>
                            }
                            <br></br>
                            {this.props.progressionDates !== undefined && this.props.progressionDates.length > 3 &&
                                <Typography sx={{ fontSize: 1 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    {this.props.progressionDates[3].month} {this.props.progressionDates[3].year}
                                </Typography>
                            }
                            {this.props.progressionKeyWords !== undefined && this.props.progressionKeyWords.length > 3 &&
                            <ul>
                                {this.props.progressionKeyWords[3].map(keywords => (
                                    <li>{keywords[0]}</li>
                                ))}
                            </ul>
                            }
                            <br></br>
                            {this.props.progressionDates !== undefined && this.props.progressionDates.length > 4 &&
                                <Typography sx={{ fontSize: 1 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    {this.props.progressionDates[4].month} {this.props.progressionDates[4].year}
                                </Typography>
                            }
                            {this.props.progressionKeyWords !== undefined && this.props.progressionKeyWords.length > 4 &&
                            <ul>
                                {this.props.progressionKeyWords[4].map(keywords => (
                                    <li>{keywords[0]}</li>
                                ))}
                            </ul>
                            }
                            <br></br>
                            <br></br>
                            {this.props.progressionDates !== undefined && this.props.progressionDates.length > 5 &&
                                <Typography sx={{ fontSize: 1 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    {this.props.progressionDates[5].month} {this.props.progressionDates[5].year}
                                </Typography>
                            }
                            {this.props.progressionKeyWords !== undefined && this.props.progressionKeyWords.length > 5 &&
                            <ul>
                                {this.props.progressionKeyWords[5].map(keywords => (
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

export default EmoProgressionCard
