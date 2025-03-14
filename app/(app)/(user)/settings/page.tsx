import { redirect } from "next/navigation";

import { auth } from "@/app/(app)/(auth)/auth";
import { SettingsForm } from "@/app/(app)/(user)/settings/settings-form";
import { getUserById } from "@/server/user";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { user, error } = await getUserById(session.user.id!);

  if (error || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your profile settings and preferences.</p>
        </div>
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
