import { redirect } from "next/navigation";

/**
 * Root page redirects to the default webinar landing page.
 * This can be updated to fetch the latest active webinar from Supabase.
 */
export default function Home() {
  redirect("/webinar/digital-growth");
}
