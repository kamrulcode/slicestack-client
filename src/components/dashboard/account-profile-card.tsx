"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SessionUser } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import { profileService } from "@/services/profile.service";
import { uploadService } from "@/services/uploads.service";

export function AccountProfileCard({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imagePreviewUrl) return () => URL.revokeObjectURL(imagePreviewUrl);
  }, [imagePreviewUrl]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      const imageUrl = imageFile ? await uploadService.image(imageFile) : image;
      await profileService.updateProfile({ name, image: imageUrl });
      setImage(imageUrl);
      setImageFile(null);
      setImagePreviewUrl(null);
      if (imageInput.current) imageInput.current.value = "";
      toast.success("Profile updated.");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function requestEmailChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRequestingEmailChange(true);

    try {
      const { error } = await authClient.changeEmail({
        newEmail: email.trim(),
        callbackURL: window.location.pathname,
      });
      if (error) throw new Error(error.message || "Email change could not be requested.");
      toast.success("Check your email to confirm the address change.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsRequestingEmailChange(false);
    }
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Personal profile
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
        </CardTitle>
        <CardDescription>
          Update your name and profile photo. Email changes require verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <form className="flex flex-col gap-4" onSubmit={saveProfile}>
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
          <Button type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? (
              <LoaderCircle className="animate-spin" aria-hidden />
            ) : (
              <Save aria-hidden />
            )}
            {isSavingProfile ? "Saving..." : "Save profile"}
          </Button>
        </form>

        <form
          className="flex flex-col gap-3 border-t border-border/60 pt-4"
          onSubmit={requestEmailChange}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-email">Email address</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              autoComplete="email"
              required
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={
              isRequestingEmailChange ||
              email.trim().toLowerCase() === user.email.toLowerCase()
            }
          >
            {isRequestingEmailChange ? (
              <LoaderCircle className="animate-spin" aria-hidden />
            ) : null}
            {isRequestingEmailChange ? "Sending verification..." : "Change email"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Your email is updated only after you confirm the verification link.
          </p>
        </form>

        <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
          <ProfileRow label="Account id" value={user.id} mono />
          <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            Your role is read-only and managed by the server. Profile updates
            cannot change account permissions.
          </p>
        </div>
      </CardContent>
    </Card>
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
    <div className="flex flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}
