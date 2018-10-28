import { SArray as SArrayType } from "s-array";
import { IDomainObject } from "./interfaces";

export module Common {

    export function findById<T extends IDomainObject>(items: SArrayType<T>, id: number): T {
        const item = items.find(i => i.id === id)();
        if (item === undefined)
            throw "Item with key '" + id + "' is not present.";
        return item;
    }
}