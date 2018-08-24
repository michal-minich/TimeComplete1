import S from "s-js";

import { TaskController } from "./controllers";
import { AppView } from "./views";


export module App {
    export let ctrl = new TaskController();
}


S.root(() => {
    var view = AppView.view(App.ctrl);
    document.body.appendChild(view);
    setTimeout(()=> AppView.queryTextBox.focus(), 100);
});