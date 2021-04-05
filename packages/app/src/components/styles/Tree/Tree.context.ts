import React from 'react'

interface TreeContextType {
  currentNode?: number | string
  handleSelectedNodeChange: (key: number | string) => void
  selectedNodeClassName?: string
  nodeClassName?: string
  selectedLineClassName?: string
  lineClassName?: string
  nodeWidth?: string
  nodeSpace?: string
}
export const TreeContext = React.createContext<TreeContextType>({
  handleSelectedNodeChange: () => void 0,
})
