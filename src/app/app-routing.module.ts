import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'perfil/:usuarioId',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'opciones',
    loadChildren: () => import('./opciones/opciones.module').then(m => m.OpcionesPageModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./Configuracion/cuenta/cuenta.module').then(m => m.CuentaPageModule)
  },
  {
    path: 'privacidad',
    loadChildren: () => import('./Configuracion/privacidad/privacidad.module').then(m => m.PrivacidadPageModule)
  },
  {
    path: 'seguridad',
    loadChildren: () => import('./Configuracion/seguridad/seguridad.module').then(m => m.SeguridadPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./Configuracion/configuracion/configuracion.module').then(m => m.ConfiguracionPageModule)
  },
  {
    path: 'contenido',
    loadChildren: () => import('./Configuracion/contenido/contenido.module').then(m => m.ContenidoPageModule)
  },
  {
    path: 'acerca',
    loadChildren: () => import('./Configuracion/acerca/acerca.module').then(m => m.AcercaPageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./bienvenida/bienvenida.module').then(m => m.BienvenidaPageModule)
  },
  {
    path: 'pantalla-carga',
    loadChildren: () => import('./pantalla-carga/pantalla-carga.module').then( m => m.PantallaCargaPageModule)
  },
  {
    path: 'administracion',
    loadChildren: () => import('./administracion/administracion.module').then( m => m.AdministracionPageModule)
  },
  {
    path: 'recuperar-contrasena/:usuarioId',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }