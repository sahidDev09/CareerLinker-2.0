"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * UserSync component handles the synchronization of user data from Clerk to Supabase.
 * It runs after a user logs in and ensures that the Supabase 'profiles' table 
 * has the latest name and profile image.
 */
export default function UserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || isSyncing) return;

    const syncUser = async () => {
      // Use session storage to avoid multiple syncs in the same browsing session
      // This minimizes database calls while still ensuring sync happens after login
      const syncKey = `cl_synced_${user.id}`;
      const sessionSynced = sessionStorage.getItem(syncKey);
      
      if (sessionSynced) return;

      setIsSyncing(true);
      const supabase = createClient();
      
      try {
        const fullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
        const email = user.primaryEmailAddress?.emailAddress;
        
        console.log("Syncing user data to Supabase...");
        
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            name: fullName,
            email: email,
            image_url: user.imageUrl,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error("Error syncing user to Supabase:", error);
        } else {
          sessionStorage.setItem(syncKey, "true");
        }
      } catch (err) {
        console.error("Unexpected error during profile sync:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, isSyncing]);

  return null;
}
