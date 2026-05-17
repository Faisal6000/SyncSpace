import Strings from '../strings/localizedStrings';

export class ErrorMessageHandler {
  static getDisplayMessage(errorMessage?: string): string {
    if (!errorMessage) return Strings.generic_error;
    if (this.isDnsResolutionError(errorMessage)) return Strings.no_internet_connection;
    if (this.isSlowInternetError(errorMessage)) return Strings.slow_internet;
    return errorMessage;
  }

  static isDnsResolutionError(msg: string): boolean {
    return (
      msg.toLowerCase().includes('network error') ||
      msg.toLowerCase().includes('enotfound')
    );
  }

  static isSlowInternetError(msg: string): boolean {
    return (
      msg.toLowerCase().includes('timeout') ||
      msg.toLowerCase().includes('econnaborted')
    );
  }
}
