import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: boolean;
  size?: "small" | "medium";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status;
  
  return (
    <Badge 
      variant={isActive ? "default" : "secondary"}
      className={isActive ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300"}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}