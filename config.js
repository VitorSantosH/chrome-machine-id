// Identidade desta instalação. Edite pela página de opções da extensão.
// Campo em branco é preenchido com o que o Chrome consegue detectar sozinho;
// os valores salvos em chrome.storage.sync têm precedência sobre a detecção.
const MACHINE_DEFAULTS = {
  tag: "",                      // marcador curto, aparece no badge (em branco: usa host ou SO)
  host: "",                     // hostname da máquina (o Chrome não expõe; só manual)
  os: "",                       // sistema operacional (detectado)
  owner: "",                    // usuário local (o Chrome não expõe; só manual)
  color: "#d94f00",             // cor do badge (uma por máquina ajuda a diferenciar)
  showBadge: true,              // desenhar o badge nas páginas
  position: "bottom-right"      // bottom-right | bottom-left | top-right | top-left
};

// Marcador textual único: facilita localizar a identidade em texto extraído da página.
const MACHINE_MARKER = "<<<MACHINE-ID>>>";

const OS_NAMES = {
  win: "Windows", mac: "macOS", linux: "Linux", cros: "ChromeOS",
  android: "Android", openbsd: "OpenBSD", fuchsia: "Fuchsia"
};

// Detecta o que o Chrome informa: SO (com versão no Windows/macOS), arquitetura e
// versão do navegador. Só roda onde chrome.runtime.getPlatformInfo existe
// (service worker e páginas da extensão), por isso o resultado fica em storage.local.
async function detectMachine() {
  const info = await chrome.runtime.getPlatformInfo();
  const detected = { os: OS_NAMES[info.os] || info.os, arch: info.arch, browser: "" };
  try {
    const h = await navigator.userAgentData.getHighEntropyValues(["platformVersion", "fullVersionList"]);
    const major = parseInt(h.platformVersion, 10);
    if (info.os === "win" && major > 0) detected.os = major >= 13 ? "Windows 11" : "Windows 10";
    if (info.os === "mac" && h.platformVersion) {
      detected.os = `macOS ${h.platformVersion.split(".").slice(0, 2).join(".")}`;
    }
    const b = (h.fullVersionList || []).find((x) => !/Not.?A.?Brand|Chromium/i.test(x.brand));
    if (b) detected.browser = `${b.brand} ${b.version}`;
  } catch (e) {
    // userAgentData indisponível: fica só o nome do SO.
  }
  await chrome.storage.local.set({ detected });
  return detected;
}

async function loadMachine() {
  let saved = {}, detected = {};
  try {
    saved = await chrome.storage.sync.get(Object.keys(MACHINE_DEFAULTS));
    ({ detected = {} } = await chrome.storage.local.get("detected"));
  } catch (e) {
    // sem storage: segue com os padrões.
  }
  // Campo salvo em branco não apaga o valor detectado.
  const filled = Object.fromEntries(Object.entries(saved).filter(([, v]) => v !== ""));
  const m = { ...MACHINE_DEFAULTS, ...detected, ...filled };
  m.tag = m.tag || m.host || m.os || "?";
  return m;
}
