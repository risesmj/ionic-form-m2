import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cpfValidator } from './validators/cpf.validator';
import { startWith, pairwise } from 'rxjs/operators';
import { ZipCodeService } from '../services/zip.code.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public genders = ['Masculino', 'Feminino', 'Não informado', 'Outro'];

  public formInfoPersonal: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ZipCodeService,
  ) {
    this.formInfoPersonal = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        lastName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        identity: ['', Validators.compose([Validators.required, cpfValidator()])],
        gender: [''],
        otherGender: ['', Validators.compose([Validators.required])],
        zipCode: [''],
        address: [''],
        district: [''],
        state: [''],
        city: [''],
        complement: [''],
      }
    );

    this.formInfoPersonal.get('zipCode')
      .valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([before, after]: [any, any]) => {
        this.getAddressFromZipCode(after);
      });

    this.formInfoPersonal.get('gender')
      .valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([before, after]: [any, any]) => {
        this.enableOrDisableOtherGender(after)
      });

  }

  enableOrDisableOtherGender(newGender: string) {
    if (newGender.trim() == "Outro") {
      this.formInfoPersonal.controls.otherGender.enable();
    } else {
      this.formInfoPersonal.controls.otherGender.disable();
      this.formInfoPersonal.patchValue({ otherGender: "" }, { emitEvent: true });
    }
  }

  async getAddressFromZipCode(zipCodeValue: string) {
    if (zipCodeValue.length == 8) {
      (await this
        .service
        .get(zipCodeValue))
        .subscribe((value: any) => {
          console.log(value);

          try {
            let fields = {
              address: value.logradouro,
              complement: value.complemento,
              district: value.bairro,
              state: value.uf,
              city: value.localidade,
            };

            this.formInfoPersonal.patchValue(fields, { emitEvent: true });
          } catch (e) { }
        });
    }

  }


  ngOnInit(): void {

    //disable because will be informed from zip code
    this.formInfoPersonal.controls.address.disable();
    this.formInfoPersonal.controls.district.disable();
    this.formInfoPersonal.controls.state.disable();
    this.formInfoPersonal.controls.city.disable();
    this.formInfoPersonal.controls.complement.disable();

  }

  sendForm() {
    console.log(this.formInfoPersonal.value);
    if (!this.formInfoPersonal.valid) {
      this.formInfoPersonal.markAllAsTouched();
    }
  }

}