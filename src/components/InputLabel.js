import React from 'react';

export default function InputLabel({
  value,
  onchange,
  filter,
  onchangeInFilter,
  typeInput,
  name,
  otp = null,
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
            <label htmlFor={f._id}>
              {f.name} {otp === 'dtNascimento' ? ` - ${f.dtNascimento}` : null}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
