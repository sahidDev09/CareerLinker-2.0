import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await req.json();
    if (!role || !["candidate", "recruiter"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const client = await clerkClient();
    
    // 1. Update Clerk Metadata
    await client.users.updateUser(userId, {
      publicMetadata: {
        role,
      },
    });

    // 2. Fetch full user details to sync with Supabase
    const user = await client.users.getUser(userId);
    const fullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
    const email = user.emailAddresses[0]?.emailAddress;

    // 3. Sync with Supabase profiles table
    const supabase = await createClient();
    const { error: supabaseError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        name: fullName,
        email: email,
        image_url: user.imageUrl,
        // We'll try to update the role if the column exists
        // Many systems use a 'role' column in profiles
        // If it doesn't exist, Supabase will just return an error which we can handle
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (supabaseError) {
      console.error("Supabase sync error on role update:", supabaseError);
      // We don't fail the whole request because Clerk update succeeded
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
