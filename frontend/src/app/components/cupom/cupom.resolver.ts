import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Cupom } from '../../models/cupom.model';
import { CupomService } from '../../services/cupom.service';
import { inject } from '@angular/core';

export const cupomResolver: ResolveFn<Cupom> = 
(route: ActivatedRouteSnapshot , state: RouterStateSnapshot) => {
  return inject(CupomService).findById(route.paramMap.get('id')!);
};
