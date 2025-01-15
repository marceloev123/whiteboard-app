import React from 'react'
import { useWindowSize } from 'usehooks-ts'

export const WhiteBoard = () => {
  const { width, height } = useWindowSize({
    initializeWithValue: false,
  })

  console.log(width, height)

  return <canvas key={width} width={width} height={height} />
}
