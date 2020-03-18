# BOT APP JS SDK *(v1.7.0)*

## 本文档规范

### 名词解释

* `SHOW`：小度有屏音箱，
* `App`：手机端的小度App和小度音箱App
* `SHOW ONLY`：说明本方法仅适用SHOW设备，也就是小度有屏音箱设备
* `App ONLY`：说明本方法仅适用小度音箱APP和小度App
* `1.4+` 说明本方法仅适用SDK 1.4及其以后的版本

## GUID

### 一个H5应用接入到度秘需要哪些步骤？

* 创建一个技能，<https://dueros.baidu.com/dbp/bot/index#/addbot/0>，选择“自定义”，输入后“确定”，将技能ID发给度秘对接技术
* 集成本SDK，详见下方**BotApp的引入**
* 如果开发者有登录的需求，账号关联流程详见**BotApp.requireLinkAccount**
* 如果开发者有支付的需求，详见**BotApp.requireCharge**

### H5游戏想要运行在小度App/小度音箱App上？需要如下工作：

小度App/小度音箱App上运行的H5游戏需要额外调用以下几个方法才能实现小度有屏音箱上同样的功能：

* 使用`isInApp()`来判断当前H5应用的运行环境是否是小度App/小度音箱App；
* 需要在`requireLinkAccount()`中传入一个回调函数来获取App上的百度账号的授权结果；
* 需要在`requireCharge()`方法中再传入一个回调函数接收购买结果；
* 通过小度App debug包调试，需要手动输入如下地址调试：http(s)://xiaodu.baidu.com/saiya/sdk/iframe/h5game-wrapper.html?gameUrl=${gameUrl} (gameUrl为encodeURIComponent编码后的地址)。

## BotApp的引入

* 通过script标签引入(支持https)

```html
<script src="//duer.bdstatic.com/saiya/sdk/h5-bot-sdk.1.7.0.js"></script>
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

> * 正式上线时上述随机字符串和签名需要开发者通过后端接口生成。在开发调试阶段可采用如下方式快速生成MD5：
> ```bash
> md5 -s "string"
> ```
> * 签名Key不能明文暴露，以免造成不必要的风险。
> * 签名Key在DBP平台(<https:/ros.baidu.com/dbp>)技能的基础信息页面

## BotApp.isInApp() *1.4+*
判断当前H5运行环境是否是在小度APP或者小度音箱APP中，以此区分有屏音箱端和手机App端。开发者需以此来判断并使用相应的SDK方法。

## BotApp.requireLinkAccount([,callback])
接入度秘的H5应用，如有登录需要，必须和百度的账号体系进行绑定，此接口用来在度秘上发起账号绑定流程。**1.4+**版本以后在**小度App/小度音箱App运行环境**中支持传入一个回调函数接收授权结果。小度有屏音箱端需要调用`getRegisterResult()`来获取授权结果。

目前支持2种方案：

1. 沿用百度账号体系oauth的授权流程，开发者需在<http://developer.baidu.com/wiki/index.php?title=docs/oauth>申请一个新的应用，并将oauth应用的相关信息提供给度秘。绑定成功后，会回调给开发者提供的callback H5地址。后续度秘请求的所有H5和接口回调，都会带上accessToken参数。开发者可以通过accessToken参数请求百度oauth的接口，再换取用户的具体信息。

2. 开发者自己实现标准的oauth协议，并将oauth协议相关接口信息在度秘dbp平台上进行配置。授权成功后可在`onLinkAccountSucceeded(fn)`的回调函数中获取到accessToken。

> 建议第三方开发者使用方案1，产品交互相对简单，用户只需要在设备上确认授权，即可自动登录

本方法在小度APP/小度音箱App和小度有屏音箱上都能调起授权。在小度APP/小度音箱App上，开发者需要传入一个回调函数来获取授权结果。小度有屏音箱上，开发者需要使用`getRegisterResult()`来获取结果

* 参数

    callback(*Function*)：本回调函数**只会**在小度App/小度音箱App上被触发，且当运行在小度App/小度音箱App时，本参数是必填参数，本回调函数会携带一个授权结果数据，其Scheme如下：

    ```javascript
    {
        "type":"{{string}}",
        "data":{
            "accessToken":"{{string}}"
        }
    }
    ```

* 示例1

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

* 示例2

  ```javascript
   botApp.requireLinkAccount();
   ```


## BotApp.onLinkAccountSuccess(callback) `SHOW ONLY`
获取oauth授权结果。此方法会监听oauth授权成功后的结果。

> 注意：仅当开发者选中上方的第二种授权方案且在有屏音箱上使用时才会触发本函数中的回调


* 参数

    callback(*Function*)：此函数接收一个参数，SDK收到授权成功的通知后会调用此函数下发accessToken等相关数据。其数据schema如下：

    ```javascript
    {
        "token": "{{STRING}}", // 标识本次返回，可能没有
        "app":{
            "accessToken": "{{STRING}}" // 第三方平台的授权accessToken（非DuerOS使用的百度access_token）
        }
    }
    ```

* 示例
    ```javascript
    botApp.onLinkAccountSuccess(function (payload) {
        console.log(payload);
        // 结果如下：
        {
            token: '13782f3d-05cd-802d-f0a9-92bb0ac572c8',
            app:{
                accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'
            }
        }
    })
    ```

## BotApp.getRegisterResult(callback)
BotApp SDK初始化之后，SDK内部会进行身份校验、注册等操作，开发者可使用本方法来获取注册结果，如果已经绑定过百度账号，则能获取到oauth授权后的accessToken。

* 参数

    callback(*Function*)：SDK获取到注册结果之后会调用此回调函数，此回调函数接收一个参数接收注册结果。其schema如下：

    ```javascript
    {
        "accessToken": "{{string}}"
    }
    ```

* 示例

    ```javascript
    botApp.getRegisterResult(function (data) {
         console.log(data);
        // 打印结果如下：
        {
            accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'
        }
    })
    ```

## BotApp.requireUserAgeInfo(callback) *1.5+* `SHOW ONLY`

H5应用可通过本方法获取用户的实名认证信息，如果用户没有实名认证小度在家上会自动弹出实名认证的二维码。

* 参数

    callback(*Function(err, data)*): 本回调会传入用户的实名认证结果，其schema如下

    err:
    ```javascript
    {
        code: {{number}} // 错误码，详细对照见附表
        msg: {{string}}
    }
    ```
    data:
    ```javascript
    {
        "is_auth": "{{STRING}}", // 用户是否实名认证，1是、0否
        "age_group": "{{STRING}}" // 用户年龄段，16岁-18岁为1，18岁以上为2，16岁以下为3
    }
    ```

* 示例

     正常返回：
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
    设备版本过低返回：
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


## BotApp.requireCharge(data, [,callback])
H5应用可通过本方法发起收款，当用户支付成功后会：如果是在有屏音箱端，回调本SDK中`onChargeStatusChange(callback)`中的`callback`函数，如果是在小度App/小度音箱App中，会回调传入的`callback`函数

对于用户支付成功的订单，会有服务端的订单通知接口，开发者应以该接口的订单支付成功通知为最终数据。


* 参数

    data(*Object*)：其schema如下：
    ```javascript
    {
        "token": "{{STRING}}", // 可选，本次事件的token，开发者可自己生成
        "chargeBaiduPay": {
            "authorizeAttributes": {
                "authorizationAmount": {
                    "amount": "{{STRING}}", // 价格
                    "currencyCode": "CNY" // 币种，目前仅支持 CNY
                },
                "sellerAuthorizationNote": "{{STRING}}" // 商家授权信息备注
            },
            "sellerOrderAttributes": {
                "sellerOrderId": "{{STRING}}", // 此笔交易，在商家这边的订单ID。当用户付款成功后，会带有此ID通知技能
                "productName": "{{STRING}}", // 商品名称
                "productId": "{{STRING}}", // 商品id
                "description": "{{STRING}}", // 商品描述信息。对商品的简单介绍
                "sellerNote": "{{STRING}}" // 商品的备注信息
            }
        }
    }
    ```

	callback(*Function*)：本函数**只会**在小度App/小度音箱App中被回调，小度有屏音箱设备请使用`onChargeStatusChange`接收购买结果。调用可能会有明显延迟(当获取购买结果失败后SDK内部会重新请求2次，每次间隔1秒)。

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

## <del>BotApp.requireBuy(data, callback) *1.4+* `App ONLY`<del>

本方法不同于`requireCharge`，需要事先在度秘的商品库里注册`productId`，然后将其传入被方法的参数中。`callback`函数会在返回游戏页面后调用，调用可能会有明显延迟(当获取购买结果失败后SDK内部会重新请求2次，每次间隔1秒)。

* 参数

    data(*Object*)：其schema如下：
    ```javascript
    {
        productId: '{{string}}', // 商品ID，
        sellerOrderId: '{{string}}' // 接入方自己的订单ID
    }
    ```
    callback(Function)：本回调会传入错误信息和购买结果，其数据Scheme如下

    ```javascript
    参数一，错误信息：
    {{Any}}
    二，购买结果
    {
        "authorizationDetails": {
            "authorizationAmount": { //
                "amount": "{{STRING}}", // 扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                "currencyCode": "CNY" // 枚举类型。目前只能为CNY
            },
            "capturedAmount": {
                "amount": "{{STRING}}", // 实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                "currencyCode": "CNY" // 枚举类型。目前只能为CNY
            },
            "creationTimestamp": "{{INT32}}" // 订单创建时间。时间戳，单位毫秒
        },
        "baiduOrderReferenceId": "{{STRING}}", // 此次交易百度生成的订单ID
        "sellerOrderId":"{{STRING}}", // 对应支付的订单ID
        "purchaseResult":"{{ENUM}}", // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
        "message":"{{STRING}}" // 支付状态对应的消息
    }
    ```

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

> 仅当在小度有屏音箱上使用`requireCharge()`发起支付动作时本方法中的回调函数才会被回调

* 参数

    callback(*Function*)：当DuerOS支付结果返回时，SDK会调用此函数。此函数有一个参数，其schema如下：
    ```javascript
    {
        "token": "{{STRING}}", // 标识本次返回，可能没有
        "authorizationDetails": {
            "authorizationAmount": { //
                "amount": "{{STRING}}", // 扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                "currencyCode": "CNY" // 枚举类型。目前只能为CNY
            },
            "capturedAmount": {
                "amount": "{{STRING}}", // 实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                "currencyCode": "CNY" // 枚举类型。目前只能为CNY
            },
            "creationTimestamp": "{{INT32}}" // 订单创建时间。时间戳，单位毫秒
        },
        "baiduOrderReferenceId": "{{STRING}}", // 此次交易百度生成的订单ID
        "sellerOrderId":"{{STRING}}", // 对应支付的订单ID
        "purchaseResult":"{{ENUM}}", // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
        "message":"{{STRING}}" // 支付状态对应的消息
    }
    ```

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

## BotApp.onHandleIntent(callback) `SHOW ONLY`
意图下发。开发者在DBP平台上面开发的意图，在匹配到对应用户query之后,会封装对应意图成为Intent下发下来。
可通过回调函数参数中的`intent.name`来确定意图名称，之后开发对应的逻辑。同时还可以通过`intent.slots`解析参数。
> DBP开放平台：<https://dueros.baidu.com/dbp>
> 本方法仅支持在小度有屏音箱上调用

* 参数

    callback(Function)：SDK收到DuerOS解析的意图后会回调此函数，开发者可使用解析结果开发相关逻辑。callback函数接收一个参数，其schema如下：

    ```javascript
    {
        "token":"{{STRING}}",
        "app":{
            "accessToken":"{{STRING}}"
        },
        "intent":{
            "name":"{{STRING}}", // 意图名
            "slots":[
                {
                    "name":"{{STRING}}", // 槽位的槽位名
                    "value":"{{STRING}}" // 槽位的值
                }
            ]
        },
        "customData":{} // 自定义数据
    }
    ```

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

## BotApp.listen([,callback]) `SHOW ONLY`
开启聆听。设备会进入语音交互状态。
> 本方法仅支持在小度有屏音箱上调用

* 参数

    callback(*Function*)：可选参数，该函数会接收一个Boolean，标识是否发起聆听成功。

* 示例
    ```javascript
    botApp.listen(function (result) {
        console.log(result);
        // 打印结果：
        true
    });
    ```

## BotApp.speak(data, [,callback]) `SHOW ONLY`
成功调起播放后回调callback
> 本方法仅支持在小度有屏音箱上调用

* 参数

    data(*string*)：要进行播报的TTS文字。

    callback(*Function*)：TTS播放完毕后回调此函数，本函数没有参数。

* 示例

    ```javascript
    /**
    data: 要播报的TTS的文字内容
    */
    botApp.speak(data, function () {
        console.log('播报完毕');
        // 打印结果
        // 播报完毕
    }))
    ```

## BotApp.requestClose() *1.1+* `SHOW ONLY`
> 本方法仅支持在小度有屏音箱上调用
请求关闭浏览器。调用此方法后，小度有屏音箱上正在运行的H5会退出。

* 示例

    ```javascript
    botApp.requestClose();
    ```

## BotApp.updateUiContext(data, [,callback]) `SHOW ONLY`
本接口定义通用的自定义用户交互能力，设备端可以自主实现所希望的交互过程。

正常情况下交互都是由服务端决定的，比如问“西藏天气怎么样”则小度反问“西藏哪个城市的？不同城市的天气差别还是挺大的。”，但存在一些场景服务端因为信息缺乏，不能完全确定交互过程，需要由设备端配合来驱动用户交互过程。例如，在抽奖游戏中，H5页面上展示了2个宝箱，用户说“选择第一个”，服务端无法可能无法确定“第一个”或者“第二个”分别对应哪个宝箱，因此需要调用本方法来定义。

使用案例：抽奖游戏<br>
H5：展示两个宝箱<br>
H5：调用`speak('你要打开哪一个宝箱')`<br>
H5：调用`listen()`进入聆听态<br>
H5：调用updateUiContext([(utterances="第一个", url="{url1}"), (utterances="第二个", url="{url2}")])<br>
用户：“第二个”<br>
服务端：...后续逻辑
> 本方法仅支持在小度有屏音箱上调用

* 参数

    data(*Object*)：要上传的端状态数据，其schema如下
    ```javascript
    {
        "enableGeneralUtterances": "{{Boolean}}",
        "hyperUtterances": [
            {
                "url": "{{string}}", // 用于确定用户query的url
                "utterances": "{[{{string}}]}", // 支持的用户话术集合
                "type": "{{ENM}}", // 枚举类型，自定义类型为link,系统还提供内建类型 input,select等等，具体见下方附表
                "params: {} // 携带的参数
            }
        ]
    }
    ```

    callback(*Function*)：可选参数，当本事件上报发起后本函数会被回调，接收一个参数，表示是否成功发起请求

* 示例
    ```javascript
    const data = {
        enableGeneralUtterances: true,
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
    botApp.updateUiContext(data, function (result) {
        console.log(result);
        // 返回结果如下
        true
    });
    ```

## botApp.onHandleUnknowUtterance(callback) *1.6+* `SHOW ONLY`
必须先调用`updateUiContext`，同时将`enableGeneralUtterances`设置为`false`。当用户的对话内容不在`updateUiContext`设置的范围内时，开发者可使用本能力获取用户语音对话的语音识别文字结果。

* 参数

    callback(*Function*)：回调函数的参数是用户对话的内容，其schema如下：

    ```javascript
    {
        "query": "{string}"
    }
    ```

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

    botApp.onHandleUnknowUtterance(function (data) {
        console.log(data);
        // 当用户对话：小度小度，苹果
        // 打印结果如下：
        {
            query: "苹果"
        }
    });
    ```

## BotApp.onClickLink(callback) `SHOW ONLY`
ClickLink事件下发。ClickLink是一种Directive，用户新增自定义交互(`updateUiContext()`之后，云端会解析用户定义的交互，下发对应的指令。例如通过`botApp.updateUiContext(data)`新增自定义交互之后DuerOS会通过此接口下发上面定义的url。

如果用户引用*系统内建自定义类型*，用户query中可以包含参数，例如"*输入北京*"，这个query中*北京*可以被解析成参数，放到后面`params`中下发。
>系统内建类型参考：见下方附表
> 本方法仅支持在小度有屏音箱上调用

* 参数

    callback(*Function*)：SDK收到DuerOS返回的结果后回调此函数，此函数的参数schema如下：

    ```javascript
    {
        "url": "{{STRING}}",
        "params":{
          "{{STRING}}": "{{string}}"
        }
    }
    ```

* 示例

    如果使用上方updateUiContext的示例数据来自定义交互能力，则表现如下<br>
    用户：小度小度，草莓<br>
    SDK：本方法中注册的回调函数获得的数据结果如下

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

## BotApp.uploadLinkClicked(data) *1.2+* `SHOW ONLY`
当用户点击了屏幕上的某个链接时可通过本方法进行上报。DuerOS根据其携带的参数下发不同的指令，也可能什么指令也不下发。
> 本方法仅支持在小度有屏音箱上调用

* 参数

    data(*Object*): data.url 要上报的Link地址

* 示例

    ```javascript
    botApp.uploadLinkClicked({
        url: 'dueros://d7a12baa-47d5-437f-7af6-05bc9c4e5c28/?openbot=true&oss_channel=ls_m'
    });
    ```

## BotApp.onHandleScreenNavigatorEvent(callback) `SHOW ONLY`
屏幕导航事件。当用户发起语音请求，要求滚动屏幕时，本事件会被调用。
> 本方法仅支持在小度有屏音箱上调用

* 参数

    callback(*Function*)：当收到SDK收到DuerOS下发的屏幕导航事件时，本函数会被调用，参数schema如下：

    ```javascript
    {
        "data": "{{INT}}"
    }
    ```

    1: 向左滚动<br>
    2: 向右滚动<br>
    3: 向上滚动<br>
    4: 向下滚动<br>
    5: 下一页<br>
    6: 上一页<br>
    7: history go back<br>
    8: 回到Home页<br>

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

## BotApp.requireShipping *1.3+* `SHOW ONLY`
请求发货信息。开发者可在`BotApp.onHandleIntent`注册的回调函数中获取商品信息。要调用本方法则必须在BotApp初始化时填写`skillID`。本方法会在初始化阶段自动调用一次，开发者也可手动调用本方法。
> 本方法仅支持在小度有屏音箱上调用

* 示例

    ```javascript
    botApp.requireShipping();
    ```

## BotApp.onDialogStateChanged(callback) *1.6+* `SHOW ONLY`
用户对话状态变化通知，用户唤醒设备，发起语音指令，TTS播报，进入空闲状态都会受收到回调通知。

* 参数

    callback(*Function(err, status))*)：当用户与设备对话状态改变时，本回调会被调用，详细状态定义如下：

    |状态名称 | 状态值 |
    |---|---|
    | 空闲状态| IDLE |
    |正在语音输入| LISTENING |
    |语音输入完成，等待后端返回 | THINKING |
    |正在进行TTS播报 | SPEAKING |

    callback参数scheme如下：

    err:
    ```javascript
    {
        code: {{number}} // 错误码，详细对照见附表
        msg: {{string}}
    }
    ```

    status
    ```javascript
    {{string}}
    ```

* 示例

    ```javascript
    botApp.onDialogStateChanged(function (err, status) {
        console.log(status);
        // 打印如下：
        LISTENING
    })
    ```

## BotApp.canGoBack(callback) *1.6+* `SHOW ONLY`
获取设备浏览器历史记记录是否还能后退

* 参数

    callback(*Function(err, status)*)：回调中会传入第一个参数是可能的报错信息，第二个参数是一个布尔值，告知是否还能回退浏览器历史记录，schema示例如下:

    err:
    ```javascript
    {
        code: {{number}} // 错误码，详细对照见附表
        msg: {{string}}
    }
    ```

    status:
    ```javascript
    {{Boolean}}
    ```

* 示例

    ```javascript
     botApp.canGoBack(function(err, status) {
         console.log(status);
         // 打印如下
         true // 也有可能是false
    });
    ```

## BotApp.initAd([,config]) *1.7+* `SHOW ONLY`
初始化广告。

* 参数
    config(*Object*): 广告相关配置，其schema如下
    ```javascript
    {
        screenOrientation: {{enum}}, // 选填，默认值：portrait，游戏的屏幕类型，portrait => 竖屏游戏，landscape => 横屏(全屏)游戏，SDK根据不同屏幕类型展示不同形式的广告
        zIndex: {{number}}, // 选填，默认值：9999，广告等浮层的层级，
        displayStrategy: {{enum}}, // 选填，默认值：twice。广告展示策略，once => 用户关闭后不再填充广告， twice => 用户关闭60s后再填充一次
        firstDisplayTime: {{number}}, // 选填，单位秒，默认值：10，广告第一次展示的时间
        bannerPosition: { // 选填，默认值：{right: '30px', bottom: '30px'}，调整banner广告在游戏页面中的位置。值为CSS中的left、top、right、bottom。
            right: '{{string}}',
            bottom: '{{string}}'
        },
        clickCallback: {{Function}}, // 选填，广告点击回调
        closeCallback: {{Function}}, // 选填，广告关闭回调
        displayCallback: {{Function}}, // 选填， 广告展示回调
        switchCallback: {{Function}} // 选填，广告切换回调
    }
    ```

* 示例
    ```javascript
    botApp.initAd({
       screenOrientation: 'portrait',
       zIndex: 9999,
       displayStrategy: 'once',
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
       }
    })
    ```


## 附表

### 内建错误信息

|错误名称 | code | msg | 描述
|---|---|---|---|
|LowVersionErrorMsg|1001|Device version too low|设备版本过低错误|
|ServiceError|1002|Service error, {{msg}}|接口请求报错|


### 系统内建类型

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
