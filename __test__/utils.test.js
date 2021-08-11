/**
 * @file 工具函数单测
 * @author dengxuening<dengxuening@baidu.com>
 */

import {getQuery, encodeObjectDataToUrlData,
    isSet, compareShowVersion,
    parseVersionNumber, sliceBase64Header,
    throttleFactory
} from '../src/utils';

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

    test('parseVersionNumber', () => {
        expect(parseVersionNumber('Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.40.0.0 (Android) DuerOS/Xiaodu;')).toBe('1.40.0.0');
        expect(parseVersionNumber('Mozilla/5.0 (Linux; Android  NV6001 Build/1.36.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;')).toBe('1.36.0.0');
    });

    test('compareShowVersion', () => {
        expect(compareShowVersion('1.36.0.0', '1.36.0.1')).toBe(-1);
        expect(compareShowVersion('1.36.0.1', '1.36.0.0')).toBe(1);
        expect(compareShowVersion('1.36.0.0', '1.36.0.0')).toBe(0);
        expect(compareShowVersion('1.36.1.0', '1.36.0.0')).toBe(1);
        expect(compareShowVersion('1.36.0.1', '1.36.1.0')).toBe(-1);
        expect(compareShowVersion('1.37.0.0', '1.36.1.0')).toBe(1);
        expect(compareShowVersion('1.36.0.1', '1.37.1.0')).toBe(-1);
        expect(compareShowVersion('2.3.0.0', '1.90.0.0')).toBe(1);
        expect(compareShowVersion('1.3.0.0', '2.90.0.0')).toBe(-1);
    });

    test('slicevBase64Header', () => {
        expect(sliceBase64Header('data:image/png;base64,iVBORw0KGgoAAAANSUhE'))
            .toBe('iVBORw0KGgoAAAANSUhE');
        expect(sliceBase64Header('iVBORw0KGgoAAAANSUhE'))
            .toBe('iVBORw0KGgoAAAANSUhE');
        expect(sliceBase64Header('base64,iVBORw0KGgoAAAANSUhE'))
            .toBe('iVBORw0KGgoAAAANSUhE');
    });

    test('throttleFactory', (done) => {
        const timeout = 4000;
        const interval = 1000;
        const fn = jest.fn();
        const throttleFn = throttleFactory(fn, interval);
        let timer = setInterval(() => {
           throttleFn();
        }, 0);
        setTimeout(() => {
            clearTimeout(timer);
            expect(fn.mock.calls.length).toBeLessThanOrEqual(Math.floor(timeout/ interval));
            done();
        }, timeout)
    })
});
