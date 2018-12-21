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
    isArraySignal
} from "../common";
import Settings from "../data/Settings";
import Tab from "../data/domain/Tab";
import Dashboard from "../data/dash/Dashboard";
import TasksDashItem from "../data/dash/TasksDashItem";
import Note from "../data/domain/Note";
import NoteDashItem from "../data/dash/NoteDashItem";


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
            const l = Label.createFromStore(
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
            const co = o.completedOn
                ? this.fromPlainObject<IDateTime>(o.completedOn, "DateTime")
                : undefined;
            const t = new Task(
                this.app,
                o.title,
                o.version,
                this.getAssociatedLabels(o),
                co,
                o.id,
                this.fromPlainObject<IDateTime>(o.createdOn, "DateTime"));

            return t as any as T;
        }
        case "Tab":
        {
            const tab = new Tab(
                this.app,
                o.title,
                o.customStyle ? this.getColorStyle(o.customStyle, o.id) : undefined,
                o.version,
                o.id,
                o.createdOn ? this.fromPlainObject<IDateTime>(o.createdOn, "DateTime") : undefined);
            tab.content = this.getDashboard(o.content);
            return tab as any as T;
        }
        case "Note":
        {
            const n = new Note(this.app, o.title || "Note", o.text, o.version, o.id, o.createdOn);
            n.associatedLabels = this.getAssociatedLabels(o);
            return n as any as T;
        }
        case "DashItem":
        {
            if (typeof o.note === "number") {
                const n = findById(this.app.data.notes, o.note);
                const nti = new NoteDashItem(this.app, n, o.width, o.height);
                return nti as any as T;
            } else if (typeof o.newTitle === "string") {
                const tdi = new TasksDashItem(this.app, o.query.text);
                tdi.newTitle(o.newTitle);
                return tdi as any as T;
            } else {
                throw o;
            }
        }
        case "Settings":
        {
            const s = new Settings();
            s.labelPrefix = o.labelPrefix;
            s.selectedTabIndex = o.selectedTabIndex;
            s.lastId = o.lastId;
            return s as any as T;
        }
        default:
            throw new Error();
        }
    }


    getAssociatedLabels(o: any): WritableArraySignal<ILabel> {
        if (o.associatedLabels) {
            return this.fromRefArray<ILabel>(
                o.associatedLabels as number[],
                this.app.data.labels);
        } else {
            return R.array([]);
        }
    }


    getDashboard(o: any): IDashboard {
        const d = new Dashboard(this.app, o.query.text);
        d.items = this.fromArray<IDashItem>(o.items, "DashItem");
        d.selected(o.selected);
        return d;
    }


    getColorStyle(o: any, owner: IDomainObject): ColorStyle {
        const cs = new ColorStyle(
            this.app,
            this.fromPlainObject<IColor>(o.backColor, "Color"),
            this.fromPlainObject<IColor>(o.customTextColor, "Color"),
            o.textColorInUse as TextColorUsage);
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