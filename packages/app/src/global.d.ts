import React from 'react'
import jsxRuntime from 'react/jsx-runtime'

declare global {
  interface Window {
    React: React
    jsxRuntime: jsxRuntime
  }
}
