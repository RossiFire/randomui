'use client'
import React, {PropsWithChildren, useEffect} from 'react'
import {ReactLenis} from 'lenis/react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { LenisOptions } from 'lenis'

interface LenisProviderProps {
  options?: LenisOptions
}


const LenisProvider = ({children, options}: PropsWithChildren<LenisProviderProps>) => {
  useEffect(() => {
    const lenis = (window as any).lenis

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }
  }, [])

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  )
}

export default LenisProvider