export function getDateFormat(date) {
  const dateParsed = date.slice(0, date.length - 3);
  const time = new Date(dateParsed);

  let today = dateParsed.slice(4, 6).replace(/\s/g, '');
  today = today.length === 1 ? ('0' + today) : today;
  
  let hours = time.getHours();
  if (date.includes("PM")) {
    hours = hours + 12;
  } else {
    hours = '0' + hours;
  }

  let minutes = time.getMinutes();
  minutes = minutes< 10 ? ('0' + minutes) : minutes;

  let month;

  switch(dateParsed.slice(0, 3)) {
    case "Jan":
      month = "Января";
      break;
    case "Feb":
      month = "Февраля";
      break;
    case "Mar":
      month = "Марта";
      break;
    case "Apr":
      month = "Апреля";
      break;
    case "May":
      month = "Мая";
      break;
    case "Jun":
      month = "Июня";
      break;
    case "Jul":
      month = "Июля";
      break;
    case "Aug":
      month = "Августа";
      break;
    case "Sep":
      month = "Сентября";
      break;
    case "Oct":
      month = "Октября";
      break;
    case "Nov":
      month = "Ноября";
      break;
    case "Dec":
      month = "Декабря";
      break;
    default:
      month = "Месяц"
  }

  return (today + " " + month + " " + time.getFullYear() + " "
    + hours + ":" + minutes);
}
