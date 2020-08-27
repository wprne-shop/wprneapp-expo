import React from 'react'

const GlobalStateContext = React.createContext()
const GlobalDispatchContext = React.createContext()

const actionTypes = {
  preview:'SetPreviewMode',
  builder:'SetBuilderMode',
}

function globalReducer(state, action) {
  switch (action.type) {
    case actionTypes.preview: {
      return {...state, mode: 'preview'}
    }
    case actionTypes.builder: {
      return {...state, mode: 'builder'}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function GlobalProvider({children}) {
  const [state, dispatch] = React.useReducer(globalReducer, {mode: 'builder'})
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}

function useGlobalState() {
  const context = React.useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider')
  }
  return context
}

function useGlobalDispatch() {
  const context = React.useContext(GlobalDispatchContext)
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalProvider')
  }
  return context
}

export {GlobalProvider, useGlobalState, useGlobalDispatch, actionTypes}