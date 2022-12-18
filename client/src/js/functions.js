export function getDateFormat(date) {
  let time = new Date(date);

  return (time.getDay() + "." + time.getMonth() + "." + time.getFullYear() + " "
    + time.getHours() + ":" + time.getMinutes());
}
