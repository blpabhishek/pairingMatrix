const shell = require('shelljs');

class CommitFetcher {
  constructor(since) {
    this.since = since;
  }

  fetch(dir) {
    let gitLogCommand = "git log --oneline --since='" + this.since + "'";
    if (dir)
      gitLogCommand = 'cd ' + dir + '&&' + gitLogCommand;

    const commitsString = shell.exec(gitLogCommand, { silent: true }).stdout;
    const commits = commitsString.split('\n');
    commits.pop();
    return commits;
  }
}

module.exports = CommitFetcher;