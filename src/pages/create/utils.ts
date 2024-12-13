import {CreateTokenForm} from "./index.tsx";

const NameMaxLength = 32
const NameMinLength = 3
const TickerMaxLength = 10
const TickerMinLength = 3

export const getFormError = (
  form: CreateTokenForm
): string => {
  if(form.name && form.name.length > NameMaxLength) {
    return `Name must not exceed ${NameMaxLength} characters`
  }
  if(form.name && form.name.length < NameMinLength) {
    return `Name must be at least ${NameMinLength} characters`
  }

  if(form.symbol && form.symbol.length > TickerMaxLength) {
    return `Ticker must not exceed ${TickerMaxLength} characters`
  }
  if(form.symbol && form.symbol.length < TickerMinLength) {
    return `Ticker must be at least ${TickerMinLength} characters`
  }
  return ''
}
