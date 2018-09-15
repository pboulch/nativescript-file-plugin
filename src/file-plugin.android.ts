import { Common } from './file-plugin.common';
import {BehaviorSubject} from 'rxjs';
var application = require("application");


var resultObservable : BehaviorSubject<string> = new BehaviorSubject(""); 

export class FilePlugin extends Common {

    static ACTION_OPEN_DOCUMENT : string = "android.intent.action.OPEN_DOCUMENT";
    static READ_REQUEST_CODE : number = 42;

    uri : string ; 


    protected performFileSearch() : void{

        // ACTION_OPEN_DOCUMENT is the intent to choose a file via the system's file
        // browser.
        

        let intent : android.content.Intent = new android.content.Intent(FilePlugin.ACTION_OPEN_DOCUMENT);
    
        // Filter to only show results that can be "opened", such as a
        // file (as opposed to a list of contacts or timezones)
        intent.addCategory(android.content.Intent.CATEGORY_OPENABLE);
    
        // Filter to show only images, using the image MIME data type.
        // If one wanted to search for ogg vorbis files, the type would be "audio/ogg".
        // To search for all documents available via installed storage providers,
        // it would be "*/*".
        intent.setType("image/*");
    
        
        var context = application.android.foregroundActivity;
        
        context.onActivityResult = this.onActivityResult;

        context.startActivityForResult(intent, FilePlugin.READ_REQUEST_CODE);
        
    }

    public getFileURI() : BehaviorSubject<string>{
        this.performFileSearch();
        return resultObservable;
    }

    public onActivityResult (requestCode : number , resultCode : number , resultData : android.content.Intent) : void {
        var context = application.android.foregroundActivity;
        // The ACTION_OPEN_DOCUMENT intent was sent with the request code
        // READ_REQUEST_CODE. If the request code seen here doesn't match, it's the
        // response to some other intent, and the code below shouldn't run at all.

        if (requestCode == FilePlugin.READ_REQUEST_CODE && resultCode == android.app.Activity.RESULT_OK) {
            // The document selected by the user won't be returned in the intent.
            // Instead, a URI to that document will be contained in the return intent
            // provided to this method as a parameter.
            // Pull that URI using resultData.getData().
            let uri : android.net.Uri = null;
            if (resultData != null) {
                uri = resultData.getData();
                console.log(uri);
                this.uri = uri.toString();
                if(resultObservable == null)
                    resultObservable = new BehaviorSubject(uri.toString());
                else
                    resultObservable.next(uri.toString());
            }
        }
    }


}