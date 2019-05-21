import { AxiosResponse, AxiosError } from 'axios';
import { Success, Error } from './types';

export const getData = (res: AxiosResponse) => res.data;

export const assertSuccessful = (error: string) => (res: Success) => {
	if (!res.success) {
		throw new Error(error);
	}
	return res;
};

export const isError = (x: any): x is Error =>
	x &&
	Object.keys(x).length === 1 &&
	typeof x.error === 'string';

export const throwError = (err: AxiosError): never => {
	if (err.response && isError(err.response.data)) {
		const { data } = err.response;
		const error = new Error(data.error);
		(error as any).code = err.response.status;
		throw error;
	}
	throw err;
}

export const stringify = (params: Record<string, string>) =>
	new URLSearchParams(params).toString();
