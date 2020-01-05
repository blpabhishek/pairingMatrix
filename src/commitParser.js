const _ = require('lodash');

class CommitsParser {
  constructor(regex) {
    this.regex = regex;
  }

  parse(messages) {
    const pairs = this.getPairs(messages);
    return {
      individuals: getIndividuals(pairs),
      validPairs: parseCommitPairsWithTotalCommits(pairs),
      committers: getAllCommitters(pairs)
    }
  }

  getPairs(messages) {
    return messages.map((msg) => {
      const pair = [];
      const matches = this.regex.exec(msg);
      if (matches && matches[1]) pair.push(matches[1]);
      if (matches && matches[2]) pair.push(matches[2]);
      this.regex.lastIndex = 0;
      return pair;
    })
  }
}

function parseCommitPairsWithTotalCommits(pair) {
  const pairs = validPairs(pair);
  return getCommittersWithCommits(pairs);
}

function getIndividuals(pairs) {
  const individuals = pairs.filter(function (pair) {
    return pair.length === 1
  });
  return getCommittersWithCommits(individuals);
}

function validPairs(pairs) {
  return pairs.filter(function (pair) {
    return pair.length === 2;
  })
}

function getAllCommitters(pairs) {
  const lowerCasedPairs = _.flatten(pairs).map(function (indivisual) {
    return indivisual.toLowerCase();
  });
  return _.uniq(lowerCasedPairs);
}

function getCommittersWithCommits(pairs) {
  const pairingData = {};
  pairs.forEach(function (pair) {
    if (pairingData[JSON.stringify(pair)])
      pairingData[JSON.stringify(pair)]++;
    else
      pairingData[JSON.stringify(pair)] = 1;
  });
  return Object.keys(pairingData).map(function (pair) {
    return {pair: JSON.parse(pair), commits: pairingData[pair]};
  });
}

module.exports = CommitsParser;