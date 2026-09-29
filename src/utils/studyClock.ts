export class ActiveStudyClock {
  private pausedMs = 0;
  private hiddenAt: number | null = null;

  constructor(private readonly startedAt = Date.now()) {}

  setVisible(visible: boolean, now = Date.now()): void {
    if (!visible && this.hiddenAt === null) this.hiddenAt = now;
    if (visible && this.hiddenAt !== null) {
      this.pausedMs += Math.max(0, now - this.hiddenAt);
      this.hiddenAt = null;
    }
  }

  elapsedSeconds(now = Date.now()): number {
    const hiddenMs = this.hiddenAt === null ? 0 : Math.max(0, now - this.hiddenAt);
    return Math.max(0, Math.floor((now - this.startedAt - this.pausedMs - hiddenMs) / 1000));
  }
}
