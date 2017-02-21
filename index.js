/**
 * Created by chenshu on 20/01/2017.
 */
"use strict";

if (!(window.embedpano && window.removepano)) {
    throw "krpano player is required";
}

module.exports = {
    props: {
        xml: {
            type: String,
            required: true
        },
        scene: {
            type: String
        },
        lazyLoad: {
            type: Boolean,
            default: true
        },
        mwheel: {
            type: Boolean,
            default: false
        },
        focus: {
            type: Boolean,
            default: true
        },
        consolelog: {
            type: Boolean,
            default: false
        },
        noPlugin: {
            type: Boolean,
            default: false
        },
        debug: {
            type: Boolean,
            default: false
        },
        callback: {
            type: Object
        }
    },
    template: "<div class='vue-krpano'></div>",
    mounted(){

        this.krpanoObjId = "krpano_" + Math.floor(Math.random() * (100000 - 100 + 1) + 100);
        this.$el.id = this.krpanoObjId + "_container";

        if (this.lazyLoad) {
            this.scrollListener();
            window.addEventListener("scroll", this.scrollListener);
        } else {
            this.createPano();
        }
    },

    methods: {
        createPano(){
            if (!this.lock) {
                this.lock = true;
                let vm = this;
                window.embedpano({
                    id: this.krpanoObjId,
                    target: this.$el.id,
                    xml: this.xml,
                    mwheel: this.mwheel,
                    focus: this.focus,
                    consolelog: this.consolelog,
                    onready(){
                        vm.krpanoObj = vm.$el.firstChild;

                        vm.$emit("panoCreated", vm.krpanoObj);
                        vm.lock = false;
                        vm.loadScene(vm.scene);
                        vm.applyConfig();
                        vm.debug && console.debug("[" + vm.krpanoObjId + "] pano created");
                    }
                });
            }

        },
        loadScene(newScene){
            let str = `if(scene[${newScene}]===null,
            loadscene(get(scene[0].name),null,MERGE,BLEND(0.5)),
            loadscene(${newScene},null,MERGE,BLEND(0.5)))`;

            this.krpanoObj && this.krpanoObj.call(str);
        },
        scrollListener(){

            var rect = this.$el.getBoundingClientRect();

            if (-rect.top > rect.height || rect.top > window.innerHeight) {
                //屏幕之外
                if (this.krpanoObj) {
                    this.krpanoObj.call("if(autorotate.enabled,autorotate.pause())");
                    this.debug && console.debug("[" + this.krpanoObjId + "] out of screen: autorotate paused");
                }

            } else {
                //屏幕之内
                if (!this.krpanoObj) {
                    //lazy load
                    this.createPano();
                }
                else {
                    this.krpanoObj.call("if(autorotate.enabled,autorotate.resume())");
                    this.debug && console.debug("[" + this.krpanoObjId + "] in screen: autorotate resumed");
                }
            }
        },
        applyConfig(){
            //apply settings
            if (this.noPlugin) {
                this.krpanoObj.call("for(set(i,0), i LT plugin.count, inc(i), set(plugin[get(i)].visible,false))");
            }

            if (this.callback) {
                Object.assign(this.krpanoObj, this.callback);
            }
        }
    },
    watch: {
        xml: function (newXml) {

            this.debug && console.debug("newXml: " + newXml);
            if (this.krpanoObj) {
                this.krpanoObj.call(`loadpano(${newXml},null,IGNOREKEEP)`);
                this.applyConfig();
                this.loadScene(this.scene);
            }
        },
        scene: function (newScene) {
            this.debug && console.debug("newScene: " + newScene);
            this.loadScene(newScene);
        }
    },
    beforeDestroy(){
        if (this.lazyLoad) {
            window.removeEventListener("scroll", this.scrollListener);
        }
        if (this.krpanoObj) {
            window.removepano(this.krpanoObj.id);
            delete this.krpanoObj;
            this.debug && console.debug("pano destroyed");
        }
    }
};