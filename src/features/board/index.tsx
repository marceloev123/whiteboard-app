import React from 'react'
import { WhiteBoard } from './white-board'
import { Toolbar } from './toolbar'
import { Settings } from './settings'

export const BoardPage = () => {
  return (
    <section className="h-screen w-full">
      <WhiteBoard />
      <Toolbar />
      <Settings />
    </section>
  )
}
