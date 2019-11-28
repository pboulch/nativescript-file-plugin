import { Common } from './file-plugin.common';
import { Observable } from 'rxjs';

export declare class FilePlugin extends Common {
    public getFileURI(viewController: any): Observable<string>;
}
