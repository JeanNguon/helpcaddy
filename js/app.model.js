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

/* global window, tizen, console */

/**
 * Application model module.
 * It's responsible for managing badges API.
 *
 * @module app.model
 * @requires {@link app.common}
 * @namespace app.model
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

// strict mode wrapper function
(function defineAppModel(app) {
    'use strict';

    /**
     * Stores application id.
     *
     * @memberof app.model
     * @private
     * @type {string}
     */
    var applicationId = '',

        /**
         * Stores value of badge count.
         *
         * @memberof app.model
         * @private
         * @type {number}
         */
        currentBadgeCount = 0;

    /**
     * Returns application id.
     *
     * @memberof app.model
     * @private
     * @returns {string}
     */
    function getApplicationId() {
        try {
            return tizen.application.getCurrentApplication().appInfo.id;
        } catch (error) {
            console.error('GetCurrentApplication id error: ', error);
        }
    }

    /**
     * Returns badge count.
     *
     * @memberof app.model
     * @private
     * @returns {number}
     */
    function getBadgeCount() {
        try {
            return tizen.badge.getBadgeCount(applicationId);
        } catch (error) {
            console.error('getBadgeCount error: ', error);
        }
    }

    /**
     * Sets badge change listener.
     *
     * @memberof app.model
     * @private
     */
    function setBadgeChangeListener() {
        try {
            tizen.badge.addChangeListener([applicationId],
                onBadgeChange);
        } catch (error) {
            console.error('setBadgeChangeListener error: ', error);
        }
    }

    /**
     * Success callback for badge change listener.
     * Fires "model.badgevaluechange" event.
     *
     * @memberof app.model
     * @private
     * @param {string} applicationId
     * @param {number} badgeCount
     * @fires "model.badgevaluechange"
     */
    function onBadgeChange(applicationId, badgeCount) {
        currentBadgeCount = badgeCount;
        app.common.dispatchEvent('model.badgevaluechange');
    }

    /**
     * Increases badge count.
     *
     * @memberof app.model
     * @public
     */
    function increaseBadgeCount() {
        changeBadgeCount(currentBadgeCount + 1);
    }

    /**
     * Decreases badge count.
     *
     * @memberof app.model
     * @public
     */
    function decreaseBadgeCount() {
        changeBadgeCount(currentBadgeCount - 1);
    }

    /**
     * Resets badge count.
     *
     * @memberof app.model
     * @public
     */
    function resetBadgeCount() {
        changeBadgeCount(0);
    }

    /**
     * Sets new value to the badge count.
     *
     * @memberof app.model
     * @private
     * @param {number} newValue
     * @fires "model.badgevaluechange.error"
     */
    function changeBadgeCount(newValue) {
        if (newValue >= 0) {
            try {
                tizen.badge.setBadgeCount(applicationId, newValue);
            } catch (error) {
                console.error('setBadgeCount error: ', error);
                app.common.dispatchEvent('model.badgevaluechange.error');
            }
        } else {
            app.common.dispatchEvent('model.badgevaluechange.error');
        }
    }

    /**
     * Returns current badge count.
     *
     * @memberof app.model
     * @public
     * @returns {number}
     */
    function getCurrentBadgeCount() {
        return currentBadgeCount;
    }

    /**
     * Initializes model module. Assigns application id and current badge count.
     * Initializes function which sets badges change listener.
     *
     * @memberof app.model
     * @public
     */
    function init() {
        applicationId = getApplicationId();
        currentBadgeCount = getBadgeCount();
        setBadgeChangeListener();
    }

    app.model = {
        init: init,
        increaseBadgeCount: increaseBadgeCount,
        decreaseBadgeCount: decreaseBadgeCount,
        resetBadgeCount: resetBadgeCount,
        getCurrentBadgeCount: getCurrentBadgeCount
    };

})(window.app);
