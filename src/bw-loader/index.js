export class Loader {
    findView() {
        throw Error('findView needs to be defined');
    }

    load(moduleId) {
        throw Error('load needs to be defined');
    }
}