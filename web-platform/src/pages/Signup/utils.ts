export const getAge = (year: string, month: string, day: string) => {
  const birthDay = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();
  const ms = currentDate.getTime() - birthDay.getTime();
  const diffDate = new Date(ms);

  return Math.abs(diffDate.getUTCFullYear() - 1970);
};
