import S from "s-js";

import { AppView } from "./views";
import * as I from "./interfaces";
import * as C from "./controllers/all";


S.root(() => {
    const app: I.IApp = new C.App();
    
    const view = AppView.view(app);
    document.body.appendChild(view);

    setTimeout(() => AppView.queryTextBox.focus(), 100);
});
