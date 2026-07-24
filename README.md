# SafeSeg — Dinâmicas de Gamificação

Quatro dinâmicas interativas de treinamento (bloqueio de energia e espaço confinado), com placar salvo localmente e, opcionalmente, em uma planilha Google Sheets.

## Arquivos

| Arquivo | Dinâmica | Norma |
|---|---|---|
| `index.html` | Hub — página inicial com os 4 cards | — |
| `eletrica-nr10.html` | Elétrica — 6 etapas de desenergização | NR-10, item 10.5.1 |
| `bloqueio-maquinas-nr12.html` | Bloqueio de máquinas — 5 etapas | NR-12, item 12.11.3 |
| `espaco-confinado-nr33.html` | Entrada segura em espaço confinado — 6 etapas | NR-33 |
| `pet-nr33.html` | Quiz da PET — 12 perguntas sobre os campos do documento | NR-33 |
| `tabuleiro-seguranca.html` | Um Dia de Trabalho Seguro — jogo de tabuleiro para até 4 jogadores, conduzido pelo facilitador | Geral (multi-NR) |
| `tabuleiro-arte.jpg` | Arte de fundo/banner do jogo de tabuleiro — precisa estar na mesma pasta do `tabuleiro-seguranca.html` | — |
| `Code.gs` | Backend (Google Apps Script) que grava os resultados no Sheets | — |

---

## Passo 1 — Publicar no GitHub Pages

1. Crie um repositório no GitHub (pode ser privado ou público).
2. Envie os 5 arquivos `.html` para a raiz do repositório (não precisa enviar o `Code.gs`, ele fica só no Apps Script).
3. Vá em **Settings → Pages**.
4. Em "Source", selecione a branch principal (`main`) e a pasta `/ (root)`.
5. Salve. Em alguns minutos o GitHub mostra a URL pública, algo como:
   `https://SEU-USUARIO.github.io/NOME-DO-REPO/`
6. Acesse essa URL — ela abre o `index.html` automaticamente, com os 4 cards.

Como os jogos se referenciam por caminho relativo (`eletrica-nr10.html`, etc.), **todos os arquivos precisam estar na mesma pasta** do repositório.

---

## Passo 2 — Criar a planilha "Gamificação" no Drive

1. No Drive da SafeSeg, crie uma planilha Google Sheets nova chamada **Gamificação**.
2. Dentro dela, vá em **Extensões → Apps Script**.
3. Apague o conteúdo padrão do editor e cole o conteúdo do arquivo `Code.gs`.
4. Salve o projeto (nome sugerido: "SafeSeg Gamificação API").
5. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize as permissões pedidas (é a sua própria conta Google acessando sua própria planilha).
7. Copie a **URL do app da Web** gerada — é algo como:
   `https://script.google.com/macros/s/AKfycb.../exec`

Cada jogo grava numa aba própria da planilha (criada automaticamente no primeiro resultado recebido): *Elétrica (NR-10)*, *Bloqueio (NR-12)*, *Espaço Confinado (NR-33)*, *PET (NR-33)*. As colunas são: Data/Hora, Nome, Tempo, Erros, Tentativas.

---

## Passo 3 — Conectar os jogos à planilha

Em **cada um dos 4 arquivos HTML** dos jogos, procure esta linha perto do início do `<script>`:

```js
const SHEET_WEBAPP_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
```

Substitua pela URL copiada no Passo 2 (a mesma URL em todos os 4 arquivos):

```js
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Salve e reenvie os arquivos atualizados para o GitHub (Passo 1). Se preferir, faça isso *antes* de publicar, num só envio.

Sem essa URL preenchida, os jogos continuam funcionando normalmente (placar local, offline) — só não enviam nada para o Sheets.

---

## Como funciona o envio

Ao final de cada dinâmica, quando a pessoa digita o nome e clica em "Salvar":
- O resultado é salvo no `localStorage` do navegador (ranking local, funciona offline).
- Se `SHEET_WEBAPP_URL` estiver preenchida, o mesmo resultado é enviado em segundo plano para a planilha (não bloqueia nem atrasa a tela do jogador).

O envio usa `mode: 'no-cors'`, então o navegador não recebe confirmação de sucesso — é uma limitação normal de Apps Script chamado do lado do cliente. Para conferir se está funcionando, é só abrir a planilha depois de um teste.
