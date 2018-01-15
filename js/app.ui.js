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

/* global window, document*/

/**
 * Application UI module.
 * It's responsible for managing user interface.
 *
 * @module app.ui
 * @requires {@link app.model}
 * @requires {@link app.common}
 * @namespace app.ui
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

// strict mode wrapper
(function defineAppUi(app) {
    'use strict';

    /**
     * Stores badge count autoincrement interval time in milliseconds.
     *
     * @memberof app.ui
     * @private
     * @const {number}
     */
    var AUTOINCREMENT_INTERVAL = 1500,

        /**
         * Maximum displayed value of the badge count.
         * If current badge count is greater than specified value,
         * then "+" sign is added to displayed value e.g. "99+".
         *
         * @memberof app.ui
         * @private
         * @const {number}
         */
        MAX_DISPLAYED_VALUE = 99,

        /**
         * Increase badge count button.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        increaseButton = null,

        /**
         * Decrease badge count button.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        decreaseButton = null,

        /**
         * Container for badges count value.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        counterValueContainer = null,

        /**
         * Element containing current counter value.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        counterValueCurrent = null,

        /**
         * Element used for slide to left animation.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        counterValueLeft = null,

        /**
         * Element used for slide to right animation.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        counterValueRight = null,

        /**
         * Autoincrement button.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        autoincrementButton = null,

        /**
         * Reset button.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        resetButton = null,

        /**
         * Stores interval identifier.
         *
         * @memberof app.ui
         * @private
         * @type {number}
         */
        autoincrementInterval = 0,

        /**
         * Current badge counter value.
         *
         * @memberof app.ui
         * @private
         * @type {number}
         */
        currentValue = 0,

        /**
         * Flag indicating if there is ongoing counter change process.
         *
         * @memberof app.ui
         * @private
         * @type {boolean}
         */
        changeInProgress = false;

    /**
     * Formats badge counter value.
     * Used to display the value in the user interface.
     *
     * @memberof app.ui
     * @private
     * @param {number} value
     * @returns {string}
     */
    function formatCounterValue(value) {
        var displayValue = value > MAX_DISPLAYED_VALUE ?
                MAX_DISPLAYED_VALUE : value,
            result = app.common.pad(displayValue, 2);

        if (value > MAX_DISPLAYED_VALUE) {
            result += '+';
        }

        return result;
    }

    /**
     * Handles "click" event on decrease button.
     * Decreases badge count.
     *
     * @memberof app.ui
     * @private
     */
    function onDecreaseButtonClick() {
        if (changeInProgress) {
            return;
        }

        changeInProgress = true;
        app.model.decreaseBadgeCount();
    }

    /**
     * Handles click event on reset button.
     * Resets badge count.
     *
     * @memberof app.ui
     * @private
     */
    function onResetButtonClick() {
        if (changeInProgress) {
            return;
        }

        changeInProgress = true;
        app.model.resetBadgeCount();
    }

    /**
     * Handles "click" event on increase button.
     * Increases badge count.
     *
     * @memberof app.ui
     * @private
     */
    function onIncreaseButtonClick() {
        if (changeInProgress) {
            return;
        }

        changeInProgress = true;
        app.model.increaseBadgeCount();
    }

    /**
     * Handles error event for badge value change.
     *
     * @memberof app.ui
     * @private
     */
    function onBadgeValueChangeError() {
        changeInProgress = false;
    }

    /**
     * Handles "model.badgevaluechange" event.
     * Shows new badge count with proper animation.
     *
     * @memberof app.ui
     * @private
     */
    function onBadgeValueChange() {
        var oldValue = currentValue,
            newValue = app.model.getCurrentBadgeCount();

        if (oldValue === newValue) {
            changeInProgress = false;
            return;
        }

        currentValue = newValue;

        if (oldValue > MAX_DISPLAYED_VALUE && newValue > MAX_DISPLAYED_VALUE) {
            changeInProgress = false;
            return;
        }

        changeInProgress = true;

        counterValueContainer.classList.add('animated');

        if (newValue > oldValue) {
            counterValueRight.innerText = formatCounterValue(newValue);
            counterValueContainer.classList.add('slide-right');
        } else {
            counterValueLeft.innerText = formatCounterValue(newValue);
            counterValueContainer.classList.add('slide-left');
        }


    }

    /**
     * Handles "click" event on autoincrement button.
     * Its starts increasing badge count by 1 at specified intervals.
     * Clears interval if exists.
     *
     * @memberof app.ui
     * @private
     */
    function onAutoincrementButtonClick() {
        function onIntervalTick() {
            if (changeInProgress) {
                return;
            }

            changeInProgress = true;
            app.model.increaseBadgeCount();
        }

        if (autoincrementInterval) {
            window.clearInterval(autoincrementInterval);
            autoincrementInterval = 0;
            autoincrementButton.classList.remove('btn-state-on');
        } else {
            autoincrementInterval =
                window.setInterval(onIntervalTick,
                    AUTOINCREMENT_INTERVAL);
            autoincrementButton.classList.add('btn-state-on');
        }
    }

    /**
     * Handles counter value transition end event.
     *
     * Cleans up counter value container state after animation.
     *
     * @memberof app.ui
     * @private
     */
    function onCounterValueTransitionEnd() {
        counterValueContainer.classList
            .remove('animated', 'slide-left', 'slide-right');

        counterValueCurrent.innerText = formatCounterValue(currentValue);
        changeInProgress = false;
    }

    /**
     * Registers event listeners.
     *
     * @memberof app.ui
     * @private
     */
    function bindUiEvents() {
        increaseButton.addEventListener('click', onIncreaseButtonClick);
        decreaseButton.addEventListener('click', onDecreaseButtonClick);
        autoincrementButton.addEventListener('click',
            onAutoincrementButtonClick);
        resetButton.addEventListener('click', onResetButtonClick);
        counterValueContainer.addEventListener('webkitTransitionEnd',
            onCounterValueTransitionEnd);
        window.addEventListener('model.badgevaluechange', onBadgeValueChange);
        window.addEventListener('model.badgevaluechange.error',
            onBadgeValueChangeError);
    }

    /**
     * Initializes ui module. Launches function which registers event listeners.
     * Shows current badge count.
     *
     * @memberof app.ui
     * @public
     */
    function init() {
        increaseButton = document.getElementById('increase-btn');
        decreaseButton = document.getElementById('decrease-btn');
        autoincrementButton = document.getElementById('auto-increment-btn');
        resetButton = document.getElementById('app-icon');
        counterValueContainer = document.getElementById('counter-value');
        counterValueCurrent = counterValueContainer
            .querySelector('#counter-value-current');
        counterValueLeft = counterValueContainer
            .querySelector('#counter-value-left');
        counterValueRight = counterValueContainer
            .querySelector('#counter-value-right');
        currentValue = app.model.getCurrentBadgeCount();
        counterValueCurrent.innerText = formatCounterValue(currentValue);
        bindUiEvents();
    }

    app.ui = {
        init: init
    };

})(window.app);
