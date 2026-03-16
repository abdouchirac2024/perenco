"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";

interface EquipmentSpecs {
  site: string;
  plateforme: string;
  equipement: string;
  tag: string;
  inletSize: string;
  inletClasse: string;
  outletSize: string;
  outletClasse: string;
  dateDepose: string;
  certificatDepose: string;
  datePose: string;
  certificatPose: string;
  commentaires: string;
}

const initialSpecs: EquipmentSpecs = {
  site: "",
  plateforme: "",
  equipement: "",
  tag: "",
  inletSize: "",
  inletClasse: "",
  outletSize: "",
  outletClasse: "",
  dateDepose: "",
  certificatDepose: "",
  datePose: "",
  certificatPose: "",
  commentaires: "",
};

export default function Home() {
  const [specs, setSpecs] = useState<EquipmentSpecs>(initialSpecs);
  const [qrLink, setQrLink] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string>("");
  const qrRef = useRef<QRCode>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setLogoBase64(canvas.toDataURL("image/png"));
      }
    };
    img.src = "/image/logo.jpeg";
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setSpecs({ ...specs, [e.target.name]: e.target.value });
  };

  const generateQR = useCallback(() => {
    if (!specs.site.trim()) {
      alert("Veuillez saisir le site.");
      return;
    }

    const data = btoa(encodeURIComponent(JSON.stringify(specs)));
    const origin = window.location.origin;
    const url = `${origin}/pc?data=${data}`;
    setQrLink(url);
    setShowQR(true);
  }, [specs]);

  const downloadQR = () => {
    if (!qrRef.current) return;
    (qrRef.current as unknown as { download: (type: string, name: string) => void }).download(
      "png",
      `qr-${specs.site.replace(/\s+/g, "_")}-${specs.tag.replace(/\s+/g, "_")}`
    );
  };

  const resetForm = () => {
    setSpecs(initialSpecs);
    setShowQR(false);
    setQrLink("");
  };

  const textFields: { name: keyof EquipmentSpecs; label: string; placeholder: string }[] = [
    { name: "site", label: "Site", placeholder: "Ex: Site de Douala" },
    { name: "plateforme", label: "Plate-forme", placeholder: "Ex: PF-A" },
    { name: "equipement", label: "Équipement protégé", placeholder: "Ex: Compresseur HP" },
    { name: "tag", label: "Tag de l'équipement protégé", placeholder: "Ex: TAG-001" },
    { name: "inletSize", label: "Inlet size", placeholder: "Ex: 2\"" },
    { name: "inletClasse", label: "Inlet classe", placeholder: "Ex: 150" },
    { name: "outletSize", label: "Outlet size", placeholder: "Ex: 3\"" },
    { name: "outletClasse", label: "Outlet classe", placeholder: "Ex: 300" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <img
            src="/image/logo.jpeg"
            alt="Perenco Logo"
            className="h-10 w-auto rounded"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-800">PERENCO</h1>
            <p className="text-sm text-slate-500">
              Générateur QR Code - Équipements
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">
              Informations de l&apos;équipement
            </h2>

            <div className="space-y-4">
              {textFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {field.label}
                    {field.name === "site" && (
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

              {/* Date de dépose */}
              <div>
                <label htmlFor="dateDepose" className="block text-sm font-medium text-slate-700 mb-1">
                  Date de dépose
                </label>
                <input
                  type="date"
                  id="dateDepose"
                  name="dateDepose"
                  value={specs.dateDepose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Certificat de dépose envoyé */}
              <div>
                <label htmlFor="certificatDepose" className="block text-sm font-medium text-slate-700 mb-1">
                  Certificat de dépose envoyé ?
                </label>
                <select
                  id="certificatDepose"
                  name="certificatDepose"
                  value={specs.certificatDepose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Date de pose */}
              <div>
                <label htmlFor="datePose" className="block text-sm font-medium text-slate-700 mb-1">
                  Date de pose
                </label>
                <input
                  type="date"
                  id="datePose"
                  name="datePose"
                  value={specs.datePose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Certificat de pose envoyé */}
              <div>
                <label htmlFor="certificatPose" className="block text-sm font-medium text-slate-700 mb-1">
                  Certificat de pose envoyé ?
                </label>
                <select
                  id="certificatPose"
                  name="certificatPose"
                  value={specs.certificatPose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Commentaires */}
              <div>
                <label
                  htmlFor="commentaires"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Commentaires
                </label>
                <textarea
                  id="commentaires"
                  name="commentaires"
                  value={specs.commentaires}
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
            {showQR && qrLink ? (
              <div className="text-center space-y-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  QR Code généré
                </h2>
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 inline-block">
                  <QRCode
                    ref={qrRef}
                    value={qrLink}
                    size={280}
                    quietZone={10}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    logoImage={logoBase64}
                    logoWidth={70}
                    logoHeight={70}
                    logoOpacity={1}
                    removeQrCodeBehindLogo={true}
                    qrStyle="dots"
                    eyeRadius={8}
                    ecLevel="H"
                  />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {specs.site} {specs.tag && `- ${specs.tag}`}
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
