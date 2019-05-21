export interface Success {
	success: boolean;
}

export interface Error {
	error: string;
}

export enum Priority {
	Low = 1,
	Medium = 2,
	High = 3
}

export enum Difficulty {
	Low = 1,
	Medium = 2,
	High = 3
}

export type Completed = boolean;

export interface Player {
	xp: number;
	quests_completed: number;
	total_quests: number;
	side_quests_completed: number;
	total_side_quests: number;
}

export interface Quest {
	id: number;
	name: string;
	difficulty: Difficulty;
	priority: Priority;
	state: Completed;
}

export interface NewQuest {
	name: string;
	priority: Priority;
	difficulty: Difficulty;
}

export interface QuestUpdateFields {
	state?: boolean;
	name?: string;
	priority?: Priority;
	difficulty?: Difficulty;
}

export interface QuestUpdate extends QuestUpdateFields {
	id: number;
}
