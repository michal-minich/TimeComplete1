import LocalStore from "../io/LocalStore";
import Clock from "../io/Clock";
import {
    IApp,
    IData,
    IDataStore,
    IClock
} from "../interfaces";
import mainView from "../views/MainView";
import Data from "./Data";


export default class App implements IApp {

    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly data: IData;


    constructor(el: Element) {

        this.localStore = new LocalStore();
        this.clock = new Clock();
        this.data = new Data(this);
        this.data.load();

        //this.debugPrintIds();

        (window as any).app = this; // for debugging in browser

        el.appendChild(mainView(this));
    }


    private debugPrintIds() {

        const ids: Array<{ id: number, type: string }> = [];

        for (let t of this.data.tasks()) {
            const f = ids.find(i => i.id === t.id);
            if (f === undefined) {
                ids.push({ id: t.id, type: "task" });
            } else {
                f.type += ", task";
            }
        }

        for (let t of this.data.labels()) {
            const f = ids.find(i => i.id === t.id);
            if (f === undefined) {
                ids.push({ id: t.id, type: "label" });
            } else {
                f.type += ", label";
            }
        }

        for (let t of this.data.notes()) {
            const f = ids.find(i => i.id === t.id);
            if (f === undefined) {
                ids.push({ id: t.id, type: "notes" });
            } else {
                f.type += ", notes";
            }
        }

        for (let t of this.data.tabs()) {
            const f = ids.find(i => i.id === t.id);
            if (f === undefined) {
                ids.push({ id: t.id, type: "tab" });
            } else {
                f.type += ", tab";
            }
        }

        console.log(ids);
    }
}