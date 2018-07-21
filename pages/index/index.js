//index.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
var MeDateSelector = require('../../utils/test.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    date: '2018/08/01 10:30',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    meDateTime: '',
    meSelectorResource: [],
    meSelectorDate: ''
  },
  onLoad() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, null, true);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });

    // meSelector 初始化
    let now = new Date(this.data.date)
    let time = now.getTime() + 900 * 24 * 60 * 60 * 1000
    let end = new Date(time)
    this._meDateSelector = new MeDateSelector(now, end, null, 6)
    this.setData({
      meSelectorResource: this._meDateSelector.selectorResource,
      meDateTime: this._meDateSelector.selectorIndexes,
      meSelectorDate: this._meDateSelector.arrSelector
    })
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    console.log(arr, "----------");
    console.log(dateArr, "+++++++++++")
    var column = e.detail.value;
    arr[e.detail.column] = e.detail.value;
    var changeDate = dateTimePicker.changeByColumn(arr, dateArr);
    // dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

  
    this.setData({
      dateTimeArray1: changeDate.dateTimeArray,
      dateTime1: changeDate.dateTime
    });
  },
  // meSelector
  meSelectorChange: function (e) {
    // 使用 meSelectorDate 设置结果
    let date = this.data.meSelectorDate
    this.setData({
      date: `${date[0]}/${date[1]}/${date[2]} ${date[3]}:${date[4]}`
    })
  },
  meSelectorColumnChange: function (e) {
    let { column, value } = e.detail
    this._meDateSelector.selectorValidateModify(column, value)
    this.setData({
      meSelectorResource: this._meDateSelector.selectorResource,
      meDateTime: this._meDateSelector.selectorIndexes,
      meSelectorDate: this._meDateSelector.arrSelector
    })
  },
  meSelectorCancel: function (e) {
    // 重新使用原值初始化空间
  }
})