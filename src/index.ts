import S from "s-js";

import { TaskController } from "./controllers";
import { AppView } from "./views";


var ctrl = new TaskController();

S.root(() => {
    var view = AppView(ctrl);
    document.body.appendChild(view);
});