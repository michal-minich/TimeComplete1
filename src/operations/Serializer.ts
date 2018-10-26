import S, { DataSignal as DataSignalType } from "s-js";
import SArray, { SArray as SArrayType } from "s-array";
import { isDataSignal, isSArray, isDomainObjectList, isDomainObject, Indexer, JsonValueType, ISerializer } from "../interfaces";


export class SSerializer implements ISerializer {

    serialize<T extends object>(value: T): string {
        const o = this.toPlainObject(value);
        return JSON.stringify(o);
    }


    toPlainObject(value: object): object {
        const v = this.toPlain(value);
        if (v == undefined)
            throw undefined;
        return v as object;
    }


    toPlain(v: any, objLevel = 0): JsonValueType | undefined {
        switch (typeof v) {
        case "string":
        case "number":
        case "boolean":
            return v;
        case "function":
            if (isDataSignal(v)) {
                return this.toPlain(v(), objLevel);
            } else if (isSArray(v)) {
                return this.toPlain((v as SArrayType<any>)(), objLevel);
            }
            return undefined;
        case "undefined":
            return undefined;
        case "object":
            if (v === null)
                throw undefined;
            if (objLevel > 0 && typeof v == "object") {
                if (isDomainObject(v)) {
                    return v.id;
                } else if (isDomainObjectList(v)) {
                    return  this.toPlain(v.items, objLevel);
                }
            } 
            if (Array.isArray(v)) {
                //return v.map((i: any) => this.toPlain(i));
                const a: JsonValueType[] = [];
                for (let item of v) {
                    const plainItem = this.toPlain(item, objLevel);
                    if (plainItem === undefined)
                        throw undefined;
                    a.push(plainItem);
                }
                return a;
            } else {
                const o: Indexer<JsonValueType> = {};
                for (let k of Object.keys(v)) {
                    const f2 = this.toPlain(v[k], ++objLevel);
                    if (f2 !== undefined)
                        o[k] = f2;
                }
                return o;
            }
        case "symbol":
        default:
            throw undefined;
        }
    }


    deserialize<T>(value: string): T {
        const o = JSON.parse(value) as object;
        for (let k of Object.keys(o)) {
            
        }
        throw new Error("Not implemented");
    }
}