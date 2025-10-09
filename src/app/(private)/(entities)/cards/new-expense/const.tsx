const required = { value: true, message: "Este campo é obrigatório"}

export const rules = {
  description: { required, maxLenght : {value: 30, message: "Máximo de 30 caracteres"} },
  value: {required, pattern: {value: /^\d+(\.\d{1,2})?$/, message: "O formato deve ser 123.12"}, min: {value: 0.01, message: "Valor mínimo: 0.01"}},
  date: {required},
  category: {required},
  card: {required},
  installments: {required, valueAsNumber: true, max: {value: 100, message: "Valor máximo: 100"}}
}