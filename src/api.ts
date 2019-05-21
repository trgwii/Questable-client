import axios, { AxiosResponse } from 'axios';

import {
	Success,
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
	private token: string;
	private url: string;
	private client: typeof axios;

	public constructor(
		token: string,
		url = 'https://api.questable.webionite.com/',
		client = axios
	) {
		this.token = token;
		this.url = url;
		this.client = client;
	}

	private static handle<T>(res: Promise<AxiosResponse<T>>): Promise<T> {
		return res.then(getData).catch(throwError);
	}

	private get<R, D = undefined>(path: string, data?: D): Promise<R> {
		return Client.handle(this.client(this.url + path, {
			params: { token: this.token, ...data }
		}));
	}

	private post<D, R>(path: string, data?: D): Promise<R> {
		return Client.handle(this .client.post<R>(this.url + path, stringify({
			token: this.token,
			...data
		}), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}));
	}
	private delete<R, D = undefined>(path: string, data?: D): Promise<R> {
		return Client.handle(this.client.delete(this.url + path, {
			params: { token: this.token, ...data }
		}));
	}

	public auth() {
		return this.get<Success>('auth')
			.then(assertSuccessful('Invalid token'))
			.then(() => this.token);
	}

	public player() {
		return this.get<Player>('player');
	}

	public getQuests() {
		return this.get<Quest[]>('get_quests');
	}

	public getQuest(id: number) {
		return this.get<Quest, { id: number }>('get_quest', { id });
	}

	public addQuest(name: string, priority: Priority, difficulty: Difficulty) {
		return this.post<NewQuest, Quest>('add_quest', {
			name, priority, difficulty
		});
	}

	public updateQuest(
		id: number,
		update: QuestUpdateFields
	) {
		return this.post<QuestUpdate, Quest>(
			'update_quest',
			{ id, ...update });
	}

	public deleteQuest(id: number) {
		return this.delete<Success, { id: number }>('delete_quest', { id })
			.then(assertSuccessful('Couldn\'t delete quest: ' + id));
	}
	
	public getSideQuests() {
		return this.get<Quest[]>('get_side_quests');
	}

	public getSideQuest(id: number) {
		return this.get<Quest, { id: number }>('get_side_quest', { id });
	}

	public addSideQuest(name: string, priority: Priority, difficulty: Difficulty) {
		return this.post<NewQuest, Quest>('add_side_quest', {
			name, priority, difficulty
		});
	}

	public updateSideQuest(
		id: number,
		update: QuestUpdateFields
	) {
		return this.post<QuestUpdate, Quest>(
			'update_side_quest',
			{ id, ...update });
	}

	public deleteSideQuest(id: number) {
		return this.delete<Success, { id: number }>(
			'delete_side_quest',
			{ id })
			.then(assertSuccessful('Couldn\'t delete side quest: ' + id));
	}

}
