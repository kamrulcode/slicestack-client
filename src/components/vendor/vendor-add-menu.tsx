"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorMessage } from "@/lib/api/client";
import { menuService } from "@/services/menu.service";
import { uploadService } from "@/services/uploads.service";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const menuItemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  location: z.string().min(2, "Location is required"),
});

type MenuItemFormInput = z.input<typeof menuItemSchema>;
type MenuItemFormValues = z.output<typeof menuItemSchema>;

export default function AddMenuItemForm() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MenuItemFormInput, unknown, MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      location: "",
    },
  });
  const selectedCategory = useWatch({
    control: form.control,
    name: "category",
  });

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB limit.`);
        continue;
      }

      validFiles.push(file);
    }

    setImageFiles((prev) => [...prev, ...validFiles]);

    setPreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: MenuItemFormValues) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one menu item image.");
      return;
    }

    try {
      setIsSubmitting(true);

      const imageUrls = await uploadService.images(imageFiles);

      const result = await menuService.create({
        itemName: values.name,
        category: values.category,
        description: values.description,
        price: values.price,
        location: values.location,
        images: imageUrls,
      });

      toast.success(result.message);

      form.reset();
      previews.forEach((preview) => URL.revokeObjectURL(preview));
      setImageFiles([]);
      setPreviews([]);
      router.push("/dashboard/vendor/menu-items");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add Menu Item</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a delicious pizza or food item to your restaurant menu. New items
          are reviewed by an admin before they appear publicly.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Item Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Item Name *</label>
          <Input
            placeholder="e.g. Classic Margherita Pizza"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category *</label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              if (!value) return;
              form.setValue("category", value, {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-destructive">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description *</label>
          <Textarea
            placeholder="Describe your delicious menu item..."
            rows={5}
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Price and Location */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (BDT) *</label>
            <Input
              type="number"
              min="1"
              placeholder="450"
              {...form.register("price")}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-destructive">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Location (Area / City) *
            </label>
            <Input
              placeholder="e.g. Dhanmondi, Dhaka"
              {...form.register("location")}
            />
            {form.formState.errors.location && (
              <p className="text-sm text-destructive">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Multiple Image Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Item Images *</label>

          <div className="rounded-xl border-2 border-dashed p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {previews.map((preview, index) => (
                <div
                  key={preview}
                  className="relative h-36 overflow-hidden rounded-lg"
                >
                  <Image
                    src={preview}
                    alt={`Menu item image ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed hover:bg-muted/50">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />

                <span className="text-sm font-medium">Add Images</span>

                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Upload multiple PNG, JPG or WEBP images. Maximum 5MB per image.
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading and submitting...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add Menu Item
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
