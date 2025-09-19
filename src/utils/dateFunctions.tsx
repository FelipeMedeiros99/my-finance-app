export const formatToDate = (date: Date)=>{
  return {
    year: `${date.getFullYear()}`, 
    month: `${date.getMonth()}`.padStart(2, "0"),
    day: `${date.getDate()}`.padStart(2, "0"),
  }
}