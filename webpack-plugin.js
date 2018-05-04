const path = require('path');

class ResolveWebpackPlugin {
    constructor(options = {}) {
        options.root = path.dirname(module.parent.filename);
        options.source = path.resolve(options.root, "example/src");
        this.options = options;
    }

    apply(compiler) {
        /* compiler.plugin("run", com => {

          console.log('-------------------------------------------------- whaaat ---------------------------------')
        })
        compiler.plugin("watch-run", (comp, cb) => {
          return cb()
        })
        compiler.plugin("normal-module-factory", cmf => {
          cmf.plugin("after-resolve", (data, cb) => {
            console.log('-------------------------------------------------- whaaat ---------------------------------')
            console.log(data.request)
            cb(null, path.resolve(__dirname, "./src/test.js"));
          })
        }) */
        compiler.plugin("compilation", compilation => {
            compilation.plugin("optimize-module-ids", modules => {
                console.log(path.resolve(__dirname));
                modules.forEach(module => {
                    if (module.id !== null && typeof module.resource === "string") {
                        module.id = path.relative(this.options.source, module.resource);
                    }

                })
            })
        })

    }
}

module.exports = ResolveWebpackPlugin;
