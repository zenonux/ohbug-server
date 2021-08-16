import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import persist from '@rematch/persist'
import storage from 'redux-persist/lib/storage/session'
import { useSelector, useDispatch } from 'react-redux'

import { models, RootModel } from '@/models'

type FullModel = ExtraModelsFromLoading<RootModel> &
  ExtraModelsFromUpdated<RootModel>
export const store = init<RootModel, FullModel>({
  models,
  plugins: [
    loading(),
    updated(),
    persist({
      timeout: 1000,
      key: 'redux-storage',
      storage,
      // whitelist: ['project'],
    }),
  ],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>

export * from 'redux'
export * from 'react-redux'

export function useModel<T extends keyof RootModel>(modelName: T) {
  const state = useSelector<RootState, RootState[T]>(
    (_state) => _state[modelName]
  )
  const dispatch = useDispatch<Dispatch>()[modelName]

  return {
    state,
    dispatch,
  }
}
