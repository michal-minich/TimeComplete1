import S from "s-js";

import { AppView } from "./views";
import * as I from "./interfaces";
import * as C from "./controllers/all";
import { SSerializer } from "./Serializer";


S.root(() => {
    const app: I.IApp = new C.App();
    
    const view = AppView.view(app);
    document.body.appendChild(view);

    var s = new SSerializer();
    //console.log(s.toPlain(app.labelStore.labels()));
    //console.log(s.toPlain(app.taskStore.tasks()));

    setTimeout(() => AppView.queryTextBox.focus(), 100);
});
