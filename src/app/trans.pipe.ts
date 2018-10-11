import { Pipe, PipeTransform } from '@angular/core';
/* import * as en from '../locale/en.json'; */
import * as hu from '../locale/hu.json';

@Pipe({
  name: 'trans'
})
export class TransPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const language = hu;
    return language[value] || value;
  }

}
