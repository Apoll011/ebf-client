import type {AgeGroup, StudentListItem} from "../model/types.ts";

export const generatePDFContent = (students: StudentListItem[], age_group: AgeGroup): string => {
    const studentsPerPage = 18;
    const totalPages = Math.ceil(students.length / studentsPerPage);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Presença</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @media print {
                    body { 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        font-size: 12px;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                    .no-break {
                        page-break-inside: avoid;
                    }
                }
                
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                }
                
                .checkbox {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #374151;
                    display: inline-block;
                    margin: 2px;
                }
                
                .header-cell {
                    background-color: #f3f4f6 !important;
                    font-weight: bold;
                    border: 1px solid #d1d5db;
                    padding: 8px 4px;
                    text-align: center;
                    font-size: 11px;
                }
                
                .student-cell {
                    border: 1px solid #d1d5db;
                    padding: 6px 4px;
                    height: 40px;
                    vertical-align: middle;
                }
                
                .student-name {
                    font-weight: 600;
                    font-size: 12px;
                }
                
                .notes-cell {
                    min-height: 30px;
                    border: 1px solid #d1d5db;
                    padding: 4px;
                }
            </style>
        </head>
        <body>
    `;

    for (let page = 0; page < totalPages; page++) {
        const startIndex = page * studentsPerPage;
        const endIndex = Math.min(startIndex + studentsPerPage, students.length);
        const pageStudents = students.slice(startIndex, endIndex);

        htmlContent += `
            <div class="${page < totalPages - 1 ? 'page-break' : ''}">
                <div class="mb-6">
                    <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">
                        Lista de Presença e Participação
                    </h1>
                    <div class="flex justify-between items-center text-sm text-gray-600">
                        <div>Data: ${formattedDate}</div>
                        <div>Turma: ${age_group}</div>
                        <div>Página ${page + 1} de ${totalPages}</div>
                    </div>
                </div>

                <table class="w-full border-collapse mb-4">
                    <thead>
                        <tr>
                            <th class="header-cell w-48">Nome do Estudante</th>
                            <th class="header-cell w-16">Presença</th>
                            <th class="header-cell w-16">Livro</th>
                            <th class="header-cell w-16">Versículo</th>
                            <th class="header-cell w-20">Participação</th>
                            <th class="header-cell w-16">Convidado</th>
                            <th class="header-cell w-16">Jogo</th>
                            <th class="header-cell flex-1">Notas</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        pageStudents.forEach((student) => {
            htmlContent += `
                <tr class="no-break">
                    <td class="student-cell student-name">${student.name}</td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="notes-cell"></td>
                </tr>
            `;
        });

        const remainingRows = studentsPerPage - pageStudents.length;
        for (let i = 0; i < remainingRows && page === totalPages - 1; i++) {
            htmlContent += `
                <tr class="no-break">
                    <td class="student-cell" style="height: 40px;"></td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="student-cell text-center">
                        <div class="checkbox"></div>
                    </td>
                    <td class="notes-cell"></td>
                </tr>
            `;
        }

        htmlContent += `
                    </tbody>
                </table>

                <!-- Summary Section -->
                <div class="mt-6 grid grid-cols-3 gap-4 text-sm">
                    <div class="border border-gray-300 p-3">
                        <div class="font-semibold mb-2">Resumo da Aula</div>
                        <div class="mb-1">Total de Alunos: ${pageStudents.length}</div>
                        <div class="mb-1">Presentes: _____</div>
                        <div>Ausentes: _____</div>
                    </div>
                    <div class="border border-gray-300 p-3">
                        <div class="font-semibold mb-2">Atividades</div>
                        <div style="height: 30px; border-bottom: 1px solid #ccc;"></div>
                        <div style="height: 20px; border-bottom: 1px solid #ccc;"></div>
                        <div style="height: 20px; border-bottom: 1px solid #ccc;"></div>
                    </div>
                    <div class="border border-gray-300 p-3">
                        <div class="font-semibold mb-2">Observações</div>
                        <div style="height: 30px; border-bottom: 1px solid #ccc;"></div>
                        <div style="height: 20px; border-bottom: 1px solid #ccc;"></div>
                        <div style="height: 20px; border-bottom: 1px solid #ccc; "></div>
                    </div>
                </div>
            </div>
        `;
    }

    htmlContent += `
        </body>
        </html>
    `;

    return htmlContent;
};
