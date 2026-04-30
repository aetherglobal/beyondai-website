'use client'
import type { RefObject } from 'react'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

type UseClickableCardType<T extends HTMLElement> = {
  cardRef: RefObject<T | null>
  linkRef: RefObject<HTMLAnchorElement | null>
}

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter()
  const cardRef = useRef<T>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  useEffect(() => {
    const cardNode = cardRef.current
    if (!cardNode) return

    const abortController = new AbortController()
    const opts = { signal: abortController.signal }

    cardNode.addEventListener(
      'mousedown',
      (e: MouseEvent) => {
        if (e.target) {
          const target = e.target as Element
          const parent = target?.closest('a')
          pressedButton.current = e.button
          if (!parent) {
            hasActiveParent.current = false
            timeDown.current = +new Date()
          } else {
            hasActiveParent.current = true
          }
        }
      },
      opts,
    )

    cardNode.addEventListener(
      'mouseup',
      (e: MouseEvent) => {
        if (linkRef.current?.href) {
          const difference = +new Date() - timeDown.current
          if (difference <= 250 && !hasActiveParent.current && pressedButton.current === 0 && !e.ctrlKey) {
            if (external) {
              window.open(linkRef.current.href, newTab ? '_blank' : '_self')
            } else {
              router.push(linkRef.current.href, { scroll })
            }
          }
        }
      },
      opts,
    )

    return () => {
      abortController.abort()
    }
  }, [external, newTab, scroll, router])

  return { cardRef, linkRef }
}

export default useClickableCard
