"use client";

import { useEffect, useState } from "react";
import ScanbotSDK from "scanbot-web-sdk/ui";

export default function Home() {

  const [scanResult, setScanResult] = useState("");

  // initialize the Scanbot Barcode SDK
  useEffect(() => {
    async function init() {
      await ScanbotSDK.initialize({
        licenseKey: "",
        enginePath: "/wasm/"
      });
    }
    init();
  }, []);

  async function startDocumentScanner() {
    const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration;

    config.palette.sbColorPrimary = "#1E90FF";
    config.palette.sbColorSecondary = "#87CEEB";
    config.userGuidance.title.text = "Place the finder over the barcode";
    config.topBar.mode = "GRADIENT";
    config.actionBar.zoomButton.backgroundColor = "#1E90FF";

    const useCase = new ScanbotSDK.UI.Config.MultipleScanningMode();
    useCase.arOverlay.visible = true;
    useCase.arOverlay.automaticSelectionEnabled = true;
    config.useCase = useCase;

    const result = await ScanbotSDK.UI.createBarcodeScanner(config);

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
