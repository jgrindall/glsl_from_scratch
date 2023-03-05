import * as THREE from 'three'
import { IUniform } from 'three/src/Three'

const WIDTH = 1536
const HEIGHT = 600

type SceneUniform = {
  u_color: IUniform<THREE.Color>,
  u_time:IUniform<number>,
  u_res: IUniform<THREE.Vec2>,
  u_mouse: IUniform<THREE.Vec2>
}

export default class Scene2{
  
  scene: THREE.Scene
  camera:THREE.OrthographicCamera
  renderer:THREE.Renderer
  uniforms:  SceneUniform;
  clock:THREE.Clock = new THREE.Clock()

  constructor(element: HTMLElement){
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(WIDTH, HEIGHT );
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
    const frustumSize = 2;
    const ar = 1;
    this.camera.left = -frustumSize * ar /2;
    this.camera.right = frustumSize * ar /2;
    this.camera.top = frustumSize/2;
    this.camera.bottom = -frustumSize/2;
    this.camera.updateProjectionMatrix();
    this.uniforms.u_res.value.x = WIDTH
    this.uniforms.u_res.value.y = HEIGHT
  }
}


const vshader = `
uniform float u_time;
varying vec2 v_uv;
varying vec3 v_position;
void main(){
  v_uv = uv;
  v_position = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}
`

const fshader = `
uniform vec3 u_color;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
varying vec2 v_uv;
varying vec3 v_position;

void main(){
  vec2 pt = vec2(u_mouse.x / u_res.x, u_mouse.y / u_res.y);
  float amt = 0.01;
  vec2 p = vec2((v_position.x + 1.0)/2.0, (-v_position.y + 1.0)/2.0);
  float dx = pt.x - p.x;
  float dy = pt.y - p.y;
  float dist = sqrt(dx*dx + dy*dy);
  float step = smoothstep(0.1, 0.2, dist);
  vec4 r = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 b = vec4(0.0, 0.0, 1.0, 1.0);
  vec4 clr = mix(r, b, step);
  gl_FragColor = clr;
}
`
