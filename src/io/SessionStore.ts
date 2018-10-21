import { IDataStore } from "../interfaces";


export class SessionStore implements IDataStore {

    save(key: string, value: any): void {
        const v = JSON.stringify(value);
        window.localStorage.setItem(key, v);
    }


    load<T>(key: string): T | undefined {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value!) as T : undefined;
    }
}