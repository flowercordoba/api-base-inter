import * as bcyptjs from 'bcrypt';

const salt = 10;

async function generateHash(passwordPlain: string) {
  const hast = await bcyptjs.hash(passwordPlain, salt);

  return hast;
}

async function compareHash(plaint: string, hast: string): Promise<any> {
  return await bcyptjs.compare(plaint, hast);
}

export { generateHash, compareHash };
