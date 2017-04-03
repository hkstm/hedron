const THREE = require('three')
const Sketch = require('../../src/Engine/Sketch.js')

class Cubey extends Sketch {

  constructor () {
    super()

    let material, geometry
    material = new THREE.MeshBasicMaterial({ wireframe: true })
    geometry = new THREE.BoxGeometry(100, 100, 100)
    this.cube = new THREE.Mesh(geometry, material)

    this.root.add(this.cube)
  }

  update (params) {
    this.cube.rotation.x += params.rotX
    this.cube.rotation.y += params.rotY
  }
}

module.exports = Cubey
