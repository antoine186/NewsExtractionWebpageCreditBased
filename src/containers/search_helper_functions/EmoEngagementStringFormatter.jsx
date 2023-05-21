import { emoIcons } from "../../utils/emotional_configuration/EmoIcons"

function EmoEngagementStringFormatter (emoBreakdown) {
  let emoEngagementFormattedString = ''

  let emoBreakdownSorted = Object.keys(emoBreakdown).map(function(key) {
    return [key, emoBreakdown[key]]
  })

  emoBreakdownSorted.sort(function (first, second) {
    return second[1] - first[1]
  })

  emoEngagementFormattedString = emoIcons[emoBreakdownSorted[0][0]] + ' ' + (emoBreakdownSorted[0][1] * 100).toFixed(2) + '% '
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[1][0]] + ' ' + (emoBreakdownSorted[1][1] * 100).toFixed(2) + '% '
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[2][0]] + ' ' + (emoBreakdownSorted[2][1] * 100).toFixed(2) + '% '
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[3][0]] + ' ' + (emoBreakdownSorted[3][1] * 100).toFixed(2) + '% '
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[4][0]] + ' ' + (emoBreakdownSorted[4][1] * 100).toFixed(2) + '% '
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[5][0]] + ' ' + (emoBreakdownSorted[5][1] * 100).toFixed(2) + '% '
  emoEngagementFormattedString = emoEngagementFormattedString + emoIcons[emoBreakdownSorted[6][0]] + ' ' + (emoBreakdownSorted[6][1] * 100).toFixed(2) + '% '

  return emoEngagementFormattedString
}

export default EmoEngagementStringFormatter

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
