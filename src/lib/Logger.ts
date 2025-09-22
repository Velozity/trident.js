import { LogLevel } from "../types";

export class Logger {
  private colors = {
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    debug: "\x1b[36m",
    event: "\x1b[35m",
    command: "\x1b[34m",
    reset: "\x1b[0m",
  };

  public log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    const color = this.colors[level] || this.colors.reset;
    const levelUpper = level.toUpperCase();

    console.log(
      `${color}[${timestamp}] [${levelUpper}]${this.colors.reset} ${message}`
    );
  }
}
