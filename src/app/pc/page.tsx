"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface PcSpecs {
  titre: string;
  processeur: string;
  ram: string;
  stockage: string;
  ecran: string;
  gpu: string;
  os: string;
  remarques: string;
}

function PcDetails() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <p className="text-xl text-slate-600">Aucune donnée trouvée.</p>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  let specs: PcSpecs;
  try {
    specs = JSON.parse(decodeURIComponent(atob(data)));
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <p className="text-xl text-red-600">Données invalides.</p>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  const details: { label: string; value: string }[] = [
    { label: "Processeur", value: specs.processeur },
    { label: "RAM", value: specs.ram },
    { label: "Stockage", value: specs.stockage },
    { label: "Écran", value: specs.ecran },
    { label: "Carte graphique", value: specs.gpu },
    { label: "Système d'exploitation", value: specs.os },
  ].filter((d) => d.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-100">PEREMCO</p>
              <h1 className="text-xl font-bold">{specs.titre}</h1>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Caractéristiques
          </h2>
          <div className="space-y-3">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm text-slate-500 font-medium">
                  {detail.label}
                </span>
                <span className="text-sm text-slate-800 font-semibold text-right ml-4">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          {specs.remarques && (
            <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 uppercase mb-1">
                Remarques
              </p>
              <p className="text-sm text-amber-900">{specs.remarques}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            Généré par PEREMCO
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PcPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Chargement...</p>
        </div>
      }
    >
      <PcDetails />
    </Suspense>
  );
}
