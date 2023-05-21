import { purgeStoredState } from 'redux-persist'
import { persistConfig } from '../../store/Store'

function ClearEntireStore () {
  purgeStoredState(persistConfig)
}

export default ClearEntireStore
