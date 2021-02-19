var audio=document.createElement('audio');
var first=true;
     window.addEventListener('mousedown',onmousedown);

   function onmousedown(){
      if(!first) return;
      first=false;
      audio.src="artificialhell.mp3";
      audio.play();
   }


// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');
// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
const fpsControl = new FPS();
// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};

function onResults(results) {
    // Hide the spinner.
    document.body.classList.add('loaded');
    // Update the frame rate.
    fpsControl.tick();
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#fafafa', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#910606', lineWidth: 1.5 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#fafafa', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#910606', lineWidth: 1.5 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#fafafa', lineWidth: 1.5 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#fafafa', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#910606', lineWidth: 1.5 });
        }
    }
    canvasCtx.restore();
}
const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.1/${file}`;
    }
});
faceMesh.onResults(onResults);
// Instantiate a camera. We'll feed each frame we receive into the solution.
const camera = new Camera(videoElement, {
    onFrame: async() => {
        await faceMesh.send({ image: videoElement });
    },
    width: 1920,
    height: 1080
});
camera.start();
// Present a control panel through which the user can manipulate the solution
// options.
new ControlPanel(controlsElement, {
    selfieMode: true,
    maxNumFaces: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
}).add([
      fpsControl
    ]).on(options => {
    faceMesh.setOptions(options);
});