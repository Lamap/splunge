import { Injectable } from '@angular/core';

// TODO: do it not like this shit
/*
const svgDirection = 'data:image/svg+xml;utf-8, \
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{{width}}" height="{{height}}"\
    style="pointer-events: none;"\
    > \
        <defs><linearGradient id="mygx"> \
            <stop offset="0%" stop-color="#35aedc" stop-opacity="1"/> \
            <stop offset="100%" stop-color="#35aedc" stop-opacity="0"/> \
        </linearGradient></defs> \
        <path \
          fill="url(\u0023mygx)" \
          stroke="black" \
          stroke-width="0" \
          d="M50 50 L100 40 L100 60 L50 50 0Z"\
          transform="rotate({{rotate}} 50 50)"\
        ></path> \
        <circle cx="50" cy="50" r="2" stroke="#35aedc" stroke-width="{{strokeWidth}}" fill="#FFF"></circle> \
        </svg>';
*/
const svgDirection = 'data:image/svg+xml;utf-8, \
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{{width}}" height="{{height}}"\
    style="pointer-events: none;"\
    > \
        <circle cx="50" cy="50" r="25" stroke="#35aedc" stroke-width="{{strokeWidth}}" fill="#FFF"></circle> \
        <rect x="45" y="0" width="10" height="20" fill="#35aedc" transform="rotate({{rotate}} 50 50)"></rect> \
        <circle cx="50" cy="50" r="{{isPointed}}" fill="#FF0000"></circle> \
        </svg>';

const svgNoDirection = 'data:image/svg+xml;utf-8, \
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{{width}}" height="{{height}}"\
    style="pointer-events: none;"\
    > \
    <circle cx="50" cy="50" r="25" stroke="#35aedc" stroke-width="{{strokeWidth}}" fill="#FFF"></circle> \
    <circle cx="50" cy="50" r="{{isPointed}}" fill="#FF0000"></circle>\
    </svg>';

@Injectable()
export class SymbolFactoryService {

  constructor() {
    console.log('symbolfactory service');
  }

  public generate(radius: number, width: number, height: number, hasDirection: boolean,
                  isSelected: boolean, isPointed: boolean): string {
    const svg: string = hasDirection ? svgDirection : svgNoDirection;
    const strokeWidth = isSelected ? 16 : 8;
    let output: string = svg.replace('{{rotate}}', radius.toString());
    output = output.replace('{{width}}', width.toString());
    output = output.replace('{{strokeWidth}}', strokeWidth.toString());
    output =  output.replace('{{isPointed}}', isPointed ? '8' : '0');
    return output.replace('{{height}}', height.toString());
  }

}
