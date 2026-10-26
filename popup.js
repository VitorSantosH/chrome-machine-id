(async () => {
  const m = await loadMachine();
  document.getElementById("tag").textContent = m.tag;
  document.getElementById("tag").style.color = m.color;
  document.getElementById("host").textContent = m.host;
  document.getElementById("os").textContent = m.os;
  document.getElementById("owner").textContent = m.owner;

  document.getElementById("open").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("id.html") });
  });
  document.getElementById("opts").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
})();
