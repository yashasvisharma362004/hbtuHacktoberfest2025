function isLeapYear(year) {
  if (year % 400 === 0) {
    return true;
  }
  if (year % 100 === 0) {
    return false;
  }
  if (year % 4 === 0) {
    return true;
  }
  return false;
}

const year1 = 2024;
const year2 = 2100;
const year3 = 2000;

console.log(`Is ${year1} a leap year? ${isLeapYear(year1)}`);
console.log(`Is ${year2} a leap year? ${isLeapYear(year2)}`);
console.log(`Is ${year3} a leap year? ${isLeapYear(year3)}`);