import React from 'react'
import { AppContextProvider } from '~/state'

export const wrapRootElement = ({ element }) => <AppContextProvider>{element}</AppContextProvider>
