import * as THREE from 'three'
import { IUniform } from 'three/src/Three'


type SceneUniform = {
  u_color: IUniform<THREE.Color>,
  u_time:IUniform<number>,
  u_res: IUniform<THREE.Vec2>,
  u_mouse: IUniform<THREE.Vec2>
}

export default class Scene{
  
  scene: THREE.Scene
  camera:THREE.OrthographicCamera
  renderer:THREE.Renderer
  uniforms:  SceneUniform;
  clock:THREE.Clock = new THREE.Clock()

  constructor(element: HTMLElement){
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    element.appendChild( this.renderer.domElement );

    const geometry = new THREE.PlaneGeometry( 2, 2 );

    const color_uniform:IUniform<THREE.Color> = {
      value: new THREE.Color(0xdd8822)
    }

    const time_uniform:IUniform<number> = {
      value: 0
    }

    const res_uniform:IUniform<THREE.Vec2> = {
      value: {
        x:0,
        y:0
      }
    }

    const mouse_uniform:IUniform<THREE.Vec2> = {
      value: {
        x:0,
        y:0
      }
    }

    this.uniforms = {
      u_color: color_uniform,
      u_time:time_uniform,
      u_res: res_uniform,
      u_mouse: mouse_uniform
    }

    const material = new THREE.ShaderMaterial( {
      vertexShader:vshader,
      fragmentShader: fshader,
      uniforms: this.uniforms
    } );

    const plane = new THREE.Mesh( geometry, material );
    this.scene.add( plane );

    this.camera.position.z = 1;

    this.onWindowResize();
    this.animate = this.animate.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)

    window.addEventListener( 'resize', this.onWindowResize, false );
    window.addEventListener( 'mousemove', this.onMouseMove, false );

    this.animate();
  }

  onMouseMove(event: MouseEvent){
    this.uniforms.u_mouse.value.x = event.clientX
    this.uniforms.u_mouse.value.y = event.clientY
  }

  animate(){
    requestAnimationFrame( this.animate );
    this.renderer.render( this.scene, this.camera );
    this.uniforms.u_time.value = this.clock.getElapsedTime()
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

    this.uniforms.u_res.value.x = window.innerWidth
    this.uniforms.u_res.value.y = window.innerHeight
  }
}


const vshader = `
uniform float u_time;
void main(){
  vec3 p = vec3(position.x + sin(u_time)*2.0, position.y, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p * 0.333, 1);
}
`

const fshader = `
uniform vec3 u_color;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
void main(){
  vec2 scaled = u_mouse / u_res;
  gl_FragColor = vec4(scaled.x, scaled.y, (sin(u_time * 3.0) + 1.0) / 2.0, 1.0);
}
`
