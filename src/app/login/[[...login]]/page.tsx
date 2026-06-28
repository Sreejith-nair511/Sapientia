import { SignIn } from "@clerk/nextjs";
import { Cpu, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT SIDE - Premium Branding */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden border-r border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-950 to-zinc-950"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="size-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Engineering OS</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Master Engineering.<br/>
            <span className="text-indigo-400">One day at a time.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The ultimate operating system for your engineering journey. Track your progress, take rich notes, and conquer every technical interview.
          </p>
          <div className="space-y-4 pt-4">
            {[
              "Complete curriculum for DSA, C++, and System Design",
              "Spaced repetition flashcards and interview prep",
              "Real-time progress tracking and analytics"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 className="size-5 text-indigo-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-500">
          <span>© 2026 Engineering OS</span>
          <span>•</span>
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
        </div>
      </div>

      {/* RIGHT SIDE - Clerk SignIn */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-50 dark:bg-background">
        <SignIn appearance={{
          elements: {
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
            card: "shadow-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
            headerTitle: "text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100",
            headerSubtitle: "text-zinc-500 dark:text-zinc-400",
            socialButtonsBlockButton: "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900",
            socialButtonsBlockButtonText: "text-zinc-700 dark:text-zinc-300 font-medium",
            dividerLine: "bg-zinc-200 dark:bg-zinc-800",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-700 dark:text-zinc-300",
            formFieldInput: "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
            footerActionLink: "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          }
        }} />
      </div>
    </div>
  );
}
