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
import type { EventGuestRespond } from './event-guest-respond';

/**
 * 
 * @export
 * @interface CustomApiResponseListEventGuestRespond
 */
export interface CustomApiResponseListEventGuestRespond {
    /**
     * 
     * @type {number}
     * @memberof CustomApiResponseListEventGuestRespond
     */
    'code'?: number;
    /**
     * 
     * @type {string}
     * @memberof CustomApiResponseListEventGuestRespond
     */
    'message'?: string;
    /**
     * 
     * @type {Array<EventGuestRespond>}
     * @memberof CustomApiResponseListEventGuestRespond
     */
    'result'?: Array<EventGuestRespond>;
}

