'use strict';

/**
 * Created by chenshu on 02/03/2017.
 */var krpanoProps = {bgcolor:{type:String},wmode:{type:String,default:"opaque"},vars:{type:Object},initvars:{type:Object},basepath:{type:String},mwheel:{type:Boolean,default:false},focus:{type:Boolean,default:true},consolelog:{type:Boolean,default:false},mobilescale:{type:Number,default:0.5},fakedevice:{type:String},passQueryParameters:{type:Boolean,default:false},webglsettings:{type:Object}};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Created by chenshu on 02/03/2017.
 */var config={props:_extends({xml:{type:String,required:true},scene:{type:String},hooks:{type:Object},debug:{type:Boolean,default:false}},krpanoProps),data:function data(){return{createLock:false,krpanoObjId:"krpano_"+Math.floor(Math.random()*(100000-100+1)+100)};},methods:{createPano:function createPano(){var _window=window,embedpano=_window.embedpano,removepano=_window.removepano;if(!(embedpano&&removepano)){throw new Error("krpano player is required");}if(!this.createLock&&!this.krpanoObj){this.createLock=true;var vm=this;this.$el.id=this.krpanoObjId+"_container";embedpano({id:this.krpanoObjId,target:this.$el.id,xml:this.xml,bgcolor:this.bgcolor,wmode:this.wmode,vars:this.vars,initvars:this.initvars,basepath:this.basepath,mwheel:this.mwheel,focus:this.focus,consolelog:this.consolelog,mobilescale:this.mobilescale,fakedevice:this.fakedevice,passQueryParameters:this.passQueryParameters,webglsettings:this.webglsettings,onready:function onready(krpanoObj){vm.krpanoObj=krpanoObj;vm.krpanoObj.hooks=vm.hooks;vm.log("pano created");vm.$emit("panoCreated",vm.krpanoObj);vm.createLock=false;},onerror:function onerror(msg){vm.$emit("panoError",msg);vm.createLock=false;}});}},removePano:function removePano(){var _window2=window,removepano=_window2.removepano;if(this.krpanoObj){removepano(this.krpanoObj.id);this.log("pano removed");delete this.krpanoObj;}},loadScene:function loadScene(){var scene=this.scene;if(this.krpanoObj){if(scene){var str="if(scene["+scene+"]===null,\n                        loadscene(get(scene[0].name),null,MERGE,BLEND(0.5)),\n                        loadscene("+scene+",null,MERGE,BLEND(0.5)))";this.krpanoObj.call(str);this.log("scene changed: "+scene);this.$emit("sceneChanged",scene);}else{this.krpanoObj.call("loadscene(get(scene[0].name),null,MERGE,BLEND(0.5))");}}},log:function log(content){if(this.debug){if(this.krpanoObj){content="["+this.krpanoObj.id+"] "+content;}console.debug(content);}}},watch:{xml:function xml(newXml){if(this.krpanoObj&&newXml){this.krpanoObj.call("loadpano("+newXml+",null,IGNOREKEEP)");this.$emit("xmlChanged",newXml);this.log("xml changed: "+newXml);}},scene:function scene(){this.loadScene();}},created:function created(){this.$on(["panoCreated","xmlChanged"],this.loadScene);},beforeDestroy:function beforeDestroy(){this.removePano();}};

/**
 * Created by chenshu on 02/03/2017.
 */var config$1={props:{lazyLoad:{type:Boolean,default:true}},mounted:function mounted(){if(this.lazyLoad){this.createLock=true;this.scrollListener();window.addEventListener("scroll",this.scrollListener);}else{this.createPano();}},methods:{scrollListener:function scrollListener(){var rect=this.$el.getBoundingClientRect();if(-rect.top>rect.height||rect.top>window.innerHeight){//屏幕之外
if(this.krpanoObj){this.krpanoObj.call("if(autorotate.enabled,autorotate.pause())");this.log("out of screen: autorotate paused");}}else{//屏幕之内
if(!this.krpanoObj){this.createLock=false;//lazy load
this.createPano();}else{this.krpanoObj.call("if(autorotate.enabled,autorotate.resume())");this.log("in screen: autorotate resumed");}}}}};

/**
 * Created by chenshu on 03/03/2017.
 */var config$2={props:{freezeVertical:{type:Boolean,default:false}},data:function data(){return{eventDelegate:undefined};},methods:{},watch:{freezeVertical:function freezeVertical(val){if(this.eventDelegate){if(val){this.eventDelegate.style.display="block";var hlookat=this.krpanoObj.get("view.hlookat");this.krpanoObj.call("lookat("+hlookat+",0)");}else{this.eventDelegate.style.display="none";}}}},created:function created(){var _this=this;if(TouchEvent){this.$on("panoCreated",function(krpano){var origin=krpano.firstChild;var eventDelegate=document.createElement("DIV");eventDelegate.className="event-delegate";Object.assign(eventDelegate.style,{display:_this.freezeVertical?"block":"none",width:"100%",height:"100%",position:"absolute","user-select":"none","z-index":1});krpano.appendChild(eventDelegate);_this.eventDelegate=eventDelegate;var originTouch=void 0;eventDelegate.addEventListener("touchstart",function(e){originTouch=e;Object.defineProperty(e,"cancelable",{value:true});var event=new TouchEvent("touchstart",e);return origin.dispatchEvent(event);});eventDelegate.addEventListener("touchend",function(e){Object.defineProperty(e,"cancelable",{value:true});var event=new TouchEvent("touchend",e);return origin.dispatchEvent(event);});eventDelegate.addEventListener("touchmove",function(e){var currentTouch=e.changedTouches[0];var deltaX=originTouch.clientX-currentTouch.clientX;var hlookat=krpano.get("view.hlookat")+deltaX;var vlookat=krpano.get("view.vlookat");krpano.call("lookat("+hlookat+","+vlookat+")");originTouch=currentTouch;return true;});eventDelegate.addEventListener("mousedown",function(e){Object.defineProperty(e,"cancelable",{value:true});return origin.dispatchEvent(new MouseEvent("mousedown",e));});eventDelegate.addEventListener("mousewheel",function(e){Object.defineProperty(e,"cancelable",{value:true});return origin.dispatchEvent(new MouseEvent("mousewheel",e));});});}}};

/**
 * Created by chenshu on 02/03/2017.
 */var component={name:"Krpano",mixins:[config,config$1,config$2],template:"<div class='vue-krpano'></div>",mounted:function mounted(){this.createPano();}};component.install=function(Vue){Vue.component(component.name,component);};

module.exports = component;
