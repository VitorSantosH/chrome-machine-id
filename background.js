importScripts("config.js");

// Mostra a tag da máquina no próprio ícone da extensão.
async function paintActionBadge() {
  const m = await loadMachine();
  const short = (m.tag || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase();
  await chrome.action.setBadgeText({ text: short });
  await chrome.action.setBadgeBackgroundColor({ color: m.color || "#d94f00" });
  await chrome.action.setTitle({ title: `Machine ID: ${m.tag} · ${m.host} · ${m.os}` });
}

chrome.runtime.onInstalled.addListener(paintActionBadge);
chrome.runtime.onStartup.addListener(paintActionBadge);
chrome.storage.onChanged.addListener(paintActionBadge);
