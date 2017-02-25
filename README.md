# vue-krpano

A Vue component for [krpano](http://www.krpano.com) player.

## Demo

[http://yier.ehousechina.com/pois/10045](http://yier.ehousechina.com/pois/10045)

## Installation

```
npm install vue-krpano --save
```

## Dependency

* [vuejs@2.0](http://vuejs.org)
* A Krpano player globally referenced by `<script>`


## Instruction

page.js

```js
{
    "template": require("./page.html"),
    "components": {
        "krpano": require("vue-krpano")
    }
}
```

page.html

```html
<krpano :xml="'krpano.xml'" :lazy-load="true" style="width:100%;height:400px"></krpano>
```

## Props

|Name|Description|Example|
|:--|:--|:--|
|`xml`|Krpano configuration XML path|`krpano.xml`|
|`scene`|Scene index|`1`|
|`lazyLoad`|A Boolean setting to lazy load pano objects|`true`|
|`mwheel`|A Boolean setting to control the mouse-wheel usage|`false`|
|`focus`|A Boolean setting to give the viewer the input / keyboard focus on startup.|`true`|
|`consolelog`|A Boolean setting that defines if krpano log/trace-messages should be sent also to the browser Javascript console.|`false`|
|`noPlugin`|A Boolean setting to remove all plugins|`false`|
|`callback`|An object that will be attached to the `krpano` instance|`{foo:bar}`|
|`debug`|Debug mode|`false`|


## Two-way Communication

The `callback` object will be attached to the `krpano` instance.

Example:

```js
var callback = {
    doSomething(){
        //do something
    }
}
```

In krpano scripts, you can access the callback object via [krpano](https://krpano.com/docu/actions/#jscall
) instance.

```xml
<action name="my_action">
    jscall(calc('krpano.doSomething()'));
</action>
```

## About

For any question, please feel free to write email to 261934121@qq.com
