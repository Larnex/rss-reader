"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ArticleSearchProps {
  value: string;
  onChangeAction: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ArticleSearch({
  value,
  onChangeAction,
  placeholder = "Search article titles...",
  className = "",
}: ArticleSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        className="pl-9 w-full"
      />
    </div>
  );
}
