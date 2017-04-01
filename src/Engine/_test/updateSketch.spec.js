import test from 'tape'
import updateSketch from '../updateSketch'

test('(Engine) updateSketch', function (t) {
  let actual, expected

  const state = {
    params: {
      '01': {
        title: 'Rotation X',
        key: 'rotX',
        value: 0.1
      },
      '02': {
        title: 'Rotation Y',
        key: 'rotY',
        value: 0.2
      },
      '03': {
        title: 'Rotation X',
        key: 'rotX',
        value: 0.3
      },
      '04': {
        title: 'Rotation Y',
        key: 'rotY',
        value: 0.4
      }
    },
    sketches: {
      'sketch_1': {
        id: 'sketch_1',
        module: 'test',
        title: 'Lorem Sketch',
        params: ['01', '02']
      },
      'sketch_2': {
        id: 'sketch_2',
        module: 'test',
        title: 'Ipsum Sketch',
        params: ['03', '04']
      }
    }
  }

  expected = {
    rotX: 0.1,
    rotY: 0.2
  }
  actual = updateSketch('sketch_1', state)

  t.deepEqual(actual, expected,
    'Returns key:value params for single sketch')

  expected = {
    rotX: 0.3,
    rotY: 0.4
  }
  actual = updateSketch('sketch_2', state)

  t.deepEqual(actual, expected,
    'Returns key:value params for single sketch')
  t.end()
})
