import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('rol');

  if (!role) {
    // No hay sesión activa
    return router.createUrlTree(['/error-401']);
  }

  if (role === 'admin') {
    return true;
  }

  // Tiene sesión, pero no permisos
  return router.createUrlTree(['/error-403']);
};
