export const pieChartOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      itemStyle: {
        color: function (colors: any) {
          var colorList = [
            '#91cd77',
            '#ef6567',
          ];
          return colorList[colors.dataIndex];
        },
      },
      name: '考试分析',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 2, name: '通过' },
        { value: 1, name: '未通过' }
      ]
    }
  ]
}