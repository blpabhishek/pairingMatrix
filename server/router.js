const express = require('express');
const bodyParser = require('body-parser');
const CommitProvider = require('../src/commitDataProvider');
const CommitFetcher = require('../src/commitFetcher');
const yml = require('js-yaml');
const fs = require('fs');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/lib'));

  app.post('/commits', function (req, res) {
    let config = {
      regexp: /\|([\w]*)(?:\/)?([\w]*)\|/
    };
    try {
      config = yml.safeLoad(fs.readFileSync('config.yml', 'utf8'))
      console.log(config);
    } catch (err) {
      console.log(err.message);
      console.log("Using default regexp - |story#|Pair1/Pair2| message");
    }
    const weeks = req.body.weeks;
    const repo = req.body.repo;
    console.log('fetch ' + weeks + ' commits for repo ' + (repo || '.'));
    const commitFetcher = new CommitFetcher(weeks);
    const commitProvider = new CommitProvider(commitFetcher, new RegExp(config.regexp, 'gi'));
    const commits = commitProvider.getCommits(repo);
    res.send(commits);
  });
};