import { Observable } from 'tns-core-modules/data/observable';
export declare class Common extends Observable {
    message: string;
    constructor();
    greet(): string;
    performFileSearch(): void;
}
export declare class Utils {
    static SUCCESS_MSG(): string;
}
