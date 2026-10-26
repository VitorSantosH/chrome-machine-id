# Machine ID

Extensão Chrome (MV3) que marca visualmente o navegador com o nome da máquina, para
diferenciar sessões quando há vários Chromes conectados na mesma conta.

Máquina configurada por padrão: **PC-CASA** · pc-casa · Ubuntu 26.04 LTS · vitor

## O que ela faz

- Desenha um badge fixo (`PC-CASA · Ubuntu 26.04 LTS`) no canto de toda página http/https.
  O badge usa Shadow DOM e `pointer-events:none`, então não interfere na página nem é
  afetado pelo CSS dela.
- Escreve a tag no ícone da extensão (badge do `chrome.action`).
- Publica a página `id.html` com hostname, SO, plataforma reportada pelo Chrome,
  user agent, fuso e resolução.
- Insere em cada página um marcador textual invisível
  `<<<MACHINE-ID>>> tag=… host=… os=… owner=…`, legível por extração de texto.

## Instalar (Chrome no Ubuntu)

1. Abra `chrome://extensions`
2. Ligue **Modo do desenvolvedor** (canto superior direito)
3. **Carregar sem compactação** → selecione `/home/vitor/Projetos/chrome-machine-id`
4. Fixe a extensão na barra para ver a tag no ícone

Para conferir a identidade: clique no ícone → **Página completa**, ou abra
`chrome-extension://<ID>/id.html` (o `<ID>` aparece no popup e em `chrome://extensions`).

## Configurar outra máquina

Instale a mesma pasta no outro Chrome e edite pelo ícone → **Editar**
(tag, hostname, SO, usuário, cor e posição do badge). Uma cor por máquina deixa a
diferença óbvia em captura de tela. Os valores ficam em `chrome.storage.sync`.

Para mudar o padrão de fábrica, edite `MACHINE_DEFAULTS` em `config.js`.

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
