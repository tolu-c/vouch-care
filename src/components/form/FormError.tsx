import { cn } from "@/lib/utils";

interface FormErrorProps {
  show: boolean;
  error?: string;
  className?: string;
}

export default function FormError({ show, error, className }: FormErrorProps) {
  if (!show || !error) return null;

  return <p className={cn("mt-1 text-xs text-red-500", className)}>{error}</p>;
}
