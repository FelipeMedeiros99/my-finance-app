const required = { value: true, message: "Este campo é obrigatório" }

export const formRules = {
  name: { required, maxLength: { value: 30, message: "No máximo, 30 caracteres" } },
  limit: { required, pattern: { value: /^\d+\.?\d{1-2}?$/, message: "Insira um valor válido" } },
  closeDate: { required },
  dueDate: { required },
}

export const defaultValuesForm = {
  closeDate: '',
  dueDate: ''
}