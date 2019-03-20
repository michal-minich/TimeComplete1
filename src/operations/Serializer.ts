import {
    Indexer,
    JsonValueType,
    ISerializer,
    ILabel,
    IColor,
    IDateTime,
    TextColorUsage,
    ArraySignal,
    IApp,
    WritableArraySignal,
    IDomainObject,
    IDashboard,
    IDashItem
} from "../interfaces";
import Label from "../data/domain/Label";
import Color from "../data/value/Color";
import DateTime from "../data/value/DateTime";
import Task from "../data/domain/Task";
import ColorStyle from "../data/value/ColorStyle";
import {
    R,
    findById,
    isValueSignal,
    isDomainObject,
    isArraySignal,
    C
} from "../common";
import DataFields from "../data/DataFields";
import Tab from "../data/domain/Tab";
import Dashboard from "../data/dash/Dashboard";
import TasksDashItem from "../data/dash/TasksDashItem";
import TaskDashItem from "../data/dash/TaskDashItem";


export default class Serializer implements ISerializer {


    constructor(private readonly app: IApp) {}


    static usedIds: Array<number> = [];


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
            if (objLevel > 0 && typeof v === "object") {
                if (isDomainObject(v)) {
                    // ReSharper disable once TsResolvedFromInaccessibleModule
                    return v.id;
                } else if (isArraySignal(v)) {
                    // ReSharper disable once TsResolvedFromInaccessibleModule
                    return this.toPlain(v(), objLevel);
                }
            }
            if (Array.isArray(v)) {
                const a: JsonValueType[] = [];
                for (const item of v) {
                    const plainItem = this.toPlain(item, objLevel);
                    if (plainItem === undefined)
                        throw undefined;
                    a.push(plainItem);
                }
                return a;
            } else {
                const o: Indexer<JsonValueType> = {};
                for (const k of Object.keys(v)) {
                    if (k === "app" || k === "matcher" || k === "type" || k === "owner")
                        continue;
                    const f2 = this.toPlain(v[k], ++objLevel);
                    if (k === "version" && o[k] === undefined) {
                        o[k] = 1;
                    }
                    if (f2 !== undefined) {
                        if (k.endsWith("Signal"))
                            o[k.substring(0, k.length - 6)] = f2;
                        else
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
        {
            Serializer.usedIds.push(o.id as number);
            const l = new Label(
                this.app,
                o.name,
                this.getColorStyle(o.style, o),
                o.version,
                o.id,
                this.fromPlainObject<IDateTime>(o.createdOn, "DateTime"));
            return l as any as T;
        }
        case "Task":
        {
            this.fixDuplicateId(o);
            const co = o.completedOn
                ? this.fromPlainObject<IDateTime>(o.completedOn, "DateTime")
                : undefined;
            const t = new Task(
                this.app,
                o.title,
                o.text,
                o.version,
                this.getAssociatedLabels(o),
                co,
                o.id,
                this.fromPlainObject<IDateTime>(o.createdOn, "DateTime"));

            return t as any as T;
        }
        case "Tab":
        {
            Serializer.usedIds.push(o.id as number);
            const tab = new Tab(
                this.app,
                o.title,
                o.customStyle ? this.getColorStyle(o.customStyle, o.id) : undefined,
                o.version,
                o.id,
                this.fromPlainObject<IDateTime>(o.createdOn, "DateTime"));
            tab.content = this.getDashboard(o.content);
            return tab as any as T;
        }
        case "DashItem":
        {
            if (typeof o.task === "number") {
                const n = findById(this.app.data.tasks, o.task);
                const nti = new TaskDashItem(this.app, n, o.width, o.height);
                return nti as any as T;
            } else if (typeof o.newTitle === "string") {
                const tdi = new TasksDashItem(this.app, o.query.text);
                tdi.newTitle(o.newTitle);
                return tdi as any as T;
            } else {
                throw o;
            }
        }
        case "DataFields":
        {
            const s = new DataFields();
            s.labelPrefix = o.labelPrefix;
            s.selectedTabIndex = o.selectedTabIndex;
            s.lastId = o.lastId;
            return s as any as T;
        }
        default:
            throw new Error();
        }
    }


    fixDuplicateId(o: any) {
        const id = o.id as number;
        if (Serializer.usedIds.indexOf(id) !== -1) {
            o.id = this.app.data.getNextId();
            console.log("Duplicate Id Changed:" + id + "->" + o.id + " " + o.title);
        }
        Serializer.usedIds.push(o.id as number);
    }


    getAssociatedLabels(o: any): WritableArraySignal<ILabel> {
        if (o.labelsFromUser) {
            return this.fromRefArray<ILabel>(
                o.labelsFromUser as number[],
                this.app.data.labels);
        } else {
            return R.array([]);
        }
    }


    getDashboard(o: any): IDashboard {
        const d = new Dashboard(this.app, o.query.text);
        d.items = this.fromArray<IDashItem>(o.items, "DashItem");
        d.columnsCount = o.columnsCount;
        d.selected(o.selected);
        return d;
    }


    getColorStyle(o: any, owner: IDomainObject): ColorStyle {
        const cs = new ColorStyle(
            this.app,
            this.fromPlainObject<IColor>(o.backColor, "Color"),
            this.fromPlainObject<IColor>(o.customTextColor, "Color"),
            o.textColorInUse as TextColorUsage);
        C.assume(owner !== undefined);
        cs.owner = owner;
        return cs;
    }


    fromRefArray<T extends IDomainObject>(
        ids: number[],
        source: ArraySignal<T>): WritableArraySignal<T> {

        const items: T[] = [];
        for (const id of ids) {
            const i = findById<T>(source, id);
            items.push(i);
        }
        return R.array(items);
    }


    fromArray<T extends object>(arr: object[], itemType: string): WritableArraySignal<T> {
        const items: T[] = [];
        for (const item of arr) {
            const i = this.fromPlainObject<T>(item, itemType);
            items.push(i);
        }
        return R.array(items);
    }
}