export const rules = {
  name: { required: { value: true, message: "Campo obrigatório" } },
  openingBalance: {required: { value: true, message: "Campo obrigatório", pattern: {value: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Valor inválido"}}}
}