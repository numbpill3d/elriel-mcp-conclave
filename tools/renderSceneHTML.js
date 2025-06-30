// /tools/renderSceneHTML.js
export default {
  renderSceneHTML: {
    description: "Generate a Three.js HTML file loading specific assets",
    run: async ({ models = [], background = '#000000' }) => {
      const assetImports = models.map((m, i) => `
        loader.load('/assets/${m}', function(gltf${i}) {
          scene.add(gltf${i}.scene)
        })`).join('\n')

      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Claude Rendered Scene</title>
  <style>body { margin: 0; }</style>
  <script type="module">
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('${background}')

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(10, 10, 10)
    scene.add(light)

    const loader = new GLTFLoader()
    ${assetImports}

    camera.position.z = 5

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    animate()
  </script>
</head>
<body></body>
</html>`

      return { html }
    }
  }
}
