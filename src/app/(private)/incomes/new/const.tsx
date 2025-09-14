export const rules = {
  description: {required: {value: true, message: "Este campo é obrigatório"}, maxLength: {value: 20, message: "O nome deve ter no máximo 20 caracteres"}},
  value: {required: {value: true, message: "Este campo é obrigatório"}, pattern: {value: /^\d+([,.]\d{1,2})?$/, message: "O valor deve ser válido"}},
  dueDate: {required: {value: true, message: "Este campo é obrigatório"}},
  recurrent: {required: {value: true, message: "Este campo é obrigatório"}},
  category: {required: {value: true, message: "Este campo é obrigatório"}},
  account: {required: {value: true, message: "Este campo é obrigatório"}},
}