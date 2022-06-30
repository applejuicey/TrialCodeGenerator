const xlsx = require('node-xlsx');
const fs = require('fs');

// 读取xlsx文件，在rawdata数组每个元素的第13索引处添加NO，生成result数组并返回
const readXlsxAndCount = function (xlsxFullpath) {

  // 导入xlsx
  const sheets = xlsx.parse(xlsxFullpath);

  // rawdata中每个元素为一个代表试验信息的数组
  let rawdata = [];
  sheets.forEach((sheet) => {
    for (let rowId in sheet['data']) {
      let row = sheet['data'][rowId];
      if (row.length !== 0) {
        rawdata.push(row);
      }
    }
  });
  // console.log(rawdata);

  let result = [];

  // 获取所有产品
  let allProducts = [];
  for (let trial of rawdata) {
    if (!allProducts.includes(trial[1])) {
      allProducts.push(trial[1]);
    }
  }
  console.log(allProducts);

  // 迭代所有产品
  for (let product of allProducts) {

    // 获取当前产品的所有试验
    let allTrialsOfCurrentProduct = [];
    // 获取当前产品的所有分期
    let allPhasesOfCurrentProduct = [];
    for (let trial of rawdata) {
      if (trial[1] === product) {
        allTrialsOfCurrentProduct.push(trial);
        if (!allPhasesOfCurrentProduct.includes(trial[2])) {
          allPhasesOfCurrentProduct.push(trial[2]);
        }
      }
    }
    // console.log(allTrialsOfCurrentProduct)
    // console.log(allPhasesOfCurrentProduct)

    // 迭代当前产品的所有分期
    for (let phase of allPhasesOfCurrentProduct) {
      // 迭代当前产品的所有试验并编号
      let i = 1;
      for (let trial of allTrialsOfCurrentProduct) {
        if (trial[2] === phase) {
          trial[13] = i;
          i = i + 1;
          // 将添加了编号的试验存入result数组
          result.push(trial);
        }
      }
    }

  }
  // console.log(result);

  return result;

};

// 导出为CSV
// let csvHeader = '\ufeff';
// let nameRow = 'Compound Name, Phase, Count, Global\n';
// let csvContent = csvHeader + nameRow;
// for (let trial of result) {
//   let currentStr = '"' + trial.join('","') + '"' + '\n';
//   csvContent = csvContent + currentStr;
// }
// fs.writeFile('./result.csv', csvContent, (error) => {
//   console.error(error);
// });

module.exports = { readXlsxAndCount };







