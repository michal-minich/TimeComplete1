import { SArray as SArrayType } from "s-array";
import { IDomainObject } from "./interfaces";
import Serializer from "./operations/Serializer";
import App from "./controllers/App";

export module Common {

    export function findById<T extends IDomainObject>(items: SArrayType<T>, id: number): T {
        const item = items.find(i => i.id === id)();
        if (item === undefined)
            throw "Item with key '" + id + "' is not present.";
        return item;
    }


    export function saveWithSerialize<T extends object>(key: string, value: ArrayLike<T>): void {
        const sv = new Serializer().toPlainObject(value);
        App.instance.sessionStore.save(key, sv);
    }
}