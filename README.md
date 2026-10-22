# Football Trilíngue (PWA)

Vocabulário e frases de futebol em português, 中文 e inglês britânico, com áudio.
Site estático: sem build, sem dependências, funciona offline.

## Publicar no Netlify
1. Suba **todo o conteúdo desta pasta** na raiz do repositório do GitHub (mantendo as pastas `icons/` e `fonts/`).
2. No Netlify: *Add new site › Import from Git* e escolha o repositório.
3. Build command: vazio. Publish directory: `.` (o `netlify.toml` já define isso).
4. Abra a URL `https://….netlify.app` no Chrome do Android e aguarde o aviso "Pronto para usar offline".
5. Instale: botão **Instalar** no topo do app, ou menu ⋮ › *Instalar app*.

## Testar offline
Depois do passo 4, ative o modo avião e abra o app pelo ícone. Tudo (texto, fontes, favoritos) funciona.
O áudio offline depende de vozes instaladas no aparelho (Ajustes › Vozes encontradas mostra o que há).

## Editar conteúdo
Os dados ficam no array `DATA` dentro do `index.html`, no formato `[中文, pinyin, português, English UK]`.
Não altere o chinês de um item já favoritado (ele é a chave do favorito).
Online, o app sempre carrega a versão nova do `index.html`; offline, usa a última que baixou.
Se mudar ícones ou fontes, aumente `VERSION` no `sw.js` para renovar o cache.

## Arquivos
- `index.html`: app inteiro (HTML, CSS, JS, dados)
- `sw.js`: service worker (cache offline)
- `manifest.webmanifest`: nome, cores, ícones e atalhos (Favoritos, Essenciais)
- `netlify.toml`: cabeçalhos de cache (o `sw.js` nunca fica em cache)
- `icons/`, `fonts/` (Barlow, licença OFL)
