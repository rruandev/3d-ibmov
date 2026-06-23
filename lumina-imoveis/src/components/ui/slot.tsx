import * as React from 'react'

/**
 * Implementação mínima de Slot (estilo Radix) — mescla props no
 * elemento filho quando `asChild` é usado, evitando dependência extra.
 */
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null
    const child = children as React.ReactElement<Record<string, unknown>>
    const childProps = child.props

    return React.cloneElement(child, {
      ...props,
      ...childProps,
      className: [props.className, childProps.className as string]
        .filter(Boolean)
        .join(' '),
      style: {
        ...(props.style as object),
        ...(childProps.style as object),
      },
      ref,
    })
  },
)
Slot.displayName = 'Slot'
