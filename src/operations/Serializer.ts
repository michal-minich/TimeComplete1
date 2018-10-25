import S, { DataSignal as DataSignalType } from "s-js";
import SArray, { SArray as SArrayType } from "s-array";
import { Indexer, JsonValueType, ISerializer } from "../interfaces";


export class SSerializer implements ISerializer {

    serialize<T extends object>(value: T): string {
        const o = this.toPlainObject(value);
        return JSON.stringify(o);
    }


    toPlainObject(value: object): object {
        const v = this.toPlainSimple(value);
        if (v == undefined)
            throw undefined;
        return v as object;
    }


    toPlainSimple(v: any): JsonValueType | undefined {
        switch (typeof v) {
        case "string":
        case "number":
        case "boolean":
            return v;
        case "function":
            if (v.name) {
                if (v.name === "data" /* S data signal */) {
                    return this.toPlainSimple((v as DataSignalType<any>)());
                } else if (v.name === "array" /* S array */) {
                    return this.toPlainSimple((v as SArrayType<any>)());
                }
            }
            return undefined;
        case "undefined":
            return undefined;
        case "object":
            const o: Indexer<JsonValueType> = {};
            for (let k of Object.keys(v)) {
                const f = this.toPlainSimple(v[k]);
                if (f !== undefined)
                    o[k] = f;
            }
            return o;
        default:
            throw undefined;
        }
    }


    deserialize<T>(value: string): T {
        throw new Error("Not implemented");
    }
}