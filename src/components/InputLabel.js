import React from 'react';

export default function InputLabel({
  value,
  onchange,
  filter,
  onchangeInFilter,
  typeInput,
  name,
}) {
  return (
    <>
      <input
        type="search"
        value={value}
        name={name}
        id={name}
        placeholder="Pesquisa"
        onChange={onchange}
      />
      <ul>
        {filter.map((f) => (
          <li key={f._id}>
            <input
              type={typeInput}
              name={name}
              id={f._id}
              className="regular-radio"
              value={f._id}
              onChange={onchangeInFilter}
            />
            <label htmlFor={f._id}>{f.name}</label>
          </li>
        ))}
      </ul>
    </>
  );
}

{
  /* <input
type="search"
value={searchPaciente}
name="pesquisapaciente"
id="pesquisapaciente"
placeholder="Pesquisa"
onChange={handleChangePesquisa}
/>
<ul>
{filterSearch.map((paciente) => (
  <li key={paciente._id}>
    <input
      type="radio"
      name="paciente"
      id={paciente._id}
      className="regular-radio"
      value={paciente._id}
      onChange={onChangePaciente}
    />
    <label htmlFor={paciente._id}>{paciente.name}</label>
  </li>
))}
</ul> */
}
