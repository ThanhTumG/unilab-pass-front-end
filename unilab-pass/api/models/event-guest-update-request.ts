/* tslint:disable */
/* eslint-disable */
/**
 * My REST API
 * Some custom description of API.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { EventGuestKey } from './event-guest-key';

/**
 * 
 * @export
 * @interface EventGuestUpdateRequest
 */
export interface EventGuestUpdateRequest {
    /**
     * 
     * @type {EventGuestKey}
     * @memberof EventGuestUpdateRequest
     */
    'eventGuestKey'?: EventGuestKey;
    /**
     * 
     * @type {string}
     * @memberof EventGuestUpdateRequest
     */
    'guestName'?: string;
}

