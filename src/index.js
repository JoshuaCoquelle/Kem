/*
|---------------------------------------------
|    Kem :: Dependency Free Event Emitting
|---------------------------------------------
|
*/
class Kem {
    
    /**
     * Creates an instance of Kem.
     * 
     */
    constructor() {
        this.events = {};
    }

    /**
     * Creates or attaches a callback function to an existing event.
     * 
     * @param {String}   eventName :: Name of event to create/existing event. 
     * @param {Function} callback  :: Callback function to attach to event.
     * @returns
     */
    $when(eventName, callback) {
        if (!this.events[eventName]) this.events[eventName] = [];

        let event = this.events[eventName];
        let token = Math.random().toString(16).slice(2);

        event.push({ token, callback });

        return token;
    }

    /**
     * Remove stored callback from the specificed event.
     *
     * @param {String}   eventName :: Name of existing event.
     * @param {Variable} fnVar     :: Variable used to save $when() functon call.
     */
    $stop(eventName, fnVar) {
        let events = this.events;

        for (let i = 0; i < events[eventName].length; i++) {

            if (events[eventName][i].token === fnVar) {
                events[eventName].splice(i, 1);
            }
        }

        return this;
    }

    /**
     * Trigger the specified event and pass along the desired data.
     * 
     * @param {String} eventName :: Name of existing event.
     * @param {any}    data      :: Data to be passed to the events callback.
     * @returns
     */
    $send(eventName, data) {
        if (!this.events[eventName]) return;

        let event = this.events[eventName];
        let actionables = event ? event.length : 0;

        while (actionables--) {
            event[actionables].callback(data, eventName);
        }

        return this;
    }

    /**
     * Empty all callbacks from the specified event. 
     * 
     * @param {any} eventName
     * @returns
     */
    $empty(eventName) {
        this.events[eventName] = [];

        return this; 
    }
    
    /**
     * Destroy an entire event from the events object.
     *
     * @param {any} eventName
     * @returns
     */
    $destroy(eventName) {
        delete this.events[eventName];

        return this;
    }

    /**
     * Destroys ALL events from the events object.
     *
     * @returns
     */
    $destroyAll() {
        this.events = {};

        return this;
    }
}