const required = { value: true, message: "Este campo é obrigatório" }
const valueAsNumber = true

export const formRules = {
  name: { required, maxLength: { value: 30, message: "No máximo, 30 caracteres" } },
  limit: { required, pattern: { value: /^\d+\.\d{1,2}$/, message: "Insira um valor válido" } },
  closeDay: { required, valueAsNumber },
  dueDay: { required, valueAsNumber },
}

export const defaultValuesForm = {
  closeDay: '',
  dueDay: '',
  limit: 0.00
}