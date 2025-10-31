import moment from 'moment-timezone'

export function formatDate(date, format = 'DD MMM YYYY, h:mm A') {
  return moment
    .utc(date, [
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DDTHH:mm:ss',
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
      'YYYY-MM-DD',
      'MMM DD, YYYY',
    ])
    .tz('Asia/Dhaka')
    .format(format)
}
