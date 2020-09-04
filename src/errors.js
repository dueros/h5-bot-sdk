/**
 * @file 各种报错信息
 * @author dengxuening<dengxuening@baidu.com>
 */

/**
 * SHOW设备版本低时的错误
 */
export class LowVersionErrorMsg {
    constructor(caller) {
        this.code = 1001;
        this.msg = `An error occurred while calling the '${caller}': device version too low`;
    }
}

export class ServiceError {
    constructor(msg) {
        this.code = 1002;
        this.msg = 'Service error, ' + msg;
    }
}
