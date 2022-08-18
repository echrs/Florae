export const getDaysLeft = (date: string) => {
  let taskDate = new Date(date);
  let today = new Date();
  return Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const getTodayDate = () => {
  let date = new Date();
  date.setHours(date.getHours(), 0, 0, 0);
  return date.toISOString();
};

export const setDaysAndTime = (days: any, time: any, existingDate: any, existingDays: any) => {
  let date = new Date();
  let exDate;
  if (existingDate?.length > 0) exDate = new Date(existingDate);
  if (days > 0) {
    if (exDate) {
      let prevDate = new Date(existingDate);
      prevDate.setDate(prevDate.getDate() - existingDays);
      prevDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (prevDate.getTime() === date.getTime()) date.setDate(date.getDate() + parseInt(days));
      else date.setDate(prevDate.getDate() + parseInt(days));
    } else date.setDate(date.getDate() + parseInt(days));
  } else {
    if (exDate) date.setDate(exDate.getDate());
  }
  if (time > 0) {
    date.setHours(parseInt(time), 0, 0, 0);
  } else {
    if (exDate) date.setHours(exDate.getHours(), 0, 0, 0);
  }
  return date.toISOString();
};

export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
