import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthFieldProps = ComponentProps<typeof Input> & {
  endAdornment?: ReactNode;
  label: string;
  validate?: (value: string) => string | null;
};

export function AuthField({
  label,
  id,
  className,
  endAdornment,
  type,
  validate,
  onChange,
  ...props
}: AuthFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-2.5">
      <Label
        htmlFor={id}
        className="text-[15px] leading-none font-semibold text-foreground"
      >
        {label}
      </Label>
      <div>
        <div
          className={
            type === "file"
              ? "flex items-center gap-3"
              : undefined
          }
        >
          <div
            className={cn(
              type === "file" &&
                "relative inline-flex h-12 items-center rounded-lg border border-input bg-card px-4 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
              endAdornment && "relative",
            )}
          >
            {type === "file" && (
              <span className="shrink-0 text-base text-foreground">
                Choose image
              </span>
            )}
            <Input
              id={id}
              type={type}
              className={cn(
                type === "file"
                  ? "absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  : "h-12 rounded-lg border-input bg-card px-4 text-base shadow-none placeholder:text-muted-foreground/60 md:text-base",
                endAdornment && "pr-12",
                className,
              )}
              {...props}
              onChange={(event) => {
                if (type === "file") {
                  const file = event.currentTarget.files?.[0] ?? null;
                  setSelectedFile(file);
                  setPreviewUrl(
                    file?.type.startsWith("image/")
                      ? URL.createObjectURL(file)
                      : null,
                  );
                }
                if (validate) {
                  event.currentTarget.setCustomValidity(
                    validate(event.currentTarget.value) ?? "",
                  );
                }
                onChange?.(event);
              }}
            />
            {endAdornment && (
              <div className="absolute inset-y-0 right-1 flex items-center">
                {endAdornment}
              </div>
            )}
          </div>
          {type === "file" && selectedFile && (
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              {selectedFile.name}
            </span>
          )}
        </div>
        {type === "file" && previewUrl && selectedFile && (
          <Image
            src={previewUrl}
            alt={`Preview of ${selectedFile.name}`}
            width={96}
            height={96}
            unoptimized
            className="mt-3 size-24 rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
}
