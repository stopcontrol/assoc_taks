/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw (March 2013)
 * Updated October 2013
 *
 * parameters:
 *      questions: array of arrays. inner arrays are arrays of strings, where each string represents a prompt
 *                  for the user to respond to.
 *      data: optional data object
 *
 */

(function($) {
    jsPsych['survey-text2'] = (function() {

        var plugin = {};

        plugin.create = function(params) {
            var trials = [];

            for (var i = 0; i < params.questions.length; i++) {

                trials.push({
                    type: "survey-text2",
                    questions: params.questions[i],
                    data: (typeof params.data === 'undefined') ? {} : params.data[i]
                });
            }
            return trials;
        };
	    //timeLeft = 5;
	    //if(timeLeft<0){timeLeft=5};
        plugin.trial = function(display_element, block, trial, part) {
            timeLeft = 121;


			var startTime = (new Date()).getTime();

			// add likert scale questions

            for (var i = 0; i < trial.questions.length; i++) {
                // create div
                display_element.append($('<div>', {
                    "id": 'surveytext' + i,
                    "class": 'surveyquestion'
                }));
				var df = 'Stimulus: ';//+ (block.trial_idx+1) +' / 2 :';
                // add question text
                $("#surveytext" + i).append('<p> ' + df + '</p>');
				$("#surveytext" + i).append('<p> <strong> <font size="6.5"  class="surveytext"  </font size>' + trial.questions[i] + '</strong></p>');
				$("#surveytext" + i).append('<p> Dr&uumlcke Enter nach jeder Assoziation/Idee:');
                // add text box
                $("#surveytext" + i).append('<textarea autofocus id="message" name="textarea" style="width:70px;height:200px;"></textarea>');

                // add countr box
				$("#surveytext" + i).append('<p> <i></i></p>');
				$("#surveytext" + i).append(' <font size="3" color="black">Verbleibende Sekunden: </font>');
                $("#surveytext" + i).append(' <input  id="time" size="3"></input>');

            }
            // record each keystroke
            //var IndiTime = 0;
            var AssoTimes = [];

            $('textarea').keyup(function (e) {
              if (e.keyCode === 13) {
                IndiTime = (new Date()).getTime()
                AssoTimes.push(IndiTime-startTime)
                console.log('Assotime= ' + AssoTimes);
              }
            });

            //setTimeout(function () {block.next()}, 3000);
			      // add submit button
			function init()
			{
			    document.getElementById("message").focus();
			};
			init();
			setTimeout(function (){

				timeLeft=121;
				var endTime = (new Date()).getTime();
                var response_time = endTime - startTime;
                AssoTimes.push(endTime-startTime);
                // create object to hold responses
                var question_data = {};
                $("div.surveyquestion").each(function(index) {
                    var id = "Q" + index;
                    var val = $(this).children('textarea').val();
                    var obje = {};
                    obje[id] = val;
                    $.extend(question_data, obje);
                });

                // save data
                block.writeData($.extend({}, {
                    "trial_type": "survey-text2",
                    "trial_index": block.trial_idx,
                    "rt": response_time,
                    //"er":IndiTime,
                    "Assotimes": AssoTimes
                }, question_data, trial.data));

                display_element.html('');

                // next trial
                block.next();
				//});
			}, 120000);



        };

        return plugin;
    })();
})(jQuery);
