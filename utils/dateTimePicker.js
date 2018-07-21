// 默认开始显示数据
var defaultDate = null;
// 返回默认显示的数组和联动数组的声明
var dateTime = null, dateTimeArray = null;
var start = 1978;
var end = 2100;

let defaultLoopArr = [
  {
    min: start,
    max: end
  }, {
    min: 1,
    max: 12
  }, {
    min: 1,
    max: 31
  }, {
    min: 0,
    max: 23
  }, {
    min: 0,
    max: 59
  }, {
    min: 0,
    max: 59
  }
]

function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getMonthDay(year, month, isHide, day) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(isHide ? parseInt(day) : 1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(isHide ? parseInt(day) : 1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(isHide ? parseInt(day) : 1, 29) : getLoopArray(isHide ? parseInt(day) : 1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}
/**
 * @description
 * @params {boolean} isInit 是否是 初始化
 */
function dateTimePicker(startYear, endYear, date, isInit) {
  // 默认开始显示数据
  defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // 返回默认显示的数组和联动数组的声明
  dateTime = [];
  dateTimeArray = [[], [], [], [], [], []];
  defaultLoopArr[0].min = startYear || 1978;
  defaultLoopArr[0].max = endYear || 2100;

  defaultLoopArr.forEach((item, i) => {
    item.isHide = isInit;
  })

  // 处理联动列表数据
  /*年月日 时分秒*/
  defaultDate.forEach((item, i) => {
    if(i == 2){
      dateTimeArray[i] = getMonthDay(defaultDate[0], defaultDate[1], defaultLoopArr[i].isHide, item);
    }else{
      dateTimeArray[i] = getLoopArray(defaultLoopArr[i].isHide ? parseInt(item) : defaultLoopArr[i].min, defaultLoopArr[i].max);
    }
  })

  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}

function changeByColumn(columnArr, dateTimeArray){
  console.log(columnArr)
  console.log(dateTimeArray)
 var temp = 0;
 // 返回默认显示的数组和联动数组的声明
 dateTime = [];
 dateTimeArray = [[], [], [], [], [], []];
 
  columnArr.forEach((item, i) => {
    if(item > 0){
      temp = i;
      return false;
    }
  });
console.log(temp)
  columnArr.forEach((item, i) => {
    if (temp < i) {
      defaultLoopArr[i].isHide = false;
    }else{
      defaultLoopArr[i].isHide = true;
    }
  });

  console.log(defaultLoopArr)
  // // 处理联动列表数据
  // /*年月日 时分秒*/
  defaultDate.forEach((item, i) => {
    // defaultLoopArr[i].isHide = (columnArr[i] > 0 ? false : true);  
    if (i == 2) {
      dateTimeArray[i] = getMonthDay(defaultDate[0], defaultDate[1], defaultLoopArr[i].isHide, item);
    } else {
      dateTimeArray[i] = getLoopArray(defaultLoopArr[i].isHide ? parseInt(item) : defaultLoopArr[i].min, defaultLoopArr[i].max);
    }
  })
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  changeByColumn: changeByColumn
}