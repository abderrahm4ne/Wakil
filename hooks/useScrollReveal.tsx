'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(ref: RefObject<HTMLElement | null>, selector = '.reveal') {
    useGSAP(() => {
        const targets = ref.current?.querySelectorAll(selector)
        if (!targets?.length) return

        gsap.fromTo(
            targets,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        )
    }, { scope: ref, dependencies: [] })
}