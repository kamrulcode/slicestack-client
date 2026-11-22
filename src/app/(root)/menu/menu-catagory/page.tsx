import { redirect } from "next/navigation";
import { menuCategories } from "@/data/menu";

export default async function MenuCategoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category = params.category;

  if (
    typeof category !== "string" ||
    !menuCategories.some((menuCategory) => menuCategory.name === category)
  ) {
    redirect("/menu");
  }

  redirect(`/menu?category=${encodeURIComponent(category)}`);
}
