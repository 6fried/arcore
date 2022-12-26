
(async function() {
    const isArSupported = navigator.xr && navigator.xr.isSessionSupported && await navigator.xr.isSessionSupported("immersive-ar");
    if(isArSupported) {
        document.getElementById("enter-ar").addEventListener("click", window.app.activateXR)
    } else {
        onNoXRDevice();
    }
})();


/**
 * Query to see if the desired XR mode is supported.
 * If support is available, advertise XR functionality to the user.
 * A user-activation event indicates that the user wishes to use XR.
 * Request an immersive session from the device
 * Use the session to run a render loop that updates sensor data, and produces graphical frames to be displayed on the XR device.
 * Continue producing frames until the user indicates that they wish to exit XR mode.
 * End the XR session. 
 **/

/**
 * Web AR App container
 */
class App {
    /**
     * Run when the Start AR button is pressed
     */
    activateXR = async () => {
        try {
            this.xrSession = await navigator.xr.requestSession('immersive-ar');

            this.createXRCanvas();

            await this.onSessionStarted();
        } catch(e) {
            onNoXRDevice();
        }
    }

    /**
     * Adds a Canvas element and initialize a WebGL context that is compatible with WebXR
     */
    createXRCanvas() {
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.gl = this.canvas.getContext("webgl", {xrCompatible: true});

        this.xrSession.updateRenderState({
            baseLayer: new XRWebGLLayer(this.xrSession, this.gl)
        });
    }

    /**
     * Called when the XRSession has begun. Here we set up our three.js
     * renderer and kick off the render loop.
     */
    async onSessionStarted() {
        document.body.classList.add('ar');

        this.setupThreeJS();

        this.localReferenceSpace = await this.xrSession.requestReferenceSpace("local");

        this.xrSession.requestAnimationFrame(this.onXRFrame);
    }

    /**
     * Initialize three.js specific rendering code, including a WebGLRenderer,
     * a demo scene, and a camera for viewing the 3D content.
     */
    setupThreeJS() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
            canvas: this.canvas,
            context: this.gl
        });
        this.renderer.autoClear = false;

        // this.scene = Utils.createCubeScene();
        this.scene = Utility.createCubeScene();

        this.camera = new THREE.PerspectiveCamera();
        this.camera.matrixAutoUpdate = false;
    }

    /**
     * Called on the XRSession's requestAnimationFrame.
     * Called with the time and XRPresentationFrame.
     */
    onXRFrame = (time, frame) => {
        this.xrSession.requestAnimationFrame(this.onXRFrame);

        const framebuffer = this.xrSession.renderState.baseLayer.framebuffer;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        this.renderer.SetFramebuffer(framebuffer);

        const pose = frame.getViewerPose(this.localReferenceSpace);
        if(pose) {
            const view = pose.views[0];

            const viewport = this.xrSession.renderState.baseLayer.getViewport(view);
            this.renderer.setSize(viewport.width, viewport.height);

            this.camera.matrix.fromArray(view.transform.matrix);
            this.camera.projectionMatrix.fromArray(view.projectionMatrix);
            this.camera.updateMatrixWorld(true);

            this.renderer.render(this.scene, this.camera);
        }
    }
};

window.app = new App();