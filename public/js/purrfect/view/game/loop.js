/*global _li, PIXI, requestAnimationFrame*/

(function (module, requestAnimationFrame) {
    'use strict';

    var moduleName = module.get('name'),
        stage = null,
        renderer = null,
        animate,
        init;

    init = function () {
        stage = module.publish('purrfect.cache.get', 'gameStage').cached;
        renderer = module.publish('purrfect.cache.get', 'gameRenderer').cached;

        requestAnimationFrame(animate);
    };

    animate = function () {
        requestAnimationFrame(animate);
        renderer.render(stage);
    };


    module.subscribe(moduleName, 'main', init);

}(_li.define('purrfect.view.game.loop'), requestAnimationFrame));