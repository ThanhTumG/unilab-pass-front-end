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
import type { EventLogRespond } from './event-log-respond';

/**
 * 
 * @export
 * @interface CustomApiResponseListEventLogRespond
 */
export interface CustomApiResponseListEventLogRespond {
    /**
     * 
     * @type {number}
     * @memberof CustomApiResponseListEventLogRespond
     */
    'code'?: number;
    /**
     * 
     * @type {string}
     * @memberof CustomApiResponseListEventLogRespond
     */
    'message'?: string;
    /**
     * 
     * @type {Array<EventLogRespond>}
     * @memberof CustomApiResponseListEventLogRespond
     */
    'result'?: Array<EventLogRespond>;
}

