/**
 * Created by chenshu on 02/03/2017.
 */

"use strict";

export default {
    bgcolor: {
        type: String
    },
    wmode: {
        type: String, default: "opaque"
    },
    vars: {
        type: Object
    },
    initvars: {
        type: Object
    },
    basepath: {
        type: String
    },
    mwheel: {
        type: Boolean, default: false
    },
    focus: {
        type: Boolean, default: true
    },
    consolelog: {
        type: Boolean, default: false
    },
    mobilescale: {
        type: Number, default: 0.5
    },
    fakedevice: {
        type: String
    },
    passQueryParameters: {
        type: Boolean, default: false
    },
    webglsettings: {
        type: Object
    }
}