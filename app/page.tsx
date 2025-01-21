"use client";

import { useEffect, useState } from "react";
import type ScanbotSDK from "scanbot-web-sdk/UI";

export default function Home() {

  const [scanResult, setScanResult] = useState("");
  let DynScanbotSDK: typeof ScanbotSDK;

  // initialize the Scanbot Barcode SDK
  useEffect(() => {
    loadSDK();
  });

  async function loadSDK() {
    // Use dynamic inline imports to load the SDK, else Next will load it into the server bundle
    // and attempt to load it before the 'window' object becomes available.
    // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
    DynScanbotSDK = (await import('scanbot-web-sdk/UI')).default;

    await DynScanbotSDK.initialize({
      licenseKey: "",
      enginePath: "/wasm/",
    });
  }

  async function startDocumentScanner() {
    const config = new DynScanbotSDK.UI.Config.BarcodeScannerConfiguration;

    config.palette.sbColorPrimary = "#1E90FF";
    config.palette.sbColorSecondary = "#87CEEB";
    config.userGuidance.title.text = "Place the finder over the barcode";
    config.topBar.mode = "GRADIENT";
    config.actionBar.zoomButton.backgroundColor = "#1E90FF";

    const useCase = new DynScanbotSDK.UI.Config.MultipleScanningMode();
    useCase.arOverlay.visible = true;
    useCase.arOverlay.automaticSelectionEnabled = true;
    config.useCase = useCase;

    const result = await DynScanbotSDK.UI.createBarcodeScanner(config);

    if (result && result.items.length > 0) {
      setScanResult(result.items[0].barcode.text);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="text-2xl font-bold pb-3"> Scanbot Next Js Example </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        onClick={startDocumentScanner}> Scan Barcodes </button>

      <p className="text-xl font-medium pt-6"> {scanResult} </p>
    </div>
  );
}
