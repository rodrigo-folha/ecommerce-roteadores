import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Roteador } from "../../models/roteador.model";
import { RoteadorService } from "../../services/roteador.service";

export const roteadorResolver: ResolveFn<Roteador> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(RoteadorService).findById(route.paramMap.get('id')!);
    }