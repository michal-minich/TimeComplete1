import {
    IApp,
    IData,
    IClock,
    IDataStore,
    ISyncLog,
    ISerializer
} from "../interfaces";

import Clock from "./io/Clock";
import mainView from "../views/MainView";
import Data from "./Data";
import { R } from "../common";
import SyncLog from "../components/SyncLog";
import LocalStore from "./io/LocalStore";
import Serializer from "../operations/Serializer";
import { AppDataOps } from "../operations/AppDataOps";


async function test1() {
    const req = new Request("http://localhost:55111/api/values");
    const response = await fetch(req);
    const json = await response.json();
    console.log(json);
}


document.addEventListener("DOMContentLoaded",
    () => {
        // test1();
        R.root(() => {
            const app: IApp = new App();
            (window as any).app = app; // for debugging in browser
        });
    });


export default class App implements IApp {

    readonly clock: IClock;
    readonly serializer: ISerializer;
    readonly localStore: IDataStore;
    readonly sync: ISyncLog;
    readonly data: IData;

    constructor() {

        this.clock = new Clock();
        this.clock = new Clock();
        this.serializer = new Serializer(this);
        this.localStore = new LocalStore();
        this.sync = new SyncLog(this);
        this.data = new Data(this);

        AppDataOps.loadAppData(this);

        document.body.appendChild(mainView(this));
    }
}