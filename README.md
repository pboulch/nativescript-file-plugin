# Picker file for NativeScript

Picker file (not only medias files) for NativeScript

Plugin downloads the file locally if it's a file on iCloud or Google Drive.

## Installation

```
tns plugin add https://github.com/pboulch/nativescript-file-plugin/raw/master/publish/package/nativescript-file-plugin-1.1.0.tgz
```

## Usage 
	
On Android, this plugin requires the following permissions : READ_EXTERNAL_STORAGE and WRITE_EXTERNAL_STORAGE.
On iOS, you have to pass the current viewController as a parameter. It can be passed on android, it's just useless. It allows to open the picker from another window (for example a modal).

    let filePlugin = new FilePlugin();
    filePlugin.getFileURI(page.viewController).subscribe((uri) => {
        if (uri != ""){
            console.log("File selected's uri : " + uri);
        }
    });
    

    
## License

Apache License Version 2.0, January 2004
