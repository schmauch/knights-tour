KNIGHT = {
	
	start: 0,
	steps: new Array(),
	
	/**
	* Brett initialisieren
	*/	
	init: function () {

		for(var i=0;i<64;i++) {

			field = $('<div></div>');
			field.attr('id', i);
			field.addClass('field possibility');

			if(((Math.floor(i/8) + i) % 2) == 0) {
				field.addClass('black')
			} else {
				field.addClass('white');
			}
			
			$('#fields').prepend(field);
		}
				
		knight = $('<img src="knight.png" id="knight" />');
		
		$('.field').click(function () {
			KNIGHT.moveTo($(this).attr('id'));
		});
	},
	

	/**
	 * Startet eine neue Tour
	 */
	startNewTour: function () {

		/* alles zurücksetzen */
		KNIGHT.steps.length = 0;
		$('.field').text('');
		$('.field').addClass('possibility');
		$('#steps').text('');
		
		KNIGHT.steps.length = 0;
		
		/* Springer auf Startpunkt positionieren */
		KNIGHT.start = Math.floor(Math.random() * 63);
		
		KNIGHT.moveTo(KNIGHT.start);
	},
	
	/**
	 * Bewegt den Springer auf die gewünschte Position
	 */
	moveTo: function(position) {

		if($('#'+position).hasClass('possibility')) {
			
			// Springer bewegen
			$('#knight').remove();	
			$('#'+position).append(knight);
			
			var nSteps = KNIGHT.steps.length + 1;

			$('#'+position).append('<b>'+nSteps+'</b>');
			KNIGHT.steps.push(position);
			KNIGHT.writeHistory();
			
			// Ende der Tour?
			if(KNIGHT.steps.length == 64) {
				KNIGHT.finish();
			}
			
			//Hilfen zurücksetzen
			$('.field').attr('data-next', '');
			$('.field').removeClass('possibility hint');

			KNIGHT.showPossibilities(position);
		}
	},
	
	
	/**
	 * Gibt alle Möglichkeiten zurück, wohin der Springer aus der angegebenen
	 * Position springen könnte.
	 */
	getPossibilities(position) {
		
		position = parseInt(position);
		var possibilities = new Array();
		var mod8 = position % 8;
		if(mod8 > 1) {
			possibilities.push(position +  6);
			possibilities.push(position - 10);
		}
		if(mod8 > 0) { 
			possibilities.push(position + 15);
			possibilities.push(position - 17);
		}
		if(mod8 < 6) {
			possibilities.push(position + 10);
			possibilities.push(position -  6);
		}
		if(mod8 < 7) { 
			possibilities.push(position + 17);
			possibilities.push(position - 15);
		}
		
		for(var i=possibilities.length - 1;i>=0;i--) {
			if($('#'+possibilities[i]+':empty').length == 0) {
				possibilities.splice(i, 1);
			}
		}
		
		return possibilities;
	},
	
	
	
	/**
	 * Zeigt alle Möglichkeiten an
	 */
	showPossibilities(position) {
		
		var possibilities = KNIGHT.getPossibilities(position);

		if(possibilities.length == 0 && KNIGHT.steps.length < 64) {
			alert('Du bist in einer Sackgasse gelandet');
		}
				
		for(var i=0;i<possibilities.length;i++) {
			$('#'+possibilities[i]).addClass('possibility');
		}
		
		if($('#help:checked').length > 0) {
			KNIGHT.showHelp(possibilities);
		}
	},
	
	
	
	/**
	 * Zeigt die Hilfe an (die beste/n der aktuellen Möglichkeiten)
	 */
	showHelp(possibilities) {
		var leastPossibilities = 8;
		var bestOptions = new Array();

		for(var i=0;i<possibilities.length;i++) {
			
			var nextPossibilities = KNIGHT.getPossibilities(possibilities[i]).length;
			
			$('#'+possibilities[i]).attr('data-next', nextPossibilities);
			
			if(nextPossibilities < leastPossibilities) {
				leastPossibilities = nextPossibilities;
			}
		}
		
		$('.possibility[data-next='+leastPossibilities+']').addClass('hint');
	},
	
	
	
	/**
	 * Geht einen Zug zurück
	 */
	oneStepBack: function () {

		if(KNIGHT.steps.length > 1) {

			var lastStep = KNIGHT.steps.pop();
			$('#'+lastStep+' *').remove();
			$('#'+lastStep).text('');
			
			var lastPosition = KNIGHT.steps.pop(); 
			$('#'+lastPosition).addClass('possibility');
			KNIGHT.moveTo(lastPosition);
		}

	},
	
	/**
	 * Gibt die Position in der Notation [A-H][1-8] an
	 */
	writeHistory: function () {
		var readableSteps = new Array();
		for(var index in KNIGHT.steps) {
			var notation = String.fromCharCode(KNIGHT.steps[index] % 8 + 65);
			notation += Math.floor(KNIGHT.steps[index]/8) + 1;
			readableSteps.push(notation);
		}
		$('#steps').text(readableSteps.join(', '));
	},
	
	finish: function () {
		position = KNIGHT.steps[KNIGHT.steps.length -1];
		
		x = Math.abs(Math.floor(KNIGHT.start /8) - Math.floor(position / 8));
		y = Math.abs((KNIGHT.start % 8) - (position % 8));
		
		var tour = 'offene'
		if(x+y == 3) {
			tour = 'geschlossene';
		}
		
		alert('Gratuliere! Du hast eine ' + tour + ' Tour gefunden');
	}
	
}

$().ready(function() {
	$('#no-js').hide();
	KNIGHT.init();
	KNIGHT.startNewTour();
	$('#help').change(function() {
		if(this.checked) {
			KNIGHT.showHelp(
				KNIGHT.getPossibilities(KNIGHT.steps[KNIGHT.steps.length - 1]));
		} else {
			$('.hint').removeClass('hint');
		}
	});
});