/**
 * Export Utilities for Bible Mind
 * Supports CSV, PDF, and JSON exports
 */

import { InterlinearResponse, Story, StudySession, VocabularyItem } from '../services/geminiService';

// ========== CSV EXPORT ==========
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
    const csvHeaders = headers || Object.keys(data[0] || {});

    const csvRows = [
        csvHeaders.join(','),
        ...data.map(row =>
            csvHeaders.map(header => {
                const value = row[header] ?? '';
                // Escape quotes and wrap in quotes if contains comma or quote
                const escaped = String(value).replace(/"/g, '""');
                return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
                    ? `"${escaped}"`
                    : escaped;
            }).join(',')
        )
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n'); // BOM for UTF-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

// Export interlinear data as CSV
export function exportInterlinearCSV(data: InterlinearResponse): void {
    const rows = data.words.map(word => ({
        Original: word.original,
        Transliteration: word.transliteration,
        English: word.english,
        Telugu: word.telugu,
        Grammar: word.grammar
    }));

    downloadCSV(rows, `interlinear_${data.reference.replace(/[:\s]/g, '_')}.csv`);
}

// Export vocabulary as CSV
export function exportVocabularyCSV(data: VocabularyItem[], bookName: string): void {
    const rows = data.map(item => ({
        Hebrew: item.hebrew,
        English: item.english,
        Telugu: item.telugu,
        Hindi: item.hindi,
        Occurrences: item.occurrences
    }));

    downloadCSV(rows, `vocabulary_${bookName}.csv`);
}

// ========== PDF EXPORT (using browser print) ==========
export function downloadPDF(content: string, title: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to download PDF');
        return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu&display=swap');
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        h1 { color: #1a1a2e; border-bottom: 2px solid #c9a227; padding-bottom: 10px; }
        h2 { color: #2d2d44; margin-top: 30px; }
        .telugu { font-family: 'Noto Sans Telugu', sans-serif; }
        .hebrew { direction: rtl; font-size: 1.2em; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #1a1a2e; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .moral { background: #fff8e1; padding: 20px; border-left: 4px solid #c9a227; margin: 20px 0; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      ${content}
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
    printWindow.document.close();
}

// Export story as PDF
export function exportStoryPDF(story: Story): void {
    const content = `
    <h1>${story.title}</h1>
    <h2>Characters</h2>
    <p>${story.characters.join(', ')}</p>
    <h2>Story</h2>
    <div>${story.content.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
    <div class="moral">
      <h2>Moral of the Story</h2>
      <p><em>${story.moral}</em></p>
    </div>
  `;
    downloadPDF(content, story.title);
}

// Export study as PDF
export function exportStudyPDF(study: StudySession): void {
    const content = `
    <h1>Bible Study: ${study.topic}</h1>
    <h2>Content</h2>
    <div>${study.content.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
    <h2>Scripture References</h2>
    <ul>${study.references.map(ref => `<li>${ref}</li>`).join('')}</ul>
    <h2>Reflection Questions</h2>
    <ol>${study.questions.map(q => `<li>${q}</li>`).join('')}</ol>
  `;
    downloadPDF(content, `Bible Study - ${study.topic}`);
}

// Export interlinear as PDF
export function exportInterlinearPDF(data: InterlinearResponse): void {
    const tableRows = data.words.map(word => `
    <tr>
      <td class="hebrew">${word.original}</td>
      <td>${word.transliteration}</td>
      <td>${word.english}</td>
      <td class="telugu">${word.telugu}</td>
      <td><em>${word.grammar}</em></td>
    </tr>
  `).join('');

    const content = `
    <h1>Interlinear: ${data.reference}</h1>
    <h2>English Translation</h2>
    <p>${data.translation_english}</p>
    <h2 class="telugu">Telugu Translation</h2>
    <p class="telugu">${data.translation_telugu}</p>
    <h2>Word-by-Word Analysis</h2>
    <table>
      <thead>
        <tr>
          <th>Original</th>
          <th>Transliteration</th>
          <th>English</th>
          <th>Telugu</th>
          <th>Grammar</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;
    downloadPDF(content, `Interlinear - ${data.reference}`);
}

// ========== JSON EXPORT ==========
export function downloadJSON(data: any, filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

// ========== HELPER ==========
function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
