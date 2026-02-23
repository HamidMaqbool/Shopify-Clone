import { cn } from '../lib/utils';
import { ProductStatus } from '../types';

interface BadgeProps {
  status: ProductStatus;
}

export default function Badge({ status }: BadgeProps) {
  const styles = {
    Active: "bg-[#c1f0d0] text-[#006e52]",
    Draft: "bg-[#e4e5e7] text-[#202223]",
    Archived: "bg-[#ffea8a] text-[#594400]",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      styles[status]
    )}>
      {status}
    </span>
  );
}
