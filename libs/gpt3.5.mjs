import { OpenAi } from './OpenAI.mjs';

async function replySingleMessage(content) {
	const response = await OpenAi.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'user', content }],
		max_tokens: 1000,
	});
	return response.data.choices;
}

async function replyMessageThread(messages) {
	const response = await OpenAi.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages,
		max_tokens: 1000,
	});
	return response.data.choices;
}

export { replySingleMessage, replyMessageThread };
