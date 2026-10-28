importScripts("config.js");

// Mostra a tag da máquina no próprio ícone da extensão.
async function paintActionBadge() {
  const m = await loadMachine();
  const short = (m.tag || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase();
  await chrome.action.setBadgeText({ text: short });
  await chrome.action.setBadgeBackgroundColor({ color: m.color || "#d94f00" });
  await chrome.action.setTitle({ title: `Machine ID: ${m.tag} · ${m.host} · ${m.os}` });
}

// Atualiza o que foi detectado (SO, arquitetura, versão do Chrome) e repinta o ícone.
async function refresh() {
  try {
    await detectMachine();
  } catch (e) {
    // sem detecção: mantém o que já estava salvo.
  }
  await paintActionBadge();
}

chrome.runtime.onInstalled.addListener(refresh);
chrome.runtime.onStartup.addListener(refresh);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") paintActionBadge();
});
