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

export const setDaysAndTime = (days: any, time: any) => {
  var date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  date.setHours(parseInt(time), 0, 0, 0);
  return date.toISOString();
};

export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
