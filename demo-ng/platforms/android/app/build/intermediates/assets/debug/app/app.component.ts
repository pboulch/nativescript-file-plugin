import { Component } from "@angular/core";
import { FilePlugin } from 'nativescript-file-plugin';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent { 
    

    
    click(){
        console.log("ON CLICK");
        let filePlugin = new FilePlugin();
        filePlugin.performFileSearch();
    }
}
