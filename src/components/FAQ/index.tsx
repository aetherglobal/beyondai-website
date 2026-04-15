'use client'

import React, { useState } from 'react'

type FAQItem = {
  question: string
  answer: string
}

export const FAQ: React.FC<{
  items: FAQItem[]
  className?: string
}> = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items.length) return null

  return (
    <div className={`divide-y divide-border ${className || ''}`}>
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="w-full py-4 text-left flex justify-between items-center gap-4"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-medium">{item.question}</span>
            <span className="text-muted-foreground shrink-0">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="pb-4 text-muted-foreground">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  )
}
