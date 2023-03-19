import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import sleep from './utils/sleep.js';
import { replySingleMessage } from './libs/gpt3.5.mjs';
import { generateImage } from './libs/dalle.mjs';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: { headless: true },
});

client.on('qr', (qr) => {
	qrcode.generate(qr, { small: true });
	console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
	console.log('ChatBot is ready!');
	client.pupPage.evaluate(
		"window.Store.MediaPrep = window.mR.findModule('MediaPrep')[1];"
	);
});
client.on('message', onMessage);

async function onMessage(msg) {
	if (msg._data.id.remote.endsWith('@g.us'))
		return console.log('Group message');
	if (msg.hasMedia) return console.log('Media message');
	const { id: user, body: message } = msg._data;
	return handleMessage(user, message);
}

async function handleMessage(user, message) {
	await sleep(1000);
	await client.sendSeen(user.remote);
	await (await client.getChatById(user.remote)).sendStateTyping();
	if (message.startsWith('/dalle')) return handleDalle(user, message);
	const [gpt3_5_Reply] = await replySingleMessage(message);
	return client.sendMessage(user.remote, gpt3_5_Reply.message.content.trim());
}

async function handleDalle(user, message) {
	const [, topic] = message.split(' ');
	if (!topic.trim())
		return client.sendMessage(
			user.remote,
			'Please provide a prompt for the image'
		);
	await client.sendMessage(user.remote, 'Processing...');
	try {
		const dalleReply = await generateImage(topic);
		const image = await MessageMedia.fromUrl(dalleReply);
		return client.sendMessage(user.remote, image);
	} catch (error) {
		console.log(error);
		return client.sendMessage(user.remote, 'Error generating image');
	}
}

client.initialize();
