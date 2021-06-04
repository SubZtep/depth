import * as THREE from 'three';
import CameraControls from 'camera-controls';

export function useCameraControl() {
  CameraControls.install( { THREE: THREE } );

  const clock = new THREE.Clock();
  const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 1000 );
  const cameraControls = new CameraControls( camera, renderer.domElement );
}
