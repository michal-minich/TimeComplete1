import S from "s-js";

import { AppView } from "./views";
import * as M from "./model";
import * as C from "./controllers";
import { SSerializer } from "./Serializer";


S.root(() => {
    const app: M.IApp = new C.App();

    C.initSampleData(app);

    const view = AppView.view(app);
    document.body.appendChild(view);

    var s = new SSerializer();
    //console.log(s.toPlain(app.labelStore.labels()));
    //console.log(s.toPlain(app.taskStore.tasks()));

    setTimeout(() => AppView.queryTextBox.focus(), 100);
});