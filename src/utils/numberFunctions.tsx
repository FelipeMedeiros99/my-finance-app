export function filterNumbers(value: string){
  return value.replace(/\D/, "")
}

export function convertToStringNumber(value: string){
  const convertedValue = Number(filterNumbers(value))/100
  return convertedValue>0?`${convertedValue}`:"0.00"
}