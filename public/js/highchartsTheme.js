/**
 * Stocard theme for Highcharts JS
 * based on the
 * Sand-Signika theme for Highcharts JS
 * @author Torstein Honsi
 */

// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function(proceed) {
    proceed.call(this);
});

Highcharts.global

Highcharts.theme = {
    colors: ['#F8A295', '#94C6B3', '#9F959F', '#C6C6D1', '#5E5A72','#E75453', '#D7DFD7', '#B35757', '#FFDEC9'],
    exporting: {
        buttons: {
            contextButton: {
                theme: {
                    'stroke-width': 0,
                    stroke: 'none',
                    fill: 'none',
                    r: 0,
                    states: {
                        hover: {
                            'stroke-width': 1,
                            stroke: '#dddddd',
                            fill: '#FFFFFF'
                        },
                        select: {
                            'stroke-width': 1,
                            stroke: '#dddddd',
                            fill: '#FFFFFF'
                        }
                    }
                }
            }
        }
    },
    chart: {
        backgroundColor: null,
        style: {
            fontFamily: '-apple-system, system, Helvetica Neue, serif'
        },
        zoomType: "x"
    },
    title: {
        style: {
            margin: '30px 0 20px',
            'font-weight': '400',
            'font-size': '25px',
            color: '#000',
            fill: '#000'
        },
        align: "left"
    },
    labels: {
        style: {
            fontSize: '8px'
        }
    },
    subtitle: {
        style: {
            color: 'black'
        }
    },
    tooltip: {
        borderWidth: 0,
        xDateFormat: '%Y-%m-%d %H:%M',
        shared: false
    },
    legend: {
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '10px'
        },
        margin: 30
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        labels: {
            step: 1,
            rotation: 45,
            startOfWeek: 0,
            startOnTick: false,
            formatter: function() {
                return Highcharts.dateFormat('%Y-%m-%d %H:%M', this.value);
            },
            style: {
                color: '#6e6e70',
                fontSize: '8px'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#6e6e70'
            }
        },
        floor: 0,
        min: 0,
        max: 1,
        minorGridLineDashStyle: 'longdash',
        minorTickInterval: 'auto',
        minorTickWidth: 0
    },
    plotOptions: {
        series: {
            shadow: false,
            marker: {
                radius: 4,
                symbol: "circle"
            },
            lineWidth: 3,

        },
        candlestick: {},
        map: {
            shadow: false
        },
        area: {
            shadow: false,
            dataLabels: {
                enabled: false,
                y: -8
            },
            fillOpacity: 0.2,
            enableMouseTracking: true
        },
        line: {
            shadow: false,
            dataLabels: {
                enabled: false,
                y: -8
            },
            enableMouseTracking: true
        }
    },

    // Highstock specific
    navigator: {
        xAxis: {
            gridLineColor: '#D0D0D8'
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: 'white',
            stroke: '#C0C0C8',
            'stroke-width': 1,
            states: {
                select: {
                    fill: '#D0D0D8'
                }
            }
        }
    },
    scrollbar: {
        trackBorderColor: '#C0C0C8'
    },

    // General
    background2: '#E0E0E8',
    "global": {
        timezoneOffset: -1 * 60
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);