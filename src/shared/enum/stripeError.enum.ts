import { registerEnumType } from "@nestjs/graphql";

enum StripeError {
  InvalidRequest = 'StripeInvalidRequestError',
  ResourceMissing = 'resource_missing',
}

export default StripeError;


export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  COP = 'cop',
}

registerEnumType(Currency, {
  name: 'Currency',
  description: 'Monedas soportadas en el sistema',  
});
