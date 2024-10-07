import 'dotenv/config'; 
import * as joi from 'joi'; 

interface EnvVars {
  PORT: number;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
  JWT_VERIFICATION_TOKEN_SECRET: string;
  JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: string;
  EMAIL_CONFIRMATION_URL: string;
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
  DATABASE_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_USERNAME: string;
  DATABASE_PORT: number;
  DATABASE_HOST: string;
  TOKU_ACCOUNT_KEY: string;
  TOKU_API_KEY: string;
  TOKU_API_BASE_URL: string;
}

// Esquema de validación con Joi
const envsSchema = joi.object({
  PORT: joi.number().required(),
  JWT_ACCESS_TOKEN_SECRET: joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: joi.string().required(),
  JWT_VERIFICATION_TOKEN_SECRET: joi.string().required(),
  JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: joi.string().required(),
  EMAIL_CONFIRMATION_URL: joi.string().uri().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: joi.string().required(),
  DATABASE_NAME: joi.string().required(),
  DATABASE_PASSWORD: joi.string().required(),
  DATABASE_USERNAME: joi.string().required(),
  DATABASE_PORT: joi.number().required(),
  DATABASE_HOST: joi.string().required(),
  TOKU_ACCOUNT_KEY: joi.string().required(),
  TOKU_API_KEY: joi.string().required(),
  TOKU_API_BASE_URL: joi.string().uri().required(),
}).unknown(true);

// Validación de las variables de entorno
const { error, value } = envsSchema.validate({
  ...process.env,
});

// Si hay un error en la validación, se lanza una excepción
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Asignación de las variables validadas a la interfaz EnvVars
const envVars: EnvVars = value;

// Exportación de las variables de entorno validadas
export const envs = {
  PORT: envVars.PORT,
  JWT_ACCESS_TOKEN_SECRET: envVars.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: envVars.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: envVars.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_VERIFICATION_TOKEN_SECRET: envVars.JWT_VERIFICATION_TOKEN_SECRET,
  JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: envVars.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
  EMAIL_CONFIRMATION_URL: envVars.EMAIL_CONFIRMATION_URL,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: envVars.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  DATABASE_NAME: envVars.DATABASE_NAME,
  DATABASE_PASSWORD: envVars.DATABASE_PASSWORD,
  DATABASE_USERNAME: envVars.DATABASE_USERNAME,
  DATABASE_PORT: envVars.DATABASE_PORT,
  DATABASE_HOST: envVars.DATABASE_HOST,
  TOKU_ACCOUNT_KEY: envVars.TOKU_ACCOUNT_KEY,
  TOKU_API_KEY: envVars.TOKU_API_KEY,
  TOKU_API_BASE_URL: envVars.TOKU_API_BASE_URL,
};
