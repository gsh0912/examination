export default {
  xAxis: {
    type: 'category',
    data: ['1', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130,190],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
}