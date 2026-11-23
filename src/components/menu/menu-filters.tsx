"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuCategories } from "@/data/menu";

export function MenuFilters() {
  const router = useRouter();
  const params = useSearchParams();
  // The parent remounts this component (via a key derived from the URL) when
  // the query changes, so these initial values always match the URL.
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");

  const hasFilters = Boolean(
    params.get("search") || params.get("category") || params.get("location"),
  );

  function apply(next: { category?: string; search?: string; location?: string }) {
    const query = new URLSearchParams();
    const nextCategory = next.category ?? category;
    const nextSearch = next.search ?? search;
    const nextLocation = next.location ?? location;

    if (nextSearch.trim()) query.set("search", nextSearch.trim());
    if (nextCategory && nextCategory !== "all") query.set("category", nextCategory);
    if (nextLocation.trim()) query.set("location", nextLocation.trim());

    const suffix = query.toString();
    router.push(suffix ? `/menu?${suffix}` : "/menu");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply({ search, location });
  }

  function handleReset() {
    setCategory("all");
    setSearch("");
    setLocation("");
    router.push("/menu");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border bg-card/70 p-4 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search pizzas or shops"
          className="pl-9"
          aria-label="Search menu items"
        />
      </div>

      <Input
        name="location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="City or area"
        className="sm:max-w-44"
        aria-label="Filter by location"
      />

      <Select
        value={category}
        onValueChange={(value) => {
          const next = value ?? "all";
          setCategory(next);
          apply({ category: next });
        }}
      >
        <SelectTrigger className="sm:w-56" aria-label="Filter by category">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {menuCategories.map((menuCategory) => (
            <SelectItem key={menuCategory.id} value={menuCategory.name}>
              {menuCategory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1 sm:flex-none">
          Search
        </Button>
        {hasFilters ? (
          <Button type="button" variant="ghost" onClick={handleReset}>
            <X className="size-4" aria-hidden />
            Clear
          </Button>
        ) : null}
      </div>
    </form>
  );
}
