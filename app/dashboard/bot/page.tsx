"use client";

import { useEffect, useState } from "react";
import { Loader2, Settings, Store, Globe, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyBotPage() {
  const [loading, setLoading] = useState(true);
  const [bot, setBot] = useState<any>(null);

  const fetchBot = async () => {
    try {
      const res = await fetch("/api/bot");
      const data = await res.json();
      if (data.success) {
        setBot(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bot", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBot();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00D4AA]" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="p-4 rounded-full bg-slate-800/50 text-slate-400">
           <Settings className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Bot Not Configured</h1>
          <p className="text-slate-400 max-w-md">
            You haven't configured your bot yet. Please set up your store information to get started.
          </p>
        </div>
        <Link href="/dashboard/bot/settings">
          <Button className="bg-[#00D4AA] text-slate-950 hover:bg-[#00D4AA]/90">
            Go to Settings to Configure
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{bot.name}</h1>
          <div className="flex items-center gap-2">
            <Badge className={bot.isActive ? "bg-[#00D4AA] text-slate-950" : "bg-slate-700 text-slate-400"}>
              {bot.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-slate-500 text-sm">Created on {new Date(bot.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Link href="/dashboard/bot/settings">
          <Button variant="outline" className="border-slate-800 text-white hover:bg-slate-800 hover:text-white hover:cursor-pointer">
            <Settings className="mr-2 h-4 w-4 " />
            Bot Settings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Store Information</CardTitle>
            <Store className="h-4 w-4 text-[#00D4AA]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{bot.storeName}</div>
            <p className="text-xs text-slate-500 mt-1">{bot.storeCity}, Algeria</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Languages</CardTitle>
            <Globe className="h-4 w-4 text-[#00D4AA]" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {bot.languages.map((lang: string) => (
                <Badge key={lang} variant="secondary" className="bg-slate-800 text-slate-300 border-none">
                  {lang.charAt(0) + lang.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Contact</CardTitle>
            <Phone className="h-4 w-4 text-[#00D4AA]" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-white">{bot.storeContact}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#00D4AA]" />
            <CardTitle className="text-white">Current Mode</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            {bot.type === 'AI_POWERED' ? 'Your bot is powered by advanced AI for natural conversations.' : 'Your bot is currently following fixed rules for responses.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Badge className="bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20 px-4 py-1">
             {bot.type.replace('_', ' ')}
           </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
