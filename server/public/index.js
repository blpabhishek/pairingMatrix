var Height = 700;
var Width = 800;
var margin = 100;
var degreeFactor = 180 / Math.PI;
var circumferenceRadius = 300;
var colors = d3.scaleOrdinal(d3.schemeCategory20);
var searchParams = new URL(document.location).searchParams;
var repo = searchParams.get('repo');

var individualCommitScale = d3.scaleLinear()
  .domain([0, 30])
  .range([0, 10]);

function showPairingMatrix(individuals, pairData, committers) {
  var svg = d3.selectAll(".chartArea").append("svg")
    .attr("height", Height)
    .attr("width", Width);

  var matrixGroup = svg.append('g')
    .attr("transform", "translate(400, 350)");

  matrixGroup.append("circle")
    .attr("class", "circumference");

  matrixGroup.selectAll(".connection")
    .data(pairData)
    .enter()
    .append("path")
    .attr("class", "connection")
    .attr("id", function (d) {
      return d.pair.join('_')
    })
    .attr("d", function (d) {
      return "M " + getCoordinate(d.pair[0], committers).x + " " + getCoordinate(d.pair[0], committers).y + " Q 0 -20 " +
        getCoordinate(d.pair[1], committers).x + " " + getCoordinate(d.pair[1], committers).y;
    })
    .attr("stroke-width", function (d) {
      return individualCommitScale(d.commits)
    });

  var devs = matrixGroup.selectAll(".individual")
    .data(committers)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      return getCoordinate(d, committers).x
    })
    .attr("cy", function (d, i) {
      return getCoordinate(d, committers).y
    })
    .attr("class", "individual")
    .attr("id", function (d) {
      return d
    })
    .attr("fill", colors)
    .attr("stroke", "red")
    .attr("stroke-width", function (d) {
      return individualCommitScale(getNumberOfCommitsOf(d, individuals))
    })
    .attr('id', function (d) {
      return d
    })
    .on('mouseover', function (id) {
      mouseOver(id, individuals, pairData)
    })
    .on('mouseout', function (id) {
      mouseOut(id, individuals, pairData)
    });

  matrixGroup.selectAll("text")
    .data(committers).enter()
    .append("text")
    .attr("x", function (d, i) {
      return getCoordinate(d, committers).x - 29 + 'px'
    })
    .attr("y", function (d, i) {
      return getCoordinate(d, committers).y + 35 + 'px'
    })
    .text(function (d) {
      return d
    })
    .attr("fill", "black")

}

function getAllPairsContaining(name, pairDataArray) {
  return pairDataArray.filter(function (pairData) {
    var pairedPeople = pairData.pair.map(function (person) {
      return person.toLowerCase()
    });
    return pairedPeople.indexOf(name) >= 0
  })
}

function toggleClass(newClass, pair) {
  for (ii = 0; ii < 2; ii++) {
    d3.selectAll($("#" + pair[ii].toLowerCase()))
      .attr("class", newClass)
  }
}

function mouseOut(id, individuals, pairData) {
  var pairedPeople = getAllPairsContaining(id, pairData);
  pairedPeople.forEach(function (pairedPerson) {
    toggleClass("individual", pairedPerson.pair);
    var pairId = pairedPerson.pair.join('_');
    d3.selectAll($("#" + pairId))
      .attr("class", "connection")
  })
}

function mouseOver(id, individuals, pairData) {
  var pairedPeople = getAllPairsContaining(id, pairData);
  pairedPeople.forEach(function (pairedPerson) {
    toggleClass("individualLarge", pairedPerson.pair)
    var pairId = pairedPerson.pair.join('_');
    d3.selectAll($("#" + pairId))
      .attr("class", "connectionLarge")
  })
}

function getNumberOfCommitsOf(person, individuals) {
  var commits = 0;
  individuals.forEach(function (individual) {
    if (individual.pair[0].toLowerCase() === person.toLowerCase())
      commits = individual.commits;
  });
  return commits;
}

function getIndexOf(name, committers) {
  var index = 0;
  committers.forEach(function (committer, i) {
    if (committer.toLowerCase() === name.toLowerCase()) index = i
  });
  return index;
}

function getCoordinate(name, committers) {
  var index = getIndexOf(name, committers);
  var angle = 2 * Math.PI / committers.length;
  return {
    x: circumferenceRadius * Math.sin(angle * (index)),
    y: circumferenceRadius * Math.cos(angle * (index))
  };
}

function setWeeks() {
  for (var i = 1; i <= 10; i++) {
    $('#weeks').append($('<option />').val(i).html(i))
  }
}

function show() {
  var weeks = $('#weeks')[0].value + ' weeks ago';
  $('.chartArea')[0].innerHTML = "";
  $.post('commits', { weeks: weeks, repo: repo }, function (res) {
    showPairingMatrix(res.individuals, res.validPairs, res.committers);
  })
}

$(document).ready(function () {

  setWeeks();

  $.post('commits', { weeks: '1 weeks ago', repo: repo }, function (res) {
    showPairingMatrix(res.individuals, res.validPairs, res.committers);
  });
});