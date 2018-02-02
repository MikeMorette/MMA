import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Apia {
  url: string = 'http://n22.mikex.ru/v1';

  constructor() {

  }
}
