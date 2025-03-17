import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { SistemaOperacional } from "../../models/sistema-operacional.model";
import { SistemaOperacionalService } from "../../services/sistema-operacional.service";

export const sistemaoperacionalResolver: ResolveFn<SistemaOperacional> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(SistemaOperacionalService).findById(route.paramMap.get('id')!);
    }