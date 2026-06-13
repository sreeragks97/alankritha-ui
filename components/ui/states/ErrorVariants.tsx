import { ErrorState } from "@/components/ui/states/ErrorState";

interface ErrorVariantProps {
  onRetry?: () => void;
}

export function ProductUnavailable({ onRetry }: ErrorVariantProps) {
  return (
    <ErrorState
      title="Product unavailable"
      description="We could not load this product right now. Please try again in a moment."
      onAction={onRetry}
      actionLabel="Reload Product"
    />
  );
}

export function GenericErrorState({ onRetry }: ErrorVariantProps) {
  return (
    <ErrorState
      title="Something went wrong"
      description="An unexpected issue occurred while loading this section."
      onAction={onRetry}
    />
  );
}

export function PageErrorState({ onRetry }: ErrorVariantProps) {
  return (
    <ErrorState
      title="Unable to load page"
      description="The page could not be prepared right now. Please retry."
      onAction={onRetry}
      actionLabel="Retry"
    />
  );
}
