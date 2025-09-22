import chalk from "chalk";
import { LogLevel } from "../types";

export class Logger {
  /**
   * Pads a single number for unified looks in the console
   */
  private static forcePadding(number: number): string {
    return (number < 10 ? "0" : "") + number;
  }

  /**
   * Gets the full current system time and date for logging purposes
   */
  private static getCurrentTime(): string {
    const now = new Date();
    const day = this.forcePadding(now.getDate());
    const month = this.forcePadding(now.getMonth() + 1);
    const year = this.forcePadding(now.getFullYear());
    const hour = this.forcePadding(now.getHours());
    const minute = this.forcePadding(now.getMinutes());
    const second = this.forcePadding(now.getSeconds());

    return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
  }

  /**
   * Generic log method with customizable color
   */
  private static log(level: LogLevel, title: string, body: string): void {
    const timestamp = this.getCurrentTime();
    const colorMap = {
      success: chalk.bold.blue,
      warning: chalk.bold.yellow,
      error: chalk.bold.red,
      debug: chalk.bold.magenta,
      event: chalk.bold.yellow,
      command: chalk.bold.green,
    };

    const colorFn = colorMap[level] || chalk.bold.white;
    console.log(colorFn(`[ ${timestamp} ] [ ${title} ] `) + body);
  }

  /**
   * Log something related to being successful
   */
  static success(title: string, body: string): void {
    this.log("success", title, body);
  }

  /**
   * Log something related to a warning
   */
  static warning(title: string, body: string): void {
    this.log("warning", title, body);
  }

  /**
   * Log something related to an error
   */
  static error(title: string, body: string): void {
    this.log("error", title, body);
  }

  /**
   * Log something related to debugging
   */
  static debug(title: string, body: string): void {
    this.log("debug", title, body);
  }

  /**
   * Log something related to an event
   */
  static event(body: string): void {
    this.log("event", "EVENT", body);
  }

  /**
   * Log something related to command usage
   */
  static command(body: string): void {
    this.log("command", "COMMAND", body);
  }
}
