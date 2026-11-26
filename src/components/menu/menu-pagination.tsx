"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/common/reveal";
import { MenuItemCard } from "@/components/menu/pizza-card";
import { buttonVariants } from "@/components/ui/button";
import type { MenuItem } from "@/types/menu";

type MenuPaginationProps = {
  items: MenuItem[];
  categoryAnchorByItemId: Record<string, string>;
};

export function MenuPagination({
  items,
  categoryAnchorByItemId,
}: MenuPaginationProps) {
  const [pageSize, setPageSize] = useState(4);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const tablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");

    function updatePageSize() {
      setPageSize(mobile.matches ? 4 : tablet.matches ? 6 : 9);
      setPage(1);
    }

    updatePageSize();
    mobile.addEventListener("change", updatePageSize);
    tablet.addEventListener("change", updatePageSize);

    return () => {
      mobile.removeEventListener("change", updatePageSize);
      tablet.removeEventListener("change", updatePageSize);
    };
  }, []);

  const pageCount = Math.ceil(items.length / pageSize);
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <div className="mt-8 grid gap-2 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <div
            key={item._id}
            id={categoryAnchorByItemId[item._id]}
            className="h-full scroll-mt-24"
          >
            <Reveal className="h-full w-85/100 xs:w-full">
              <MenuItemCard menuItem={item} />
            </Reveal>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing {startIndex + 1}–{Math.min(startIndex + pageSize, items.length)} of{" "}
          {items.length} menu items
        </p>
        {pageCount > 1 ? (
          <nav className="flex items-center gap-2" aria-label="Menu pagination">
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="min-w-20 text-center text-sm text-muted-foreground">
              Page {currentPage} of {pageCount}
            </span>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              disabled={currentPage === pageCount}
            >
              Next
            </button>
          </nav>
        ) : null}
      </div>
    </>
  );
}
