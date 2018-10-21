interface ISerializer {
    serialize<T>(value: T): string;
    deserialize<T>(value: string): T;
}


type Indexer<T> = { [key: string]: T };

type Simple = string | number | boolean;

export class SSerializer implements ISerializer {

    serialize<T>(value: T): string {
        const o = this.toPlain(value);
        return JSON.stringify(o);
    }


    toPlain<T extends Indexer<any>>(value: T): any {
        const o: Indexer<Simple | Simple[]> = {};

        for (let k of Object.keys(value)) {
            let v = value[k];
            if (typeof v === "function" && v.name && v.name === "data") {
                v = (v as () => any)();
            }
            switch (typeof v) {
            case "string":
            case "number":
            case "boolean":
                o[k] = v;
                break;
            case "object":
                o[k] = this.toPlain(v);
                break;
            default:
                throw undefined;
            }
        }
        return o;
    }

    toPlainSimple<T>(value: Simple) {
    }

    deserialize<T>(value: string): T {
        throw new Error("Not implemented");
    }
}