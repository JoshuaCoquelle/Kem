"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
|---------------------------------------------
|    Kem :: Dependency Free Event Emitting
|---------------------------------------------
|
*/
var Kem = function () {

    /**
     * Creates an instance of Kem.
     */
    function Kem() {
        _classCallCheck(this, Kem);

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


    _createClass(Kem, [{
        key: "$when",
        value: function $when(eventName, callback) {
            this.setOrCreateEvent(eventName);

            var token = this.generateToken();

            this.pushToEvent(eventName, {
                token: token,
                callback: callback,
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

    }, {
        key: "$stop",
        value: function $stop(eventName, name) {
            if (!this.eventExists(eventName)) {
                return;
            }

            var event = this.events[eventName];

            event.forEach(function (key, index) {
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

    }, {
        key: "$send",
        value: function $send(eventName, data) {
            if (!this.eventExists(eventName)) {
                return;
            }

            var event = this.events[eventName];
            var props = event ? event.length : 0;

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

    }, {
        key: "$empty",
        value: function $empty(eventName) {
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

    }, {
        key: "$destroy",
        value: function $destroy(eventName) {
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

    }, {
        key: "$destroyAll",
        value: function $destroyAll() {
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

    }, {
        key: "eventExists",
        value: function eventExists(eventName) {
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

    }, {
        key: "setOrCreateEvent",
        value: function setOrCreateEvent(eventName) {
            this.events[eventName] = this.events[eventName] || [];

            return this;
        }
    }, {
        key: "pushToEvent",
        value: function pushToEvent(eventName, props) {
            this.events[eventName].push(props);

            return this;
        }

        /**
         * Generates a 13 character long alpha-numeric string token.
         * 
         * @returns
         */

    }, {
        key: "generateToken",
        value: function generateToken() {
            return Math.random().toString(16).slice(2);
        }
    }]);

    return Kem;
}();