/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global window*/

/**
 * Application common utility module.
 * Provides common methods used by other modules (e.g. event triggering).
 *
 * @module app.common
 * @namespace app.common
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

// strict mode wrapper function
(function defineAppCommon(app) {
    'use strict';

    // create namespace for the module
    app.common = app.common || {};

    /**
     * Returns the input as a string padded on the left to the specified
     * length. By default input is padded with zeros and length
     * is set to 2.
     *
     * @memberof app.common
     * @public
     * @param {*} input
     * @param {number} [length=2] Pad length (default: 2)
     * @param {string} [padString=0] Pad string (default: '0')
     * @returns {string}
     */
    app.common.pad = function pad(input, length, padString) {
        input = String(input);
        length = length || 2;
        padString = padString || '0';

        while (input.length < length) {
            input = padString + input;
        }

        return input;
    };

    /**
     * Dispatches an event.
     *
     * @memberof app.common
     * @public
     * @param {string} eventName Event name.
     * @param {*} data Detailed data.
     */
    app.common.dispatchEvent = function dispatchEvent(eventName, data) {
        var customEvent = new window.CustomEvent(eventName, {
            detail: data,
            cancelable: true
        });

        window.dispatchEvent(customEvent);
    };

})(window.app);
