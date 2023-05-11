
type  IFormat = 'year' | 'date' | 'time' | '' 

export const getTime = (time:string, format:IFormat = 'date') => {
  switch (format) {
    case 'year':
      return new Date(time).toDateString().split(' ')[3]
    case 'date':
      return new Date(time).toLocaleDateString().replaceAll('/', '-')
    case 'time':
      return new Date(time).toLocaleString().replaceAll('/', '-')
    default:
      return new Date(time).toLocaleDateString().replaceAll('/', '-')
  }
}

export const getTimeBefore = (data:any)=> {
  var str = new Date(data).toLocaleString();
  //将字符串转换成时间格式
  var timePublish:any = new Date(str);
  var timeNow:any = new Date();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;
  var diffValue = timeNow - timePublish;
  var diffMonth:any = diffValue / month;
  var diffWeek:any = diffValue / (7 * day);
  var diffDay:any = diffValue / day;
  var diffHour:any = diffValue / hour;
  var diffMinute:any = diffValue / minute;
  var diffYear:any = diffValue / year;
  let result=""
  if (diffValue < 0) {
      result = "刚刚发表";
  } else if (diffYear > 1) {
      result = parseInt(diffYear) + "年前";
  } else if (diffMonth > 1) {
      result = parseInt(diffMonth) + "月前";
  } else if (diffWeek > 1) {
      result = parseInt(diffWeek) + "周前";
  } else if (diffDay > 1) {
      result = parseInt(diffDay) + "天前";
  } else if (diffHour > 1) {
      result = parseInt(diffHour) + "小时前";
  } else if (diffMinute > 1) {
      result = parseInt(diffMinute) + "分钟前";
  } else {
      result = "刚刚";
  }
  return result;
}


