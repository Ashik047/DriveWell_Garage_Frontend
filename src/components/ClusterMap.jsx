import React, { useEffect, useMemo, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
// import { branches } from "../constants/branches"
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { getAllBranchesApi } from "../api/branchApi";
import { useQuery } from "@tanstack/react-query";

const ClusterMap = ({ allBranches }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const API_KEY = import.meta.env.VITE_MAPTILER_API;
    const defaultCenter = [76.49226799607277, 9.873369124422851];

    const branchDetails = useMemo(() => allBranches, [allBranches]);

    const branches = {
        "features": allBranches?.filter(branch =>
            branch.longitude != null && branch.latitude != null &&
            !isNaN(Number(branch.longitude)) && !isNaN(Number(branch.latitude))
        )?.map(branch => {
            return {
                "properties": {
                    "name": `<div class='text-center'><h5 class='font-bold'>DriveWell Garage</h5><p class='text-dim-black'>${branch.branchName} Branch</p></div>`,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [Number(branch.longitude), Number(branch.latitude)]
                }
            }
        })
    };

    useEffect(() => {
        if (allBranches?.length > 0) {
            if (map.current) return;
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.BRIGHT,
                center: branches?.features[0]?.geometry?.coordinates || defaultCenter,
                zoom: 11,
                apiKey: API_KEY
            });

            map.current.on('load', function () {
                map.current.addSource('branches', {
                    type: 'geojson',
                    data: branches,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });

                map.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'branches',
                    filter: ['has', 'point_count'],
                    paint: {

                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#00BCD4',
                            3,
                            '#FF0',
                            5,
                            '#4ad24dff'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            15,
                            3,
                            20,
                            5,
                            25
                        ]
                    }
                });

                map.current.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'branches',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });

                map.current.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'branches',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 5,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });
                map.current.on("render", () => {
                    const features = map.current.querySourceFeatures("branches", {
                        filter: ["!", ["has", "point_count"]],
                    });

                    if (map.current._unclusteredMarkers) {
                        map.current._unclusteredMarkers.forEach((m) => m.remove());
                    }
                    map.current._unclusteredMarkers = [];

                    features.forEach((f) => {
                        const coords = f.geometry.coordinates;
                        const marker = new maptilersdk.Marker({ color: "#11b4da" })
                            .setLngLat(coords)
                            .setPopup(new maptilersdk.Popup().setText("Branch location"))
                            .addTo(map.current);

                        map.current._unclusteredMarkers.push(marker);
                    });
                });

                map.current.on('click', 'clusters', async (e) => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    });
                    const clusterId = features[0].properties.cluster_id;
                    const zoom = await map.current.getSource('branches').getClusterExpansionZoom(clusterId);
                    map.current.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom
                    });
                });


                map.current.on('click', 'unclustered-point', function (e) {
                    const { name } = e.features[0].properties;
                    const coordinates = e.features[0].geometry.coordinates.slice();


                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new maptilersdk.Popup()
                        .setLngLat(coordinates)
                        .setHTML(name)
                        .addTo(map.current);
                });

                map.current.on('mouseenter', 'clusters', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'clusters', () => {
                    map.current.getCanvas().style.cursor = '';
                });
                map.current.on('mouseenter', 'unclustered-point', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'unclustered-point', () => {
                    map.current.getCanvas().style.cursor = '';
                });
            });
        }
    }, [branchDetails]);
    return (
        <div ref={mapContainer} className="mt-6 w-full h-[500px] rounded-md"></div>
    )
}

export default ClusterMap