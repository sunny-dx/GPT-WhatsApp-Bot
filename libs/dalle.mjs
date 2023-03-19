import { OpenAi } from './OpenAI.mjs';

async function generateImage(prompt) {
	const response = await OpenAi.createImage({
		prompt,
		n: 1,
		size: '1024x1024',
	});
	return response.data.data[0].url;
}

export { generateImage };
