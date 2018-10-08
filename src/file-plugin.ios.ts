import { Common } from './file-plugin.common';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from "rxjs";
import { ios as iosApp } from "tns-core-modules/application";
import { DocumentPickerService } from './document-picker.service';

var resultObservable: BehaviorSubject<string> = new BehaviorSubject("");

export class FilePlugin extends Common {

    subscription: Subscription;
    dp: DocumentPickerService = new DocumentPickerService();

    constructor(){
        super();
    }

    public getFileURI(): BehaviorSubject<string> {
        resultObservable = new BehaviorSubject("");
        var window = iosApp.nativeApp.keyWindow || (iosApp.nativeApp.windows.count > 0 && iosApp.nativeApp.windows[0]);
        if (window) {
            var rootController = window.rootViewController;
            if (rootController) {
                console.log('Showing native IOS document picker');
                this.dp.show(rootController);
            }

            console.log("subscribing to file URL");
            this.subscription = DocumentPickerService.getFileURL().subscribe((result) => {
                console.log("Data from DPS : " + result);
                if (result != "") {
                    resultObservable.next(result);
                    this.subscription.unsubscribe();
                }
            });
        }
        return resultObservable;
    }
}
