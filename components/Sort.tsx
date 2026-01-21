"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort =
    searchParams.get("sort") || sortTypes[0].value;

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleSort}>
      <SelectTrigger className="sort-select">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.value}
            value={sort.value}
            className="shad-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
