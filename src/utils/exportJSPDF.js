import { format } from 'date-fns';
import brasilLocal from 'date-fns/locale/pt-BR';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//
const generatePDF = (tHead, fileName, values) => {
  const doc = new jsPDF();
  const pages = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.width; //Optional
  const pageHeight = doc.internal.pageSize.height; //Optional
  const tableHead = tHead;
  doc.text(`${fileName}`, 14, 15);
  doc.setFontSize(9);
  doc.text(
    ` ${format(new Date(), 'PPPpp', {
      locale: brasilLocal,
    })}`,
    14,
    pageHeight - 10
  );
  autoTable(doc, { theme: 'grid', head: tableHead, body: values, startY: 20 });

  doc.setFontSize(10); //Optional

  for (let j = 1; j < pages + 1; j++) {
    let horizontalPos = pageWidth / 2; //Can be fixed number
    let verticalPos = pageHeight - 10; //Can be fixed number
    doc.setPage(j);
    doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, {
      align: 'center',
    });
  }
  doc.save(`${fileName.trim()}.pdf`);
  // doc.save(`${fileName}.pdf`);
};
export default generatePDF;
