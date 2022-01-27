interface IEventBusInterface {
    fireEvent(eventName: string, data?: any): void;
    addListener(eventName: string, listener: any): void;
    removeListener(listener: any): void;
}

/**
 * EventBus, cross-interface communication solution
 * {eventName1:[listener1,listener2],eventName2:[listener3,listener4]}
 */
export default class EventBus implements IEventBusInterface {
    static instance: EventBus;

    eventListeners: {[eventName: string]: Array<(arg?: any) => void>};

    static getInstance() {
        if (typeof EventBus.instance === 'object') {
            return EventBus.instance;
        }
        return new EventBus();
    }

    constructor() {
        this.eventListeners = {};
        if (typeof EventBus.instance === 'object') {
            // return EventBus.instance;
        }
        EventBus.instance = this;
    }

    /**
     * Emit/Fire an event with event data
     * @param eventName string
     * @param data event payload (optional)
     */
    fireEvent(eventName: string | number, data?: any) {
        const listeners = this.eventListeners[eventName];
        if (Array.isArray(listeners)) {
            listeners.forEach((listener) => {
                if (typeof listener === 'function') {
                    listener(data);
                }
            });
        }
    }

    /**
     * Register an event listener
     * @param eventName string
     * @param listener function
     */
    addListener(
        eventName: string | number,
        listener: {(arg?: any): void; (arg?: any): void}
    ) {
        const listeners = this.eventListeners[eventName];
        if (Array.isArray(listeners)) {
            listeners.push(listener);
        } else {
            this.eventListeners[eventName] = [listener];
        }
    }

    /**
     * Unregister an event listener if exists
     * @param listener function
     */
    removeListener(listener: {(arg?: any): void; (arg?: any): void}) {
        Object.keys(this.eventListeners).forEach((eventName) => {
            const listeners = this.eventListeners[eventName];
            this._remove(listeners, listener);
            if (listeners.length === 0) {
                delete this.eventListeners[eventName];
            }
        });
    }

    /**
     * Internally used utility
     * * */
    // eslint-disable-next-line class-methods-use-this
    private _remove(array: any[], item: any) {
        if (!array) {
            return;
        }
        for (let i = 0, l = array.length; i < l; i += 1) {
            if (item === array[i]) {
                array.splice(i, 1);
            }
        }
    }
}
