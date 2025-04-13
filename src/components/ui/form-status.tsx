interface FormStatusProps {
  error?: string | null;
  success?: string | null;
}

export function FormStatus({ error, success }: FormStatusProps) {
  if (!error && !success) return null;

  if (error) {
    return <div className="text-sm font-medium text-destructive">{error}</div>;
  }

  return <div className="text-sm font-medium text-green-600">{success}</div>;
}
