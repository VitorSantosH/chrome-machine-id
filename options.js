const FIELDS = ["tag", "host", "os", "owner", "color", "position"];

(async () => {
  const m = await loadMachine();
  FIELDS.forEach((f) => (document.getElementById(f).value = m[f]));
  document.getElementById("showBadge").checked = !!m.showBadge;

  document.getElementById("save").addEventListener("click", async () => {
    const data = { showBadge: document.getElementById("showBadge").checked };
    FIELDS.forEach((f) => (data[f] = document.getElementById(f).value.trim()));
    await chrome.storage.sync.set(data);
    const status = document.getElementById("status");
    status.textContent = "salvo — recarregue as abas abertas";
    setTimeout(() => (status.textContent = ""), 3000);
  });
})();
