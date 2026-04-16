import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const ProgramCard: React.FC<{
  title: string
  description: string
  href?: string
  className?: string
}> = ({ title, description, href, className }) => {
  const content = (
    <div
      className={`group relative p-8 bg-dark/40 border-l-2 border-transparent hover:border-primary hover:bg-dark/70 transition-all duration-300 ${className || ''}`}
    >
      <h3 className="text-xl text-white font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-secondary-foreground/70 text-sm leading-relaxed">{description}</p>
      {href && (
        <div className="mt-5 flex items-center gap-1.5 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
