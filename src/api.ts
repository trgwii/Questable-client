import axios, { AxiosResponse } from 'axios';

import {
	Success,
	Error,
	Player,
	Quest,
	Priority,
	Difficulty,
	NewQuest,
	QuestUpdate,
	QuestUpdateFields
} from './types';

import {
	getData,
	assertSuccessful,
	throwError,
	stringify
} from './utils';

export default class Client {
	token: string;
	url: string;
	client: typeof axios;

	constructor(
		token: string,
		url = 'https://api.questable.webionite.com/',
		client = axios
	) {
		this.token = token;
		this.url = url;
		this.client = client;
	}

	static handle<T>(res: Promise<AxiosResponse<T>>): Promise<T> {
		return res.then(getData).catch(throwError);
	}

	get<R, D = undefined>(path: string, data?: D): Promise<R> {
		return Client.handle(this.client(this.url + path, {
			params: { token: this.token, ...data }
		}));
	}

	post<D, R>(path: string, data?: D): Promise<R> {
		return Client.handle(this.client.post<R>(this.url + path, stringify({
			token: this.token,
			...data
		}), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}))
	}
	delete<R, D = undefined>(path: string, data?: D): Promise<R> {
		return Client.handle(this.client.delete(this.url + path, {
			params: { token: this.token, ...data }
		}));
	}

	auth() {
		return this.get<Success>('auth')
			.then(assertSuccessful('Invalid token'))
			.then(() => this.token);
	}

	player() {
		return this.get<Player>('player');
	}

	getQuests() {
		return this.get<Quest[]>('get_quests');
	}

	getQuest(id: number) {
		return this.get<Quest, { id: number }>('get_quest', { id });
	}

	addQuest(name: string, priority: Priority, difficulty: Difficulty) {
		return this.post<NewQuest, Quest>('add_quest', {
			name, priority, difficulty
		});
	}

	updateQuest(
		id: number,
		update: QuestUpdateFields
	) {
		return this.post<QuestUpdate, Quest>(
			'update_quest',
			{ id, ...update });
	}

	deleteQuest(id: number) {
		return this.delete<Success, { id: number }>('delete_quest', { id })
			.then(assertSuccessful('Couldn\'t delete quest: ' + id));
	}
	
	getSideQuests() {
		return this.get<Quest[]>('get_side_quests');
	}

	getSideQuest(id: number) {
		return this.get<Quest, { id: number }>('get_side_quest', { id });
	}

	addSideQuest(name: string, priority: Priority, difficulty: Difficulty) {
		return this.post<NewQuest, Quest>('add_side_quest', {
			name, priority, difficulty
		});
	}

	updateSideQuest(
		id: number,
		update: QuestUpdateFields
	) {
		return this.post<QuestUpdate, Quest>(
			'update_side_quest',
			{ id, ...update });
	}

	deleteSideQuest(id: number) {
		return this.delete<Success, { id: number }>(
			'delete_side_quest',
			{ id })
			.then(assertSuccessful('Couldn\'t delete side quest: ' + id));
	}

}
