window.gltfLoader = new THREE.GLTFLoader();

class Reticle extends THREE.Object3D {
    constructor() {
        super();

        this.loader = new THREE.GLTFLoader();
        this.loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", (gltf) => {
            this.add(gltf.scene);
        })

        this.visible = false;
    }
}

window.gltfLoader.load("https://immersive-web.github.io/webxr-samples/media/gltf/sunflower/sunflower.gltf", function(gltf) {
    const flower = gltf.scene.children.find(c => c.name === 'sunflower')
    flower.castShadow = true;
    window.sunflower = gltf.scene;
});

window.Utility = {

    createLitScene() {
        const scene = new THREE.Scene();

        const light = new THREE.AmbientLight(0xffffff, 1);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(10, 15, 10);

        directionalLight.castShadow = true;

        const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        planeGeometry.rotateX(-Math.PI / 2);

        const shadowMesh = new THREE.Mesh(planeGeometry, new THREE.ShadowMaterial({
            color: 0x111111,
            opacity: 0.2,
        }));

        shadowMesh.name = 'shadowMesh';
        shadowMesh.receiveShadow = true;
        shadowMesh.position.y = 10000;

        scene.add(shadowMesh);
        scene.add(light);
        scene.add(directionalLight);

        return scene;
    },

    createCubeScene() {
        const scene = new THREE.Scene();

        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0xff00ff }),
            new THREE.MeshBasicMaterial({ color: 0x00ffff }),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        ];

        const box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), materials);
        box.position.set(1, 1, 1);
        scene.add(box);

        return scene;
    },
};

function onNoXRDevice() {
    document.body.classList.add('unsupported');
}