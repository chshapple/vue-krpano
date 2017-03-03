/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

import core from "./core";
import lazyLoad from "./features/lazyLoad";

let config = {

    mixins: [core, lazyLoad],

    template: "<div class='vue-krpano'></div>",

    mounted(){
        this.createPano();
    }
};

export default config;