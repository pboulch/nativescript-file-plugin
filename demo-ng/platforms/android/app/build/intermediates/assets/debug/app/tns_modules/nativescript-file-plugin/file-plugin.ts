import { Common } from './file-plugin.common';
import app = require("tns-core-modules/application");


export class FilePlugin extends Common {

    private static READ_REQUEST_CODE : number = 42;

    public performFileSearch() : void {

        console.log("HERE 23");

        // ACTION_OPEN_DOCUMENT is the intent to choose a file via the system's file
        // browser.
        let intent : android.content.Intent = new android.content.Intent("android.intent.action.OPEN_DOCUMENT");

        // Filter to only show results that can be "opened", such as a
        // file (as opposed to a list of contacts or timezones)
        intent.addCategory(android.content.Intent.CATEGORY_OPENABLE);

        // Filter to show only images, using the image MIME data type.
        // If one wanted to search for ogg vorbis files, the type would be "audio/ogg".
        // To search for all documents available via installed storage providers,
        // it would be "*/*".
        intent.setType("image/*");

        app.android.foregroundActivity.startActivityForResult(intent, FilePlugin.READ_REQUEST_CODE);
    }
}
