# H5-BOT-SDK *(v1.9.0)*

## 本文档规范

### 名词解释

* `SHOW`：小度有屏音箱，
* `App`：手机端的小度App和小度音箱App
* `SHOW ONLY`：说明本方法仅适用SHOW设备，也就是小度有屏音箱设备
* `App ONLY`：说明本方法仅适用小度音箱APP和小度App
* `1.4+` 说明本方法仅适用SDK 1.4及其以后的版本

## GUID

### 一个H5应用接入到度秘需要哪些步骤？

* H5类型技能尚处于内测阶段，需要进入到[如下页面](https://dueros.baidu.com/dbp/bot/index#/authorization)（若已激活，此步骤可跳过）激活，激活码: 8ea5dfe6-2b25-83d8-0f0b-8285ab6a7869-19c45ea4-6deb-a02d-fd36-410c8bb75e86。
* 创建一个技能，<https://dueros.baidu.com/dbp/bot/index#/addbot/0>，选择“自定义”目录下的"H5技能"，填写相应参数，创建技能。
* 在你的H5里集成本SDK，详见下方**BotApp的引入**
* 如果开发者有登录的需求，账号关联流程详见`requireLinkAccount()`
* 如果开发者有支付的需求，详见`requireCharge()`

### <del>H5游戏想要运行在小度App/小度音箱App上？需要如下工作</del>(本渠道已暂停开放)

小度App/小度音箱App上运行的H5游戏需要额外调用以下几个方法才能实现小度有屏音箱上同样的功能：

* 使用`isInApp()`来判断当前H5应用的运行环境是否是小度App/小度音箱App；
* 需要在`requireLinkAccount()`中传入一个回调函数来获取App上的百度账号的授权结果；
* 需要在`requireCharge()`方法中再传入一个回调函数接收购买结果；
* 通过小度App debug包调试，需要手动输入如下地址调试：http(s)://xiaodu.baidu.com/saiya/sdk/iframe/h5game-wrapper.html?gameUrl=${gameUrl} (gameUrl为encodeURIComponent编码后的地址)。

## BotApp的引入

* 通过script标签引入(支持https)

```html
<script src="//duer.bdstatic.com/saiya/sdk/h5-bot-sdk.1.9.0.js"></script>
```
即可在全局环境下获取到`BotApp`对象
> 使用webpack进行打包的模块化的开发形式参考webpack配置文件中的 [externals配置](https://webpack.js.org/configuration/externals/#externals)

## 开始使用
```javascript
// 初始化botApp对象
const botApp = new BotApp({
    random1: '3691308f2a4c2f6983f2880d32e29c84', // 随机字符串，长度不限，由开发者自己生成
    signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16', // 将(random1 + 签名Key)的字符串拼接后做MD5运算得出
    random2: 'dc468c70fb574ebd07287b38d0d0676d', // 随机字符串，长度不限，由开发者自己生成
    signature2: '61dc2b99967e0b326e82e80b05571d22', // 将(random2 + 签名Key)的字符串拼接后做MD5运算得出
    skillID: '699e74f5-b879-1926-1e11-51998f05ea68' // 必填字段，技能ID。填写本字段后SDK会在初始化阶段调用BotApp.requireShipping(小度有屏音箱环境)方法。
});
```

> 正式上线时上述随机字符串和签名需要开发者通过后端接口生成。在开发调试阶段可采用如下方式快速生成MD5：
> ```bash
> md5 -s "string"
> ```
> 签名Key不能明文暴露，以免造成不必要的风险。
> 签名Key在DBP平台(<https:/ros.baidu.com/dbp>)技能的基础信息页面
> 签名必须填写正确，否则技能会在与用户交互时被强制退出

## isInApp() *1.4+*
判断当前H5运行环境是否是在小度APP或者小度音箱APP中，以此区分有屏音箱端和手机App端。开发者需以此来判断并使用相应的SDK方法。

## requireLinkAccount([,callback])
接入度秘的H5应用，如有登录需要，必须和百度的账号体系进行绑定，此接口用来发起账号绑定流程。

> **1.4+**版本以后在**小度App/小度音箱App运行环境**中支持传入一个回调函数接收授权结果。小度有屏音箱端需要调用`getRegisterResult()`来获取授权结果。

目前支持2种方案：

1. 沿用百度账号体系oauth的授权流程，开发者需在<http://developer.baidu.com/wiki/index.php?title=docs/oauth>申请一个新的应用，并将oauth应用的相关信息提供给度秘。绑定成功后，会回调给开发者提供的callback H5地址。后续度秘请求的所有H5和接口回调，都会带上accessToken参数。开发者可以通过accessToken参数请求百度oauth的接口，再换取用户的具体信息。

2. 开发者自己实现标准的oauth协议，并将oauth协议相关接口信息在度秘dbp平台上进行配置。授权成功后可在`onLinkAccountSucceeded(callback)`的回调函数中获取到accessToken。

> 建议第三方开发者使用方案1，产品交互相对简单，用户只需要在设备上确认授权，即可自动登录

本方法在小度APP/小度音箱App和小度有屏音箱上都能调起授权。在小度APP/小度音箱App上，开发者需要传入一个回调函数来获取授权结果。小度有屏音箱上，开发者需要使用`getRegisterResult()`来获取结果。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|**只会**在小度App/小度音箱App上被调用，参数为授权结果|Function(data: Object)|仅小度/小度音箱 App 中必填|无|

callback参数

|参数|说明|类型|
|----|----|----|
|data|授权结果|Object|
|data.type|授权结果状态码|enum {"authorized_success", "authorized_fail"}|
|data.data.accessToken|oauth accessToken|string|


* 示例1(在App中)

```javascript
botApp.requireLinkAccount(function (data) {
     console.log(data);
     // 注意，本函数仅会在App环境下触发。小度有屏音箱上运行的应用请使用`getRegisterResult()`获取注册结果
     // 打印如下：
    {
        "type":"authorized_success", // 授权被拒绝时的值：authorized_fail
        "data":{
            "accessToken":"28.10b09eb18b9dcc3806vda3920199a6fd.2592000.1575546362.4114435386-16962311"
        }
    }
});
```

* 示例2(在SHOW中)

```javascript
botApp.requireLinkAccount();
```


## onLinkAccountSuccess(callback) `SHOW ONLY`
获取oauth授权结果。此方法会监听oauth授权成功后的结果。

> 注意：仅当开发者选中上方的第二种授权方案且在有屏音箱上使用时才会触发本函数中的回调

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|SDK收到授权成功的通知后会调用此函数|Function(payload: Object)|是|无|

callback参数

|参数|说明|类型|
|----|----|----|
|payload|授权结果|Object|
|payload.token|标识本次返回，一般没用|string|
|payload.app.accessToken|第三方平台的授权accessToken（非DuerOS使用的百度access token）|string|

* 示例
```javascript
botApp.onLinkAccountSuccess(function (payload) {
    console.log(payload);
    // 结果如下：
    {
        app:{
            "accessToken": "{{string}}",
                "apiAccessToken":"{{string}}",
                "syncLocalStorage":"{{boolean}}",
                "userId": "{{string}}",
                "deviceId": "{{string}}",
                "deepUrl":"{{string}}"
        }
    }
})
```

## getRegisterResult(callback)
BotApp SDK初始化之后，SDK内部会进行身份校验、注册等操作，开发者可使用本方法来获取注册结果，如果已经绑定过百度账号，则能获取到授权后的 oauth access token。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|SDK获取到注册结果之后调用此函数|Function({accessToken: string})|是|无|

* 示例

```javascript
botApp.getRegisterResult(function (data) {
     console.log(data);
    // 打印结果如下：
    {
        "accessToken": "{{string}}",
        "apiAccessToken":"{{string}}",
        "syncLocalStorage":"{{boolean}}",
        "userId": "{{string}}",
        "deviceId": "{{string}}",
        "deepUrl":"{{string}}"
    }
})
```

## requireUserAgeInfo(callback) *1.5+* `SHOW ONLY`

本方法获取用户的实名认证信息，如果用户没有实名认证则会在小度在家上自动弹出实名认证的二维码。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|本回调会传入用户的实名认证结果|Function(err: Object, data: Object)|必填|是|

err参数

|参数|说明|类型|
|----|----|----|
|err|SDK内建错误信息，见附录|Object|
|err.code|错误码，详细对照见附表|number|
|err.msg|错误信息，详细对照见附表|string|

data参数

|参数|说明|类型|
|----|----|----|
|data|实名认证信息|Object|
|data.is_auth|用户是否完成实名认证，1：已完成，2：未完成|enum {"1", "2"}|
|data.age_group|用户年龄段，16岁-18岁为1，18岁以上为2，16岁以下为3|enum {"1", "2", "3"}|


* 正常返回示例

```javascript
botApp.requireUserAgeInfo(function (err, data) {
    console.log(err, data);
    // 打印如下：
    null
    {
        "is_auth": "1",
        "age_group": "2"
    }
});
```

* 设备版本过低返回：

```javascript
botApp.requireUserAgeInfo(function (err, data) {
    console.log(err, data);
    // 打印如下：
    {
        code: 1001,
        msg: 'Device version too low'
    }
    null
});
```


## requireCharge(data, [,callback(err, payload)])
本方法会发起收款，当用户支付成功后，如果是在 SHOW 端设备中，通过`onChargeStatusChange(callback)`接收付款结果通知，如果是在 App 中，会调用传入的`callback`函数。

> 对于用户支付成功的订单，会有服务端的订单通知接口，开发者应以该接口的订单支付成功通知为最终数据。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|data|订单参数|Object|必填|无|
|data.token|本次事件的token，开发者自己提供|Object|否|无|
|data.chargeBaiduPay.authorizeAttributes.sellerAuthorizationNote|商家授权信息备注|string|是|无|
|data.chargeBaiduPay.authorizeAttributes.authorizationAmount.amount|价格，单位元|string|是|无|
|data.chargeBaiduPay.authorizeAttributes.authorizationAmount.currencyCode|币种，目前仅支持 CNY|enum {"CNY"}|是|无|
|data.chargeBaiduPay.sellerOrderAttributes.sellerOrderId|此笔交易在商家这边的订单ID。当用户付款成功后，会带有此ID通知技能|string|是|无|
|data.chargeBaiduPay.sellerOrderAttributes.productName|商品名称|string|是|无|
|data.chargeBaiduPay.sellerOrderAttributes.productId|商品ID|string|是|无|
|data.chargeBaiduPay.sellerOrderAttributes.description|商品描述信息。对商品的简单介绍|string|是|无|
|data.chargeBaiduPay.sellerOrderAttributes.sellerNote|商品的备注信息|string|是|无|
|callback|本函数**只会**在 App 中被调用，SHOW设备请使用`onChargeStatusChange`接收购买结果。|Function|否(App环境下必填)|无|

callback**只会**在小度App/小度音箱App中被回调，传入的参数见下表。小度有屏音箱设备请使用`onChargeStatusChange`接收购买结果

|参数|说明|类型|
|----|----|----|
|err|错误信息|Error\|string|
|payload|本次交易的扣款信息|Object|
|payload.authorizationDetails.authorizationAmount.amount|扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元|string|
|payload.authorizationDetails.authorizationAmount.currencyCode|目前只能为CNY|enum {"CNY"}|
|payload.authorizationDetails.capturedAmount.amount|实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元|string|
|payload.authorizationDetails.capturedAmount.currencyCode|枚举类型。目前只能为CNY|enum {"CNY"}|
|payload.authorizationDetails.creationTimestamp|订单创建时间。时间戳，单位毫秒|string|
|payload.baiduOrderReferenceId|此次交易百度生成的订单ID|string|
|payload.sellerOrderId|对应支付的订单ID|string|
|payload.purchaseResult|此次支付结果。 选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误|enum {"SUCCESS", "ERROR"}|
|payload.message|支付状态对应的消息|string|

* 示例

    ```javascript
    const data = {
        token: 'fjaksvmakfjiefj23fdsnfs',
        chargeBaiduPay: {
            authorizeAttributes: {
                authorizationAmount: {
                    amount: '1.09',
                    currencyCode: 'CNY'
                },
                sellerAuthorizationNote: '双11大促'
            },
            sellerOrderAttributes: {
                sellerOrderId: 'hfuawffu2jkjk12e23',
                productName: 'Mac Book Pro 2019',
                productId: 'fjaksdfkvjsznvj',
                description: '笔记本电脑',
                sellerNote: '大促销'
            }
        }
    }
    botApp.requireCharge(data, function (err, data) {
        if (!err) {
            console.log(data);
            // 结果如下
            {
                authorizationDetails: {
                    authorizationAmount: {
                        amount: "1.99",
                        currencyCode: 'CNY'
                    },
                    capturedAmount: {
                        amount: '1.09',
                        currencyCode: 'CNY'
                    },
                    creationTimestamp: '1546272000000'
                },
                baiduOrderReferenceId: 'fjkasdfekfjsnvks',
                sellerOrderId: 'fskdfjmvckadfl',
                purchaseResult: 'SUCCESS',
                message: '支付成功'
            }
        }
    });
    ```

## <del>requireBuy(data, callback) *1.4+* `App ONLY`</del>

本方法不同于`requireCharge`，需要事先在度秘的商品库里注册`productId`。`callback`函数会在返回游戏页面后调用，调用可能会有明显延迟。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|data|商品信息|Object|是|无|
|data.productId|商品ID|string|是|无|
|data.sellerOrderId|接入方自己的订单ID|string|是|无|
|callback|获取购买结果，传入的参数见下表|Function|是|无|

callback传入的参数

|参数|说明|类型|
|----|----|----|
|err|错误信息|Any|
|payload|本次交易的扣款信息|Object|
|payload.authorizationDetails.authorizationAmount.amount|扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元|string|
|payload.authorizationDetails.authorizationAmount.currencyCode|目前只能为CNY|enum {"CNY"}|
|payload.authorizationDetails.capturedAmount.amount|实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元|string|
|payload.authorizationDetails.capturedAmount.currencyCode|枚举类型。目前只能为CNY|enum {"CNY"}|
|payload.authorizationDetails.creationTimestamp|订单创建时间。时间戳，单位毫秒|string|
|payload.baiduOrderReferenceId|此次交易百度生成的订单ID|string|
|payload.sellerOrderId|对应支付的订单ID|string|
|payload.purchaseResult|此次支付结果。 选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误|enum {"SUCCESS", "ERROR"}|
|payload.message|支付状态对应的消息|string|

* 示例

    ```javascript
    botApp.requireBuy({
        productId: '191022111415582172',
        sellerOrderId: 'xxxxxx112121xxxx'
    }, function (err, data) {
        if (!err) {
            console.log(data);
            // 打印结果如下
            {
                authorizationDetails: {
                    authorizationAmount: {
                        amount: "1.99",
                        currencyCode: 'CNY'
                    },
                    capturedAmount: {
                        amount: '1.09',
                        currencyCode: 'CNY'
                    },
                    creationTimestamp: '1546272000000'
                },
                baiduOrderReferenceId: 'fjkasdfekfjsnvks',
                sellerOrderId: 'fskdfjmvckadfl',
                purchaseResult: 'SUCCESS',
                message: '支付成功'
            }
        }
    });
    ```

## BotApp.onChargeStatusChange(callback) `SHOW ONLY`
通知支付结果。该指令只是一个前端的通知，第三方开发者可以用此回调做页面的刷新。

> 仅当在小度有屏音箱上使用`requireCharge()`发起支付动作时本方法中的回调才会被调用

callback传入的参数

|参数|说明|类型|
|----|----|----|
|payload|本次交易的扣款信息|Object|
|payload.authorizationDetails.authorizationAmount.amount|扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元|string|
|payload.authorizationDetails.authorizationAmount.currencyCode|目前只能为CNY|enum {"CNY"}|
|payload.authorizationDetails.capturedAmount.amount|实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元|string|
|payload.authorizationDetails.capturedAmount.currencyCode|枚举类型。目前只能为CNY|enum {"CNY"}|
|payload.authorizationDetails.creationTimestamp|订单创建时间。时间戳，单位毫秒|string|
|payload.baiduOrderReferenceId|此次交易百度生成的订单ID|string|
|payload.sellerOrderId|对应支付的订单ID|string|
|payload.purchaseResult|此次支付结果。 选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误|enum {"SUCCESS", "ERROR"}|
|payload.message|支付状态对应的消息|string|
|payload.token|标识本次返回，可能没有|string|


* 示例
    ```javascript
    botApp.onChargeStatusChange(function (payload) {
        console.log(payload);
        // 打印结果如下：
        {
            token: 'faskdfkasdfsnvcknawjkenfjkwa', // 标识本次返回
            authorizationDetails: {
                authorizationAmount: {
                    amount: "1.99",
                    currencyCode: 'CNY'
                },
                capturedAmount: {
                    amount: '1.09',
                    currencyCode: 'CNY'
                },
                creationTimestamp: '1546272000000'
            },
            baiduOrderReferenceId: 'fjkasdfekfjsnvks',
            sellerOrderId: 'fskdfjmvckadfl',
            purchaseResult: 'SUCCESS',
            message: '支付成功'
        }
    })
    ```

## onHandleIntent(callback) `SHOW ONLY`
意图下发。开发者在DBP平台上面开发的意图，在匹配到用户对话之后会封装对应意图成为Intent下发下来。

> DBP开放平台：<https://dueros.baidu.com/dbp>
> 本方法仅支持在小度有屏音箱上调用

callback传入的参数

|参数|说明|类型|
|----|----|----|
|payload|意图解析结果|Object|
|payload.intent.name|DuerOS解析出来的意图名称|string|
|payload.intent.slots[].name|槽位名|string|
|payload.intent.slots[].value|槽位值|string|
|payload.intent.customData.jsonData|额外的信息，JSON规范的字符串，一般用不上|string|

* 示例：

    ```javascript
    botApp.onHandleIntent(function (payload) {
        console.log(payload);
        // 结果如下：
        {
            "app": {
                "packageName": "com.baidu.duershow.h5container"
            },
            "customData": "",
            "intent": {
                "name": "test_city",
                "slots": [{
                    "name": "sys.city",
                    "value": "{\"city\":\"南京\",\"origin\":\"南京\"}"
                }]
            }
        }
    });
    ```

## listen() `SHOW ONLY`

开启聆听。设备会进入语音交互状态。

> 本方法仅支持在小度有屏音箱上调用

* 示例
    ```javascript
    botApp.listen();
    ```

## speak(data) `SHOW ONLY`

将文字转换为语音播报出来，播报进度可通过`onDialogStateChanged`获取

> 本方法仅支持在小度有屏音箱上调用

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|data|要语音播报的文字|string|是|无|


* 示例

    ```javascript
    /**
    data: 要播报的TTS的文字内容
    */
    botApp.speak('欢迎使用');
    ```

## requestClose() *1.1+* `SHOW ONLY`

> 本方法仅支持在小度有屏音箱上调用

请求退出。调用此方法后，小度有屏音箱上正在运行的H5会退出。

* 示例

    ```javascript
    botApp.requestClose();
    ```

## updateUiContext(data) `SHOW ONLY`
本接口定义通用的自定义用户交互能力，设备端可以自主实现所希望的交互过程。

正常情况下交互都是由服务端决定的，比如问“西藏天气怎么样”则小度反问“西藏哪个城市的？不同城市的天气差别还是挺大的。”，但存在一些场景服务端因为信息缺乏，不能完全确定交互过程，需要由设备端配合来驱动用户交互过程。例如，在抽奖游戏中，H5页面上展示了2个宝箱，用户说“我选左边的”，服务端无法可能无法确定“我选左边的”或者“我选右边的”分别对应哪个宝箱，因此需要调用本方法来定义。

使用案例：抽奖游戏<br>
H5：展示两个宝箱<br>
H5：调用updateUiContext([(utterances="我选左边的", url="box_left"), (utterances="我选右边的", url="box_right")])<br>
H5：调用`speak('你要打开哪一个宝箱')`<br>
H5：调用`listen()`进入聆听态<br>
用户：“我选左边的”<br>
服务端：下发ClickLink<br>
H5：在onClickLink(callback)中接收ClickLink携带的结果<br>
H5：判断ClickLink回调函数中传入的URL是box_left还是box_right<br>
H5：进入处理逻辑<br>

> 本方法仅支持在小度有屏音箱上调用

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|data|要上传的端状态数据|Object|是|无|
|data.enableGeneralUtterances|是否由系统自动处理未匹配上updateUIContext中设置的用户对话|boolean|是|无|
|data.hyperUtterances[].utterances|需要处理的用户话术集合|Array|是|无|
|data.hyperUtterances[].url|用于确定用户query的url|boolean|是|无|
|data.hyperUtterances[].type|自定义类型为link,系统还提供内建类型 input,select等等，具体见下方附表|enum|是|无|
|data.hyperUtterances[].params|携带的参数，参数根据type的不同而不同，具体参加下方附表|Any|是|无|

* 示例
    ```javascript
    const data = {
        enableGeneralUtterances: true, // 如果为false,当用户的表达与下方注册的常用表达都不匹配时设备不会有任何处理
        hyperUtterances: [
            {
                url: 'https://www.apple.com', // 当用户的语音对话内容与utterances匹配时，SDK会调用onClickLink中的回调函数，并将本URL当做参数。
                utterances: ['苹果'],
                type: 'link',
                params: {}
            },
            {
                url: 'https://www.banana.com',
                utterances: ['香蕉'],
                type: 'link',
                params: {}
            },
            {
                url: 'https://www.strawberry.com',
                utterances: ['草莓'],
                type: 'link',
                params: {}
            }
        ]
    };
    botApp.updateUiContext(data);
    ```

## onClickLink(callback) `SHOW ONLY`
ClickLink事件下发。ClickLink是一种Directive，用户新增自定义交互(`updateUiContext())`之后，云端会解析用户定义的交互，通过此方法下发上面定义的url。

如果用户引用*系统内建自定义类型*，用户query中可以包含参数，例如"*输入北京*"，这个query中*北京*可以被解析成参数，放到后面`params`中下发。

> 系统内建类型参考：见下方附表
> 本方法仅支持在小度有屏音箱上调用

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|云端下发ClickLinke指令后本函数会被调用|Function|是|无|

callback参数

|参数|说明|类型|
|----|----|----|
|payload|云端下发的指令内容，一般是`updateUiContext()`中传入的`hyperUtterances`中的内容|Object|
|payload.url|用户对话内容与`updateUiContext()`中`hyperUtterances`定义的对话内容匹配时相对应的url|string|
|payload.params|同`updateUiContext()`|Object|


* 示例

    如果使用`updateUiContext`的示例数据来自定义交互能力，则表现如下<br>
    用户：小度小度，草莓<br>

    ```javascript
    botApp.onClickLink(function (payload) {
        console.log(payload);
        // 打印如下
        {
            url: 'https://www.straberry.com',
            params: {}
        }
    });
    ```

## onHandleUnknowUtterance(callback) *1.6+* `SHOW ONLY`
当用户的对话内容不在`updateUiContext`设置的用户表达范围时，开发者可使用本能力获取用户对话的语音识别(ASR)文字结果。

> 必须先调用`updateUiContext()`，同时将`enableGeneralUtterances`设置为`false`。


|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|语音识别结果会通过本函数传入|Function(err: Any, {query: string})|是|无|

* 示例

    ```javascript
    botApp.updateUiContext({
        enableGeneralUtterances: false,
        hyperUtterances: [
            {
                url: 'https://www.banana.com',
                utterances: ['香蕉'],
                type: 'link',
                params: {}
            }
        ]
    });

    botApp.onHandleUnknowUtterance(function (err, data) {
        console.log(data);
        // 当用户对话：小度小度，哈密瓜
        // 打印结果如下：
        {
            query: "哈密瓜"
        }
    });
    ```


## uploadLinkClicked(data) *1.2+* `SHOW ONLY`
LinkClick是DuerOS系统中定义的事件上报的一种。DuerOS根据其携带的参数下发不同的指令，也可能什么指令也不下发。

> 本方法仅支持在小度有屏音箱上调用

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|data|要上报的事件内容|Object|是|无|
|data.url|要上报的LinkUrl|string|是|无|

* 示例

    ```javascript
    botApp.uploadLinkClicked({
        url: 'dueros://d7a12baa-47d5-437f-7af6-05bc9c4e5c28/?openbot=true&oss_channel=ls_m'
    });
    ```

## onHandleScreenNavigatorEvent(callback) `SHOW ONLY`

屏幕导航事件。当用户发起语音请求，要求滚动屏幕时，本事件会被调用。

> 本方法仅支持在小度有屏音箱上调用

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|获取屏幕导航参数|Function({data: number})|是|无|

滚动方向说明

|滚动方向|值|类型|
|----|----|----|
|向左滚动|1|number|
|向右滚动|2|number|
|向上滚动|3|number|
|向下滚动|4|number|
|下一页|5|number|
|上一页|6|number|
|history go back|7|number|
|回到Home页|8|number|

* 示例

    对小度音箱说：『向左滚动』

    ```javascript
    botApp.onHandleScreenNavigatorEvent(function (payload) {
        console.log(payload);
        //打印：
        {
            data: 1
        }
    })
    ```

## requireShipping() *1.3+* `SHOW ONLY`
请求发货信息。要调用本方法则必须在BotApp初始化时填写`skillID`，并同时使用`onHandleIntent()`来获取发货信息。本方法会在初始化阶段自动调用一次，开发者也可手动调用本方法。

> 本方法仅支持在小度有屏音箱上调用

* 示例

    ```javascript
    botApp.requireShipping();
    ```

## onDialogStateChanged(callback) *1.6+* `SHOW ONLY`
用户对话状态变化通知，用户唤醒设备，发起语音指令，TTS播报，进入空闲状态都会收到回调通知。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|用户对话状态变化通知|Function(err: Object, status: string)|是|无|

callback参数

|参数|说明|类型|
|----|----|----|
|err|内建错误类型，见附表|Object|
|status|用户对话状态，具体见下方表格|string|

用户对话状态

|状态名称 | 状态值 |
|---|---|
| 空闲状态| IDLE |
|正在语音输入| LISTENING |
|语音输入完成，等待后端返回 | THINKING |
|正在进行TTS播报 | SPEAKING |
|开始TTS播报 | TTS_START |
|TTS播报正常结束 | TTS_FINISH |
|TTS播报中途被打断 | TTS_INTERRUPT |


* 示例

    ```javascript
    botApp.onDialogStateChanged(function (err, status) {
        console.log(status);
        //唤醒设备后，打印如下：
        LISTENING
    })
    ```

## canGoBack(callback) *1.6+* `SHOW ONLY`
获取设备浏览器历史记记录是否还能后退

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|获取设备浏览器历史记记录是否还能后退|Function(err: Object, canGoBack: boolean)|是|无|

callback参数

|参数|说明|类型|
|----|----|----|
|err|内建错误类型，见附表|Object|
|canGoBack|浏览器历史记录是否还能回退|boolean|

* 示例

    ```javascript
     botApp.canGoBack(function(err, status) {
         console.log(status);
         // 打印如下
         true // 也有可能是false
    });
    ```

## initAd(config) *1.7+* `SHOW ONLY`
初始化广告。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|config|广告相关参数配置|Object|是|无|
|config.placeId|广告位ID，联系DuerOS接口人申请|string|是|无|
|config.screenOrientation|游戏的屏幕类型，portrait => 竖屏游戏，landscape => 横屏（全屏）游戏，SDK根据不同屏幕类型展示不同形式的广告|enum {"portrait", "landscape"}|否|portrait|
|config.zIndex|广告浮层的层级|number|否|9999|
|config.displayStrategy|广告展示策略，once => 用户关闭后不再填充广告， twice => 用户关闭60s后再填充一次|enum {"once", "twice"}|否|twice|
|config.firstDisplayTime|广告第一次展示在本方法调用多久后，单位秒|number|否|10|
|config.bannerPosition|配置banner广告（横屏游戏中的广告）在游戏页面中的位置，值为CSS中的left、top、right、bottom|Object|否|{right: "30px", bottom: "30px"}|
|config.clickCallback|广告被点击时的回调|Function|否|无|
|config.closeCallback|广告关闭回调|Function|否|无|
|config.displayCallback|广告展示回调|Function|否|无|
|config.switchCallback|广告切换回调|Function|否|无|

* 示例
    ```javascript
    botApp.initAd({
       placeId: '5bnTSA3%2Bk%2FlCppVdt9bzxe%2B7gnZMFYgnMQLXt3dB%2FWFKf4lyam1he4m8ubUrZ0dj2d5T49v1ld1b9JHT%2B6ZhWIp9T6niQuPFPWCZ%2BpOIZhg%3D',
       screenOrientation: 'portrait',
       zIndex: 9999,
       displayStrategy: 'twice',
       firstDisplayTime: 10,
       bannerPosition: {
           right: '30px',
           bottom: '30px'
       },
       clickCallback: function() {
          console.log('用户点击了广告');
       },
       closeCallback: function() {
         console.log('用户关闭了广告');
       },
       displayCallback: function() {
          console.log('广告展示成功');
       },
       switchCallback: function() {
           console.log('广告切换成功');
       }
    })
    ```

## registerGesture(config, callback) *1.8+* `SHOW ONLY`

注册手势识别。注册后可在回调函数中接收到手势识别的结果。

目前已经支持的手势类型

|手势名称|值|
|---|---|
|OK|GESTURE_OK|
|五指张开的手掌|GESTURE_PALM|
|握拳，拇指竖起，拳头横向使拇指朝向右边|GESTURE_RIGHT|
|握拳，拇指竖起，拳头横向使拇指朝向左边|GESTURE_LEFT|

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|config|需要注册的手势列表|Array|是|无|
|callback|接收手势识别的回调函数|Function|是|无|

callback参数

|参数|说明|类型|
|----|----|----|
|err|内建错误类型，见附表|Object|
|getture|手势识别结果|string|

* 示例
    ```javascript
     botApp.registerGesture(['GESTURE_OK', 'GESTURE_PALM', 'GESTURE_LEFT', 'GESTURE_RIGHT'], (err, gesture) => {
         if (!err) {
             console.log(gesture);
             // 如果是OK手势，则打印结果如下
             // GESTURE_OK
         }
     });
    ```

## interruptTTS() *1.8+* `SHOW ONLY`

打断正在播报的TTS

* 示例
    ```javascript
     botApp.interruptTTS();
    ```

## getCameraState(callback) *1.8+* `SHOW ONLY`
获取设备摄像头状态

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|接收摄像头状态的回调|Function|是|无|

callback参数

|参数|说明|类型|
|----|----|----|
|err|内建错误类型，见附表|Object|
|state|摄像头状态|enum {'ENABLED','DISABLED'}|

## sendEvent(data) *1.8+* `SHOW ONLY`

上报事件。第三方开发者一般用不到。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|data|事件相关参数|Object|是|无|
|data.namespace|事件命名空间|string|是|无|
|data.name|事件名|string|是|无|
|data.needDialogRequestId|是否需要dialogRequestId，由设备生成|boolean|是|无|
|data.payload|事件携带的相关参数|Object\|null|是|无|

* 示例
    ```javascript
     const data = {
         namespace: 'ai.dueros.device_interface.bot_app_sdk',
         name: 'TouchedDown',
          needDialogRequestId: false,
          payload: {
              position : {
                   left: '20px',
                   top: '40px',
              }
          }
     };
     log(data);
     botApp.sendEvent(data);
    ```

## onBuyStatusChange(callback) *1.9+* `SHOW ONLY`

第三方开发者可以用此回调做页面的刷新。支付模块和第三方会有个服务端的通知通路，第三方开发者以服务端的通知订单数据为准。
<b>注意和onChargeStatusChange作区分，这个通知是Buy购买行为的通知。onChargeStatusChange是支付行为的通知</b>

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|callback|接收购买结果的回调|Function|是|无|

* 示例
    ```javascript
     botApp.sendEvent(function (err, data) {
        if (!err) {
            console.log(data);
            // 打印结果如下：
            {
                "productId": "{{STRING}}",
                "baiduOrderReferenceId": "{{STRING}}",
                "sellerOrderId":"{{STRING}}",
                "purchaseResult":"{{ENUM}}",
                "message":"{{STRING}}" //  - SUCCESS 支付成功,- ERROR 支付发生错误
            }
        }
    });
    ```

## uploadBase64Image(base64Image, callback) *1.9+* `SHOW ONLY`
上传base64编码过的图片到云端。

|参数|说明|类型|必填|默认值|
|----|----|----|----|----|
|base64Image|base64编码的图片|String|是|无|
|callback|接收上传结果的回调|Function|是|无|

* 示例
    ```javascript
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhE';
     botApp.uploadBase64Image(base64Image, function (err, data) {
        if (!err) {
            console.log(data);
            // 打印结果如下：
            'SUCCESS' // 上传成功
            'FAILED' // 上传失败
        }
    });
    ```



## 附表

### 内建错误信息

|错误名称 | code | msg | 描述
|---|---|---|---|
|LowVersionErrorMsg|1001|Device version too low|设备版本过低错误|
|ServiceError|1002|Service error, {{msg}}|接口请求报错|


### updateUIContext 系统内建类型

<table style="border-collapse: collapse; min-width: 100%;">
    <colgroup>
        <col style="width: 130px;" />
        <col style="width: 129px;" />
        <col style="width: 77px;" />
        <col style="width: 294px;" />
        <col style="width: 264px;" /></colgroup>
    <tbody>
        <tr>
            <td style="background-color: rgb(234, 234, 234); border: 1px solid rgb(187, 187, 187); width: 130px; padding: 8px;">
                <div>type</div></td>
            <td style="background-color: rgb(234, 234, 234); border: 1px solid rgb(187, 187, 187); width: 129px; padding: 8px;">
                <div>request params</div></td>
            <td style="background-color: rgb(234, 234, 234); border: 1px solid rgb(187, 187, 187); width: 77px; padding: 8px;">
                <div>response slots</div>
                <div>（除了默认的url之外）</div></td>
            <td style="background-color: rgb(234, 234, 234); border: 1px solid rgb(187, 187, 187); width: 294px; padding: 8px;">example</td>
            <td style="background-color: rgb(234, 234, 234); border: 1px solid rgb(187, 187, 187); width: 264px; padding: 8px;">
                <div>vsl</div></td>
        </tr>
        <tr>
            <td>
                <div>input</div></td>
            <td>
                <div>name:</div>
                <div>(optional) value:</div>
                <div>(optional) type:</div>
                <div>&nbsp;&nbsp;date</div>
                <div>&nbsp;&nbsp;car_number</div>
                <div>&nbsp;&nbsp;cityxpress_number</div>
                <div>&nbsp; city<e>
                <div>(optional) prefix(暂不支持)</div>
                <div></div>
            </td>
            <td>content</td>
            <td>
                <div>“输入地址北京”</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name:地址,</div>
                <div>&nbsp;&nbsp;type:city</div>
                <div>}</div>
                <div></div>
                <div>response params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;content:北京</div>
                <div>}</div></td>
            <td>
                <div>input-text</div>
                <div>@car-number</div>
                <div>input-date</div>
                <div>input-city</div>
                <div>@express-number</div>
             </td>
        </tr>
        <tr>
            <td>
                <div>button</div></td>
            <td>
                <div>name</div>
                <div>(optional) index</div>
                <div>(optional) index_x</div>
                <div>(optional) index_y</div></td>
            <td>
                <div>-</div></td>
            <td>
                <div>“点击确认”、“选择确认”、“选择第一个”</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name: 确认,</div>
                <div>&nbsp;&nbsp;index: 1,</div>
                <div>}</div></td>
            </div>
            <td></td>
        </tr>
        <tr>
            <td>
                <div>link</div></td>
            <td>
                <div>name</div>
                <div>(optional) index</div>
                <div>(optional) index_x</div>
                <div>(optional) index_y</div>
                <div>(optional) prefix(暂不支持)</div></td>
            <td>
                <div>-</div></td>
            <td>
                <div>“点击确认”、“选择确认”、“选择第一个”</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name: 确认,</div>
                <div>&nbsp;&nbsp;index: 1,</div>
                <div>}</div></td>
            <td>
                <div>click</div></td>
        </tr>
        <tr>
            <td>
                <div>select</div></td>
            <td>
                <div>name</div>
                <div>(optional) selected</div>
                <div>(optional) index</div>
                <div>(optional) index_x</div>
                <div>(optional) index_y</div></td>
            <td>
                <div>-</div></td>
            <td>
                <div>“选择确认”、“选择第一个”</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name: 确认,</div>
                <div>&nbsp;&nbsp;index: 1,</div>
                <div>}</div></td>
            <td>
                <div>select</div></td>
        </tr>
        <tr>
            <td>
                <div>video</div></td>
            <td>
                <div>name</div>
                <div>(optional) index</div>
                <div>(optional) index_x</div>
                <div>(optional) index_y</div>
                <div>(optional) actors(screen_e)</div>
                <div>(optional) director</div>
                <div>(optional) prefix(暂不支持)</div>
                <div>//后续增加的字段要与structures/search-video-structure-private.md 保持一致</div>
                </td>
            <td>
                <div>-</div></td>
            <td>
                <div>"播放琅琊榜"</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name: 琅琊榜</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>
                <div>music</div></td>
            <td>
                <div>name</div>
                <div>(optional) index</div>
                <div>(optional) index_x</div>
                <div>(optional) index_y</div>
                <div>(optional) singers</div>
                <div>(optional) album</div>
                <div>(optional) prefix(暂不支持)</div></td>
            <td>
                <div>-</div></td>
            <td>
                <div>"播放青花瓷"</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name: 青花瓷</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>
                <div>tab</div></td>
            <td>
                <div>name</div>
                <div>(optional) selected</div>
                <div>(optional) index</div>
                <div>(optional) index_x</div>
                <div>(optional) index_y</div>
                <div>(optional) prefix(暂不支持)</div></td>
            <td>
                <div>-</div></td>
            <td>
                <div>“切换到电视剧”</div>
                <div>request params</div>
                <div>{</div>
                <div>name: 电视剧</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>scroll</td>
            <td>
                <div>(optional) name:</div>
                <div>(optional) type:</div>
                <div>vertical</div>
                <div>horizontal</div>
                <div>page</div></td>
            <td>
                <div>direction 方向，取值{left/right/up/down}</div>
                <div></div>
                <div>by 滚动的相对值，可以有正负</div>
                <div></div>
                <div>to 滚动的绝对值，-1代表滚到底</div></td>
            <td>
                <div>"把电影列表向下滚动"</div>
                <div>request params</div>
                <div>{</div>
                <div>name:电影列表</div>
                <div>}</div>
                <div></div>
                <div>response params</div>
                <div>{</div>
                <div>direction:{left/right/up/down}</div>
                <div>&nbsp;&nbsp;by: {{LONG}},</div>
                <div>&nbsp;&nbsp;to: {{LONG}}, //to ==-1的时候，表示“滚到底”</div>
                <div>&nbsp;&nbsp;//by和to的单位，暂时都是 屏幕/页，以后有需求再加别的unit</div>
                <div>}</div></td>
            <td>
                <div>scroll-vertical</div>
                <div>scroll-horizontal</div>
                <div>scroll-page</div></td>
        </tr>
        <tr>
            <td>pager</td>
            <td>
                <div>(optional) name:</div>
                <div>(optional) cur_page:</div>
                <div>(optional) min</div>
                <div>(optional) max</div>
                </td>
            <td>
                <div>by 页码的相对值，可以有正负</div>
                <div>to 页码的绝对值，-1代表最后一页(如果没有max的话, 才会返回-1;否则应该返回max-1)</div>
            </td>
            <td>
                <div>"把电影列表翻到最后一页"</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name:电影列表</div>
                <div>}</div>
                <div></div>
                <div>response params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;to: {{LONG}}, </div>
                <div>}</div></td>
            <td>
                <div>pager</div>
                </td>
        </tr>
         <tr>
            <td>step</td>
            <td>
                <div>(optional) name:</div>
                <div>(optional) cur_page:</div>
                <div>(optional) min</div>
                <div>(optional) max</div>
                </td>
            <td>
                <div>by 页码的相对值，可以有正负</div>
                <div>to 页码的绝对值，-1代表最后一页(如果没有max的话, 才会返回-1;否则应该返回max-1)</div>
            </td>
            <td>
                <div>"下一步"</div>
                <div>request params</div>
                <div>{</div>
                <div>}</div>
                <div></div>
                <div>response params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;by: {{LONG}}, </div>
                <div>}</div></td>
            <td>
                <div>step</div>
                </td>
        </tr>
        <tr>
            <td>call_phone</td>
            <td>
                <div>name</div>
                <div>(optional) index</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>"电话第一个"</div>
                <div>request params</div>
                <div>{</div>
                <div>index:1</div>
                <div>}</div>
                <div>response params</div>
                <div>{</div>
                <div>call_phone_type:(normal/voice/video)</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>send_message</td>
            <td>
                <div>name</div>
                <div>(optional) index</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>"发消息给第一个"</div>
                <div>request params</div>
                <div>{</div>
                <div>index:1</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>read_message</td>
            <td>
                <div>(optional) index</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>"阅读第一条留言"</div>
                <div>request params</div>
                <div>{</div>
                <div>index:1</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>view_photo</td>
            <td>
                <div>(optional) index</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>"查看第一张照片"</div>
                <div>request params</div>
                <div>{</div>
                <div>index:1</div>
                <div>}</div></td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>
                <div>video_player</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>command: seek_by(快进快退n秒)/seek_to(从某时刻播放)/pause(暂停)/continue(继续播放)/next(下一个)/previous(上一个)/</div>
                <div>percent: 进度的百分比,例如30</div>
                <div>time: 秒数, 例如90</div>
                <div>action: FORWARD/REWIND(快进快退场景下区分前进后退)</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>-</div>
            </td>
        </tr>
        <tr>
            <td>
                <div>audio_player</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>command: continue(继续播放)/pause(暂停)/previous(上一个)/next(下一个)/seek_to(从某时刻播放)/seek_by(快进快退n秒)/favorite(收藏or取消收藏)/play_favorite(播放收藏)/play_history(播放历史)/play_mode(播放模式)/exit(退出)</div>
                <div>time: 秒数, 例如90</div>
                <div>percent: 百分比, 例如30</div>
                <div>action: FORWARD/REWIND/LIKE/UNLIKE(快进快退场景下区分前进、后退, 收藏场景下区分收藏、取消收藏)</div>
                <div>play_mode: 播放模式, RAND/SINGLE_CYCLE/LIST_CYCLE分别表示随机播放/单曲循环/顺序播放</div>
            </td>
            <td>
                <div>-</div>
            </td>
            <td>
                <div>-</div>
            </td>
        </tr>
        <tr>
            <td>
                <div>smarthome_control</div>
            </td>
            <td>
                <div>index</div>
                <div>name</div>
            </td>
            <td>
                <div>slots</div>
            </td>
            <td>
                <div>“第一个调亮”、“把第一个设置为阅读模式”</div>
                <div>request params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;name: 床头灯,</div>
                <div>&nbsp;&nbsp;index: 1</div>
                <div>}</div>
                <div>response params</div>
                <div>{</div>
                <div>&nbsp;&nbsp;slots:{ANY}</div>
                <div>}</div>
            </td>
            <td>
                <div></div>
            </td>
        </tr>
        <tr>
            <td>
                <div></div>
            </td>
            <td>
                <div></div>
            </td>
            <td>
                <div></div>
            </td>
            <td>
                <div></div>
            </td>
            <td>
                <div></div>
            </td>
        </tr>
    </tbody>
</table>
