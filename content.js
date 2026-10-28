(async () => {
  const BADGE_ID = "__machine_id_badge__";
  const MARKER_ID = "__machine_id_marker__";
  if (document.getElementById(MARKER_ID)) return;

  // Evita poluir páginas internas da própria extensão.
  if (location.protocol === "chrome-extension:") return;

  const m = await loadMachine();

  const mount = (node) => {
    const put = () => (document.body || document.documentElement).appendChild(node);
    if (document.body) put();
    else document.addEventListener("DOMContentLoaded", put, { once: true });
  };

  // Marcador invisível em texto, para leitura programática da página.
  // Fica independente do badge: existe mesmo com o badge visual desligado.
  const marker = document.createElement("span");
  marker.id = MARKER_ID;
  marker.setAttribute("data-machine-id", m.tag);
  marker.style.cssText = "position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0);";
  marker.textContent = `${MACHINE_MARKER} tag=${m.tag} host=${m.host} os=${m.os} owner=${m.owner} arch=${m.arch || ""} browser=${m.browser || ""}`;
  mount(marker);

  if (!m.showBadge) return;

  const POS = {
    "bottom-right": "bottom:8px; right:8px;",
    "bottom-left":  "bottom:8px; left:8px;",
    "top-right":    "top:8px; right:8px;",
    "top-left":     "top:8px; left:8px;"
  };

  const host = document.createElement("div");
  host.id = BADGE_ID;
  host.style.cssText = [
    "position:fixed",
    "z-index:2147483647",
    "pointer-events:none",
    POS[m.position] || POS["bottom-right"]
  ].join(";");

  // Shadow DOM: o CSS da página não altera o badge, e o badge não altera a página.
  const shadow = host.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent = `
    .b {
      font: 600 11px/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: #fff;
      background: ${m.color};
      border-radius: 6px;
      padding: 4px 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,.35);
      opacity: .92;
      white-space: nowrap;
      letter-spacing: .3px;
    }
    .sub { font-weight: 400; opacity: .85; }
  `;
  const el = document.createElement("div");
  el.className = "b";
  el.textContent = `${m.tag}`;
  const sub = document.createElement("span");
  sub.className = "sub";
  sub.textContent = ` · ${m.os}`;
  el.appendChild(sub);

  shadow.appendChild(style);
  shadow.appendChild(el);

  mount(host);
})();
