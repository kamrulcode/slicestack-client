"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  LoaderCircle,
  Pencil,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SessionUser } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import { profileService } from "@/services/profile.service";
import { uploadService } from "@/services/uploads.service";

export function AccountProfileCard({
  user,
  plan,
}: {
  user: SessionUser;
  plan?: "free" | "premium";
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imagePreviewUrl) return () => URL.revokeObjectURL(imagePreviewUrl);
  }, [imagePreviewUrl]);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) return;

    setName(user.name);
    setImage(user.image);
    setImageFile(null);
    setImagePreviewUrl(null);
    if (imageInput.current) imageInput.current.value = "";
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      const imageUrl = imageFile ? await uploadService.image(imageFile) : image;
      const profile = { name: name.trim(), image: imageUrl };
      await profileService.updateProfile(profile);

      const { error } = await authClient.updateUser(profile);
      if (error) {
        throw new Error(
          error.message || "Your profile was saved but could not be refreshed.",
        );
      }

      setName(profile.name);
      setImage(imageUrl);
      setImageFile(null);
      setImagePreviewUrl(null);
      if (imageInput.current) imageInput.current.value = "";
      toast.success("Profile updated.");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  }

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="flex items-center gap-2">
              Account
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </CardTitle>
            <CardDescription>Your SliceStack account details.</CardDescription>
          </div>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Pencil aria-hidden />
                Edit
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {user.image ? (
                <AvatarImage src={user.image} alt={`${user.name}'s profile`} />
              ) : null}

              <AvatarFallback>{initials || "SS"}</AvatarFallback>
            </Avatar>

            <ProfileRow label="Full name" value={user.name} />
            {plan === "premium" && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                <Crown size={11} />
                PRO
              </span>
            )}
          </div>
          <ProfileRow label="Email address" value={user.email} />
          <ProfileRow label="Account id" value={user.id} mono />
          <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            Your role is read-only and managed by the server.
          </p>
        </CardContent>
      </Card>

      <SheetContent side="right" className="w-[90vw] gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5 pr-14">
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Update your name or photo. Your email and account role are managed
            by the server.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <form
            id="profile-details-form"
            className="flex flex-col gap-4"
            onSubmit={saveProfile}
          >
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                {imagePreviewUrl || image ? (
                  <AvatarImage
                    src={imagePreviewUrl || image || ""}
                    alt={`${name}'s profile`}
                  />
                ) : null}
                <AvatarFallback>{initials || "SS"}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label htmlFor="profile-image">Profile photo</Label>
                <Input
                  id="profile-image"
                  ref={imageInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] ?? null;
                    setImageFile(file);
                    setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                />
                {image || imageFile ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-fit"
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                      setImagePreviewUrl(null);
                      if (imageInput.current) imageInput.current.value = "";
                    }}
                  >
                    <Trash2 aria-hidden />
                    Remove photo
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                minLength={2}
                maxLength={100}
                autoComplete="name"
                required
              />
            </div>
          </form>

          <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            Your email and role are read-only and managed by the server.
          </p>
        </div>

        <SheetFooter className="border-t border-border p-5">
          <Button
            type="submit"
            form="profile-details-form"
            disabled={isSavingProfile}
          >
            {isSavingProfile ? (
              <LoaderCircle className="animate-spin" aria-hidden />
            ) : (
              <Save aria-hidden />
            )}
            {isSavingProfile ? "Saving..." : "Save profile"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ProfileRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`${mono ? "font-mono text-xs" : "font-semibold"} break-all`}
      >
        {value}
      </span>
    </div>
  );
}
