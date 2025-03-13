import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Lote } from "../../models/lote.model";
import { LoteService } from "../../services/lote.service";

export const loteResolver: ResolveFn<Lote> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(LoteService).findById(String(route.paramMap.get('id')!));
    }