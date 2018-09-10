import { Observable } from 'tns-core-modules/data/observable';
import { FilePlugin } from 'nativescript-file-plugin';

export class HelloWorldModel extends Observable {
  public message: string;
  private filePlugin: FilePlugin;

  constructor() {
    super();

    this.filePlugin = new FilePlugin();
    this.message = this.filePlugin.message;
  }
}
