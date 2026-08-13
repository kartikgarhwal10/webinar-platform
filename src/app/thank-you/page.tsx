import Link from "next/link";
import { CheckCircle, Home, Calendar } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-border p-8 rounded-3xl shadow-xl">
          
          <div className="w-16 h-16 rounded-full bg-green-150 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-black text-foreground tracking-tight mb-3">
            Registration Confirmed!
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
            Thank you for registering. We have reserved your seat. Check your inbox for the calendar confirmation details.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 border border-border hover:bg-border/10 rounded-xl text-sm font-bold text-foreground transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
