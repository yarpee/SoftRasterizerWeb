requirejs.config({
    baseUrl: '',
    bundles: {
        'engine': ['Main']
    }
});

requirejs(['Main'], function (Module) {
    var main = new Module.Main();
});