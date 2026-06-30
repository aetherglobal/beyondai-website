import React from 'react'

type SectionHeaderProps = {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  subheading?: string | null
  /** Render on a primary/dark (colored) background — flips text colors. */
  onColored?: boolean
  className?: string
  /** Heading element + size. `hero` is reserved for the page hero. */
  as?: 'h1' | 'h2'
}

/**
 * Canonical eyebrow + heading (+ optional subheading) used across section blocks.
 * Replaces markup that was duplicated in every block so the type rhythm stays
 * consistent. Sharp corners / uppercase headings are brand rules.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  onColored = false,
  className,
  as = 'h2',
}) => {
  if (!eyebrow && !heading && !headingAccent && !subheading) return null

  const eyebrowColor = onColored ? 'text-primary-foreground/60' : 'text-primary-deep'
  const headingColor = onColored ? 'text-primary-foreground' : 'text-foreground'
  const subColor = onColored ? 'text-primary-foreground/70' : 'text-muted-foreground'
  const Heading = as

  return (
    <div className={className}>
      {eyebrow && (
        <p className={`text-sm tracking-widest uppercase mb-4 font-mono ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      {(heading || headingAccent) && (
        <Heading
          className={`text-section font-bold uppercase tracking-tight text-balance ${headingColor}`}
        >
          {heading}
          {headingAccent && (
            <>
              {heading && <br />}
              <span className={onColored ? 'text-primary' : 'text-primary-deep'}>
                {headingAccent}
              </span>
            </>
          )}
        </Heading>
      )}
      {subheading && (
        <p className={`mt-5 max-w-2xl text-base leading-relaxed ${subColor}`}>{subheading}</p>
      )}
    </div>
  )
}
