"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface EquipmentSpecs {
  site: string;
  plateforme: string;
  equipement: string;
  tag: string;
  inletSize: string;
  inletClasse: string;
  outletSize: string;
  outletClasse: string;
  orifice: string;
  pressionTarage: string;
  dateDepose: string;
  certificatDepose: string;
  datePose: string;
  certificatPose: string;
  commentaires: string;
}

function EquipmentDetails() {
  const searchParams = useSearchParams();
  const data = searchParams.get("d") || searchParams.get("data");

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

  let specs: EquipmentSpecs;
  try {
    const decoded = JSON.parse(decodeURIComponent(escape(atob(data))));
    if (Array.isArray(decoded)) {
      const [site, plateforme, equipement, tag, inletSize, inletClasse,
        outletSize, outletClasse, orifice, pressionTarage,
        dateDepose, certificatDepose, datePose,
        certificatPose, commentaires] = decoded;
      specs = { site, plateforme, equipement, tag, inletSize, inletClasse,
        outletSize, outletClasse, orifice, pressionTarage,
        dateDepose, certificatDepose, datePose,
        certificatPose, commentaires };
    } else {
      specs = decoded;
    }
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
    { label: "Site", value: specs.site },
    { label: "Plate-forme", value: specs.plateforme },
    { label: "Équipement protégé", value: specs.equipement },
    { label: "Tag de la PSV", value: specs.tag },
    { label: "Inlet size", value: specs.inletSize },
    { label: "Inlet classe", value: specs.inletClasse },
    { label: "Outlet size", value: specs.outletSize },
    { label: "Outlet classe", value: specs.outletClasse },
    { label: "Orifice", value: specs.orifice },
    { label: "Pression de tarage", value: specs.pressionTarage },
    { label: "Date de dépose", value: specs.dateDepose },
    { label: "Certificat de dépose envoyé ?", value: specs.certificatDepose },
    { label: "Date de pose", value: specs.datePose },
    { label: "Certificat de pose envoyé ?", value: specs.certificatPose },
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-100">PERENCO</p>
              <h1 className="text-xl font-bold">{specs.site}</h1>
              {specs.tag && (
                <p className="text-sm text-blue-200">Tag: {specs.tag}</p>
              )}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Informations de l&apos;équipement
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

          {specs.commentaires && (
            <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 uppercase mb-1">
                Commentaires
              </p>
              <p className="text-sm text-amber-900">{specs.commentaires}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            Généré par PERENCO
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
      <EquipmentDetails />
    </Suspense>
  );
}
