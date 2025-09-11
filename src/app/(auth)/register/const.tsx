export const usernameRules = {
  required: {
    value: true,
    message: "Este campo é obrigatório"
  },
  pattern: {
    value: /^[a-zA-Z0-9._]+$/,
    message: `Apenas letras, números, ponto (.) e underline (_).`
  },
  min: {
    value: 3,
    message: "Mínimo de 3 caracteres"
  },
  max: {
    value: 100,
    message: "Máximo de 100 caracteres"
  }
}


export const passwordRules = {
  required: {
    value: true,
    message: "Este campo é obrigatório"
  },
  minLength: {
    value: 3,
    message: "Mínimo de 3 caracteres"
  },
  maxLength: {
    value: 20,
    message: "Máximo de 20 caracteres"
  }
}