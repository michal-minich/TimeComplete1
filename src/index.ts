import S from "s-js";

import { TestController } from "./controllers";
import { AppView } from "./views";


var ctrl = new TestController();

S.root(() => {
    var view = AppView(ctrl);
    document.body.appendChild(view);
});