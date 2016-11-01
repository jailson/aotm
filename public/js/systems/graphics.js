var Graphics = {
    renderer: {},
    scene: {},
    camera: {},

    init: function (args, onSuccess) {
        this.scene = new THREE.Scene();

        // Lights
        var ambientLight = new THREE.AmbientLight(0x666666);
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0x887766);
        directionalLight.position.set(-1, 1, 5).normalize();
        this.scene.add(directionalLight);

        // Camera without AR
        // this.camera = new THREE.PerspectiveCamera(75, App.settings.width / App.settings.height, 0.1, 1000);
        // this.camera.matrixAutoUpdate = true; 
        // this.camera.position.z = 5;

        // Camera with With AR
        this.camera = new THREE.Camera();
        this.camera.matrixAutoUpdate = false; 

        // Render
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(App.settings.width, App.settings.height);
        this.renderer.setClearColor(new THREE.Color('lightgrey'), 0);

        document.body.appendChild(this.renderer.domElement);

        onSuccess && onSuccess([ambientLight, directionalLight, this.camera]);
    },

    loadModel: function (params, onSuccess) {
        var loader = new THREE.STLLoader();

        loader.load(params.path, (geometry) => {
            var mesh = new THREE.Mesh(geometry, params.material);
            mesh.position.set(0, 0, 0);
            mesh.scale.set(40, 40, 40);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            onSuccess(mesh);
        });
    },

    update: function (args) {
        this.renderer.render(this.scene, this.camera);
    }
}

App.systems.Graphics = Graphics;
