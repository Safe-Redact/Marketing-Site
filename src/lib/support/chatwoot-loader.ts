interface ChatwootSdk {
  run(config: { websiteToken: string; baseUrl: string }): void;
}

export type ScriptHandle = Pick<
  HTMLScriptElement,
  "id" | "src" | "async" | "defer" | "onload" | "onerror"
>;

export interface ChatwootLoaderRuntime {
  findScript(id: string): ScriptHandle | null;
  createScript(): ScriptHandle;
  appendScript(script: ScriptHandle): void;
  getSdk(): ChatwootSdk | undefined;
  setSettings(settings: {
    hideMessageBubble: true;
    locale: "en";
    position: "right";
    useBrowserLanguage: false;
    enableFileUpload: false;
  }): void;
}

export const CHATWOOT_SCRIPT_ID = "openredakt-chatwoot-sdk";

/** One loader instance owns one SDK lifecycle, including concurrent activations. */
export function createChatwootLoader(runtime: ChatwootLoaderRuntime) {
  let loadPromise: Promise<void> | null = null;
  let initialized = false;

  function initialize(baseUrl: string, websiteToken: string) {
    if (initialized) return;
    const sdk = runtime.getSdk();
    if (!sdk) throw new Error("Support chat SDK did not initialize.");

    runtime.setSettings({
      hideMessageBubble: true,
      locale: "en",
      position: "right",
      useBrowserLanguage: false,
      enableFileUpload: false,
    });
    sdk.run({ baseUrl, websiteToken });
    initialized = true;
  }

  return {
    load(baseUrl: string, websiteToken: string) {
      if (loadPromise) return loadPromise;

      loadPromise = new Promise<void>((resolve, reject) => {
        const existing = runtime.findScript(CHATWOOT_SCRIPT_ID);
        if (existing && runtime.getSdk()) {
          try {
            initialize(baseUrl, websiteToken);
            resolve();
          } catch (error) {
            reject(error);
          }
          return;
        }

        const script = existing ?? runtime.createScript();
        script.id = CHATWOOT_SCRIPT_ID;
        script.src = `${baseUrl}/packs/js/sdk.js`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          try {
            initialize(baseUrl, websiteToken);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        script.onerror = () => reject(new Error("Support chat could not be loaded."));

        if (!existing) runtime.appendScript(script);
      });

      return loadPromise;
    },
  };
}

function browserRuntime(): ChatwootLoaderRuntime {
  return {
    findScript: (id) => document.getElementById(id) as HTMLScriptElement | null,
    createScript: () => document.createElement("script"),
    appendScript: (script) => document.head.appendChild(script as HTMLScriptElement),
    getSdk: () => window.chatwootSDK,
    setSettings: (settings) => {
      window.chatwootSettings = settings;
    },
  };
}

export const chatwootLoader =
  typeof window === "undefined" ? null : createChatwootLoader(browserRuntime());
