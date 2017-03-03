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
|`scene`|Scene name|`foo`|
|`lazyLoad`|A Boolean setting to lazy load pano objects|`true`|
|`hooks`|An object that will be attached to the `krpano` instance|`{foo:bar}`|
|`debug`|Debug mode|`false`|

### Krpano builtin options

|Name|Description|Example|
|:--|:--|:--|
|`bgcolor`|The background color of the viewer (in html color format).|`#000000`|
|`wmode`|The wmode setting is typically a Flashplayer setting, but wmode=opaque and wmode=transparent<br/> will be evaluated also by the krpano HTML5 viewer and make the viewer background transparent there too. <br/>Overlapping html elements itself are always possible when using the HTML5 viewer.|`opaque`|
|`vars`|Pass a Javascript Object with krpano variable:value pairs.<br/>The variables will be set AFTER the xml file has been be loaded and parsed.
So these variables can be used to add new settings or to overwrite settings that were already defined in the xml.||
|`initvars`|Pass a Javascript Object with krpano variable:value pairs.<br/>This is basically the same as the vars setting, <br/>but these variables will be set BEFORE the xml file wil be loaded and parsed.||
|`basepath`|Can be used in Flash and HTML5 for adjusting relative paths in the xml.||
|`mwheel`|A Boolean setting to control the mouse-wheel usage|`false`|
|`focus`|A Boolean setting to give the viewer the input / keyboard focus on startup.|`true`|
|`consolelog`|A Boolean setting that defines if krpano log/trace-messages should be sent also to the browser Javascript console.|`false`|
|`webglsettings`|Pass an object with special settings for the WebGL context creation.<br/>The WebGL context will be created at startup and can't be changed at runtime, therefore these settings need to be specified already during embedding.||
|`mobilescale`|By default all krpano content on mobile devices will be scaled by 0.5.<br/>To disable that scaling, set the mobilescale setting to 1.0.<br/>This can be useful for implementing responsive webdesigns.|`0.5`|
|`fakedevice`|Fake the krpano device detection settings.<br/>Available settings: `mobile`, `tablet`, `desktop`.|`mobile`|

## Two-way Communication

The `hooks` object will be attached to the `krpano` instance.

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
    jscall(calc('krpano.hooks.doSomething()'));
</action>
```

## About

For any question, please feel free to write email to 261934121@qq.com
