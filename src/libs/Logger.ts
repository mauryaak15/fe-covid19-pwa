import Debug, {Debugger} from 'debug';

const APP_NAME = '';

export default class Logger {
    private _debug: Debugger;

    private _warn: Debugger;

    private _error: Debugger;

    constructor(prefix?: string) {
        if (prefix) {
            this._debug = Debug(`${APP_NAME}:${prefix}`);
            this._warn = Debug(`${APP_NAME}:WARN:${prefix}`);
            this._error = Debug(`${APP_NAME}:ERROR:${prefix}`);
        } else {
            this._debug = Debug(APP_NAME);
            this._warn = Debug(`${APP_NAME}:WARN`);
            this._error = Debug(`${APP_NAME}:ERROR`);
        }
        /* eslint-disable no-console */
        this.debug.log = console.info.bind(console);
        this._warn.log = console.warn.bind(console);
        this._error.log = console.error.bind(console);
        /* eslint-disable no-console */
    }

    get debug() {
        return this._debug;
    }

    get warn() {
        return this._warn;
    }

    get error() {
        return this._error;
    }
}
