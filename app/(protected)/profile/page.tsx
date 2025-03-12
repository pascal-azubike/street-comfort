import { auth } from "@/auth"
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { PageHero } from "@/app/(pages)/pageHero";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch complete user data
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.user.id)
  });-
  console.log('im inside profile page')
  return (
    <>
      <PageHero 
        title="My Profile" 
        description="View and manage your personal information and preferences."
      />
      <div className="container max-w-4xl px-8 mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button asChild variant="outline">
            <Link href="/profile/edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg">{user?.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{user?.email || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-lg">{user?.phone || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Alternative Phone</label>
                <p className="text-lg">{user?.alternatePhone || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Contact</label>
                <p className="text-lg capitalize">{user?.preferredContact || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <p className="text-lg">{user?.businessName || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tax ID/VAT Number</label>
                <p className="text-lg">{user?.taxId || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 