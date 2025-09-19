export function filterNumbers(value: string){
  const filtredValue = value.replace(/\D+/g, "")
  return filtredValue;
}

export function convertToStringNumber(value: string){
  value = value.replace(",", ".")

  if(!value.includes(".")){
    value = value + "00"
  }
  value = filterNumbers(value)
  return String((Number(value)/100).toFixed(2))
}


export function convertToMoneyFormat(value: string|number){
  value = String(value)
  value = convertToStringNumber(value)

  return Number(value).toLocaleString("pt-BT", {style: "currency", currency: "BRL"})
}

export function convertToNumberFormat(value: string | number){
  value = convertToStringNumber(String(value))
  return Number(value)
}