const formateDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date!!";
  }
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    minute: "2-digit",
    hour: "numeric",
    hour12: true,
  });
};

export default formateDate;
