const assert = require('assert');
const CommitDataProvider = require('../../src/commitDataProvider');

describe('github data provider', () => {

  let dataFetcher;

  before(() => {
    dataFetcher = {
      fetch: function () {
        return ['c3x4211 |Abhishek| Adding package.json',
          'd3x8111 |Abhishek| Adding a gitignore file',
          'f3x2121 |Abhishek/Abhikur| Initial commit '
        ]
      }
    }
  });

  it('should get commits data', () => {

    const regex = /\|\w*\/\w*\||\|\w*\|/gi;
    const commitDataProvider = new CommitDataProvider(dataFetcher, regex);

    const data = commitDataProvider.getCommits();

    assert.equal(data.individuals.length, 1);
    assert.equal(data.individuals[0].pair[0], 'Abhishek');
    assert.equal(data.individuals[0].commits, 2);

    assert.equal(data.validPairs.length, 1);
    assert.equal(data.validPairs[0].pair[0], 'Abhishek');
    assert.equal(data.validPairs[0].pair[1], 'Abhikur');
    assert.equal(data.validPairs[0].commits, 1);

    assert.equal(data.committers.length, 2);

  });
});
