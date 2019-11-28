import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { MainViewModel } from './main-view-model';
import { FilePlugin } from 'nativescript-file-plugin';
import { Page, isIOS, isAndroid } from 'tns-core-modules/ui/page';

const permissions = require("nativescript-permissions");

let viewModel: MainViewModel = new MainViewModel();
let currentPage: Page;

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = viewModel;

    currentPage = page;
}

export function click() {
    let permissionsRequired = new Array();
    if (isAndroid) {
        permissionsRequired = new Array(
            android.Manifest.permission.READ_EXTERNAL_STORAGE,
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE
        );
    }

    permissions.requestPermissions(permissionsRequired).then(() => {
        let filePlugin = new FilePlugin();
        let viewController = isIOS ? currentPage.viewController : null;
        filePlugin.getFileURI(viewController).subscribe((uriResult) => {
            console.log("Uri received : " + uriResult);
            if (uriResult !== "") {
                viewModel.uri = uriResult;
            }
        });
    }).catch(() => {
        console.log("You need those permissions");
    });
}
