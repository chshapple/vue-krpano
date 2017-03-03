/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

import krpanoProps from "./krpanoProps";

const {embedpano, removepano} = window;

if (embedpano == undefined || removepano == undefined) {
    throw new Error("krpano player is required");
}

let config = {
    props: {
        xml: {
            type: String, required: true
        },
        scene: {
            type: String
        },
        hooks: {
            type: Object
        },
        debug: {
            type: Boolean, default: false
        },
        ...krpanoProps
    },
    data(){
        return {
            createLock: false,
            krpanoObjId: "krpano_" + Math.floor(Math.random() * (100000 - 100 + 1) + 100)
        };
    },
    methods: {
        createPano(){

            if (!this.createLock && !this.krpanoObj) {
                this.createLock = true;
                const vm = this;
                this.$el.id = this.krpanoObjId + "_container";

                embedpano({
                    id: this.krpanoObjId,
                    target: this.$el.id,
                    xml: this.xml,
                    bgcolor: this.bgcolor,
                    wmode: this.wmode,
                    vars: this.vars,
                    initvars: this.initvars,
                    basepath: this.basepath,
                    mwheel: this.mwheel,
                    focus: this.focus,
                    consolelog: this.consolelog,
                    mobilescale: this.mobilescale,
                    fakedevice: this.fakedevice,
                    passQueryParameters: this.passQueryParameters,
                    webglsettings: this.webglsettings,
                    onready(krpanoObj){
                        vm.krpanoObj = krpanoObj;
                        vm.krpanoObj.hooks = vm.hooks;
                        vm.log("pano created");
                        vm.$emit("panoCreated", vm.krpanoObj);
                        vm.createLock = false;
                    },
                    onerror(msg){
                        vm.$emit("panoError", msg);
                        vm.createLock = false;
                    }
                });
            }
        },
        removePano(){
            if (this.krpanoObj) {
                removepano(this.krpanoObj.id);
                this.log("pano removed");
                delete this.krpanoObj;
            }
        },
        loadScene(){
            let scene = this.scene;
            if (this.krpanoObj && scene) {
                let str = `if(scene[${scene}]===null,
                        loadscene(get(scene[0].name),null,MERGE,BLEND(0.5)),
                        loadscene(${scene},null,MERGE,BLEND(0.5)))`;
                this.krpanoObj.call(str);

                this.log("scene changed: " + scene);
                this.$emit("sceneChanged", scene);
            }
        },
        log(content){
            if (this.debug) {
                if (this.krpanoObj) {
                    content = "[" + this.krpanoObj.id + "] " + content;
                }
                console.debug(content);
            }
        }
    },
    watch: {
        xml(newXml){
            if (this.krpanoObj && newXml) {
                this.krpanoObj.call(`loadpano(${newXml},null,IGNOREKEEP)`);
                this.$emit("xmlChanged", newXml);
                this.log("xml changed: " + newXml);
            }
        },
        scene: function () {
            this.loadScene();
        }
    },
    created(){
        this.$on(["panoCreated", "xmlChanged"], this.loadScene);
    },
    beforeDestroy(){
        this.removePano();
    }
};

export default config;