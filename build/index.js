/**
 * Created by chenshu on 03/03/2017.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");

const resolve = _path => path.resolve(__dirname, "../", _path);

if (!fs.existsSync(resolve("dist"))) {
    fs.mkdirSync(resolve("dist"));
}

build([
    {
        dest: resolve('dist/vue-krpano.common.js'),
        format: 'cjs'
    },
    {
        dest: resolve('dist/vue-krpano.esm.js'),
        format: 'es'
    }
].map(genConfig));

function build(builds) {
    let built = 0;
    const total = builds.length;
    const next = () => {
        buildEntry(builds[built]).then(() => {
            built++;
            if (built < total) {
                next()
            }
        }).catch()
    };

    next()
}

function genConfig(opts) {
    return {
        entry: resolve('src/index.js'),
        dest: opts.dest,
        format: opts.format,
        moduleName: 'VueKrpano',
        plugins: [
            babel({})
        ]
    };
}

function buildEntry(config) {
    return rollup.rollup(config).then(bundle => {
        console.log(config.dest);
        return bundle.write(config);
    });
}