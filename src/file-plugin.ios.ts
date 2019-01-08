import { Common } from './file-plugin.common';
import { BehaviorSubject, AsyncSubject } from 'rxjs';
import { Subscription } from "rxjs";
import { ios as iosApp } from "tns-core-modules/application";
import { DocumentPickerService } from './document-picker.service';

let resultObservable: AsyncSubject<string> = new AsyncSubject();

export class FilePlugin extends Common {

    subscription: Subscription;
    dp: DocumentPickerService = new DocumentPickerService();

    constructor() {
        super();
    }

    public getFileURI(): AsyncSubject<string> {
        resultObservable = new AsyncSubject();
        let window = iosApp.nativeApp.keyWindow || (iosApp.nativeApp.windows.count > 0 && iosApp.nativeApp.windows[0]);
        if (window) {
            let rootController = window.rootViewController;
            if (rootController) {
                console.log('Showing native IOS document picker');
                this.dp.show(rootController);
            }

            console.log("subscribing to file URL");
            this.subscription = DocumentPickerService.getFileURL().subscribe((result) => {
                console.log("Data from DPS : " + result);
                if (result !== "") {
                    resultObservable.next(result);
                    resultObservable.complete();
                    this.subscription.unsubscribe();
                }
            });
        }
        return resultObservable;
    }
}
