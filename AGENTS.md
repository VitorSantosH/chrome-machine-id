# Para assistentes de IA

Para saber em qual navegador/máquina está a sessão, leia a seção
**"Como uma IA descobre em qual navegador está"** do `README.md`.

Resumo: abra uma página http/https comum e leia
`document.querySelector('[data-machine-id]')?.textContent`
(ou procure `<<<MACHINE-ID>>>` no texto da página). A `tag` identifica a máquina.
