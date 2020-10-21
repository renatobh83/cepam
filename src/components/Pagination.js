import React from 'react';

// import "./styles.css";
export default function Pagination({ limitHorario, totalHorarios, paginate }) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalHorarios / limitHorario);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      {totalPages > 1 && (
        <ul className="page">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a onClick={() => paginate(number)} className="page-link">
                {number}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
