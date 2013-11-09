/*global _li, PIXI, jQuery*/

(function (module, PIXI) {
    'use strict';

    var moduleName = module.get('name'),
        canvas,
        stage,
        renderer,
        loop,
        init;

    init = function () {
        canvas();
        renderer();
        stage();
        loop();
    };

    canvas = function () {
        var canvas = document.querySelector('#canvas');
        module.publish('purrfect.cache.set', {key: 'gameCanvas', value: canvas});

    };

    renderer = function () {
        var canvas = module.publish('purrfect.cache.get', 'gameCanvas'),
            renderer = PIXI.autoDetectRenderer(800, 600, canvas.cached);

        module.publish('purrfect.cache.set', {key: 'gameRenderer', value: renderer});
    };

    stage = function () {
        var stage = new PIXI.Stage(0xFFFFFF);

        module.publish('purrfect.cache.set', {key: 'gameStage', value: stage});
    };

    loop = function () {
        module.publish('purrfect.view.game.loop');
    };


    module.subscribe(moduleName, 'main', init);

}(_li.define('purrfect.view.game.render'), PIXI));