export {};

declare global {
  interface Window {
    chatwootSettings?: {
      hideMessageBubble: true;
      locale: "en";
      position: "right";
      useBrowserLanguage: false;
      enableFileUpload: false;
    };
    chatwootSDK?: {
      run(config: { websiteToken: string; baseUrl: string }): void;
    };
    $chatwoot?: {
      toggle(state?: "open" | "close"): void;
    };
  }
}
