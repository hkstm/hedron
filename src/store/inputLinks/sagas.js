import { select, put, call, takeEvery } from 'redux-saga/effects'
import { getDefaultModifierIds } from './selectors'
import getInputLink from '../../selectors/getInputLink'
import getNode from '../../selectors/getNode'
import { rInputLinkCreate, rInputLinkDelete } from './actions'
import { rNodeCreate, uNodeCreate, uNodeDelete, uNodeInputLinkAdd, nodeInputLinkRemove } from '../nodes/actions'
import { inputAssignedLinkCreate, inputAssignedLinkDelete } from '../inputs/actions'
import lfoGenerateOptions from '../../utils/lfoGenerateOptions'
import midiGenerateOptions from '../../utils/midiGenerateOptions'
import { midiStartLearning } from '../midi/actions'
import getCurrentBankIndex from '../../selectors/getCurrentBankIndex'
import { getAll } from '../../externals/modifiers'
import uid from 'uid'

/*
  Creates the link between input and node.
  e.g. A paramater can have inputs assigned to it. This is done by creating
  an input link. The link takes in the input value, sends it through modifiers and then
  applies that value to the param.
*/
export function* inputLinkCreate (action) {
  const p = action.payload
  const modifierIds = []
  const lfoOptionIds = []
  const midiOptionIds = []
  let bankIndex, inputLinkIdToToggle, node, nodeType

  if (p.inputId === 'midi') {
    yield put(midiStartLearning(p.nodeId, p.inputType))
  } else {
    const linkId = yield call(uid)

    if (p.inputType === 'inputLinkToggle') {
      inputLinkIdToToggle = p.nodeId
    } else {
      node = yield select(getNode, p.nodeId)
      nodeType = node.type
      if (p.inputType !== 'midi') {
        const modifiers = yield call(getAll)
        const defaultModifierIds = yield select(getDefaultModifierIds)

        for (let i = 0; i < defaultModifierIds.length; i++) {
          const id = defaultModifierIds[i]
          const config = modifiers[id].config

          for (let j = 0; j < config.title.length; j++) {
            if (!config.type || config.type === p.inputType) {
              const modifierId = yield call(uid)
              const modifier = {
                id: modifierId,
                key: id,
                title: config.title[j],
                value: config.defaultValue[j],
                passToNext: j < config.title.length - 1,
                inputLinkIds: [],
                type: config.type
              }

              modifierIds.push(modifierId)
              yield put(rNodeCreate(modifierId, modifier))
            }
          }
        }
      }
    }

    if (p.inputId === 'lfo') {
      const lfoOpts = yield call(lfoGenerateOptions)

      for (let key in lfoOpts) {
        const item = lfoOpts[key]
        lfoOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }
    }

    if (p.inputType === 'midi' || p.inputType === 'inputLinkToggle') {
      bankIndex = yield select(getCurrentBankIndex, p.deviceId)
      const midiOpts = yield call(midiGenerateOptions)

      for (let key in midiOpts) {
        const item = midiOpts[key]
        midiOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }
    }

    const link = {
      title: p.inputId,
      input: {
        id: p.inputId,
        type: p.inputType
      },
      id: linkId,
      nodeId: p.nodeId,
      nodeType,
      deviceId: p.deviceId,
      bankIndex,
      modifierIds,
      lfoOptionIds,
      midiOptionIds,
      inputLinkIdToToggle
    }

    yield put(rInputLinkCreate(linkId, link))
    if (node) {
      yield put(uNodeInputLinkAdd(p.nodeId, linkId))
    }
    yield put(inputAssignedLinkCreate(p.inputId, linkId, p.deviceId))
  }
}

export function* inputLinkDelete (action) {
  const p = action.payload

  const link = yield select(getInputLink, p.id)

  const { input, modifierIds, nodeId } = link

  yield put(inputAssignedLinkDelete(input.id, p.id))

  if (modifierIds) {
    for (let i = 0; i < modifierIds.length; i++) {
      yield put(uNodeDelete(modifierIds[i]))
    }
  }

  yield put(nodeInputLinkRemove(nodeId, p.id))
  yield put(rInputLinkDelete(p.id))
}

export function* watchInputLinks () {
  yield takeEvery('U_INPUT_LINK_CREATE', inputLinkCreate)
  yield takeEvery('U_INPUT_LINK_DELETE', inputLinkDelete)
}
