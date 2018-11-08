
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
    };
    mapTransitionDuration: number;
}
export const spgConfig: ISpgConfig = {
    mapOverlays: [
        {
            id: 'T-2000',
            name: 'A Tabán az ezredfordulón, Lenkei Ákos térképe',
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
            name: 'Légifelvétel a parkosított Tabán környékéről (HIM)',
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
            id: 'TK-1930',
            name: 'A Tabán és környéke a lebontás előtt, Lenkei Ákos térképe',
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
        /*
        {
            id: 'T-1930',
            name: 'A Tabán a lebontás előtt, Lenkei Ákos térképe',
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
/*
        {
            id: 'TK-1918_II',
            name: 'M. kir. 9. felmérési felügyelőség: Budapest székesfőváros térképe (1: 720)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1918_II.jpg',
            maxZoom: 22,
            dated: 1918,
            bounds: {
                north: 47.49376,
                west: 19.04095,
                south: 47.49026,
                east: 19.04775
            }
        },
        */
        {
            id: 'T-1887',
            name: 'A Tabán a 19. század végén, Fővárosi Mérnöki Hivatal, 1:5000 (BTM)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1885.jpg',
            maxZoom: 20,
            dated: 1887,
            bounds: {
                north: 47.495091,
                west: 19.034447,
                south: 47.488021,
                east: 19.049994
            }
        },
        /*
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
        },*/
        {
            id: 'T-1900',
            name: 'A Tabán a városegyesítést követően (L. Ákos)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/b1_22clr.gif',
            maxZoom: 20,
            dated: 1880,
            bounds: {
                north: 47.495809,
                south: 47.488865,
                east: 19.048340,
                west: 19.034961
            }
        },
        {
            id: 'Marek-1874',
            name: 'Marek János: Buda sz. kir. város egész határának másolati térképe (1:1440)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/Marek_cut.jpg',
            maxZoom: 20,
            dated: 1873,
            bounds: {
                north: 47.497667,
                west: 19.030817,
                south: 47.488073,
                east: 19.048398
            }
        },
        {
            id: 'Buda-1824',
            name: 'A Tabán az újjáépítést követően, Wilsdorf hadnagy térképe, 1:3600 (HIM)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1824_buda.png',
            maxZoom: 19,
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
            name: 'A Tabán Buda és Pest térképén, Lipszky János térképe, 1:7200 (BTM)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1810.png',
            maxZoom: 19,
            dated: 1810,
            bounds: {
                north: 47.508065,
                west: 19.01192,
                south: 47.462254,
                east: 19.065004
            },
        },
        /*
        {
            id: 'TK-1790',
            name: 'A Tabán a tűzvész előtt (OSZK)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1790b.png',
            maxZoom: 20,
            dated: 1790,
            bounds: {
                north: 47.497259,
                west: 19.032573,
                south: 47.479525,
                east: 19.056778
            }
        },
        /*
        {
            id: 'TK-1760',
            name: 'Buda, Pest és Óbuda valamint környékük térképe',
            src: 'http://tabanatlas.hspartacus.hu/trkp/btm_1760.png',
            maxZoom: 18,
            dated: 1760,
            bounds: {
                north: 47.545427,
                west: 19.002246,
                south: 47.478336,
                east: 19.085228
            }
        },
        */
        {
            id: 'TK-1753',
            name: 'A Tabán a székesegyház építése idején (HIM)',
            src: 'http://tabanatlas.hspartacus.hu/trkp/1753_2.png',
            maxZoom: 19,
            dated: 1753,
            bounds: {
                north: 47.51482,
                west: 19.01895,
                south: 47.48744,
                east: 19.05683
            }
        }
    ],
    topOverlay: 'TK-1930',
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
};
