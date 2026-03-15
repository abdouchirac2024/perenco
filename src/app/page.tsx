"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";

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

const initialSpecs: PcSpecs = {
  titre: "",
  processeur: "",
  ram: "",
  stockage: "",
  ecran: "",
  gpu: "",
  os: "",
  remarques: "",
};

export default function Home() {
  const [specs, setSpecs] = useState<PcSpecs>(initialSpecs);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSpecs({ ...specs, [e.target.name]: e.target.value });
  };

  const generateQR = async () => {
    if (!specs.titre.trim()) {
      alert("Veuillez saisir un titre pour l'ordinateur.");
      return;
    }

    const data = btoa(
      encodeURIComponent(JSON.stringify(specs))
    );

    const origin = window.location.origin;
    const url = `${origin}/pc?data=${data}`;
    setQrLink(url);

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du QR code.");
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${specs.titre.replace(/\s+/g, "_")}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const resetForm = () => {
    setSpecs(initialSpecs);
    setQrDataUrl(null);
    setQrLink("");
  };

  const fields: { name: keyof PcSpecs; label: string; placeholder: string }[] =
    [
      {
        name: "titre",
        label: "Titre / Nom du PC",
        placeholder: "Ex: Dell Latitude 5520",
      },
      {
        name: "processeur",
        label: "Processeur",
        placeholder: "Ex: Intel Core i7-1165G7",
      },
      { name: "ram", label: "RAM", placeholder: "Ex: 16 Go DDR4" },
      {
        name: "stockage",
        label: "Stockage",
        placeholder: "Ex: SSD 512 Go NVMe",
      },
      { name: "ecran", label: "Écran", placeholder: "Ex: 15.6\" FHD IPS" },
      {
        name: "gpu",
        label: "Carte graphique",
        placeholder: "Ex: Intel Iris Xe",
      },
      {
        name: "os",
        label: "Système d'exploitation",
        placeholder: "Ex: Windows 11 Pro",
      },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-blue-600 text-white font-bold text-xl px-3 py-1.5 rounded-lg">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">PEREMCO</h1>
            <p className="text-sm text-slate-500">
              Générateur QR Code - Caractéristiques PC
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">
              Caractéristiques de l&apos;ordinateur
            </h2>

            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {field.label}
                    {field.name === "titre" && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={specs[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="remarques"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Remarques
                </label>
                <textarea
                  id="remarques"
                  name="remarques"
                  value={specs.remarques}
                  onChange={handleChange}
                  placeholder="Notes supplémentaires..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={generateQR}
                  className="flex-1 bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Générer le QR Code
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
            {qrDataUrl ? (
              <div ref={qrRef} className="text-center space-y-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  QR Code généré
                </h2>
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 inline-block">
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {specs.titre}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={downloadQR}
                    className="bg-green-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-green-700 transition cursor-pointer"
                  >
                    Télécharger PNG
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrLink);
                      alert("Lien copié !");
                    }}
                    className="border border-slate-300 text-slate-600 font-medium py-2 px-5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    Copier le lien
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-16">
                <svg
                  className="w-20 h-20 mx-auto mb-4 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-lg font-medium">Aucun QR code généré</p>
                <p className="text-sm mt-1">
                  Remplissez le formulaire et cliquez sur &quot;Générer&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
