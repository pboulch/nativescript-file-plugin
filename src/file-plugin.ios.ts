import { AsyncSubject, Subscription } from 'rxjs';
import { DocumentPickerService } from './document-picker.service';
import { Common } from './file-plugin.common';

let resultObservable: AsyncSubject<string> = new AsyncSubject();

export class FilePlugin extends Common {
    private subscription: Subscription;
    private dp: DocumentPickerService = new DocumentPickerService();

    public getFileURI(viewController: any): AsyncSubject<string> {
        if (viewController == null) {
            console.error("viewController must not be null");
        }

        resultObservable = new AsyncSubject();

        console.log('Showing native IOS document picker');
        this.dp.show(viewController);

        this.subscription = DocumentPickerService.getFileURL().subscribe((result) => {
            if (result !== "") {
                resultObservable.next(result);
                resultObservable.complete();
                this.subscription.unsubscribe();
            }
        });

        return resultObservable;
    }
}
