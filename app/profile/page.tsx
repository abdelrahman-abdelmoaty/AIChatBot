import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile/settings-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your profile settings and preferences.</p>
        </div>
        <ProfileForm session={session} />
      </div>
    </div>
  );
}
