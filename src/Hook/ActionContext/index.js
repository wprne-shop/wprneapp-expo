import React from 'react'

const ActionContext = React.createContext()

function ActionProvider({value, children}) {
  return (
    <ActionContext.Provider value={value}>      
      {children}     
    </ActionContext.Provider>
  )
}

function useAction() {
  const context = React.useContext(ActionContext)
  
  if (context === undefined) {
    return false
  }
  return context
}

export  { ActionProvider, useAction }  