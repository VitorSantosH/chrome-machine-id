# Machine ID

Extensão Chrome (MV3) que marca visualmente o navegador com o nome da máquina, para
diferenciar sessões quando há vários Chromes conectados na mesma conta.

Sistema operacional, arquitetura e versão do Chrome são detectados sozinhos. Hostname e
usuário o Chrome não expõe a extensões; esses (e a tag) se preenchem em **Editar**.

## O que ela faz

- Desenha um badge fixo (`PC-head5 · windows`) no canto de toda página http/https.
  O badge usa Shadow DOM e `pointer-events:none`, então não interfere na página nem é
  afetado pelo CSS dela.
- Escreve a tag no ícone da extensão (badge do `chrome.action`).
- Publica a página `id.html` com hostname, SO, plataforma reportada pelo Chrome,
  user agent, fuso e resolução.
- Insere em cada página um marcador textual invisível
  `<<<MACHINE-ID>>> tag=… host=… os=… owner=… arch=… browser=…`, legível por extração
  de texto. O marcador existe mesmo com o badge visual desligado.

## Como uma IA descobre em qual navegador está

Vale para qualquer assistente que controla o Chrome por extensão (Claude in Chrome e
similares) e precisa saber de qual máquina vem a sessão.

1. Abra uma página **http/https** comum (ex.: `https://example.com`). Em `chrome://`,
   `chrome-extension://` e na nova guia o content script não roda, e as ferramentas de
   automação costumam bloquear esses endereços — por isso `id.html` não serve para isso.
2. Leia o marcador pelo DOM:

   ```js
   document.querySelector('[data-machine-id]')?.textContent
   // <<<MACHINE-ID>>> tag=PC-head5 host=pc head5 os=windows owner=vitor arch=x86-64 browser=Google Chrome 155.0.8059.85
   ```

   Sem JavaScript, procure `<<<MACHINE-ID>>>` no texto extraído da página.
3. Compare a `tag` com a máquina esperada. Se for outra, troque de navegador
   (no Claude in Chrome: `list_connected_browsers` → `select_browser`) e leia de novo.

Significado dos campos:

| Campo     | Origem                                                          |
|-----------|-----------------------------------------------------------------|
| `tag`     | nome curto definido em **Editar** (em branco: usa host ou SO)   |
| `host`    | manual — o Chrome não expõe o hostname a extensões              |
| `os`      | detectado (`Windows 10/11`, `macOS x.y`, `Linux`…), ou o salvo  |
| `owner`   | manual — o Chrome não expõe o usuário do sistema                |
| `arch`    | detectado (`x86-64`, `arm64`…)                                  |
| `browser` | detectado (marca e versão do navegador)                         |

Valor salvo em **Editar** tem precedência sobre o detectado.

Se o marcador não aparecer: a extensão está em outro perfil do Chrome, o "Acesso ao
site" dela não está em **Em todos os sites**, ou a aba foi aberta antes de a extensão
ser carregada/recarregada (recarregue a aba).

## Instalar (Chrome no Ubuntu)

1. Abra `chrome://extensions`
2. Ligue **Modo do desenvolvedor** (canto superior direito)
3. **Carregar sem compactação** → selecione `/home/vitor/Projetos/chrome-machine-id`
4. Fixe a extensão na barra para ver a tag no ícone

Para conferir a identidade: clique no ícone → **Página completa**, ou abra
`chrome-extension://<ID>/id.html` (o `<ID>` aparece no popup e em `chrome://extensions`).

## Configurar outra máquina

Instale a mesma pasta no outro Chrome e edite pelo ícone → **Editar**
(tag, hostname, SO, usuário, cor e posição do badge). Campo em branco usa o valor
detectado, mostrado como placeholder. Uma cor por máquina deixa a diferença óbvia em
captura de tela. Os valores salvos ficam em `chrome.storage.sync`; os detectados, em
`chrome.storage.local`.

## Arquivos

| Arquivo        | Função                                              |
|----------------|-----------------------------------------------------|
| `manifest.json`| Manifest V3                                         |
| `config.js`    | Padrões da máquina + `loadMachine()`                |
| `content.js`   | Badge e marcador textual nas páginas                |
| `background.js`| Tag no ícone da extensão                            |
| `id.html/.js`  | Página de identidade completa                       |
| `popup.html/.js`| Popup do ícone                                     |
| `options.html/.js`| Edição da identidade                             |
