import { Component } from '@angular/core';
import { Usuario } from '../register/usuario.model';
import { Router, NavigationEnd  } from '@angular/router';
import { ImagenService } from '../services/imagen.service';
import { UsuariosService } from '../services/usuarios.service';
import { Storage } from '@ionic/storage-angular';
import { LikeService } from '../services/like.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { AlertController } from '@ionic/angular';
import { CategoriaService } from '../services/categoria.service';
import { GuardadosService } from '../services/guardados.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  allLikes: any;
  
  imagenesBaneadas: any;

  nombreUsuario: any;
  currentUser: any;
  idUsuario!: any;
  isAdmin!: any;
  imagenes: any[] = [];
  likes: any[] = [];
  imagenId: any;
  currentImageId: any;

  categorias: any[] = []

  cantidadNotificacionesNoVistas: any;
  constructor(private guardadoServicio: GuardadosService, private categoriaServicio: CategoriaService, private alertController: AlertController, private likeServicio: LikeService, private router: Router, private imagenServicio: ImagenService, private usuarioService: UsuariosService, private storage: Storage, private notificacionService: NotificacionesService) {
    this.storage.create();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (currentRoute === '/tabs/imagenes') {
          this.cargarUsuarioData();
          
        }
      }
    });
  }

    ngOnInit(){
      this.cargarUsuarioData();
      this.loadImages();
      this.obtenerNotificaciones();
      this.obtenerCantidadNotificacionesNoVistas();
      this.cargarCategorias();
      this.actualizarSeleccionCategoria();
      this.loadLikes();
    }

    ionViewWillEnter(){
      this.cargarUsuarioData();
      this.loadImages();
      this.obtenerNotificaciones();
      this.obtenerCantidadNotificacionesNoVistas();
      this.cargarCategorias();
      this.actualizarSeleccionCategoria();
      this.loadLikes();
    }

  async cargarUsuarioData() {
  try {
    const currentUser = await this.usuarioService.getCurrentUser();

    if (currentUser) {
      this.nombreUsuario = currentUser.nombre;
      this.idUsuario = currentUser.idUsuario;
      this.isAdmin = currentUser.isAdmin;
      console.log(`Nombre usuario actual en storage: ${this.nombreUsuario} id: ${this.idUsuario} is_admin: ${this.isAdmin}`);
    }
  } catch (error) {
    console.error('Error al cargar los datos del usuario:', error);
  }
}

  async loadImages() {
    this.imagenServicio.getImagenes().then((imagenes) => {
      this.getCategoriaId().then(selectedCategoriaId => {
        if (selectedCategoriaId && selectedCategoriaId !== 9) {
          this.imagenes = imagenes.filter(imagen => imagen.categoria_id === selectedCategoriaId);
        } else {
          this.imagenes = imagenes;
        }

        console.log('Datos de imágenes en la base de datos:');
        console.log(this.imagenes);
      });
    });
  }

  cerrarSesion(){
    this.usuarioService.logoutUser();
    this.router.navigate(['/login']);
    
  }

  async agregarLike(idUsuario:any, imagenId: any) {
    try {
      await this.likeServicio.addLike(idUsuario, imagenId);
      console.log('Like agregado con éxito');
      this.loadImages();
    } catch (error) {
      console.error('Error al agregar el like:', error);
    }
  }
  
  async removerLike(idUsuario: any, imagenId: any) {
    try {
      await this.likeServicio.removeLike(idUsuario, imagenId);
      console.log('Like removido con éxito');
      this.loadImages();
    } catch (error) {
      console.error('Error al remover el like:', error);
    }
  }

  async toggleLike(idUsuario: any ,imagenId: any) {
    const hasLiked = await this.likeServicio.hasLiked(idUsuario, imagenId);
    if (hasLiked) {
      await this.removerLike(idUsuario,imagenId);

    } else {
      await this.agregarLike(idUsuario,imagenId);

      const imagen = this.imagenes.find((img) => img.id === imagenId); 
      const notificacionExiste = await this.notificacionService.existeNotificacionDeLike(imagenId, this.idUsuario);

      if (!notificacionExiste) {
        await this.notificacionService.enviarNotificacionDeLike(imagen.id, this.idUsuario, imagen.usuario_id);
        this.obtenerCantidadNotificacionesNoVistas();
      } else {
        console.log('No se ha agregado la notificación porque ya existe');
      }
    }
    this.loadImages();
  }

  async agregarGuardado(idUsuario:any, imagenId: any) {
    try {
      await this.guardadoServicio.addGuardado(idUsuario, imagenId);
      console.log('Guardado agregado con éxito');
      this.loadImages();
    } catch (error) {
      console.error('Error al agregar el like:', error);
    }
  }
  
  async removerGuardado(idUsuario: any, imagenId: any) {
    try {
      await this.guardadoServicio.removeGuardado(idUsuario, imagenId);
      console.log('Guardado removido con éxito');
      this.loadImages();
    } catch (error) {
      console.error('Error al remover el like:', error);
    }
  }

  async toggleGuardado(idUsuario: any, imagenId: any) {
    const hasGuardado = await this.guardadoServicio.hasGuardado(idUsuario, imagenId);
    if (hasGuardado) {
      await this.removerGuardado(idUsuario, imagenId);
    } else {
      await this.agregarGuardado(idUsuario, imagenId);
    }
  
    this.loadImages();
  }

  async obtenerNotificaciones() {
    try {
      const notificaciones = await this.notificacionService.getNotificaciones();
      console.log('Notificaciones obtenidas:', notificaciones);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  }

  async obtenerCantidadNotificacionesNoVistas() {
    try {
      this.cantidadNotificacionesNoVistas = await this.notificacionService.getCantidadNotificacionesNoVistasPorId(this.idUsuario);
      console.log('Cantidad de notis no vistas: ', this.cantidadNotificacionesNoVistas);
      
    } catch (error) {
      console.error('Error al obtener la cantidad de notificaciones no vistas:', error);
    }
  }

  async actualizarSeleccionCategoria() {
    const selectedCategoriaId = await this.storage.get('selectedCategoriaId');
  
    if (selectedCategoriaId) {
      this.categorias.forEach(categoria => {
        categoria.checked = (categoria.id === selectedCategoriaId);
      });
      
    }
  }
  

  async mostrarMenuCategorias() {
    const alert = await this.alertController.create({
      header: 'Selecciona una categoría',
      inputs: this.categorias.map(categoria => ({
        type: 'radio',
        label: categoria.nombre,
        value: categoria.id.toString(), 
        checked: categoria.checked,
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: async (selectedCategoriaId) => {
            const categoryId = parseInt(selectedCategoriaId, 10);
  
            console.log('ID de la categoría seleccionada:', categoryId);
  
            this.categorias.forEach(categoria => {
              categoria.checked = (categoria.id === categoryId);
            });
            await this.storage.set('selectedCategoriaId', categoryId);
            this.loadImages();
          },
        },
      ],
    });
  
    await alert.present();
  }

  async cargarCategorias() {
    await this.categoriaServicio.getCategorias().then((categorias) => {
      this.categorias = categorias;
      console.log('Datos de categorias en la base de datos:');
      console.log(this.categorias);
    });
  
    await this.actualizarSeleccionCategoria();
  }

  async getCategoriaId() {
    return await this.storage.get('selectedCategoriaId');
  }

  
  async loadLikes() {
    try {
      this.allLikes = await this.likeServicio.getAllLikes();
      console.log('TODOS LOS LIKES: ',this.allLikes);
      
    } catch (error) {
      console.error('Error al cargar los likes:', error);
    }

  }
}