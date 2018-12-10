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

        el.appendChild(mainView(this));
    }
}