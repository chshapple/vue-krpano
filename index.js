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
                        vm.lock = false;

                        if (vm.noPlugin) {
                            vm.krpanoObj.call("for(set(i,0), i LT plugin.count, inc(i), set(plugin[get(i)].visible,false))");
                        }

                        if (vm.debug) console.log("pano created");

                    }
                });
            }

        },
        destroyPano(){
            if (this.krpanoObj) {
                window.removepano(this.krpanoObj.id);
                delete this.krpanoObj;
                if (this.debug) console.log("pano destroyed");
            }
        },
        scrollListener(){

            if (window.scrollY - this.$el.offsetTop - this.$el.offsetHeight > 0 ||
                this.$el.offsetTop - window.scrollY - window.innerHeight > 0) {
                //屏幕之外
                if (this.krpanoObj) {
                    this.krpanoObj.call("if(autorotate.enabled,autorotate.pause())");
                }

            } else {
                //屏幕之内
                if (!this.krpanoObj) {
                    this.createPano()
                }
                else {
                    this.krpanoObj.call("if(autorotate.enabled,autorotate.resume())");
                }
            }
        }
    },
    watch: {
        xml: function (newXml) {
            if (this.krpanoObj) {
                this.krpanoObj.call(`loadpano(${newXml})`);
                this.krpanoObj.call(`loadscene(get(scene[${this.scene - 1}].name),null,MERGE,BLEND(0.5))`);
            }
        },
        scene: function (newScene) {
            if (this.krpanoObj) {
                this.krpanoObj.call(`loadscene(get(scene[${newScene - 1}].name),null,MERGE,BLEND(0.5))`);
            }
        }
    },
    destroyed(){
        if (this.lazyLoad) {
            window.removeEventListener("scroll", this.scrollListener);
        }
        this.destroyPano();
    }
};