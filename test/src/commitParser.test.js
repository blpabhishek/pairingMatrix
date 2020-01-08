const assert = require('assert');
const CommitsParser = require('../../src/commitParser');

function contains(element, elements) {
  return elements.indexOf(element) >= 0;
}

describe('commitsParser', () => {

  let messages = [],
    regexp = /\s+([\w]*)?(?:\s*,\s*)?([\w]*)\s*\|/;

  before(() => {
    messages = [
      'b3e567y [#21] Abhikur | first commit',
      '4ega564 [#22] Abhikur,Abhishek | second message',
      '2e67s88 [#23] Abhi, Abhishek | third commit',
      '3b342d4 [#24] Abhi , Abhishek | fourth commit'
    ];
  });

  it('should get all the pairs including non valid', () => {
    const commitsParser = new CommitsParser(regexp);
    const allPairs = commitsParser.getPairs(messages);

    assert.equal('Abhikur', allPairs[0][0]);
    assert.equal('Abhishek', allPairs[1][1]);
    assert.equal('Abhi', allPairs[2][0]);
  });

  it('should get individuals with commits', () => {
    const commitsParser = new CommitsParser(regexp);
    const parsedData = commitsParser.parse(messages);

    assert.equal(parsedData.individuals.length, 1);
    assert.equal(parsedData.individuals[0].pair.length, 1);
    assert.equal(parsedData.individuals[0].commits, 1);
    assert.equal(parsedData.individuals[0].pair[0], 'Abhikur');
  });

  it('should get only valid pairs along with total number of commits', () => {
    const commitsParser = new CommitsParser(regexp);
    const validPairs = commitsParser.parse(messages).validPairs;

    assert.equal(validPairs[0].pair[0], 'Abhikur');
    assert.equal(validPairs[0].pair[1], 'Abhishek');
    assert.equal(validPairs[1].pair[0], 'Abhi');
    assert.equal(validPairs[1].pair[1], 'Abhishek');
    assert.equal(validPairs[0].commits, 1);
    assert.equal(validPairs[1].commits, 2);
  });

  it('should get all committers in the repo', () => {
    const commitsParser = new CommitsParser(regexp);
    const committers = commitsParser.parse(messages).committers;
    assert.equal(committers.length, 3);
    assert.ok(contains('abhikur', committers));
    assert.ok(contains('abhi', committers));
    assert.ok(contains('abhishek', committers));
  })

});