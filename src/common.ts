﻿import { IDomainObject, RArray } from "./interfaces";
import Serializer from "./operations/Serializer";
import App from "./controllers/App";

export module Common {

    export function findById<T extends IDomainObject>(items: RArray<T>, id: number): T {
        const item = items.find(i => i.id === id)();
        if (item === undefined)
            throw "Item with key '" + id + "' is not present.";
        return item;
    }


    export function saveWithSerialize<T extends object>(key: string, value: ArrayLike<T>): void {
        const sv = new Serializer().toPlainObject(value);
        App.instance.localStore.save(key, sv);
    }


    export function download(fileName: string, text: string): void {
        const el = document.createElement("a");
        el.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(text));
        el.setAttribute("download", fileName);
        el.style.display = "none";
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }
}