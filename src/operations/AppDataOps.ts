import { R } from "../common";
import {
        ITask,
        WritableArraySignal,
        ILabel,
        INote,
        IDataFields,
        ITab,
        IApp,
        IDataStore,
    } from
    "../interfaces";
import DataFields from "../data/DataFields";
import { addTab } from "../data/domain/Tab";
import Data from "../components/Data";


export module AppDataOps {


    export function loadAppData(app: IApp): void {

        const d = app.data as Data;

        try {

            d.fields = loadObj<IDataFields>(app, "fields", "DataFields", () => new DataFields());
            d.labels = loadArray<ILabel>(app, "labels", "Label");
            d.tasks = loadArray<ITask>(app, "tasks", "Task");
            d.notes = loadArray<INote>(app, "notes", "Note");
            d.tabs = loadArray<ITab>(app, "tabs", "Tab");

        } catch (ex) {

            d.fields = new DataFields();
            d.labels = R.array();
            d.tasks = R.array();
            d.notes = R.array();
            d.tabs = R.array();

            console.log(ex);
            return;

        } finally {

            if (d.tabs().length === 0)
                addTab(app);
        }

        setupStoreSave(app);
    }


    export function exportData(s: IDataStore): void {
        const data = {
            labels: s.load("labels"),
            tasks: s.load("tasks"),
            notes: s.load("notes"),
            tabs: s.load("tabs"),
            fields: s.load("fields")
        };
        download("export.json", JSON.stringify(data));
    }


    export function importData(s: IDataStore): void {
        const input = document.createElement("input")!;
        input.type = "file";
        input.addEventListener("change",
            () => {
                const file: any = input.files![0];
                const fr = new FileReader();
                fr.addEventListener("load",
                    () => {
                        const json = fr.result as string;
                        const o = JSON.parse(json) as any;
                        s.save("labels", o.labels);
                        s.save("tasks", o.tasks);
                        s.save("notes", o.notes);
                        s.save("tabs", o.tabs);
                        s.save("fields", o.fields);
                    });
                fr.readAsText(file);
            },
            false);
        input.click();
    }


    function download(fileName: string, text: string): void {
        const el = document.createElement("a");
        el.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(text));
        el.setAttribute("download", fileName);
        el.style.display = "none";
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }


    function loadArray<T extends object>(app: IApp, key: string, type: string): WritableArraySignal<T> {
        const arr = app.localStore.loadOrUndefined(key);
        return arr === undefined
            ? R.array()
            : app.serializer.fromArray<T>(arr as object[], type);
    }


    function loadObj<T extends object>(app: IApp, key: string, type: string, init: () => T): T {
        const o = app.localStore.loadOrUndefined(key);
        return o === undefined
            ? init()
            : app.serializer.fromPlainObject<T>(o, type);
    }


    function setupStoreSave(app: IApp) {

        const d = app.data as Data;

        R.onAny(() => {
            const labels = d.labels();
            saveWithSerialize(app, "labels", labels);
        });

        R.onAny(() => {
            const tasks = d.tasks();
            saveWithSerialize(app, "tasks", tasks);
        });

        R.onAny(() => {
            const notes = d.notes();
            saveWithSerialize(app, "notes", notes);
        });

        R.onAny(() => {
            const tabs = d.tabs();
            saveWithSerialize(app, "tabs", tabs);
        });

        R.onAny(() => {
            const fields = d.fields;
            saveWithSerialize(app, "fields", fields);
        });
    }


    function saveWithSerialize<T extends object>(
        app: IApp,
        key: string,
        value: T): void {

        const sv = app.serializer.toPlainObject(value);
        app.localStore.save(key, sv);
    }
}