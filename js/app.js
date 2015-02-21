/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

$(function(){

    var model = {
        init: function(){
            this.attendance = JSON.parse(localStorage.attendance);
        },

        saveNewAttendance: function(newAttendance){
            localStorage.attendance = JSON.stringify(newAttendance);
        }
    };

    var controller = {
        init: function(){
            model.init();
            view.init();
        },

        getAttendance: function(){
            return model.attendance;
        },

        saveNewAttendance: function(newAttendance){
            model.saveNewAttendance(newAttendance);
        }

        
    };

    var view = {
        init: function(){
            // Check boxes, based on attendance records
            var attendance = controller.getAttendance();
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });

            this.render();

            // On box check, add information to model and render page again
            var $allCheckboxes = $('tbody input');
            $allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                controller.saveNewAttendance(newAttendance);
                view.render();
            });
        },

        render: function(){
            // Count days missed and update column
            $allMissed = $('tbody .missed-col');
            $allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        }
    };

    controller.init();

});

