import { Common } from './file-plugin.common';
import { BehaviorSubject } from 'rxjs';
import * as application from "tns-core-modules/application";

let resultObservable: BehaviorSubject<string> = new BehaviorSubject("");

export class FilePlugin extends Common {
    static ACTION_OPEN_DOCUMENT: string = "android.intent.action.OPEN_DOCUMENT";
    static READ_REQUEST_CODE: number = 42;
    static REQUEST_EXTERNAL_STORAGE: number = 1;
    static PERMISSIONS_STORAGE: Array<string> = new Array(
        android.Manifest.permission.READ_EXTERNAL_STORAGE,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE
    );

    protected performFileSearch(): void {
        // ACTION_OPEN_DOCUMENT is the intent to choose a file via the system's file
        // browser.
        let intent: android.content.Intent = new android.content.Intent(FilePlugin.ACTION_OPEN_DOCUMENT);

        // Filter to only show results that can be "opened", such as a
        // file (as opposed to a list of contacts or timezones)
        intent.addCategory(android.content.Intent.CATEGORY_OPENABLE);

        // TODO use a parameter to choose the mime types you want
        intent.setType("*/*");
        let extraTypes = Array.create(java.lang.String, 10);
        extraTypes[0] = new java.lang.String("image/png");
        extraTypes[1] = new java.lang.String("image/jpeg");
        extraTypes[2] = new java.lang.String("application/pdf");
        extraTypes[3] = new java.lang.String("application/rtf");
        extraTypes[4] = new java.lang.String("text/rtf");
        extraTypes[5] = new java.lang.String("text/richtext");
        extraTypes[6] = new java.lang.String("application/x-rtf");
        extraTypes[7] = new java.lang.String("application/msword");
        extraTypes[8] = new java.lang.String("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        extraTypes[9] = new java.lang.String("application/vnd.oasis.opendocument.text");
        intent.putExtra("android.intent.extra.MIME_TYPES", extraTypes);
        intent.setFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);

        let context = application.android.foregroundActivity;

        context.onActivityResult = this.onActivityResult;

        context.startActivityForResult(intent, FilePlugin.READ_REQUEST_CODE);
    }

    public getFileURI(viewController: any = null): BehaviorSubject<string> {
        resultObservable = new BehaviorSubject("");
        this.performFileSearch();
        return resultObservable;
    }

    public static getFileName(uri: android.net.Uri): string {
        let context = application.android.foregroundActivity;
        let result = null;
        if (uri.getScheme() === "content") {
            let cursor = context.getContentResolver().query(uri, null, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            let cut = result.lastIndexOf('/');
            if (cut !== -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }

    public onActivityResult(requestCode: number, resultCode: number, resultData: android.content.Intent): void {
        console.log("onActivityResult");
        let context = application.android.foregroundActivity;
        // The ACTION_OPEN_DOCUMENT intent was sent with the request code
        // READ_REQUEST_CODE. If the request code seen here doesn't match, it's the
        // response to some other intent, and the code below shouldn't run at all.

        if (requestCode === FilePlugin.READ_REQUEST_CODE && resultCode === android.app.Activity.RESULT_OK) {
            // The document selected by the user won't be returned in the intent.
            // Instead, a URI to that document will be contained in the return intent
            // provided to this method as a parameter.
            // Pull that URI using resultData.getData().
            let uri: android.net.Uri = null;
            if (resultData != null) {
                uri = resultData.getData();

                let filename = FilePlugin.getFileName(uri);

                try {
                    let input: java.io.InputStream = context.getContentResolver().openInputStream(uri);
                    let path: java.io.File = context.getFilesDir();
                    let targetFile: java.io.File = new java.io.File(path, filename);

                    let permission: number = androidx.core.app.ActivityCompat.checkSelfPermission(context, android.Manifest.permission.WRITE_EXTERNAL_STORAGE);
                    if (permission !== android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        // We don't have permission so prompt the user
                        console.log("insufficient permissions");
                    }

                    let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), input.available());
                    input.read(buffer);

                    let outStream: java.io.OutputStream = new java.io.FileOutputStream(targetFile);
                    outStream.write(buffer);

                    console.log("file copied at : " + targetFile.getPath());

                    if (resultObservable == null) {
                        resultObservable = new BehaviorSubject(targetFile.getPath());
                    } else {
                        resultObservable.next(targetFile.getPath());
                    }
                } catch (e) {
                    console.dir(e);
                }
            }
        }
    }
}