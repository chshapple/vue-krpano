/**
 * Created by chenshu on 03/03/2017.
 */
"use strict";

function touchstart(e) {

    let touch = e.changedTouches[0];
    this.touchOrigin = {
        x: touch.clientX,
        y: touch.clientY
    };
}

function touchmove(e) {

    e.stopPropagation();

    let touch = e.changedTouches[0];
    let current = {
        x: touch.clientX,
        y: touch.clientY
    };
    let deltaX = this.touchOrigin.x - current.x;
    let deltaY = this.touchOrigin.y - current.y;
    window.scrollBy(0, deltaY);

    let vlookat = this.get("view.vlookat");
    let hlookat = this.get("view.hlookat") + deltaX;
    this.call(`lookat(${hlookat},${vlookat})`);

    this.touchOrigin = current;

}

let config = {
    props: {
        freezeVertical: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        setVerticalFreeze(freeze){
            if (freeze) {
                this.krpanoObj.addEventListener("touchstart", touchstart, true);
                this.krpanoObj.addEventListener("touchmove", touchmove, true);
                this.log("vertical freeze");
            } else {
                this.krpanoObj.removeEventListener("touchstart", touchstart, true);
                this.krpanoObj.removeEventListener("touchmove", touchmove, true);
                this.log("vertical release");
            }
        }
    },
    watch: {
        freezeVertical(val){
            this.setVerticalFreeze(val)
        }
    },
    created(){
        this.$on("panoCreated", () => {
            this.setVerticalFreeze(this.freezeVertical);
        });
    }
};

export default config;