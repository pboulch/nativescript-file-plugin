# Picker file for NativeScript

Picker file (not only medias files) for NativeScript

Plugin downloads the file locally if it's a file on iCloud or Google Drive.

## Installation

```
tns plugin add https://github.com/pboulch/nativescript-file-plugin/raw/master/publish/package/nativescript-file-plugin-1.1.0.tgz
```

## Usage 
	
	
    let permissionsRequired = new Array();
        if (isAndroid) {
            permissionsRequired = new Array(
                android.Manifest.permission.READ_EXTERNAL_STORAGE,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            );
        }

        permissions.requestPermissions(permissionsRequired)
            .then(function () {
                let filePlugin = new FilePlugin();
                filePlugin.getFileURI().subscribe((uri) => {
                    
                    if (uri != ""){
                        console.log("URI FILE : "+uri);
                    }
                        
                })
            }.bind(this))
            .catch(function () {
                console.log("ERROR - File picker error");
            }.bind(this));
    

    
## License

Apache License Version 2.0, January 2004
