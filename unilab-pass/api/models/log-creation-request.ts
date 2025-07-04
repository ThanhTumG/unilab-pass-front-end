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



/**
 * 
 * @export
 * @interface LogCreationRequest
 */
export interface LogCreationRequest {
    /**
     * 
     * @type {string}
     * @memberof LogCreationRequest
     */
    'labId'?: string;
    /**
     * 
     * @type {string}
     * @memberof LogCreationRequest
     */
    'userId'?: string;
    /**
     * 
     * @type {string}
     * @memberof LogCreationRequest
     */
    'recordType'?: LogCreationRequestRecordTypeEnum;
    /**
     * Illegal/legal identification field for facial authentication process (if wrong 3 times is illegal)
     * @type {string}
     * @memberof LogCreationRequest
     */
    'logType'?: LogCreationRequestLogTypeEnum;
}

export const LogCreationRequestRecordTypeEnum = {
    CHECKIN: 'CHECKIN',
    CHECKOUT: 'CHECKOUT'
} as const;

export type LogCreationRequestRecordTypeEnum = typeof LogCreationRequestRecordTypeEnum[keyof typeof LogCreationRequestRecordTypeEnum];
export const LogCreationRequestLogTypeEnum = {
    LEGAL: 'LEGAL',
    ILLEGAL: 'ILLEGAL',
    AUTO: 'AUTO'
} as const;

export type LogCreationRequestLogTypeEnum = typeof LogCreationRequestLogTypeEnum[keyof typeof LogCreationRequestLogTypeEnum];


