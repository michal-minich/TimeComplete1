import SessionStore from "../io/SessionStore";
import Clock from "../io/Clock";
import IncrementCounter from "../operations/IncrementCounter";
import {
    IApp,
    IData,
    IDataStore,
    IClock,
    IIdProvider,
    IDashboard
} from "../interfaces";
import mainView from "../views/MainView";
import Data from "../data/Data";


export default class App implements IApp {

    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly idCounter: IIdProvider<number>;

    readonly data: IData;

    constructor(el: Element) {

        this.localStore = new SessionStore();

        this.data = new Data(this);
        this.data.load();

        this.clock = new Clock();
        this.idCounter = new IncrementCounter(this);

        el.appendChild(mainView(this));
    }


    get dashboard(): IDashboard {
        const d = this.data;
        return d.tabs()[d.settings.selectedTabIndex()].content as IDashboard;
    }
}