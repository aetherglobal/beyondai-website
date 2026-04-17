import { cn } from '@/utilities/ui'
import * as React from 'react'

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  return (
    <div className="relative">
      <textarea
        id={id}
        placeholder=" "
        className={cn(
          'peer block w-full border border-border bg-transparent px-3 pt-5 pb-2 text-base text-white rounded-none transition-colors focus:border-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm min-h-[120px]',
          className,
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-5 origin-[0] text-sm text-muted-foreground transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75"
      >
        {label}
      </label>
    </div>
  )
}

export { FloatingTextarea }
