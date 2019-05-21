import Client from '.';

const client = new Client('token');

// eslint-disable-next-line no-console
const log = <T>(pre: string) => (x: T) => (console.log(pre, x), x);

(async () => {

	await client.auth()
		.then(log('auth'));
	await client.player()
		.then(log('player'));
	const quest = await client.addQuest('Poop again', 3, 3)
		.then(log('addQuest'));
	await client.getQuests()
		.then(log('getQuests'));
	await client.getQuest(quest.id)
		.then(log('getQuest'));
	await client.updateQuest(quest.id, { priority: 2, difficulty: 1 })
		.then(log('updateQuest'));
	await client.deleteQuest(quest.id)
		.then(log('deleteQuest'));
	const sideQuest = await client.addSideQuest('Poop again', 3, 3)
		.then(log('addSideQuest'));
	await client.getSideQuests()
		.then(log('getSideQuests'));
	await client.getSideQuest(sideQuest.id)
		.then(log('getSideQuest'));
	await client.updateSideQuest(sideQuest.id, { priority: 2, difficulty: 1 })
		.then(log('updateSideQuest'));
	await client.deleteSideQuest(sideQuest.id)
		.then(log('deleteSideQuest'));
})();
