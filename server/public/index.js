var Height = 700;
var Width = 800;
var margin = 100;
var degreeFactor = 180 / Math.PI;
var circumferenceRadius = 300;
var colors = d3.scaleOrdinal(d3.schemeCategory20);

var indivisualCommitScale = d3.scaleLinear()
	.domain([0, 30])
	.range([0, 10]);

function showPairingMatrix(indivisuals, pairData, committers) {
	var svg = d3.selectAll(".container").append("svg")
		.attr("height", Height)
		.attr("width", Width)

	var matrixGroup = svg.append('g')
		.attr("transform", "translate(400, 350)")

	matrixGroup.append("circle")
		.attr("class", "circumference")

	matrixGroup.selectAll(".connection")
		.data(pairData)
		.enter()
		.append("path")
		.attr("class", "connection")
		.attr("d", function(d) {
			return "M " + getCoordinate(d.pair[0], committers).x + " " + getCoordinate(d.pair[0], committers).y + " Q 0 -20 " +
                    getCoordinate(d.pair[1], committers).x + " " + getCoordinate(d.pair[1], committers).y;
		})
		.attr("stroke-width", function(d) {return indivisualCommitScale(d.commits)})
		
	var devs = matrixGroup.selectAll(".indivisual")
		.data(committers)
		.enter()
		.append("circle")
		.attr("cx", function(d, i) { return getCoordinate(d, committers).x})
		.attr("cy", function(d, i) { return getCoordinate(d, committers).y})
		.attr("class", "indivisual")
		.attr("fill", colors)
		.attr("stroke", "red")
		.attr("stroke-width", function(d) {
			return indivisualCommitScale(getNumberOfCommitsOf(d, indivisuals))
		})

	matrixGroup.selectAll("text")
		.data(committers).enter()
		.append("text")
		.attr("x", function(d, i) { return getCoordinate(d, committers).x})
		.attr("y", function(d, i) { return getCoordinate(d, committers).y})
		.text(function(d){ return d})
		.attr("fill", "black")

}

function getNumberOfCommitsOf(person, indivisuals) {
	var commits = 0;
	indivisuals.forEach(function(indivisual) {
		if(indivisual.pair[0].toLowerCase() == person.toLowerCase())
			commits = indivisual.commits;
	});
	return commits;
}

function getIndexOf(name, committers) {
	var index = 0;
	committers.forEach(function(committer, i) {
		if(committer.toLowerCase() == name.toLowerCase()) index = i
	})
	return index;
}

function getCoordinate(name, committers) {
	var index = getIndexOf(name, committers);
	var angle = 2 * Math.PI / committers.length;
	return {x: circumferenceRadius * Math.sin(angle * (index)),
			y: circumferenceRadius * Math.cos(angle * (index))};
}

function setWeeks() {
	for (var i = 1; i <= 10; i++) {
		$('#weeks').append($('<option />').val(i).html(i))
	}
}

function show() {
	var weeks = $('#weeks')[0].value
	$('.chartArea')[0].innerHTML = "";
	$.post('commits', { weeks: weeks }, function(res) {
		showPairingMatrix(res.indivisuals, res.validPairs, res.committers);
	})
}

$(document).ready(function() {

	setWeeks();

	$.post('commits', {weeks: '1'}, function(res) {
		showPairingMatrix(res.indivisuals, res.validPairs, res.committers);
	});
})