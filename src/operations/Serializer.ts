import {
    isValueSignal,
    isDomainObject,
    Indexer,
    JsonValueType,
    ISerializer,
    ILabel,
    IColor,
    ITask,
    IDateTime,
    LabelTextColor,
    ArraySignal,
    IApp,
    WritableArraySignal,
    isArraySignal
} from "../interfaces";
import Label from "../data/Label";
import Color from "../data/Color";
import DateTime from "../data/DateTime";
import Task from "../data/Task";
import LabelStyle from "../data/LabelStyle";
import { R, findById } from "../common";


export default class Serializer implements ISerializer {


    constructor(private readonly app: IApp) {}


    serialize<T extends object>(value: T): string {
        const o = this.toPlainObject(value);
        return JSON.stringify(o);
    }


    deserialize<T extends object>(value: string, type: string): T {
        const o = JSON.parse(value) as any;
        const o2 = this.fromPlainObject<T>(o, type);
        return o2;
    }


    toPlainObject<T extends object>(value: T): object {
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
            if (isValueSignal(v)) {
                return this.toPlain(v(), objLevel);
            } else if (isArraySignal(v)) {
                return this.toPlain((v as ArraySignal<any>)(), objLevel);
            }
            return undefined;
        case "undefined":
            return undefined;
        case "object":
            if (v === null)
                throw undefined;
            if (objLevel > 0 && typeof v == "object") {
                if (isDomainObject(v)) {
                    // ReSharper disable once TsResolvedFromInaccessibleModule
                    return v.id;
                } else if (isArraySignal(v)) {
                    // ReSharper disable once TsResolvedFromInaccessibleModule
                    return this.toPlain(v(), objLevel);
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
                    if (k === "app")
                        continue;
                    const f2 = this.toPlain(v[k], ++objLevel);
                    if (f2 !== undefined) {
                        if (k.endsWith("Signal"))
                            k = k.substring(0, k.length - 6);
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


    fromPlainObject<T extends object>(value: object, type: string): T {
        const o = value as any;
        switch (type) {
        case "Color":
            return new Color(o.value) as any as T;
        case "DateTime":
            return new DateTime(o.value) as any as T;
        case "Label":
            const l = new Label(
                this.app,
                o.name,
                new
                LabelStyle(
                    this.fromPlainObject<IColor>(o.style.backColor, "Color"),
                    this.fromPlainObject<IColor>(o.style.customTextColor, "Color"),
                    o.style.textColorInUse as LabelTextColor));
            l.id = o.id;
            l.createdOn = this.fromPlainObject<IDateTime>(
                o.createdOn,
                "DateTime");
            return l as any as T;
        case "Task":
            let associatedLabels: WritableArraySignal<ILabel>;
            if (o.associatedLabels) {
                associatedLabels = this.fromPlainObject<WritableArraySignal<ILabel>>(
                    o.associatedLabels,
                    "AssociatedLabels");
            } else {
                associatedLabels = R.array([]);
            }
            const t = new Task(this.app, o.title, associatedLabels);
            t.id = o.id;
            t.createdOn = this.fromPlainObject<IDateTime>(
                o.createdOn,
                "DateTime");
            if (o.completedOn) {
                t.completedOn = this.fromPlainObject<IDateTime>(
                    o.completedOn,
                    "DateTime");
            }
            return t as any as T;
        case "LabelList":
        {
            const items: ILabel[] = [];
            for (let item of o) {
                const i = this.fromPlainObject<ILabel>(item, "Label");
                items.push(i);
            }
            const ls = R.array(items);
            return ls as any as T;
        }
        case "TaskList":
        {
            const items: ITask[] = [];
            for (let item of o) {
                const i = this.fromPlainObject<ITask>(item, "Task");
                items.push(i);
            }
            const ts = R.array(items);
            return ts as any as T;
        }
        case "AssociatedLabels":
        {
            const items: ILabel[] = [];
            for (let item of o) {
                const i = findById(this.app.data.labels, item);
                items.push(i);
            }
            const als = R.array(items);
            return als as any as T;
        }
        default:
            throw new Error();
        }
    }
}