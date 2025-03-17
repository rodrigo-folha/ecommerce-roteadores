import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';
import { Funcionario } from '../../models/funcionario.model';

export const funcionarioResolver: ResolveFn<Funcionario> = 
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(FuncionarioService).findById(route.paramMap.get('id')!);
  };
