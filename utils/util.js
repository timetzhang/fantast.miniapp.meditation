const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatSeconds = value =>{
  var min = Math.floor(value / 60);
  var second = Math.floor(value % 60) < 10 ? '0' + Math.floor(value % 60) : Math.floor(value % 60);
  return min + ':' + second;
}

module.exports = {
  formatTime: formatTime,
  formatSeconds: formatSeconds
}
