/*
|---------------------------------------------
|    Kem :: Dependency Free Event Emitting
|---------------------------------------------
|
*/
class Kem {

    /**
     * Creates an instance of Kem.
     */
    constructor() {
        this.events = {};
    }

    /*
    |---------------------------------------------------------------
    | Main Kem instance methods to be used by library user. ($)
    |---------------------------------------------------------------
    */

    /**
     * Creates or attaches a callback function to an existing event.
     * 
     * @param {String}   eventName :: Name of event to create/existing event. 
     * @param {Function} callback  :: Callback function to attach to event.
     * @returns
     */
    $when(eventName, callback) {
        this.setOrCreateEvent(eventName);

        let token = this.generateToken();

        this.pushToEvent(eventName, {
            token,
            callback,
            callbackName: callback.name
        });

        return token;
    }

    /**
     * Remove stored callback from the specificed event.
     *
     * @param {String}   eventName :: Name of existing event.
     * @param {Variable} fnVar     :: Variable used to save $when() functon call.
     */
    $stop(eventName, name) {
        if (!this.eventExists(eventName)) {
            return;
        }

        let event = this.events[eventName];

        event.forEach(function(key, index) {
            if (key.token === name) event.splice(index, 1);
        });

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
        if (!this.eventExists(eventName)) {
            return;
        }

        let event = this.events[eventName];
        let props = event ? event.length : 0;

        while (props--) {
            event[props].callback(data, eventName);
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
        if (this.eventExists(eventName)) {
            this.events[eventName] = [];
        }

        return this; 
    }
    
    /**
     * Destroy an entire event from the events object.
     *
     * @param {String} eventName
     * @returns
     */
    $destroy(eventName) {
        if (this.eventExists(eventName)) {
            delete this.events[eventName];
        }

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

    /*
    |---------------------------------------------------------------
    | Helper utilty methods for inner class use.
    |---------------------------------------------------------------
    */

    /**
     * Determine whether an event exist by key name.
     * 
     * @param {String} eventName :: A string containing the name of the event.
     * @returns
     */
    eventExists(eventName) {
        if (this.events[eventName]) {
            return true;
        }

        return false;
    }

    /**
     * Initialize a new event as an empty array or add to existing event.
     * 
     * @param {String} eventName :: A string containing the name of the event.
     */
    setOrCreateEvent(eventName) {
        this.events[eventName] = this.events[eventName] || [];

        return this;
    }

    /**
     * Push a properties object to the specified event.
     * 
     * @param {String} eventName :: A string containing the name of the event.
     * @param {Object} props     :: Push a callback props object to an event.
     * @returns
     */
    pushToEvent(eventName, props) {
        this.events[eventName].push(props);
        
        return this;
    }

    /**
     * Generates a 13 character long alpha-numeric string token.
     * 
     * @returns
     */
    generateToken() {
        return Math.random().toString(16).slice(2);
    }

}