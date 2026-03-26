interface FormErrorProps {
  show: boolean;
  error?: unknown;
  className?: string;
}

export default function FormError({ show, error, className }: FormErrorProps) {
  if (!show || !error) return null;
  return <p className={className ?? "mt-1 text-xs text-red-500"}>{String(error)}</p>;
}
