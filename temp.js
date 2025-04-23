const { subHours } = require("date-fns");
const timeToCheckFor = subHours(new Date(), 1);
console.log(timeToCheckFor);
