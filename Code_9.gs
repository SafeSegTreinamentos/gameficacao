/**
 * SafeSeg — Gamificação
 * Backend Apps Script para as dinâmicas de bloqueio de energia e espaço confinado.
 *
 * COMO USAR:
 * 1. Crie uma planilha Google Sheets chamada "Gamificação" no Drive da SafeSeg.
 * 2. Dentro dela: Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole este arquivo inteiro.
 * 4. Implantar > Nova implantação > tipo "App da Web".
 *    - Executar como: Eu (sua conta)
 *    - Quem pode acessar: Qualquer pessoa
 * 5. Copie a URL gerada e cole em SHEET_WEBAPP_URL no topo de cada um dos
 *    4 arquivos HTML dos jogos (eletrica-nr10.html, bloqueio-maquinas-nr12.html,
 *    espaco-confinado-nr33.html, pet-nr33.html).
 *
 * Cada jogo grava numa aba própria da planilha (criada automaticamente
 * no primeiro resultado recebido).
 */

const ABAS = {
  eletrica: 'Elétrica (NR-10)',
  bloqueio: 'Bloqueio (NR-12)',
  confinado: 'Espaço Confinado (NR-33)',
  pet: 'PET (NR-33)'
};

const CABECALHO = ['Data/Hora', 'Nome', 'Tempo', 'Erros', 'Tentativas'];

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const nomeAba = ABAS[dados.jogo] || ('Outros — ' + (dados.jogo || '?'));

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName(nomeAba);
    if (!aba) {
      aba = ss.insertSheet(nomeAba);
      aba.appendRow(CABECALHO);
      aba.getRange(1, 1, 1, CABECALHO.length)
        .setFontWeight('bold')
        .setBackground('#14171B')
        .setFontColor('#F59E0B');
      aba.setFrozenRows(1);
      aba.autoResizeColumns(1, CABECALHO.length);
    }

    aba.appendRow([
      new Date(),
      dados.nome || '(sem nome)',
      dados.tempo || '',
      dados.erros != null ? dados.erros : '',
      dados.tentativas != null ? dados.tentativas : ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'SafeSeg Gamificação — API online' }))
    .setMimeType(ContentService.MimeType.JSON);
}
