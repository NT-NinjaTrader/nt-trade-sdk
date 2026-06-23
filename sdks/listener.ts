export class Listener {
  private cleanup: () => void;
  private hasUnlistened: boolean = false;

  constructor(cleanup?: () => void) {
    this.cleanup = cleanup || (() => {});
  }

  public unlisten() {
    if (!this.hasUnlistened) {
      this.cleanup();
      this.hasUnlistened = true;
    }
  }
}
