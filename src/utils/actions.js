export const update = (array, update, setNew, setFale, setNull) => {
  const filterUsers = array.filter((u) => u._id !== update._id);
  setNew([...filterUsers, update]);
  setFale(false);
  setNull(null);
};
export const create = (array, newObj, setNew, setFalse, setNull) => {
  setNew([...array, newObj]);
  setFalse(false);
  setNull(null);
};
export const setToEdit = (element, setEdit, setTrue) => {
  setEdit(element);
  setTrue(true);
};
