import React from 'react'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const AuthorBio: React.FC<{
  authors: { id?: string | null; name?: string | null }[]
}> = ({ authors }) => {
  const validAuthors = authors.filter((a) => a.name)

  if (validAuthors.length === 0) return null

  return (
    <div className="max-w-[48rem] mx-auto">
      <div className="border border-gray-200 p-6">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
          {validAuthors.length === 1 ? 'Written by' : 'Written by'}
        </p>
        <div className="flex flex-col gap-4">
          {validAuthors.map((author) => (
            <div key={author.id} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                {getInitials(author.name!)}
              </div>
              <div>
                <p className="font-bold text-lg text-black">{author.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
