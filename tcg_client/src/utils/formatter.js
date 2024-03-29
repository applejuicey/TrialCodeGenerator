import { message } from 'ant-design-vue';
import country from "country-list-js";
import { compounds } from './compounds.js';

const formatColumnName = function (value) {
  const columnNameMap = new Map();
  columnNameMap.set('trialStatus', 'Status')
    .set('trialGenerationDate', 'Time Stamp')
    .set('trialCompoundName', 'Compound Name')
    .set('trialPhase', 'Phase')
    .set('trialCounterNumber', 'NO.')
    .set('trialCountryCode', 'Country');
  return columnNameMap.get(value);
};

const formatSortOrderName = function (value) {
  const sortOrderNameMap = new Map();
  sortOrderNameMap.set('ASC', 'Ascending')
    .set('DESC', 'Descending');
  return sortOrderNameMap.get(value);
};

const formatTrialPhase = function (value) {
  const phaseMap = new Map();
  phaseMap.set('p0', '0')
    .set('p1', 'I').set('p21', 'I/II').set('p31', 'I/III')
    .set('p2', 'II').set('p2a', 'IIa').set('p2b', 'IIb').set('p32', 'II/III')
    .set('p3', 'III').set('p3a', 'IIIa').set('p3b', 'IIIb')
    .set('p4', 'IV')
    .set('p0na', 'NA');
  return phaseMap.get(value);
}

const formatUserType = function (value) {
  const userTypeMap = new Map();
  userTypeMap.set('t0', 'root').set('t1', 'admin')
    .set('t2', 'user').set('t3', 'readonly');
  return userTypeMap.get(value);
}

const formatTrialUniqueSequenceCode = function (value) {
  let stringifiedSequenceCode = value.toString();
  if (stringifiedSequenceCode.length === 1 ) {
    return '0' + stringifiedSequenceCode;
  } else {
    return stringifiedSequenceCode;
  }
}

const formatTrialCode = function (trialRecord) {
  return trialRecord.trialCompoundName + '-' + trialRecord.trialPhase.substr(1, 1) +
    formatTrialUniqueSequenceCode(trialRecord.trialUniqueSequenceCode);
}

const standardiseTrialCompoundName = function (name) {
  try {
    if (!name || !(compounds.includes(name) || compounds.includes(name.trim().toUpperCase()))) {
      throw new Error();
    }
    return {
      status: true,
      result: name.trim().toUpperCase()
    };
  } catch (error) {
    message.error('Please provide a valid compound name!', 6);
    return {
      status: false,
    };
  }
}

const standardiseTrialCountryCode = function (countryCode) {
  let initialUpperCase = (someString) => {
    someString = someString.toLowerCase();
    let [initial, ...rest] = someString;
    return initial.toUpperCase() + rest.join('');
  };
  let finalResultArray = [];
  try {
    countryCode.split(',').forEach((item) => {
      if (['INT', 'INTERNATIONAL'].includes(item.trim().toUpperCase())) {
        finalResultArray.push('INT');
        return;
      }
      let foundCountryByISO3 = country.findByIso3(item.trim().toUpperCase());
      if (foundCountryByISO3) {
        finalResultArray.push(item.trim().toUpperCase());
        return;
      }
      let foundCountryByName = country.findByName(initialUpperCase(item.trim()));
      if (foundCountryByName) {
        finalResultArray.push(foundCountryByName.code.iso3.trim());
        return;
      }
      finalResultArray.push(item.trim());
      message.error(`The country '${ item.trim() }' cannot be found according to ISO 3166. Please confirm your input!`, 6);
      throw new Error();
    })
    return {
      status: true,
      result: finalResultArray.join(','),
    };
  } catch (error) {
    message.error('Please provide a valid 3-letter country code or country name according to the ISO-3166!', 6);
    return {
      status: false,
      result: finalResultArray.join(','),
    };
  }
}

export {
  formatColumnName,
  formatSortOrderName,
  formatTrialPhase,
  standardiseTrialCompoundName,
  standardiseTrialCountryCode,
};