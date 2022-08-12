export const getDaysLeft = (date: string) => {
  let taskDate = new Date(date);
  let today = new Date();
  return Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const setDaysAndTime = (days: any, time: any) => {
  var date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  date.setHours(parseInt(time), 0, 0);
  return date.toISOString();
};
