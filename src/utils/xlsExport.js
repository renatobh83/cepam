import React from "react";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

export const ExportCSV = ({ csvData, fileName }) => {
  console.log(csvData);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xls", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return <button onClick={() => exportToCSV(csvData, fileName)}>Export</button>;
};