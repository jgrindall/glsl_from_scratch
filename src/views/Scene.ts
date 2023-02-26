import * as THREE from 'three'

export default class Scene{
  
  scene: THREE.Scene
  camera:THREE.OrthographicCamera
  renderer:THREE.Renderer

  constructor(element: HTMLElement){
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    element.appendChild( this.renderer.domElement );

    const geometry = new THREE.PlaneGeometry( 2, 2 );
    const material = new THREE.ShaderMaterial( {} );

    const plane = new THREE.Mesh( geometry, material );
    this.scene.add( plane );

    this.camera.position.z = 1;

    this.onWindowResize();
    window.addEventListener( 'resize', this.onWindowResize, false );

    this.animate();
  }

  animate(){
    requestAnimationFrame( this.animate );
    this.renderer.render( this.scene, this.camera );
  }
  onWindowResize(){
    const aspectRatio = window.innerWidth/window.innerHeight;
    let width, height;
    if (aspectRatio>=1){
      //landscape
      width = 1;
      height = (window.innerHeight/window.innerWidth) * width;
    }
    else{
      width = aspectRatio;
      height = 1;
    }
    this.camera.left = -width;
    this.camera.right = width;
    this.camera.top = height;
    this.camera.bottom = -height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
}


const vshader = `

`
const fshader = `

`
