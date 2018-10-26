import S, { DataSignal as DataSignalType } from "s-js";
import SArray, { SArray as SArrayType } from "s-array";
import { isDomainObject, Indexer, JsonValueType, ISerializer } from "../interfaces";


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


    toPlain(v: any): JsonValueType | undefined {
        switch (typeof v) {
        case "string":
        case "number":
        case "boolean":
            return v;
        case "function":
            if (v.name) {
                if (v.name === "data") {
                    return this.toPlain((v as DataSignalType<any>)());
                } else if (v.name === "array") {
                    return this.toPlain((v as SArrayType<any>)());
                }
            }
            return undefined;
        case "undefined":
            return undefined;
        case "object":
            if (v === null)
                throw undefined;
            if (Array.isArray(v)) {
                //return v.map((i: any) => this.toPlain(i));
                const a: JsonValueType[] = [];
                for (let item of v) {
                    const plainItem = this.toPlain(item);
                    if (plainItem === undefined)
                        throw undefined;
                    a.push(plainItem);
                }
                return a;
            } else {
                const o: Indexer<JsonValueType> = {};
                for (let k of Object.keys(v)) {
                    const f = v[k];
                    const f2 = this.toPlain(f);
                    if (typeof f2 == "object" && isDomainObject(f2)) {
                        o[k] = f2.id;
                    } else if (f2 !== undefined) {
                        o[k] = f2;
                    }
                }
                return o;
            }
        case "symbol":
        default:
            throw undefined;
        }
    }


    deserialize<T>(value: string): T {
        const o = JSON.parse(value);
        throw new Error("Not implemented");
    }
}