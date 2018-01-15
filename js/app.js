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

/*global window, document,console, tizen*/

/**
 * Main application module.
 * Handles application life cycle.
 *
 * @module app
 * @requires {@link app.ui}
 * @requires {@link app.model}
 * @namespace app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

// strict mode wrapper function
(function defineApp(app) {
    'use strict';

    /**
     * Closes the application.
     *
     * @memberof app
     * @public
     */
    app.exit = function exit() {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (error) {
            console.error('Application exit failed. ', error);
        }
    };

    /**
     * Handles hardware key press event.
     * Closes the application if back key was pressed.
     *
     * @memberof app
     * @private
     * @param {Event} event
     */
    function onDeviceHardwareKeyPress(event) {
        if (event.keyName === 'back') {
            app.exit();
        }
    }

    /**
     * Registers event listeners.
     *
     * @memberof app
     * @private
     */
    function bindEvents() {
        document.addEventListener('tizenhwkey', onDeviceHardwareKeyPress);
    }

    /**
     * Initializes app module.
     * Binds events.
     *
     * @memberof app
     * @private
     */
    function init() {
        bindEvents();
        app.model.init();
        app.ui.init();
    }

    window.addEventListener('load', init);

})(window.app);
