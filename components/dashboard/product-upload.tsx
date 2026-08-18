"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type UploadResult = {
  success: boolean;
  imported?: number;
  rejected?: number;
  errors?: { row: number; reason: string }[];
  error?: string;
  missing?: string[];
};

export function ProductUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/bot/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, error: "NETWORK_ERROR" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="bg-card border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Product Catalog</CardTitle>
        <CardDescription className="text-slate-400">
          Upload your stock as xlsx or csv. This replaces your current catalog entirely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <a
          href="/templates/wakil_product_template.xlsx"
          download
          className="inline-flex items-center gap-2 text-sm text-[#00D4AA] hover:underline"
        >
          <Download className="h-4 w-4" />
          Download template
        </a>

        <div className="flex items-center gap-4">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={onInputChange}
            className="hidden"
            id="product-file-input"
          />
          <Button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="bg-[#00D4AA] text-slate-950 hover:bg-[#00D4AA]/90"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin me-2" />
            ) : (
              <Upload className="h-4 w-4 me-2" />
            )}
            {uploading ? "Uploading..." : "Upload stock file"}
          </Button>
        </div>

        {result && !result.success && (
          <div className="flex items-start gap-2 text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p>Upload failed: {result.error}</p>
              {result.missing && <p>Missing columns: {result.missing.join(", ")}</p>}
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#00D4AA] text-sm bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg p-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Imported {result.imported} products
                {result.rejected ? `, ${result.rejected} rows skipped` : ""}
              </span>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                {result.errors.map((e, i) => (
                  <div key={i}>Row {e.row}: {e.reason}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}