"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BotConfigFormProps {
  onSuccess: () => void;
  initialData?: any;
}

const LANGUAGES = [
  { label: "Arabic", value: "ARABIC" },
  { label: "French", value: "FRENCH" },
  { label: "Darija", value: "DARIJA" },
];

export function BotConfigForm({ onSuccess, initialData }: BotConfigFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    storeCity: "",
    storeContact: "",
    languages: [] as string[],
    type: "RULE_BASED",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();
        if (data.success) {
          setPlan(data.data.plan);
        }
      } catch (err) {
        console.error("Failed to fetch plan", err);
      }
    };
    fetchPlan();

    if (initialData) {
      setFormData({
        name: initialData.name || "",
        storeName: initialData.storeName || "",
        storeCity: initialData.storeCity || "",
        storeContact: initialData.storeContact || "",
        languages: initialData.languages || [],
        type: initialData.type || "RULE_BASED",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.languages.includes("DARIJA") && (formData.type === "RULE_BASED" || plan === "FREE_TRIAL")) {
      setError("Darija is only available for AI-powered bots on paid plans.");
      setLoading(false);
      return;
    }

    if (formData.languages.length === 0) {
      setError("Please select at least one language");
      setLoading(false);
      return;
    }

    try {
      const method = initialData ? "PATCH" : "POST";
      const res = await fetch("/api/bot", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Failed to ${initialData ? 'update' : 'configure'} bot`);
      }

      onSuccess();
      alert(initialData ? "Settings updated successfully!" : "Bot configured successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (lang === "DARIJA" && (formData.type === "RULE_BASED" || plan === "FREE_TRIAL")) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          {initialData ? "Bot Settings" : "Configure Your Bot"}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {initialData 
            ? "Update your store information and bot preferences." 
            : "Tell us about your store to personalize your automated assistant."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="botType" className="text-slate-200">Bot Type</Label>
              <select
                id="botType"
                value={formData.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  // If switching to RULE_BASED, remove DARIJA if it was selected
                  const newLangs = newType === "RULE_BASED" 
                    ? formData.languages.filter(l => l !== "DARIJA")
                    : formData.languages;
                  setFormData({ ...formData, type: newType, languages: newLangs });
                }}
                className="w-full bg-slate-950 border-slate-800 text-white rounded-md p-2"
              >
                <option value="RULE_BASED">Rule Based</option>
                <option 
                    value="AI_POWERED" 
                    disabled={plan === "FREE_TRIAL" || plan === "STARTER"}
                >
                    AI Powered {(plan === "FREE_TRIAL" || plan === "STARTER") ? "(Pro+ only)" : ""}
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="botName" className="text-slate-200">Bot Name</Label>
              <Input
                id="botName"
                placeholder="e.g. MyStore Assistant"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-slate-200">Store Name</Label>
              <Input
                id="storeName"
                placeholder="e.g. Fashion Hub"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeCity" className="text-slate-200">Store City</Label>
              <Input
                id="storeCity"
                placeholder="e.g. Algiers"
                value={formData.storeCity}
                onChange={(e) => setFormData({ ...formData, storeCity: e.target.value })}
                required
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeContact" className="text-slate-200">Store Contact (Phone/WhatsApp)</Label>
              <Input
                id="storeContact"
                placeholder="e.g. +213 555 123 456"
                value={formData.storeContact}
                onChange={(e) => setFormData({ ...formData, storeContact: e.target.value })}
                required
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-200">Bot Languages</Label>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map((lang) => {
                const isRestricted = lang.value === "DARIJA" && (formData.type === "RULE_BASED" || plan === "FREE_TRIAL");
                const isSelected = formData.languages.includes(lang.value);
                return (
                  <button
                    key={lang.value}
                    type="button"
                    disabled={isRestricted}
                    onClick={() => toggleLanguage(lang.value)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-secondary border-secondary text-slate-950"
                        : isRestricted
                        ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:cursor-pointer"
                    }`}
                  >
                    {lang.label}
                    {isRestricted && <span className="ml-2 text-[10px] opacity-70">(AI only)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-slate-950 hover:cursor-pointer "
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating Settings..." : "Saving Configuration..."}
              </>
            ) : (
              initialData ? "Update Settings" : "Save Configuration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
