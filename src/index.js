/*
| -----------------------------------------------------------------
| Plugin: Kem.js
| Description: Dependency free JavaScript event emitter
| Version: 1.0.0
| Author: Josua Coquelle
| September 2016
| License: MIT
| -----------------------------------------------------------------
*/

var Kem = (function() {
    /**
     * Kem constructor.
     */
    function Kem() {
        this.events = {};
    }

    /*
    | -----------------------------------------------------------------
    | ~ Public ~ :: Kem API methods.
    | -----------------------------------------------------------------
    */
    
    /**
     * Push an event callback to an existing or newly created event.
     * 
     * @param  {String}   event    | Name of event to create/existing event. 
     * @param  {Function} callback | Callback function to attach to event.
     * @return {Object}            | Returns Kem instance.
     */
    Kem.prototype.when = function(event, callback) {
        if (functionIsAnonymous(event, callback)) return;

        initializeEmptyEventIfNew(this, event);

        this.events[event].push({
            callback: callback,
            callbackName: callback.name
        });

        return this;
    };
    
    /**
     * Wire multiple events at once by passing an event object literal.
     * 
     * @param  {Object} eventObj | Object literal to register event key value pairs.
     * @return {Object}          | Returns Kem instance.
     */
    Kem.prototype.wire = function(eventObj) {
        for (var event in eventObj) {
            if (valueIsNotArrayOrFunction(eventObj[event])) return;

            var callbacks = [].concat(eventObj[event]);

            initializeEmptyEventIfNew(this, event);
            registerEventCallbacks(this, event, callbacks);
        }

        return this;
    };
    
    /**
     * Fire the specified event and pass the desired data to callback.
     * 
     * @param  {String} event | Name of existing event.
     * @param  {any}    data  | Data to be passed to the events callback.
     * @return {Object}       | Returns Kem instance.
     */
    Kem.prototype.fire = function(event, data) {
        if (!eventExists(this, event)) return;

        var event = this.events[event];
        var callbacks = event ? event.length : 0;

        while (callbacks--) {
            event[callbacks].callback(data, event);
        }

        return this;
    };

    /**
     * Remove stored callback from the specificed event.
     *
     * @param  {String} event    | Name of event to target.
     * @param  {String} callback | Function name to be removed from targeted event
     * @return {Object}          | Returns Kem instance.
     */
    Kem.prototype.stop = function(event, callback) {
        if (!eventExists(this, event)) return;

        var event = this.events[event];

        event.forEach(function(key, index) {
            if (key.callbackName === callback) {
                event.splice(index, 1);
            }
        });

        return this;
    };

    /**
     * Empty all callbacks from the targeted event. 
     * 
     * @param  {String} event | Name of event to target.
     * @return {Object}       | Returns Kem instance.
     */
    Kem.prototype.empty = function(event) {
        if (eventExists(this, event)) {
            this.events[event] = [];
        }

        return this; 
    };

    /**
     * Delete an entire single event from the events object.
     *
     * @param  {String} event | Name of event to delete.
     * @return {Object}       | Returns Kem instance.
     */
    Kem.prototype.destroy = function(event) {
        if (eventExists(this, event)) {
            delete this.events[event];
        }

        return this;
    }

    /**
     * Delete all events from the instance events object.
     *
     * @return {Object} | Returns Kem instance.
     */
    Kem.prototype.destroyAll = function() {
        this.events = {};

        return this;
    };

    /**
     * Allow API user to check if the current instance has the specified event.
     * 
     * @param  {String} event | Name of event to target.
     * @return {Boolean}      | Returns whether or not the event exists.
     */
    Kem.prototype.hasEvent = function(event) {
        return eventExists(this, event);
    };

    /**
     * Determine whether the specified event has the existing callback.
     * 
     * @param  {String}  event    | Name of event to target.
     * @param  {String}  callback | String containing name of the callback function.
     * @return {Boolean}          | Returns whether or not the specificed callback exists on the event.
     */
    Kem.prototype.hasCallback = function(event, callback) {
        if (!eventExists(this, event)) return;

        var event = this.events[event];

        for (var i = 0; i < event.length; i++) {
            if (event[i].callbackName === callback) return true;
        }

        return false;
    };

    /**
     * Get the current instances event key names.
     * 
     * @return {Object} | Returns the events object literal.
     */
    Kem.prototype.getKeys = function() {
        var eventKeys = [];

        for (var event in this.events) {
            eventKeys.push(event);
        }

        return eventKeys;
    };

    /*
    | -----------------------------------------------------------------
    | ~ Private ~ :: Helper utilty functions for inner class use.
    | -----------------------------------------------------------------
    */

    /**
     * Check for existance of the current passed event.
     *
     * @param  {Object}  scope | The object scope to evaluate.
     * @param  {String}  event | Name of event to target.
     * @return {Boolean}       | Return whether event exists or not.
     */
    function eventExists(scope, event) {
        var isEvent = scope.events[event] ? true : false;

        return isEvent;
    }

    /**
     * Determine whether the passed callback is an anonymous function.
     * 
     * @param  {Function} callback | Callback function to attach to event.
     * @return {Boolean}           | Returns whether or not the function is anonymous.
     */
    function functionIsAnonymous(callback) {
        var funcToString = callback.toString().split(' ').join('');

        var isNamedFunction = (funcToString.indexOf('function()') > -1);

        return isNamedFunction;
    }

    /**
     * Determine whether or not the event value is an Array or a Function.
     * 
     * @param  {Function || Array} callback | Kem will only accept an array or function callback value.
     * @return {Boolean}                    | Return whether or not the callback is valid.
     */
    function valueIsNotArrayOrFunction(callback) {
        var callbackType = callback.constructor;

        if (callbackType === Array || callbackType === Function) return false;

        return true;
    }
    
    /**
     * If the event doesn't exist, create and initialize the value as an empty array.
     * 
     * @param  {Object} scope | The object context to evaluate.
     * @param  {String} event | Name of event to target.
     * @return {Object}       | Returns the current instance scope.
     */
    function initializeEmptyEventIfNew(scope, event) {
        scope.events[event] = scope.events[event] || [];

        return scope;
    }

    /**
     * Loop through the callbacks array and register them to the event if validation passes.
     * 
     * @param  {Object} scope     | The object context to evaluate.
     * @param  {String} event     | Name of event to target.
     * @param  {Array}  callbacks | An array containing the list of desired callbacks to register.
     * @return {Object}           | Returns an instance of the current scope.
     */
    function registerEventCallbacks(scope, event, callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            if (functionIsAnonymous(callbacks[i])) return;

            scope.events[event].push({
                callback: callbacks[i],
                callbackName: callbacks[i].name
            });
        }

        return scope;
    }

    /**
     * Expose the Kem constructor.
     */
    return Kem;
})();