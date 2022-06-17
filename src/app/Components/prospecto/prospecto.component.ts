import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProspectoService } from 'src/app/services/prospecto.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '..//..//archivo file-upload.service';

@Component({
  selector: 'app-prospecto',
  templateUrl: './prospecto.component.html',
  styleUrls: ['./prospecto.component.css'],
})
export class ProspectoComponent implements OnInit {
  listProspecto: any[] = [];
  documentos: any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id: number | undefined;
  closeResult: string = '';
  mostrarLista: boolean = false;
  nombredocumento: any;
  listEstatus: any[] = ['Enviado', 'Rechazado'];
  select1Control = new FormControl('');
  select1 = 'Enviado';
  _isDisabled:boolean = false;

  // Variable to store shortLink from api response
  shortLink: string = '';
  loading: boolean = false; // Flag variable
  file: any; // Variable to store file

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fileUploadService: FileUploadService,
    private _prospectoService: ProspectoService
  ) {
    this.form = this.fb.group({
      id: 0,
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      telefono: ['', Validators.required],
      rfc: ['', Validators.required],
      estatus: [''],
      nombredocumento: [''],
      observaciones: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id;
    this.obtenerProspecto();
  }
  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
    this.nombredocumento = this.file.name;
  }

  obtenerProspecto() {
    this._prospectoService.getListProspecto().subscribe(
      (data) => {
        console.log(data);
        this.listProspecto = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardarProspecto() {
    const prospecto: any = {
      nombre: this.form.get('nombre')?.value,
      primerApellido: this.form.get('primerApellido')?.value,
      segundoApellido: this.form.get('segundoApellido')?.value,
      calle: this.form.get('calle')?.value,
      numero: this.form.get('numero')?.value,
      codigoPostal: this.form.get('codigoPostal')?.value,
      telefono: this.form.get('telefono')?.value,
      rfc: this.form.get('rfc')?.value,
      estatus: this.select1Control.value,
      documentos: this.documentos,
      observaciones: this.form.get('observaciones')?.value,
    };

    if (this.id == undefined) {
      // Agregamos una nueva prospecto
      this._prospectoService.saveProspecto(prospecto).subscribe(
        (data) => {
          this.toastr.success(
            'La prospecto fue o con exito!',
            'Prospecto Registrado'
          );
          this.obtenerProspecto();
          this.form.reset();
        },
        (error) => {
          this.toastr.error('Opss.. ocurrio un error', 'Error');
          console.log(error);
        }
      );
    } else {
      prospecto.id = this.id;
      // Editamos prospecto
      this._prospectoService.updateProspecto(this.id, prospecto).subscribe(
        (data) => {
          this.form.reset();
          this.accion = 'Agregar';
          this.id = undefined;
          this.toastr.info(
            'La prospecto fue actualizado con exito!',
            'Prospecto Actualizado'
          );
          this.obtenerProspecto();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  eliminarProspecto(id: number) {
    this._prospectoService.deleteProspecto(id).subscribe(
      (data) => {
        this.toastr.error(
          'La prospecto fue eliminado con exito!',
          'Prospecto eliminado'
        );
        this.obtenerProspecto();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editarProspecto(prospecto: any) {
    this.accion = 'Editar';
    this.id = prospecto.id;
    this.mostrarLista = !this.mostrarLista;

    let id = this.id;
    let listprospecto = this.listProspecto.find(function (x) {
      return x.id == id;
    });

    this.documentos = listprospecto.documentos;

    this.select1 = prospecto.estatus;
    this.form.patchValue({
      id:this.id,
      nombre: prospecto.nombre,
      primerApellido: prospecto.primerApellido,
      segundoApellido: prospecto.segundoApellido,
      calle: prospecto.calle,
      numero: prospecto.numero,
      codigoPostal: prospecto.codigoPostal,
      telefono: prospecto.telefono,
      rfc: prospecto.rfc,
      estatus: prospecto.estatus,
      documentos: this.documentos,
      observaciones:prospecto.observaciones
    });
  }

  open(content: any) {
    let id = this.id;
    let prospecto = this.listProspecto.find(function (x) {
      return x.id == id;
    });

    if (prospecto != undefined) this.documentos = prospecto.documentos;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  add() {
    this.listProspecto = [];
    this.documentos = [];
    this.id = undefined;
    this.accion = 'Agregar';
    this.mostrarLista = !this.mostrarLista;

    // this.obtenerProspecto();
    this.form.reset();
  }

  mostrarPropesto() {
    this.mostrarLista = !this.mostrarLista;
    this.obtenerProspecto();
  }

  agregarDocumento(nambe: any) {
    var prospecto = {
      nombredocumento: this.nombredocumento,
      prospectosid: this.id == undefined ? 0 : this.id,
    };
    this.documentos.push(prospecto);

    this.modalService.dismissAll(this.documentos);
    this.onUpload();
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof event === 'object') {
        // Short link via api response
        this.shortLink = event.dbPath;

        this.loading = false; // Flag variable
      }
    });
  }

  cambiaColorEstatus(Prospecto: any) {
    if (Prospecto.estatus == 'Enviado') {
      return {
        'table-success': true,
      };
    } else {
      return {
        'table-danger': true,
      };
    }
  }

}
