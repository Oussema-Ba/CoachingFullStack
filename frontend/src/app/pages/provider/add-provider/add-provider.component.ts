import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderService } from '../../../services/provider.service';
import { Provider } from '../../../models/Provider';
import { Router } from '@angular/router';
import { SweetService } from '../../../services/sweet.service';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.scss']
})
export class AddProviderComponent implements OnInit {
  providerForm: FormGroup;
  submitted = false;
  selectedFile: File | null = null;

  constructor(
      private fb: FormBuilder,
      private providerService: ProviderService,
      private router: Router,
      private sweetService: SweetService
  ) {
    this.providerForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  addProvider(): void {
    this.submitted = true;
    if (this.providerForm.invalid) {
      return;
    }
    if (!this.selectedFile) {
      this.sweetService.danger('Le logo est obligatoire. Veuillez sélectionner un fichier.');
      return;
    }
    const providerData: Provider = this.providerForm.value;

    this.providerService.createProviderWithLogo(providerData, this.selectedFile).subscribe({
      next: (response) => {
        this.sweetService.success('Fournisseur ajouté avec succès.');
        this.resetForm();
        this.router.navigate(['fournisseur']);
      },
      error: (error) => {
        this.sweetService.danger('Une erreur est survenue lors de l\'ajout du fournisseur.');
        console.error('Erreur lors de l\'ajout du fournisseur :', error);
      }
    });
  }

  resetForm(): void {
    this.providerForm.reset();
    this.submitted = false;
    this.selectedFile = null;
  }

  get form() {
    return this.providerForm.controls;
  }
}
