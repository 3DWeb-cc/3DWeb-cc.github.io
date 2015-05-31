(function () {
    'use strict';

    var doIt, scenes,
        particleCount = 2000,

        scenes = $('.animation-container').map(function (index, htmlContainer) {
            var particles, pX, pY, pZ, particle, sprite1, sprite2, sprite3, sprite4, sprite5, parameters, theCloud,
                materials = [],
                container = $(htmlContainer),
                HEIGHT = container.outerHeight(),
                WIDTH = container.width(),
                renderer = new THREE.WebGLRenderer({
                    alpha: true
                }),
                camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000),
                scene = new THREE.Scene();

            scene.fog = new THREE.FogExp2(0x000000, 0.006);
            renderer.setSize(WIDTH, HEIGHT);
            $(renderer.domElement).css({
                position: 'absolute',
                left: 0,
                top: 0
            });

            particles = new THREE.Geometry();

            for (var p = 0; p < particleCount; p++) {

                // create a particle with random
                // position values, -250 -> 250
                pX = Math.random() * 500 - 250;
                pY = Math.random() * 500 - 250;
                pZ = Math.random() * 500 - 250;
                particle = new THREE.Vector3(pX, pY, pZ);

                particles.vertices.push(particle);

            }

            // snowflakes by http://en.wikipedia.org/wiki/File:Sketch_of_snow_crystal_by_Ren%C3%A9_Descartes.jpg
            sprite1 = THREE.ImageUtils.loadTexture("assets/textures/snowflake1.png");
            sprite2 = THREE.ImageUtils.loadTexture("assets/textures/snowflake2.png");
            sprite3 = THREE.ImageUtils.loadTexture("assets/textures/snowflake3.png");
            sprite4 = THREE.ImageUtils.loadTexture("assets/textures/snowflake4.png");
            sprite5 = THREE.ImageUtils.loadTexture("assets/textures/snowflake5.png");

            parameters = [
                [0x645862, 3, sprite1],
                [0x998C79, 2, sprite2],
                [0x4C3C4C, 3, sprite3],
                [0x83776F, 1, sprite4],
                [0x4C3C4C, 3, sprite5]
            ];

            for (var i = 0; i < parameters.length; i++) {

                materials[i] = new THREE.PointCloudMaterial({
                    size: parameters[i][1],
                    map: parameters[i][2],
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    transparent: true
                });

                theCloud = new THREE.PointCloud(particles, materials[i]);

                theCloud.rotation.y = Math.random() * 6;
                theCloud.rotation.x = Math.random() * 6;
                theCloud.rotation.z = Math.random() * 6;

                scene.add(theCloud);
                //clouds.push(theCloud);

            }

            container.prepend(renderer.domElement);
            return {
                container: container,
                camera: camera,
                renderer: renderer,
                scene: scene
            }
        });

    /**
     * Hopefully, in 600ms window resize could be reasonably considered done
     */
    $(window).resize(function (evt) {
        clearTimeout(doIt);
        doIt = setTimeout(function () {
            $(scenes).each(function (k, v) {
                var HEIGHT = v.container.outerHeight();
                var WIDTH = v.container.width();
                v.camera.aspect = WIDTH / HEIGHT;
                v.camera.updateProjectionMatrix();

                v.renderer.setSize(WIDTH, HEIGHT);
            })
        }, 600);
    });


    function animate() {

        var time = Date.now() * 0.00001;

        $(scenes).each(function (k, singleScene) {
            var object;
            singleScene.camera.position.z += 0.01;
            singleScene.camera.lookAt(singleScene.scene.position);

            for (var i = 0; i < singleScene.scene.children.length; i++) {

                object = singleScene.scene.children[i];

                if (object instanceof THREE.PointCloud) {

                    object.rotation.x = time * ( i < 4 ? i + 1 : -( i + 1 ) );

                }

            }
            singleScene.renderer.render(singleScene.scene, singleScene.camera);
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

})();