const FIELDS = ["tag", "host", "os", "owner", "color", "position"];
const TEXT_FIELDS = ["tag", "host", "os", "owner"];

(async () => {
  let detected = {};
  try {
    detected = await detectMachine();
  } catch (e) {
    // sem detecção: placeholders ficam vazios.
  }

  // Mostra só o que foi salvo; o detectado aparece como placeholder (campo em branco = automático).
  const saved = await chrome.storage.sync.get(MACHINE_DEFAULTS);
  FIELDS.forEach((f) => (document.getElementById(f).value = saved[f]));
  document.getElementById("showBadge").checked = !!saved.showBadge;
  TEXT_FIELDS.forEach((f) => {
    const el = document.getElementById(f);
    el.placeholder = detected[f] ? `automático: ${detected[f]}` : "não detectável — preencha";
  });

  document.getElementById("save").addEventListener("click", async () => {
    const data = { showBadge: document.getElementById("showBadge").checked };
    FIELDS.forEach((f) => (data[f] = document.getElementById(f).value.trim()));
    await chrome.storage.sync.set(data);
    const status = document.getElementById("status");
    status.textContent = "salvo — recarregue as abas abertas";
    setTimeout(() => (status.textContent = ""), 3000);
  });
})();
