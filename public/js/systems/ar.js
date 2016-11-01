var AR = {
    controller: null,
    srcElement: null,
    markerRoot: null,
    markerWidth: 2,
    markerIndex: 0,

    run: function () {
        var cameraParameters = new ARCameraParam('data/camera_para-iphone_5_rear-640x480_1.0m.dat', () => {
            var Graphics = App.systems.Graphics;
            this.controller = new ARController(App.settings.width, App.settings.height, cameraParameters);
            var projectionMatrix = this.controller.getCameraMatrix();
            Graphics.camera.projectionMatrix.elements.set(projectionMatrix);

            // load kanji pattern
            this.controller.loadMarker('data/patt.kanji', (index) => {
                this.markerIndex = index;
                this.controller.trackPatternMarkerId(this.markerIndex, this.markerWidth);
                console.log("markerId", index);
            });
        })

        // create the marker Root
        this.markerRoot = new THREE.Object3D();
        this.markerRoot.name = 'MarkerRoot';
        this.markerRoot.userData.markerMatrix = new Float64Array(12);
        this.markerRoot.matrixAutoUpdate = false;
        this.markerRoot.visible = false;

        Graphics.scene.add(this.markerRoot);

        var materialWhite = new THREE.MeshPhongMaterial({ color: 0xfdfdfd, specular: 0x111111, shininess: 200 });
        
        Graphics.loadModel({ path: './models/ayogo_back.stl', material: materialWhite }, (model) => {
            this.markerRoot.add(model);
        }); 

        var materialPink = new THREE.MeshPhongMaterial({ color: 0xff0146, specular: 0x111111, shininess: 200 });
        Graphics.loadModel({ path: './models/ayogo_front.stl', material: materialPink }, (model) => {
            this.markerRoot.add(model);
        }); 

    },

    init: function () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        this.srcElement = document.createElement('video');
        document.body.appendChild(this.srcElement);

        if (navigator.getUserMedia == false) {
            console.log("navigator.getUserMedia not present in your browser");
        }

        MediaStreamTrack.getSources((sourceInfos) => {
            var constraints = {
                audio: false,
                video: {
                    mandatory: {
                        maxWidth: 640,
                        maxHeight: 480
                    }
                }
            }

            // it it finds the videoSource 'environment', modify constraints.video
            for (var i = 0; i < sourceInfos.length; i++) {
                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === "video" && sourceInfo.facing === "environment") {
                    constraints.video.optional = [{ sourceId: sourceInfo.id }]
                }
            }
            navigator.getUserMedia(constraints, (stream) => {
                console.log('success', stream);
                this.srcElement.src = window.URL.createObjectURL(stream);

                var interval = setInterval(() => {
                    if (!this.srcElement.videoWidth) {
                        return;
                    }
                    this.run();
                    clearInterval(interval);
                }, 1000/100);
                //  this.run();
            }, (error) => {
                console.log("Can't access user media", error);
                alert("Can't access user media");
            });
        })
    },

    update: function () {
        if (!this.controller) {
            return;
        }

        this.controller.detectMarker(this.srcElement);

        // update markerRoot with the found markers
        var markerNum = this.controller.getMarkerNum();

        if (markerNum > 0) {
            if (this.markerRoot.visible === false) {
                this.controller.getTransMatSquare(this.markerIndex, this.markerWidth, this.markerRoot.userData.markerMatrix);
            } else {
                this.controller.getTransMatSquareCont(this.markerIndex, this.markerWidth, this.markerRoot.userData.markerMatrix, this.markerRoot.userData.markerMatrix);
            }
            this.controller.transMatToGLMat(this.markerRoot.userData.markerMatrix, this.markerRoot.matrix.elements);
        }

        // objects visible IF there is a marker
        if (markerNum > 0) {
            this.markerRoot.visible = true;
        } else {
            this.markerRoot.visible = false;
        }
    }
}

App.systems.AR = AR;
