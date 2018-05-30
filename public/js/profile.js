/*jshint esversion: 6*/
$(document).ready(() => {
  var URL;
  var ACCESS_TOKEN;
  var USER_ID;

  if (!window.location.hash) {
    var r = confirm('Connect to Fitbit.com?\n' +
      'Click OK to continue\nOr cancel to go back to home page.');
    if (r == true) {
      window.location.replace('/connect');
    } else {
      window.location.replace('/home');
    }
  } else {
    URL = window.location.href;
    ACCESS_TOKEN = URL.split('#')[1].split('=')[1].split('&')[0];
    USER_ID = URL.split('#')[1].split('=')[2].split('&')[0];
    $.ajax({
      url: 'https://api.fitbit.com/1/user/' + USER_ID + '/profile.json',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + ACCESS_TOKEN,
      },
      dataType: 'json',
      success: (data) => {
        $('#user_name').text(data.user.fullName);
        $('#user_age').text(data.user.age);
        $('#user_gender').text(data.user.gender);
        $('#user_height').text(data.user.height.toFixed() + '\"');
        $('#user_weight').text(data.user.weight + ' kg');
      },
    });

    var chart1 = c3.generate({
      bindto: '#chart1',
      padding: {
        right: 30,
      },
      data: {
        x: 'dates',
        columns: [
          ['dates'],
          ['steps'],
        ],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%m/%d/%y',
          },
        },
      },
      legend: {
        show: false,
      },
    });

    $.ajax({
      url: 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1w.json',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + ACCESS_TOKEN,
      },
      dataType: 'json',
      success: (data) => {
        var steps = ['steps'];
        var dates = ['dates'];
        data['activities-steps'].forEach((e) => {
          steps.push(parseInt(e.value));
          dates.push(e.dateTime);
        });
        chart1.load({
          columns: [
            dates,
            steps,
          ],
        });
        chart1.show(['steps']);
      },
    });
  }
});
