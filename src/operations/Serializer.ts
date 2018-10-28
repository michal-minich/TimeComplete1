import { SArray as SArrayType } from "s-array";
import {
    isDataSignal,
    isSArray,
    isDomainObjectList,
    isDomainObject,
    Indexer,
    JsonValueType,
    ISerializer,
    ILabel,
    IColor,
    ITask,
    IDateTime
} from "../interfaces";
import Label from "../data/Label";
import Color from "../data/Color";
import LabelList from "../data/LabelList";
import DateTime from "../data/DateTime";
import Task from "../data/Task";
import TaskList from "../data/TaskList";
import { AssociatedLabels } from "../data/Task";
import App from "../controllers/App";


export default class Serializer implements ISerializer {

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
                    // ReSharper disable once TsResolvedFromInaccessibleModule
                    return v.id;
                } else if (isDomainObjectList(v)) {
                    // ReSharper disable once TsResolvedFromInaccessibleModule
                    return this.toPlain(v.items, objLevel);
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
                o.name,
                this.fromPlainObject<IColor>(o.color, "Color"));
            l.id = o.id;
            l.createdOn = this.fromPlainObject<IDateTime>(
                o.createdOn,
                "DateTime");
            return l as any as T;
        case "Task":
            let associatedLabels: AssociatedLabels;
            if (o.associatedLabels) {
                associatedLabels = this.fromPlainObject<AssociatedLabels>(
                    o.associatedLabels,
                    "AssociatedLabels");
            } else {
                associatedLabels = new AssociatedLabels([]);
            }
            const t = new Task(o.title, associatedLabels);
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
            const ls = new LabelList(items);
            return ls as any as T;
        }
        case "TaskList":
        {
            const items: ITask[] = [];
            for (let item of o) {
                const i = this.fromPlainObject<ITask>(item, "Task");
                items.push(i);
            }
            const ts = new TaskList(items);
            return ts as any as T;
        }
        case "AssociatedLabels":
        {
            const items: ILabel[] = [];
            for (let item of o) {
                const i = App.instance.data.labels.byId(item);
                items.push(i);
            }
            const als = new AssociatedLabels(items);
            return als as any as T;
        }
        default:
            throw new Error();
        }
    }
}