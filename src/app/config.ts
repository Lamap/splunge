
import { IMapOverlayItem } from './components/map/map/map.component';
import { LatLngLiteral } from '../../node_modules/@agm/core/services/google-maps-types';
interface ISpgConfig {
    mapOverlays: IMapOverlayItem[];
    topOverlay?: String;
    secondTopOverlay?: String;
    defaultCenter: LatLngLiteral;
    defaultZoom: number;
    maxZoom: number;
    minZoom: number;
    moveBoundaries: {
        north: number;
        east: number;
        west: number;
        south: number;
    }
    mapTransitionDuration: number;
}
export const spgConfig: ISpgConfig = {
    mapOverlays: [
        {
            id: 'T-2000',
            name: 'Tabán az ezredfordulón (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/b3_22clr.gif',
            maxZoom: 20,
            dated: 2000,
            bounds: {
                north: 47.495809,
                south: 47.488865,
                east: 19.048340,
                west: 19.034961
            },
        },
        /*
        {
            id: 'TK-2000',
            name: 'Tabán és környéke ezredfordulón (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/K3_25clr.gif',
            maxZoom: 20,
            dated: 2000,
            bounds: {
                north: 47.497600,
                west: 19.024800,
                south: 47.483150,
                east: 19.0536900
            }
        },
        */
        {
            id: 'TK-1944',
            name: 'M. kir. Honvéd Légierő légifelvétele',
            src: 'http://tabanatlas.hspartacus.hu/trkp/Aerial_1944_cropped_W1800.jpg',
            maxZoom: 20,
            dated: 1944,
            bounds: {
                north: 47.499400,
                west: 19.032295,
                south: 47.4879400,
                east: 19.047728
            },
        },
        {
            id: 'T-1930',
            name: 'A lebontás előtti Tabán (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/b2_22clr.gif',
            maxZoom: 20,
            dated: 1930,
            bounds: {
                north: 47.495809,
                south: 47.488865,
                east: 19.048340,
                west: 19.034961
            }
        },
        {
            id: 'TK-1930',
            name: 'Tabán és környéke a lebontás előtt (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/K2_25clr.gif',
            maxZoom: 20,
            dated: 1930,
            bounds: {
                north: 47.497600,
                west: 19.024800,
                south: 47.483150,
                east: 19.0536900
            }
        },
        {
            id: 'T-1900',
            name: 'A Tabán a századfordulón (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/b1_22clr.gif',
            maxZoom: 20,
            dated: 1900,
            bounds: {
                north: 47.495809,
                south: 47.488865,
                east: 19.048340,
                west: 19.034961
            }
        },
        {
            id: 'TK-1900',
            name: 'Tabán és környéke a századfordulón (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/K1_28clr.gif',
            maxZoom: 20,
            dated: 1900,
            bounds: {
                north: 47.497600,
                west: 19.024800,
                south: 47.483150,
                east: 19.0536900
            }
        },
        {
            id: 'Marek-1874',
            name: 'Marek János: Buda sz. kir. város egész határának másolati térképe (1:1440)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1874_marek_v2.jpg',
            maxZoom: 22,
            dated: 1874,
            bounds: {
                north: 47.500400,
                west: 19.022782,
                south: 47.486973803423446,
                east: 19.047611525575803
            }
        },
        {
            id: 'Buda-1824',
            name: 'Wilsdorf hadnagy: A Vár és a Víziváros [valamint a Tabán és a Krisztinaváros] térképe (1:3600)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1824_buda.png',
            maxZoom: 20,
            dated: 1824,
            bounds: {
                north: 47.505324,
                west: 19.020713,
                south: 47.484108,
                east: 19.049125
            },
        },
        {
            id: 'Buda-1810',
            name: 'Lipszky János: Magyarország sz. kir. fővárosainak, Budának és Pestnek térképe (1:7200)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1810.png',
            maxZoom: 20,
            dated: 1810,
            bounds: {
                north: 47.508065,
                west: 19.01192,
                south: 47.462254,
                east: 19.065004
            },
        },
        {
            id: 'TK-1760',
            name: 'Budapest a 18. század közepén',
            src: 'http://tabanatlas.hspartacus.hu/trkp/btm_1760.png',
            maxZoom: 15,
            dated: 1830,
            bounds: {
                north: 47.545427,
                west: 19.002246,
                south: 47.478336,
                east: 19.085228
            }
        }
    ],
    topOverlay: 'T-1930',
    secondTopOverlay: 'TK-1930',
    mapTransitionDuration: 1000,
    defaultCenter: {
        lat: 47.49258698962108,
        lng: 19.045
    },
    defaultZoom: 18,
    maxZoom: 22,
    minZoom: 12,
    moveBoundaries: {
        south: 47.370,
        north: 47.615,
        east: 19.280,
        west: 18.893000
    }
}
