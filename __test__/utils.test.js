/**
 * @file 工具函数单测
 * @author dengxuening<dengxuening@baidu.com>
 */

import {getQuery, encodeObjectDataToUrlData, isSet} from '../src/utils';

describe('测试工具函数 utils', () => {
    test('getQuery', () => {
        const search = '?type=update&intentId=5596fa45-eda3-b15b-ea0b-101b56a5bba1&botId=422f2072-0cc0-e0c7-e867-616c8ab56c4d';
        expect(getQuery(search)).toEqual({
            type: 'update',
            intentId: '5596fa45-eda3-b15b-ea0b-101b56a5bba1',
            botId: '422f2072-0cc0-e0c7-e867-616c8ab56c4d'
        });
    });

    test('encodeObjectDataToUrlData', () => {
        expect(encodeObjectDataToUrlData({name: 'Lisa', age: 24})).toBe('name=Lisa&age=24');
    });

    test('isSet', () => {
        const obj = {
            name: 'Lisa'
        };
        expect(isSet(obj.age)).toBe(false);
        expect(isSet(obj.name)).toBe(true);
    });
});
