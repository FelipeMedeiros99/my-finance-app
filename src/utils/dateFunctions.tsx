export const returnObjectOfDate = (date: string) => {

  const dateRegex = /^\d{4}-\d{1,2}\d{1,2}$/
  let onlyDate = date.split("T")[0]

  if (!dateRegex.test(onlyDate)) {
    throw new Error("Data inválida, o formato deve ser YYYY-MM-DD")
  }
  const [year, month, day] = onlyDate.split("-")
  return {
    year: year,
    month: month.padStart(2, "0"),
    day: day.padStart(2, "0")
  }
}

export const formateDateToText = (date: string | Date) => {
  const currentDate = new Date()

  let filtredDate = { year: currentDate.getFullYear(), month: currentDate.getMonth(), day: currentDate.getDate() }
  if (typeof date === "string") {
    let [year, month, day] = date.split("-")
    filtredDate.year = Number(year)
    filtredDate.month = Number(month) - 1
    filtredDate.day = Number(day)

  }
  const modelDate = typeof date === "string" ? convertToLocalTime(new Date(filtredDate.year, filtredDate.month, filtredDate.day)) : convertToLocalTime(new Date(date))

  return modelDate.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

export function convertInputDateToDate(date: string | Date) {
  let datePart = String(date).split("T")[0]
  const timeRegex = /^\d{4}-\d{1,2}-\d{1,2}$/
  const validation = timeRegex.test(datePart)
  if (validation) {
    const [year, month, day] = datePart.split("-");
    const formatedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return formatedDate;

  } else {
    throw new Error("formado de data deve ser: YYYY-MM-DD")
  }

}


export function convertToLocalTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}