"use client";

import { useEffect, useState } from "react";
import { BotConfigForm } from "@/components/dashboard/bot-config-form";
import { RuleManager } from "@/components/dashboard/rule-manager";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BotSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [bot, setBot] = useState<any>(null);
  const router = useRouter();

  const fetchBot = async () => {
    try {
      const res = await fetch("/api/bot");
      const data = await res.json();
      if (data.success) {
        setBot(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bot settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBot();
  }, []);

  const handleSuccess = async () => {
    const isNew = !bot;
    await fetchBot();
    if (isNew) {
      router.push("/dashboard/bot");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/bot" 
          className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bot Settings</h1>
          <p className="text-slate-400">
            Manage your bot's identity and business information
          </p>
        </div>
      </div>

      <BotConfigForm initialData={bot} onSuccess={handleSuccess} />

      {bot && bot.type === "RULE_BASED" && (
        <div className="pt-8 border-t border-slate-800">
          <RuleManager />
        </div>
      )}
    </div>
  );
}
