maptilersdk.config.apiKey = "XkDppi6mYJTHOxZ11CU7";

//making a custom data - for the maptiler to recognize the data, the data should be an object with features as one of its key. It should be an array of objects. The nested objects should have geometry as one of its key that contains the type and coordinates keys and properties as its another key which contains the details about the point (for creating the pop-ups). The whole data should be in GeoJSON format
const places = {
    "features": [
        {
            "properties": {
                "name": "Piravom",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    76.49226799607277,
                    9.873369124422851]
            }
        },
        {
            "properties": {
                "name": "Elanji",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [76.54437962919474, 9.831149118989908]
            }
        },
        {
            "properties": {
                "name": "Mulakulam",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [76.49334003370643, 9.843592103657778]
            }
        },
        {
            "properties": {
                "name": "Mutholapuram",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [76.57005943357944, 9.83252767780744]
            }
        },
        {
            "properties": {
                "name": "Koothattukulam",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [76.59568794071674, 9.86159566051782]
            }
        },
        {
            "properties": {
                "name": "Velloor",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [76.45362842828035, 9.831847483796551]
            }
        },
        {
            "properties": {
                "name": "Thalayolaparambu",
            },
            "geometry": {
                "type": "Point",
                "coordinates": [76.4474905282259, 9.785558303473739]
            }
        }
    ]
}

// map.on is an event listener
// cluster - points grouped together
// unclustered-point - single point
// here our data is named places - if it is something else, add that name where-ever "places" is inserted
// addLayer is responsible for the appearances (style and displaying of contents)
// addSource - defining the source

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: [76.49226799607277, 9.873369124422851], // piravom
    zoom: 7
});

map.on('load', function () {
    map.addSource('places', {
        type: 'geojson',
        data: places,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
            // with three steps to implement three types of circles: as the count increase the number, the color changes
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00BCD4',
                3,              // the count breakpoint
                '#2133f3ff',
                5,              // the count breakpoint
                '#4ad24dff'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                3,  // the count breakpoint, others are the radius unit
                20,
                5,  // the count breakpoint
                25
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'places',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('places').getClusterExpansionZoom(clusterId);
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
        const { name } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(name)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
    });
});

