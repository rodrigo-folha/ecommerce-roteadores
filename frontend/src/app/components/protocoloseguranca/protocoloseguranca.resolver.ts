import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ProtocoloSeguranca } from "../../models/protocolo-seguranca.model";
import { ProtocoloSegurancaService } from "../../services/protocolo-seguranca.service";

export const protocoloSegurancaResolver: ResolveFn<ProtocoloSeguranca> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(ProtocoloSegurancaService).findById(route.paramMap.get('id')!);
    }