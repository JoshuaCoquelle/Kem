/*
|---------------------------------------------------------------
|           Kem :: Dependency Free Event Emitting
|---------------------------------------------------------------
*/
var Kem = (function() {

    /**
     * Kem constructor.
     */
    function Kem() {
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
     * @param {String}   eventName | Name of event to create/existing event. 
     * @param {Function} callback  | Callback function to attach to event.
     * @returns
     */
    Kem.prototype.$when = function(eventName, callback) {
        setOrCreateEvent(this, eventName);

        var token = generateToken();

        pushToEvent(this, eventName, {
            token: token,
            callback: callback,
            callbackName: callback.name
        });

        return token;
    };

    /**
     * Trigger the specified event and pass along the desired data.
     * 
     * @param {String} eventName | Name of existing event.
     * @param {any}    data      | Data to be passed to the events callback.
     * @returns
     */
    Kem.prototype.$send = function(eventName, data) {
        if (!eventExists(this, eventName)) {
            return;
        }

        var event = this.events[eventName];
        var props = event ? event.length : 0;

        while (props--) {
            event[props].callback(data, eventName);
        }

        return this;
    };

    /**
     * Remove stored callback from the specificed event.
     *
     * @param {String}   eventName | Name of existing event.
     * @param {Variable} fnVar     | Variable used to save $when() functon call.
     */
    Kem.prototype.$stop = function(eventName, name) {
        if (!eventExists(this, eventName)) {
            return;
        }

        var event = this.events[eventName];

        event.forEach(function(key, index) {
            if (key.token === name) {
                event.splice(index, 1);
            }
        });

        return this;
    };

    /**
     * Empty all callbacks from the specified event. 
     * 
     * @param {String} eventName
     * @returns
     */
    Kem.prototype.$empty = function(eventName) {
        if (eventExists(this, eventName)) {
            this.events[eventName] = [];
        }

        return this; 
    };

    /**
     * Destroy an entire event from the events object.
     *
     * @param {String} eventName
     * @returns
     */
    Kem.prototype.$destroy = function(eventName) {
        if (eventExists(this, eventName)) {
            delete this.events[eventName];
        }

        return this;
    }

    /**
     * Destroys ALL events from the events object.
     *
     * @returns
     */
    Kem.prototype.$destroyAll = function() {
        this.events = {};

        return this;
    };

    /*
    |---------------------------------------------------------------
    | Helper utilty methods for inner class use.
    |---------------------------------------------------------------
    */

    /**
     * Determine whether an event exist by key name.
     * 
     * @param {String} eventName | A string containing the name of the event.
     * @returns
     */
    function eventExists(scope, eventName) {
        if (scope.events[eventName]) {
            return true;
        }

        return false;
    }

    /**
     * Initialize a new event as an empty array or add to existing event.
     * 
     * @param {String} eventName | A string containing the name of the event.
     */
    function setOrCreateEvent(scope, eventName) {
        scope.events[eventName] = scope.events[eventName] || [];

        return scope;
    }

    /**
     * Push a properties object to the specified event.
     * 
     * @param {String} eventName | A string containing the name of the event.
     * @param {Object} props     | Push a callback props object to an event.
     * @returns
     */
    function pushToEvent(scope, eventName, props) {
        scope.events[eventName].push(props);
        
        return scope;
    }

    /**
     * Generates a 13 character long alpha-numeric string token.
     * 
     * @returns
     */
    function generateToken() {
        return Math.random().toString(16).slice(2);
    }

    /**
     * Expose the Kem constructor.
     */
    return Kem;
})();