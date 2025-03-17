import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { BandaFrequencia } from "../../models/banda-frequencia.model";
import { BandaFrequenciaService } from "../../services/banda-frequencia.service";

export const bandaFrequenciaResolver: ResolveFn<BandaFrequencia> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(BandaFrequenciaService).findById(route.paramMap.get('id')!);
    }