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
 * @interface MyUserUpdateRequest
 */
export interface MyUserUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof MyUserUpdateRequest
     */
    'password'?: string;
    /**
     * 
     * @type {string}
     * @memberof MyUserUpdateRequest
     */
    'firstName'?: string;
    /**
     * 
     * @type {string}
     * @memberof MyUserUpdateRequest
     */
    'lastName'?: string;
    /**
     * 
     * @type {string}
     * @memberof MyUserUpdateRequest
     */
    'dob'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof MyUserUpdateRequest
     */
    'roles'?: Array<string>;
}

