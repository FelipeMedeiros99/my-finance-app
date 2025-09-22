export const formatToDate = (date: Date)=>{
  return {
    year: `${date.getFullYear()}`, 
    month: `${date.getMonth()}`.padStart(2, "0"),
    day: `${date.getDate()}`.padStart(2, "0"),
  }
}

export const formateDateToText = (date: string | Date)=>{
  const modelDate = typeof date === "string" ? new Date(`${date}T00:00:00`) : new Date(`${date}`) 
  
  return modelDate.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}