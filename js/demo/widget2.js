$(document).on('nifty.ready', function() {


    // REALTIME FLOT CHART
    // =================================================================
    // Require Flot Charts
    // -----------------------------------------------------------------
    // http://www.flotcharts.org/
    // =================================================================
    // We use an inline data source in the example, usually data would
    // be fetched from a server

    var data = [],  totalPoints = 100;

    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);

        // Do a random walk

        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;

            if (y < 20) {
                y = 30;
            } else if (y > 100) {
                y = 100;
            }

            data.push(y);
        }

        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        return res;
    }

    // Set up the control widget
    var updateInterval = 750;
    var flotOptions = {
        series: {
            lines: {
                lineWidth: 1,
                show: true,
                fill: true,
                fillColor : "#d8d9d9"
            },
            color: '#cccccc',
            shadowSize: 0	// Drawing is faster without shadows
        },
        yaxis: {
            min: 0,
            max: 110,
            ticks: 30,
            show: false
        },
        xaxis: {
            show: false
        },
        grid: {
            hoverable: true,
            clickable: true,
            borderWidth: 0
        },
        tooltip: false,
        tooltipOpts: {
            defaultTheme: false
        }
    }


    var plot = $.plot("#demo-realtime-chart", [ getRandomData() ], flotOptions);
	var plot2 = $.plot("#demo-realtime-chart2", [ getRandomData() ], flotOptions);
	var plot5 = $.plot("#demo-realtime-chart5", [ getRandomData() ], flotOptions);
    function update() {
        plot.setData([getRandomData()]);

        // Since the axes don't change, we don't need to call plot.setupGrid()

        plot.draw();
        setTimeout(update, updateInterval);
    }
	function update2() {
        plot2.setData([getRandomData()]);

        // Since the axes don't change, we don't need to call plot.setupGrid()

        plot2.draw();
        setTimeout(update2, updateInterval);
    }
	function update5() {
        plot5.setData([getRandomData()]);

        // Since the axes don't change, we don't need to call plot.setupGrid()

        plot5.draw();
        setTimeout(update5, updateInterval);
    }
    update();
	update2();
    update5();
});
