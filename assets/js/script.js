let provinsi = {};
let villages = {};

async function loadAllMapData() {
    const urls = [
        'data/91/91.geo.json',
        'data/92/92.geo.json',
        'data/93/93.geo.json',
        'data/94/94.geo.json',
        'data/95/95.geo.json',
        'data/96/96.geo.json',
    ];
    try {
        // Memuat data provinsi dari file GeoJSON
        const responses = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
        provinsi = responses[0];
        for (let i = 1; i < responses.length; i++) {
            provinsi.features = provinsi.features.concat(responses[i].features);
        }

        // Inisialisasi peta dengan data yang dimuat
        initializeChart();
    } catch (error) {
        console.error("Gagal memuat data map: ", error);
    }
}


function initializeChart() {
    Highcharts.mapChart('container', {
        // Pengaturan navigasi dan data peta
        title: {
            text: 'Peta Provinsi'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        colorAxis: {
            min: 0
        },
        plotOptions: {
            map: {
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}'
                }
            }
        },
        series: [{
            data: provinsi.features.map(feature => {
                return {
                    code: feature.properties.code,
                    name: feature.properties.name,
                    value: (feature.properties.code * 12345) % 100,
                };
            }),
            mapData: provinsi,
            joinBy: 'code',
            name: 'Provinsi',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
        }],
    });
}

// Memulai proses memuat data
loadAllMapData();