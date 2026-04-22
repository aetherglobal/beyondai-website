'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type FooterLink = NonNullable<
  NonNullable<NonNullable<Footer['linkColumns']>[number]['links']>[number]
>

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<FooterLink>()

  const label = data?.data?.link?.label
    ? `Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}

export const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['linkColumns']>[number]>()

  const label = data?.data?.heading
    ? `Column ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.heading}`
    : 'Column'

  return <div>{label}</div>
}
