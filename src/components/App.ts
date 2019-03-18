import {
    IApp,
    IData,
    IClock,
    IDataStore,
    ISyncLog,
    ISerializer,
    IAppUc
} from "../interfaces";

import Clock from "./io/Clock";
import AppUc from "../ui/AppUc";
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

    readonly clock: IClock = new Clock();
    readonly serializer: ISerializer = new Serializer(this);
    readonly localStore: IDataStore = new LocalStore();
    readonly sync: ISyncLog = new SyncLog(this);
    readonly data: IData = new Data(this);
    readonly ui: IAppUc;

    constructor() {

        AppDataOps.loadAppData(this);
        
        this.ui = new AppUc(this);

        document.body.appendChild(this.ui.view);
    }
}