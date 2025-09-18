export const rules = {
  description: {required: {value: true, message: "Este campo é obrigatório"}, maxLength: {value: 20, message: "O nome deve ter no máximo 20 caracteres"}},
  value: {required: {value: true, message: "Este campo é obrigatório"}, pattern: {value: /^R\$\s\d+(.\d{1,2})?$/, message: "O valor deve ser válido"}},
  dueDate: {required: {value: true, message: "Este campo é obrigatório"}},
  recurrent: {required: {value: true, message: "Este campo é obrigatório"}},
  category: {required: {value: true, message: "Este campo é obrigatório"}},
  account: {required: {value: true, message: "Este campo é obrigatório"}},
}

export const getDateToday = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${year}-${month}-${day}`;
}