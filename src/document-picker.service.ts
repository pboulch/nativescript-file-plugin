import { BehaviorSubject } from 'rxjs';
import * as utils from 'tns-core-modules/utils/utils';

export class DocumentPickerService {
    private documentPicker: UIDocumentPickerViewController;

    static fileURLObservable : BehaviorSubject<string> = new BehaviorSubject<string>("");

    fileUrl: string;

    show(vc: UIViewController) {
        DocumentPickerService.fileURLObservable = new BehaviorSubject("");
        const documentTypes = utils.ios.collections.jsArrayToNSArray([kUTTypeImage, kUTTypePDF]);
        this.documentPicker = UIDocumentPickerViewController.alloc().initWithDocumentTypesInMode(documentTypes, UIDocumentPickerMode.Import);
        this.documentPicker.delegate = DocumentPickerDelegate.initWithOwner(new WeakRef(this));

        vc.presentViewControllerAnimatedCompletion(this.documentPicker, true, null);
    }

    addFileUrl(fileUrl: NSURL) {
        console.log("File picked : " + fileUrl.path);
        this.fileUrl = fileUrl.path;
        DocumentPickerService.fileURLObservable.next(fileUrl.path);
    }

    static getFileURL() : BehaviorSubject<string>{
        return DocumentPickerService.fileURLObservable;
    }

    static resetObservable() : void {
        DocumentPickerService.fileURLObservable = new BehaviorSubject("");
    }
}

class DocumentPickerDelegate extends NSObject implements UIDocumentPickerDelegate {
    private owner: WeakRef<DocumentPickerService>;
    public static ObjCProtocols = [UIDocumentPickerDelegate];

    static initWithOwner(owner: WeakRef<DocumentPickerService>): DocumentPickerDelegate {
        const delegate = <DocumentPickerDelegate>DocumentPickerDelegate.new();
        delegate.owner = owner;

        return delegate;
    }

    documentPickerDidPickDocumentAtURL(controller: UIDocumentPickerViewController, url: NSURL) {
        console.log("documentPickerDidPickDocumentAtURL");
        this.owner.get().addFileUrl(url);
    }
    documentPickerWasCancelled?(controller: UIDocumentPickerViewController) {
        console.log("documentPickerWasCancelled");
    }
}

