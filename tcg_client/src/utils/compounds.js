let compounds = [];
let compoundsRaw = JSON.parse(localStorage.getItem('compounds'));

compoundsRaw.forEach((item) => {
  compounds.push(item.compoundName);
});

export {
  compounds,
};