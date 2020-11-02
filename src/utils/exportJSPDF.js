import { format } from 'date-fns';
import brasilLocal from 'date-fns/locale/pt-BR';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generatePDF = (tHead, fileName, values) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.width; //Optional
  const pageHeight = doc.internal.pageSize.height; //Optional
  const tableHead = tHead;
  doc.text(`${fileName}`, 14, 15);
  doc.setFontSize(9);

  if (tHead) {
    autoTable(doc, {
      theme: 'grid',
      head: tableHead,
      body: values,

      startY: 20,
    });
  } else {
    autoTable(doc, { body: values, startY: 20 });
  }
  const addFooters = (doc) => {
    let horizontalPos = pageWidth / 2; //Can be fixed number

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        'Página ' + String(i) + ' de ' + String(pageCount),
        horizontalPos,
        287,
        {
          align: 'center',
        }
      );
      doc.text(
        ` ${format(new Date(), 'PPPpp', {
          locale: brasilLocal,
        })}`,
        14,
        pageHeight - 10
      );
    }
  };
  addFooters(doc);
  doc.save(`${fileName.trim()}.pdf`);
};
export default generatePDF;
