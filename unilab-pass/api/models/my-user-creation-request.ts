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
 * @interface MyUserCreationRequest
 */
export interface MyUserCreationRequest {
    /**
     * 
     * @type {string}
     * @memberof MyUserCreationRequest
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof MyUserCreationRequest
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof MyUserCreationRequest
     */
    'password': string;
    /**
     * 
     * @type {string}
     * @memberof MyUserCreationRequest
     */
    'firstName'?: string;
    /**
     * 
     * @type {string}
     * @memberof MyUserCreationRequest
     */
    'lastName'?: string;
    /**
     * Date of birth
     * @type {string}
     * @memberof MyUserCreationRequest
     */
    'dob'?: string;
}

