import S from "s-js";

import { AppView } from "./views";
import * as M from "./model";
import * as C from "./controllers";


S.root(() => {
    const app: M.IApp = new C.App();

    C.initSampleData(app);

    const view = AppView.view(app);
    document.body.appendChild(view);

    const view2 = AppView.labelAssignView(app);
    document.body.appendChild(view2);

    setTimeout(() => AppView.queryTextBox.focus(), 100);
});