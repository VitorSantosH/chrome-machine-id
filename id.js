(async () => {
  const m = await loadMachine();
  const set = (id, v) => (document.getElementById(id).textContent = v);

  set("tag", m.tag);
  set("host", m.host);
  set("os", m.os);
  set("owner", m.owner);
  set("ua", navigator.userAgent);
  set("tz", Intl.DateTimeFormat().resolvedOptions().timeZone);
  set("res", `${screen.width}x${screen.height} @ ${window.devicePixelRatio}x`);
  set("extid", chrome.runtime.id);

  document.title = `Machine ID: ${m.tag} — ${m.os}`;
  set("marker", `${MACHINE_MARKER} tag=${m.tag} host=${m.host} os=${m.os} owner=${m.owner}`);

  try {
    const info = await chrome.runtime.getPlatformInfo();
    set("plat", `${info.os} / ${info.arch}`);
  } catch (e) {
    set("plat", "indisponível");
  }
})();
