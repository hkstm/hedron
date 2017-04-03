import allModules from 'sketches'
import World from './World'

export default (sketches, state) => {
  const sketchKeys = Object.keys(state.sketches.instances)

  // Add sketch
  if (sketches.length === sketchKeys.length - 1) {
    const key = sketchKeys[sketches.length]
    const newSketch = state.sketches.instances[key]
    const moduleId = newSketch.moduleId
    const module = new allModules[moduleId].Module()

    sketches.push({
      id: key,
      module
    })

    World.scene.add(module.root)
  }

  // Remove sketch
  if (sketches.length === sketchKeys.length + 1) {
    sketches.forEach((sketch, index) => {
      if (sketchKeys.indexOf(sketch.id) === -1) {
        sketches.splice(index, 1)
      }
    })
  }

  return sketches
}
