import type { ButtonHTMLAttributes } from 'react'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  canSubmit: boolean
  isSubmitting: boolean
  idleLabel: string
  submittingLabel: string
}

export default function SubmitButton({
  canSubmit,
  isSubmitting,
  idleLabel,
  submittingLabel,
  className,
  ...buttonProps
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={!canSubmit || isSubmitting}
      className={className}
      {...buttonProps}
    >
      {isSubmitting ? submittingLabel : idleLabel}
    </button>
  )
}