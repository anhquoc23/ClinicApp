
export const formatCurrency = (money) => {
    return money.toFixed(2).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
      });
}

export const setTime = (hour, minute) => {
  const time = new Date()
  time.setHours(hour)
  time.setMinutes(minute)
  time.setSeconds(0)
  return time
}

export const randomColor = (length) => {
  let colors = []
  for (let i = 0; i < length; i++)
      colors.push(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`)
  return colors
}

export const getQuarter = (month) => {
  return month < 4 ? 1 : month < 7 ? 2 ? month < 10 : 3 : 4
}

export const getDateByStr = (dateSTr) => {return new Date(dateSTr)}