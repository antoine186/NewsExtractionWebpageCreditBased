import { emoIcons } from "../../utils/emotional_configuration/EmoIcons"

function EmoChangeStringFormatter (emoBreakdown, previousEmoBreakdown) {
  let emoEngagementFormattedString = ''

  let emoBreakdownSorted = Object.keys(emoBreakdown).map(function(key) {
    return [key, emoBreakdown[key]]
  })

  emoBreakdownSorted.sort(function (first, second) {
    return second[1] - first[1]
  })

  let emoSign1 = ''
  if (((emoBreakdownSorted[0][1] - previousEmoBreakdown[emoBreakdownSorted[0][0]]) / previousEmoBreakdown[emoBreakdownSorted[0][0]] * 100) >= 0) {
    emoSign1 = '+'
  }
  emoEngagementFormattedString = emoIcons[emoBreakdownSorted[0][0]] + ' ' + emoSign1 + ((emoBreakdownSorted[0][1] - previousEmoBreakdown[emoBreakdownSorted[0][0]]) / previousEmoBreakdown[emoBreakdownSorted[0][0]] * 100).toFixed(2) + '% '

  let emoSign2 = ''
  if (((emoBreakdownSorted[1][1] - previousEmoBreakdown[emoBreakdownSorted[1][0]]) / previousEmoBreakdown[emoBreakdownSorted[1][0]] * 100) >= 0) {
    emoSign2 = '+'
  }
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[1][0]] + ' ' + emoSign2 + ((emoBreakdownSorted[1][1] - previousEmoBreakdown[emoBreakdownSorted[1][0]]) / previousEmoBreakdown[emoBreakdownSorted[1][0]] * 100).toFixed(2) + '% '

  let emoSign3 = ''
  if (((emoBreakdownSorted[2][1] - previousEmoBreakdown[emoBreakdownSorted[2][0]]) / previousEmoBreakdown[emoBreakdownSorted[2][0]] * 100) >= 0) {
    emoSign3 = '+'
  }
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[2][0]] + ' ' + emoSign3 + ((emoBreakdownSorted[2][1] - previousEmoBreakdown[emoBreakdownSorted[2][0]]) / previousEmoBreakdown[emoBreakdownSorted[2][0]] * 100).toFixed(2) + '% '

  let emoSign4 = ''
  if (((emoBreakdownSorted[3][1] - previousEmoBreakdown[emoBreakdownSorted[3][0]]) / previousEmoBreakdown[emoBreakdownSorted[3][0]] * 100) >= 0) {
    emoSign4 = '+'
  }
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[3][0]] + ' ' + emoSign4 + ((emoBreakdownSorted[3][1] - previousEmoBreakdown[emoBreakdownSorted[3][0]]) / previousEmoBreakdown[emoBreakdownSorted[3][0]] * 100).toFixed(2) + '% '

  let emoSign5 = ''
  if (((emoBreakdownSorted[4][1] - previousEmoBreakdown[emoBreakdownSorted[4][0]]) / previousEmoBreakdown[emoBreakdownSorted[4][0]] * 100) >= 0) {
    emoSign5 = '+'
  }
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[4][0]] + ' ' + emoSign5 + ((emoBreakdownSorted[4][1] - previousEmoBreakdown[emoBreakdownSorted[4][0]]) / previousEmoBreakdown[emoBreakdownSorted[4][0]] * 100).toFixed(2) + '% '

  let emoSign6 = ''
  if (((emoBreakdownSorted[5][1] - previousEmoBreakdown[emoBreakdownSorted[5][0]]) / previousEmoBreakdown[emoBreakdownSorted[5][0]] * 100) >= 0) {
    emoSign6 = '+'
  }
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[5][0]] + ' ' + emoSign6 + ((emoBreakdownSorted[5][1] - previousEmoBreakdown[emoBreakdownSorted[5][0]]) / previousEmoBreakdown[emoBreakdownSorted[5][0]] * 100).toFixed(2) + '% '

  let emoSign7 = ''
  if (((emoBreakdownSorted[6][1] - previousEmoBreakdown[emoBreakdownSorted[6][0]]) / previousEmoBreakdown[emoBreakdownSorted[6][0]] * 100) >= 0) {
    emoSign7 = '+'
  }
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[6][0]] + ' ' + emoSign7 + ((emoBreakdownSorted[6][1] - previousEmoBreakdown[emoBreakdownSorted[6][0]]) / previousEmoBreakdown[emoBreakdownSorted[6][0]] * 100).toFixed(2) + '% '

  return emoEngagementFormattedString
}

export default EmoChangeStringFormatter

/*
sadness 😢
joy 😃
love 🥰
disgust 🤢
anger 😡
fear 😱
surprise 😯
neutral 😐
*/
