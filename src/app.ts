import S from "s-js";

import { AppView } from "./views";
import * as M from "./model";
import * as C from "./controllers";


S.root(() => {
    const app: M.IApp = new C.App();

    C.initSampleData(app);

    const view = AppView.view(app);
    document.body.appendChild(view);

    setTimeout(() => AppView.queryTextBox.focus(), 100);
});