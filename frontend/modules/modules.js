//trim data
export const trimData = (obj) => {
  let finalobj = {};
  for (let key in obj) {
    finalobj[key] = obj[key]?.trim();
  }
  return finalobj;
};
