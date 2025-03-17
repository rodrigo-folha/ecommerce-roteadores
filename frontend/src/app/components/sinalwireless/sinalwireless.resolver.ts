import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { SinalWireless } from "../../models/sinal-wireless.model";
import { SinalWirelessService } from "../../services/sinal-wireless.service";

export const sinalWirelessResolver: ResolveFn<SinalWireless> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(SinalWirelessService).findById(route.paramMap.get('id')!);
    }