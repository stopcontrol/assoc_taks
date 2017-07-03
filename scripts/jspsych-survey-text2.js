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

        plugin.trial = function(display_element, block, trial, part) {
            var startTime = (new Date()).getTime();
            // add likert scale questions

            for (var i = 0; i < trial.questions.length; i++) {
                // create div
                display_element.append($('<div>', {
                    "id": 'surveytext' + i,
                    "class": 'surveyquestion'
                }));

                // add question text
                $("#surveytext" + i).append('<p class="surveytext">' + trial.questions[i] + '</p>');

                // add text box
                $("#surveytext" + i).append('<textarea name="textarea" style="width:40px;height:100px;"></textarea>');
            }
            // record each keystroke
            //var IndiTime = 0;
            var AssoTimes = [];
            //$('textarea').keypress(function (e) {
            //  if (e.which === 188) {
            //    IndiTime = (new Date()).getTime()
            //    AssoTimes.push(IndiTime-startTime)
            //  }
            //});
            $('textarea').keyup(function (e) {
              if (e.keyCode === 188) {
                IndiTime = (new Date()).getTime()
                AssoTimes.push(IndiTime-startTime)
              }
            });
            setTimeout(function () {block.next()}, 90000);
			      // add submit button
            display_element.append($('<button>', {
                'id': 'next',
                'class': 'surveytext'
            }));
            $("#next").html('Weiter');
            $("#next").click(function() {
                // measure response time
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
            });



        };

        return plugin;
    })();
})(jQuery);
