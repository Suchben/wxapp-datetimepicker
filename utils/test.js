// 使用开始时间 结束时间 修正选择器时间
class MeDateSelector {
  constructor (dateBegin, dateEnd, dateDefault, length) {
    this.dateBegin = dateBegin || new Date()
    this.dateEnd = dateEnd || this.dateBegin
    this.dateDefault = dateDefault || this.dateBegin
    this.length = length < 1 || length > 6 ? 6 : length
    this.init()
  }

  init () {
    this.arrBegin = dateToArray(this.dateBegin, this.length)
    this.arrEnd = dateToArray(this.dateEnd, this.length)
    this.arrSelector = dateToArray(this.dateDefault, this.length)
    this.updatePickerResource()
    this.updateSelectorIndexes()
  }
}

MeDateSelector.prototype.selectorValidateModify = function (column, index) {
  let value = this.selectorResource[column][index]
  let selectedDate = JSON.parse(JSON.stringify(this.arrSelector))
  selectedDate.splice(column, 1, value)
  let begin = this.arrBegin
  let end = this.arrEnd

  selectedDate = dateMustBetween(begin, end, selectedDate)
  this.arrSelector = selectedDate
  console.log('oooo', this.arrSelector)
  this.updatePickerResource()
  this.arrSelector = dateValueMustBetween(this.resourceStart, this.resourceEnd, selectedDate)
  console.log('pppp', this.arrSelector)
  this.updateSelectorIndexes()
}

function dateMustBetween(arrBegin, arrEnd, arrDate) {
  let beginStr = arrBegin.join()
  let endStr = arrEnd.join()
  let selectedDateStr = arrDate.join()
  if (selectedDateStr < beginStr) {
    return arrBegin
  } else if (selectedDateStr > endStr) {
    return arrEnd
  } else {
    return arrDate
  }
}

function dateValueMustBetween(arrBegin, arrEnd, arrDate) {
  arrDate = JSON.parse(JSON.stringify(arrDate))
  for (let i = 0; i < arrBegin.length; i++) {
    let b = arrBegin[i]
    let e = arrEnd[i]
    let d = arrDate[i]
    if (d < b) {
      arrDate[i] = b
    } else if (d > e) {
      arrDate[i] = e
    }
  }
  return arrDate
}

/*
2018,01,02
2017,01,01
*/

// 输入 起始时间 选择器时间 最大时间
// 输出 选择器数据源的最大、最小值

MeDateSelector.prototype.updatePickerResource = function () {
  let begin = this.arrBegin
  let end = this.arrEnd
  let selectedDate = this.arrSelector
  let length = this.length
  let min = begin
  for (let i = 0; i < selectedDate.length; i++) {
    let s = selectedDate[i]
    let b = begin[i]
    if (s === b) {} else if (s > b) {
      min = begin.slice(0, i + 1).concat(['0000', '01', '01', '00', '00', '00'].slice(i + 1, length))
      break
    } else {
      console.error('选择器时间小于可选范围:' + selectedDate.join('/'))
      return null
    }
  }
  let max = end
  for (let i = 0; i < selectedDate.length; i++) {
    let s = selectedDate[i]
    let e = end[i]
    if (s === e) {} else if (s < e) {
      // 获取选择月份的天数
      let count = daysInMonth(selectedDate[0], selectedDate[1])
      max = end.slice(0, i + 1).concat(['9999', '12', String(count), '23', '59', '59'].slice(i + 1, length))
      break
    } else {
      console.error('选择器时间大于可选范围:' + selectedDate.join('/'))
      return null
    }
  }
  this.resourceStart = min
  this.resourceEnd = max
  this.selectorResource = resourceWithStartAndEnd(min, max)
}

MeDateSelector.prototype.updateSelectorIndexes = function () {
  let selectedDate = this.arrSelector
  let result = []
  for (let i = 0, value; i < selectedDate.length; i++) {
    value = selectedDate[i]
    result.push(this.selectorResource[i].indexOf(value))
  }
  this.selectorIndexes = result
}

function daysInMonth(year, month) {
  var d = new Date(Number(year), Number(month), 0)
  return d.getDate()
}

function resourceWithStartAndEnd(start, end) {
  let resource = []
  for (let i = 0; i < start.length; i++) {
    let s = Number(start[i])
    let e = Number(end[i])
    let arr = []
    for (let j = s; j <= e; j++) {
      arr.push(j < 10? '0' + j: String(j))
    }
    resource.push(arr)
  }
  return resource
}

// 时间 => 数组 转化器
function dateToArray(date, length) {
  if (date instanceof Date) {
    function withZero(n) {
      return n < 10? '0' + n: String(n)
    }
    let result = []
    let year = withZero(date.getFullYear())
    let month = withZero(date.getMonth() + 1)
    let day = withZero(date.getDate())
    let hour = withZero(date.getHours())
    let minute = withZero(date.getMinutes())
    let second = withZero(date.getSeconds())
    return [year, month, day, hour, minute, second].slice(0, length)
  } else {
    console.error('日期参数无效', date)
    return []
  }
}

module.exports = MeDateSelector