import { Component } from "@angular/core";
import { FilePlugin } from 'nativescript-file-plugin';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent { 
    
    url : string;
    
    click(){
        console.log("ON CLICK");
        let filePlugin = new FilePlugin();
        filePlugin.getFileURI().subscribe((uri)=>{
            console.log("SUBSCRIBE "+uri);
            if(uri != "")
                this.url = uri;
        });
    }
}
