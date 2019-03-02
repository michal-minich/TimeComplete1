import { IDataStore } from "../../interfaces";


export default class LocalStore implements IDataStore {

    save<T extends object>(key: string, value: T): void {
        const v = JSON.stringify(value);
        window.localStorage.setItem(key, v);
    }


    load<T extends object>(key: string): T {
        const value = this.loadOrUndefined<T>(key);
        if (value === undefined)
            throw new Error("Value of key '" + key + "' is undefined.");
        return value;
    }


    loadOrUndefined<T extends object>(key: string): T | undefined {
        const value = window.localStorage.getItem(key);
        if (value)
            return JSON.parse(value) as T;
        return undefined;
    }
}