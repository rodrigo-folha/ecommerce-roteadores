import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { QuantidadeAntena } from "../../models/quantidade-antena.model";
import { QuantidadeAntenaService } from "../../services/quantidade-antena.service";

export const quantidadeantenaResolver: ResolveFn<QuantidadeAntena> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(QuantidadeAntenaService).findById(route.paramMap.get('id')!);
    }