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
            type: Number,
            default: 1
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
                    onready(){
                        vm.krpanoObj = vm.$el.firstChild;
                        vm.$emit("panoCreated", vm.krpanoObj);
                        vm.lock = false;

                        vm.applyConfig();

                        if (vm.debug) console.debug("pano created");
                    }
                });
            }

        },
        changeScene(newScene){
            if (this.krpanoObj) {
                this.krpanoObj.call(`loadscene(get(scene[${newScene - 1}].name),null,MERGE,BLEND(0.5))`);
            }
        },
        applyConfig(){
            if (this.noPlugin) {
                this.krpanoObj.call("for(set(i,0), i LT plugin.count, inc(i), set(plugin[get(i)].visible,false))");
            }

            this.changeScene(this.scene);
        },
        destroyPano(){
            if (this.krpanoObj) {
                window.removepano(this.krpanoObj.id);
                delete this.krpanoObj;
                if (this.debug) console.debug("pano destroyed");
            }
        },
        scrollListener(){

            if (window.scrollY - this.$el.offsetTop - this.$el.offsetHeight > 0 ||
                this.$el.offsetTop - window.scrollY - window.innerHeight > 0) {
                //屏幕之外
                if (this.krpanoObj) {
                    this.krpanoObj.call("if(autorotate.enabled,autorotate.pause())");
                    if (this.debug) console.debug("out of screen: autorotate paused");
                }

            } else {
                //屏幕之内
                if (!this.krpanoObj) {
                    this.createPano();
                    if (this.debug) console.debug("in screen: pano created");

                }
                else {
                    this.krpanoObj.call("if(autorotate.enabled,autorotate.resume())");
                    if (this.debug) console.debug("in screen: autorotate resumed");

                }
            }
        }
    },
    watch: {
        xml: function (newXml) {

            if (this.debug) console.debug("newXml: " + newXml);
            if (this.krpanoObj) {
                this.krpanoObj.call(`loadpano(${newXml},null,IGNOREKEEP)`);
                this.applyConfig();
            }

        },
        scene: function (newScene) {
            if (this.debug) console.debug("newScene: " + newScene);
            this.changeScene(newScene);
        }
    },
    destroyed(){
        if (this.lazyLoad) {
            window.removeEventListener("scroll", this.scrollListener);
        }
        this.destroyPano();
    }
};