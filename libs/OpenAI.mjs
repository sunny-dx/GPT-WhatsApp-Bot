import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const secret = process.env.OPENAI_API_KEY;
import { Configuration, OpenAIApi } from 'openai';
const config = new Configuration({ apiKey: secret });
const OpenAi = new OpenAIApi(config);
export { OpenAi };
