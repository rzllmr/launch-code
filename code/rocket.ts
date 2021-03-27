import { Part } from './subdir/part';

export class Rocket {
  name: string;
  part: Part;
  ready: Boolean;

  constructor() {
    this.name = "rocket";
    this.part = new Part();
    this.ready = true;
  }
}

export class Helper {
  name: string;

  constructor() {
    this.name = "helper";
  }
}
