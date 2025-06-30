export default {
  generateSceneTemplate: {
    description: "Returns a Three.js base scene with Elriel visual styling, low poly, pixelated.",
    run: async () => {
      return {
        html: `<!DOCTYPE html>
<html>
<head>
  <title>Elriel Template</title>
  <style>body { margin: 0; background: #000 }</style>
  <script type="module">
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'
    import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js'
    import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js'
    import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const loader = new GLTFLoader()
    loader.load('/assets/temple.glb', gltf => scene.add(gltf.scene))

    const light = new THREE.HemisphereLight(0xcccccc, 0x222222, 1)
    scene.add(light)

    // Pixelated post-process shader pass
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const pixelShader = {
      uniforms: { tDiffuse: { value: null }, resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, pixelSize: { value: 2.0 } },
      vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }\`,
      fragmentShader: \`uniform sampler2D tDiffuse; uniform vec2 resolution; uniform float pixelSize; varying vec2 vUv; void main() { vec2 dxy = pixelSize / resolution; vec2 coord = dxy * floor(vUv / dxy); gl_FragColor = texture2D(tDiffuse, coord); }\`
    }
    composer.addPass(new ShaderPass(pixelShader))

    function animate() {
      requestAnimationFrame(animate)
      composer.render()
    }
    animate()
  </script>
</head>
<body></body>
</html>`
      }
    }
  }
}
