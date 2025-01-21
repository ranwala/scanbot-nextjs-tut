import type ScanbotSDK from "scanbot-web-sdk/UI";

export default class ScanbotSDKService {
    public static instance: ScanbotSDKService = new ScanbotSDKService();

    DynScanbotSDK?: typeof ScanbotSDK;

    public async initialize() {

        // Use dynamic inline imports to load the SDK, else Next will load it into the server bundle
        // and attempt to load it before the 'window' object becomes available.
        // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
        this.DynScanbotSDK = (await import('scanbot-web-sdk/UI')).default;

        await this.DynScanbotSDK.initialize({
            licenseKey: "",
            enginePath: "/wasm/",
        });
    }

    public async startDocumentScanner() {
        const config = new this.DynScanbotSDK!.UI.Config.BarcodeScannerConfiguration;

        config.palette.sbColorPrimary = "#1E90FF";
        config.palette.sbColorSecondary = "#87CEEB";
        config.userGuidance.title.text = "Place the finder over the barcode";
        config.topBar.mode = "GRADIENT";
        config.actionBar.zoomButton.backgroundColor = "#1E90FF";

        const useCase = new this.DynScanbotSDK!.UI.Config.MultipleScanningMode();
        useCase.arOverlay.visible = true;
        useCase.arOverlay.automaticSelectionEnabled = true;
        config.useCase = useCase;

        const result = await this.DynScanbotSDK!.UI.createBarcodeScanner(config);

        if (result && result.items.length > 0) {
        }
    }
}