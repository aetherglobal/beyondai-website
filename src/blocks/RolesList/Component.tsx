import React from 'react'

import type { RolesListBlock as RolesListBlockType } from '@/payload-types'

type Props = RolesListBlockType & { disableInnerContainer?: boolean }

export const RolesListBlock: React.FC<Props> = ({ eyebrow, heading, roles }) => {
  if (!roles || roles.length === 0) return null

  return (
    <section className="bg-white">
      <div className="container py-16 md:py-20">
        {(eyebrow || heading) && (
          <div className="mb-12 max-w-2xl">
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1]">
                {heading}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, i) => (
            <article key={i} className="p-8 border border-border hover:border-primary-deep transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold tracking-tight">{role.title}</h3>
                {role.commitment && (
                  <span className="shrink-0 text-xs uppercase tracking-wider bg-primary/20 text-primary-deep px-3 py-1">
                    {role.commitment}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{role.description}</p>
              {Array.isArray(role.skills) && role.skills.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {role.skills.map((s, si) => (
                    <li
                      key={si}
                      className="text-xs font-mono uppercase tracking-wider border border-border px-2.5 py-1"
                    >
                      {s.skill}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
