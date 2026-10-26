// Identidade desta instalação. Edite aqui OU pela página de opções da extensão.
// Os valores salvos em chrome.storage.sync têm precedência sobre estes padrões.
const MACHINE_DEFAULTS = {
  tag: "PC-CASA",               // marcador curto, aparece no badge
  host: "pc-casa",              // hostname da máquina
  os: "Ubuntu 26.04 LTS",       // sistema operacional
  owner: "vitor",               // usuário local
  color: "#d94f00",             // cor do badge (uma por máquina ajuda a diferenciar)
  showBadge: true,              // desenhar o badge nas páginas
  position: "bottom-right"      // bottom-right | bottom-left | top-right | top-left
};

// Marcador textual único: facilita localizar a identidade em texto extraído da página.
const MACHINE_MARKER = "<<<MACHINE-ID>>>";

async function loadMachine() {
  try {
    const saved = await chrome.storage.sync.get(MACHINE_DEFAULTS);
    return { ...MACHINE_DEFAULTS, ...saved };
  } catch (e) {
    return { ...MACHINE_DEFAULTS };
  }
}
