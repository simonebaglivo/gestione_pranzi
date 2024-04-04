export function getNextMonday(week: number) {
  const day = week * 7;
  const date = new Date();
  date.setDate(date.getDate() + ((1 + 7 - date.getDay()) % 7 || 7) + day);

  // Getting month and year.
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });

  // Returning in the right format.
  return `${date.getDate()} ${month} ${year}`;
}
