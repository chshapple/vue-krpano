/**
 * Created by chenshu on 03/03/2017.
 */
"use strict";

let config = {
    props: {
        freezeVertical: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            eventDelegate: undefined
        }
    },
    methods: {},
    watch: {
        freezeVertical(val){
            if (this.eventDelegate) {
                if (val) {
                    this.eventDelegate.style.display = "block";
                    let hlookat = this.krpanoObj.get("view.hlookat");
                    this.krpanoObj.call(`lookat(${hlookat},0)`);
                } else {
                    this.eventDelegate.style.display = "none";
                }
            }
        }
    },
    created(){

        if (TouchEvent) {

            this.$on("panoCreated", krpano => {

                let origin = krpano.firstChild;

                let eventDelegate = document.createElement("DIV");
                eventDelegate.className = "event-delegate";
                Object.assign(eventDelegate.style, {
                    display: this.freezeVertical ? "block" : "none",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    "user-select": "none",
                    "z-index": 1
                });
                krpano.appendChild(eventDelegate);
                this.eventDelegate = eventDelegate;

                let originTouch;

                eventDelegate.addEventListener("touchstart", function (e) {
                    originTouch = e;
                    Object.defineProperty(e, "cancelable", {value: true});
                    let event = new TouchEvent("touchstart", e);
                    return origin.dispatchEvent(event);
                });

                eventDelegate.addEventListener("touchend", function (e) {
                    Object.defineProperty(e, "cancelable", {value: true});
                    let event = new TouchEvent("touchend", e);
                    return origin.dispatchEvent(event);
                });

                eventDelegate.addEventListener("touchmove", function (e) {

                    let currentTouch = e.changedTouches[0];
                    let deltaX = originTouch.clientX - currentTouch.clientX;
                    let hlookat = krpano.get("view.hlookat") + deltaX;
                    let vlookat = krpano.get("view.vlookat");
                    krpano.call(`lookat(${hlookat},${vlookat})`);

                    originTouch = currentTouch;

                    return true;
                });

                eventDelegate.addEventListener("mousedown", function (e) {
                    Object.defineProperty(e, "cancelable", {value: true});
                    return origin.dispatchEvent(new MouseEvent("mousedown", e));
                });

                eventDelegate.addEventListener("mousewheel", function (e) {
                    Object.defineProperty(e, "cancelable", {value: true});
                    return origin.dispatchEvent(new MouseEvent("mousewheel", e));
                });
            });
        }

    }
};

export default config;