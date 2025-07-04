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


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { CustomApiResponseListLogRespond } from '../models';
// @ts-ignore
import type { CustomApiResponseLogDetailRespond } from '../models';
// @ts-ignore
import type { CustomApiResponseLogRespond } from '../models';
// @ts-ignore
import type { CustomApiResponseWeeklyReportResponse } from '../models';
// @ts-ignore
import type { LogCreationRequest } from '../models';
/**
 * LogControllerApi - axios parameter creator
 * @export
 */
export const LogControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Add new log into lab
         * @param {LogCreationRequest} request 
         * @param {any} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createNewLog: async (request: LogCreationRequest, file?: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'request' is not null or undefined
            assertParamExists('createNewLog', 'request', request)
            const localVarPath = `/logs`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication BearerAuthentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


            if (request !== undefined) { 
                localVarFormParams.append('request', { name: "request", type: "application/json", string: JSON.stringify(request) });
            }
    
            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get log\'s csv file
         * @param {string} labId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        exportCSV: async (labId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'labId' is not null or undefined
            assertParamExists('exportCSV', 'labId', labId)
            const localVarPath = `/logs/{labId}/export-csv`
                .replace(`{${"labId"}}`, encodeURIComponent(String(labId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuthentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get all logs of lab
         * @param {string} labId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllLogs: async (labId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'labId' is not null or undefined
            assertParamExists('getAllLogs', 'labId', labId)
            const localVarPath = `/logs/{labId}`
                .replace(`{${"labId"}}`, encodeURIComponent(String(labId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuthentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get log details
         * @param {string} logId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLogDetail: async (logId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'logId' is not null or undefined
            assertParamExists('getLogDetail', 'logId', logId)
            const localVarPath = `/logs/detail/{logId}`
                .replace(`{${"logId"}}`, encodeURIComponent(String(logId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuthentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get log\'s weekly report
         * @param {string} labId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getWeeklyReport: async (labId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'labId' is not null or undefined
            assertParamExists('getWeeklyReport', 'labId', labId)
            const localVarPath = `/logs/{labId}/weekly`
                .replace(`{${"labId"}}`, encodeURIComponent(String(labId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuthentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * LogControllerApi - functional programming interface
 * @export
 */
export const LogControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = LogControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Add new log into lab
         * @param {LogCreationRequest} request 
         * @param {any} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createNewLog(request: LogCreationRequest, file?: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CustomApiResponseLogRespond>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createNewLog(request, file, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LogControllerApi.createNewLog']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get log\'s csv file
         * @param {string} labId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async exportCSV(labId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.exportCSV(labId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LogControllerApi.exportCSV']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get all logs of lab
         * @param {string} labId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAllLogs(labId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CustomApiResponseListLogRespond>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAllLogs(labId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LogControllerApi.getAllLogs']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get log details
         * @param {string} logId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLogDetail(logId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CustomApiResponseLogDetailRespond>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getLogDetail(logId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LogControllerApi.getLogDetail']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get log\'s weekly report
         * @param {string} labId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getWeeklyReport(labId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CustomApiResponseWeeklyReportResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getWeeklyReport(labId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LogControllerApi.getWeeklyReport']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * LogControllerApi - factory interface
 * @export
 */
export const LogControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = LogControllerApiFp(configuration)
    return {
        /**
         * 
         * @summary Add new log into lab
         * @param {LogControllerApiCreateNewLogRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createNewLog(requestParameters: LogControllerApiCreateNewLogRequest, options?: RawAxiosRequestConfig): AxiosPromise<CustomApiResponseLogRespond> {
            return localVarFp.createNewLog(requestParameters.request, requestParameters.file, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get log\'s csv file
         * @param {LogControllerApiExportCSVRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        exportCSV(requestParameters: LogControllerApiExportCSVRequest, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.exportCSV(requestParameters.labId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get all logs of lab
         * @param {LogControllerApiGetAllLogsRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllLogs(requestParameters: LogControllerApiGetAllLogsRequest, options?: RawAxiosRequestConfig): AxiosPromise<CustomApiResponseListLogRespond> {
            return localVarFp.getAllLogs(requestParameters.labId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get log details
         * @param {LogControllerApiGetLogDetailRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLogDetail(requestParameters: LogControllerApiGetLogDetailRequest, options?: RawAxiosRequestConfig): AxiosPromise<CustomApiResponseLogDetailRespond> {
            return localVarFp.getLogDetail(requestParameters.logId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get log\'s weekly report
         * @param {LogControllerApiGetWeeklyReportRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getWeeklyReport(requestParameters: LogControllerApiGetWeeklyReportRequest, options?: RawAxiosRequestConfig): AxiosPromise<CustomApiResponseWeeklyReportResponse> {
            return localVarFp.getWeeklyReport(requestParameters.labId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for createNewLog operation in LogControllerApi.
 * @export
 * @interface LogControllerApiCreateNewLogRequest
 */
export interface LogControllerApiCreateNewLogRequest {
    /**
     * 
     * @type {LogCreationRequest}
     * @memberof LogControllerApiCreateNewLog
     */
    readonly request: LogCreationRequest

    /**
     * 
     * @type {any}
     * @memberof LogControllerApiCreateNewLog
     */
    readonly file?: any
}

/**
 * Request parameters for exportCSV operation in LogControllerApi.
 * @export
 * @interface LogControllerApiExportCSVRequest
 */
export interface LogControllerApiExportCSVRequest {
    /**
     * 
     * @type {string}
     * @memberof LogControllerApiExportCSV
     */
    readonly labId: string
}

/**
 * Request parameters for getAllLogs operation in LogControllerApi.
 * @export
 * @interface LogControllerApiGetAllLogsRequest
 */
export interface LogControllerApiGetAllLogsRequest {
    /**
     * 
     * @type {string}
     * @memberof LogControllerApiGetAllLogs
     */
    readonly labId: string
}

/**
 * Request parameters for getLogDetail operation in LogControllerApi.
 * @export
 * @interface LogControllerApiGetLogDetailRequest
 */
export interface LogControllerApiGetLogDetailRequest {
    /**
     * 
     * @type {string}
     * @memberof LogControllerApiGetLogDetail
     */
    readonly logId: string
}

/**
 * Request parameters for getWeeklyReport operation in LogControllerApi.
 * @export
 * @interface LogControllerApiGetWeeklyReportRequest
 */
export interface LogControllerApiGetWeeklyReportRequest {
    /**
     * 
     * @type {string}
     * @memberof LogControllerApiGetWeeklyReport
     */
    readonly labId: string
}

/**
 * LogControllerApi - object-oriented interface
 * @export
 * @class LogControllerApi
 * @extends {BaseAPI}
 */
export class LogControllerApi extends BaseAPI {
    /**
     * 
     * @summary Add new log into lab
     * @param {LogControllerApiCreateNewLogRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogControllerApi
     */
    public createNewLog(requestParameters: LogControllerApiCreateNewLogRequest, options?: RawAxiosRequestConfig) {
        return LogControllerApiFp(this.configuration).createNewLog(requestParameters.request, requestParameters.file, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get log\'s csv file
     * @param {LogControllerApiExportCSVRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogControllerApi
     */
    public exportCSV(requestParameters: LogControllerApiExportCSVRequest, options?: RawAxiosRequestConfig) {
        return LogControllerApiFp(this.configuration).exportCSV(requestParameters.labId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get all logs of lab
     * @param {LogControllerApiGetAllLogsRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogControllerApi
     */
    public getAllLogs(requestParameters: LogControllerApiGetAllLogsRequest, options?: RawAxiosRequestConfig) {
        return LogControllerApiFp(this.configuration).getAllLogs(requestParameters.labId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get log details
     * @param {LogControllerApiGetLogDetailRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogControllerApi
     */
    public getLogDetail(requestParameters: LogControllerApiGetLogDetailRequest, options?: RawAxiosRequestConfig) {
        return LogControllerApiFp(this.configuration).getLogDetail(requestParameters.logId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get log\'s weekly report
     * @param {LogControllerApiGetWeeklyReportRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogControllerApi
     */
    public getWeeklyReport(requestParameters: LogControllerApiGetWeeklyReportRequest, options?: RawAxiosRequestConfig) {
        return LogControllerApiFp(this.configuration).getWeeklyReport(requestParameters.labId, options).then((request) => request(this.axios, this.basePath));
    }
}

