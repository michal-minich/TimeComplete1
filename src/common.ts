import S from "s-js"
import SArray from "s-array";
import {
        IDomainObject,
        ArraySignal,
        ValueSignal,
        WritableArraySignal,
        INoteDashItem,
        ITasksDashItem
    } from
    "./interfaces";


export function findById<T extends IDomainObject>(items: ArraySignal<T>, id: number): T {
    const item = items.find(i => i.id === id)();
    if (item === undefined)
        throw "Item with key '" + id + "' is not present.";
    return item;
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


export function removeTextSelections() {
    if (window.getSelection) {
        if (window.getSelection().empty) { // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) { // Firefox
            window.getSelection().removeAllRanges();
        }
    }
}


export function onClick(fn: (e: MouseEvent) => void) {
    return (el: HTMLElement) => {
        el.addEventListener("click", fn);
    };
}


export function onMouseDown(fn: (e: MouseEvent) => void) {
    return (el: HTMLElement) => {
        el.addEventListener("mousedown", fn);
    };
}

export function indexOfMin(array: ArrayLike<any>): number {
    if (array.length === 0)
        return -1;
    let min = array[0];
    let ix = 0;
    for (let i = 1; i < array.length; i++) {
        if (array[i] < min) {
            ix = i;
            min = array[i];
        }
    }
    return ix;
}


export function isValueSignal(v: any): v is ValueSignal<any> {
    return typeof v === "function" && (v as any).name === "data";
}


export function isNoteDashItem(v: any): v is INoteDashItem {
    return v.noteId && typeof v.noteId === "number";
}


export function isTasksDashItem(v: any): v is ITasksDashItem {
    return v.query && v.newTitle;
}


export function isArraySignal(v: NonNullable<object>): v is WritableArraySignal<any> {
    return typeof (v as any).mapS === "function";
}


export function isDomainObject(v: NonNullable<object>): v is IDomainObject {
    return typeof (v as any).id === "number" && typeof (v as any).createdOn.value === "string";
}


export module R {

    export function onAny<T>(fn: () => T): () => T;
    export function onAny<T>(fn: (v: T) => T, seed: T): () => T;
    export function onAny<T>(fn: any, seed?: T): () => T {
        return (S as any)(fn, seed);
    }

    export function root<T>(fn: (dispose: () => void) => T): T {
        return S.root(fn);
    }

    export function array<T>(): WritableArraySignal<any>;
    export function array<T>(values: T[]): WritableArraySignal<T>;
    export function array<T>(values?: T[]): WritableArraySignal<T> {
        return SArray(values == undefined ? [] : values);
    }

    export function data<T>(value: T): ValueSignal<T> {
        return S.data(value);
    }

    export function value<T>(value: T, eq?: (a: T, b: T) => boolean): ValueSignal<T> {
        return S.value(value, eq);
    }

    export function sample<T>(signal: ValueSignal<T>): T {
        return S.sample(signal);
    }


    export function freeze<T>(signal: ValueSignal<T>): T {
        return S.freeze(signal);
    }

    export function on<T>(ev: () => any, fn: () => T): () => T;
    export function on<T>(ev: () => any, fn: (v: T) => T, seed: T, onchanges?: boolean): () => T;
    export function on<T>(ev: () => any, fn?: any, seed?: T, onchanges?: boolean): T {
        return (S.on as any)(ev, fn, seed, onchanges);
    }


    export function onArrayChange<T>(
        arr: ArraySignal<T>,
        addedAction: (item: T) => void,
        removedAction: (item: T) => void) {
        S(() => {
            arr.map(
                addedAction,
                removedAction,
                () => {});
        });
    }


    export function onAdd<T>(arr: ArraySignal<T>, action: (item: T) => void) {
        S(() => {
            arr.map(
                (a) => {
                    console.log(action(a));
                },
                () => {},
                () => {});
        });
    }


    export function onRemove<T>(arr: ArraySignal<T>, action: (item: T) => void) {
        S(() => {
            arr.map(
                () => {},
                (r) => {
                    console.log(action(r));
                },
                () => {});
        });
    }
}