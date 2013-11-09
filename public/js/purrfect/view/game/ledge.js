/*global _li, PIXI*/

(function (module, PIXI) {
    'use strict';

    var moduleName = module.get('name'),
        load,
        ledges,
        place,
        renderedLedges = [],
        textures = [new PIXI.Texture.fromImage('/img/terrain.png'),
            new PIXI.Texture.fromImage('/img/terrain2.png'),
            new PIXI.Texture.fromImage('/img/terrain3.png'),
            new PIXI.Texture.fromImage('/img/terrain4.png'),
            new PIXI.Texture.fromImage('/img/terrain5.png'),
            new PIXI.Texture.fromImage('/img/terrain.png')],
        init;

    init = function () {
        ledges = module.publish('purrfect.cache.get', 'gameLevel').cached;
        load();
    };

    load = function () {
        var i = 0,
            j = 0,
            position,
            lastPosition = 520,
            apart = 200,
            ledge,
            ground;

        for (i; i < ledges.length; i += 1) {
            if (i > 100) {
                apart = 250;
            }
            if (i > 200) {
                apart = 300;
            }
            if (i > 300) {
                apart = 350;
            }
            position = lastPosition - apart;
            lastPosition = position;
            j = 0;
            ledge = ledges[i];
            for (j; j < ledge.length; j += 1) {
                ground = ledge[j];
                place(i, position, j, ground);
            }
        }
        module.publish('purrfect.cache.set', {key: 'gameLedges', value: renderedLedges});
    };

    place = function (i, position, column, render) {
        if (render) {
            var ledge = new PIXI.Sprite(textures[Math.floor(i/100)]),
                container = module.publish('purrfect.cache.get', 'gameContainer').cached;

            ledge.position.x = 80 * column;
            ledge.position.y = position;
            ledge.originalPosition = {
                x: 80 * column,
                y: position
            };

            ledge.anchor.x = 0.5;
            ledge.anchor.y = 0.5;
            renderedLedges.push(ledge);
            container.addChildAt(ledge, 0);

        }
    };

    module.subscribe(moduleName, 'main', init);

}(_li.define('purrfect.view.game.ledge'), PIXI));