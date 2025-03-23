import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../services/provider.service';
import { Provider } from '../../../models/Provider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetService } from '../../../services/sweet.service';

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit {
  selectedProvider!: Provider;
  providerForm: FormGroup;
  submitted = false;
  providerIdToDelete!: number;
  providers: Provider[] = [];
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 2;
  allProviders: Provider[] = [];
  isSearchActive: boolean = false;
  selectedFile: File | null = null;

  constructor(
      private providerService: ProviderService,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private router: Router,
      private sweetService: SweetService
  ) {
    this.providerForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPaginatedProviders();
    this.loadAllProviders();
  }

  loadPaginatedProviders(): void {
    this.providerService.getPaginatedProviders(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (data) => {
        this.providers = data.content;
        this.totalItems = data.totalElements;
        this.filteredProviders = [...this.providers];
        this.loadLogos(this.providers);
      },
      error: (error) => {
        console.error('Erreur lors du chargement paginé', error);
        this.sweetService.danger('Erreur lors du chargement des fournisseurs.');
      }
    });
  }

  loadAllProviders(): void {
    this.providerService.getAllProviders().subscribe({
      next: (data: Provider[]) => {
        this.allProviders = data;
      },
      error: (error) => {
        console.error('Erreur chargement total', error);
      }
    });
  }

  openEditModal(provider: Provider, content: any): void {
    this.selectedProvider = provider;
    this.submitted = false;
    this.selectedFile = null;

    if (provider.id) {
      this.providerService.getProviderLogo(provider.id).subscribe({
        next: (logoBlob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedProvider.logo = reader.result as string;
          };
          reader.readAsDataURL(logoBlob);
        },
        error: () => {
          console.warn(`Impossible de charger le logo du fournisseur ID ${provider.id}`);
        }
      });
    }

    this.providerForm.patchValue({
      id: provider.id,
      name: provider.name,
      address: provider.address,
      email: provider.email,
      telephone: provider.telephone
    });

    this.modalService.open(content, { size: 'md', centered: true });
  }

  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  saveProvider(): void {
    this.submitted = true;

    if (this.providerForm.valid) {
      const provider = this.providerForm.value as Provider;

      this.providerService.updateProviderWithLogo(
          provider.id,
          provider,
          this.selectedFile ?? undefined
      ).subscribe({
        next: () => {
          this.loadAllProviders();
          this.loadPaginatedProviders();
          this.modalService.dismissAll();
          this.sweetService.success('Fournisseur mis à jour avec succès.');
        },
        error: (error) => {
          console.error('Erreur mise à jour', error);
          this.sweetService.danger('Erreur lors de la mise à jour du fournisseur.');
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.providerIdToDelete = id;
    this.sweetService.warning('Voulez-vous vraiment supprimer ce fournisseur ?').then((result) => {
      if (result.isConfirmed) {
        this.deleteProvider();
      }
    });
  }

  deleteProvider(): void {
    if (this.providerIdToDelete) {
      this.providerService.deleteProvider(this.providerIdToDelete).subscribe({
        next: () => {
          this.loadAllProviders();
          this.loadPaginatedProviders();
          this.sweetService.success('Fournisseur supprimé avec succès.');
        },
        error: (error) => {
          console.error('Erreur suppression', error);
          this.sweetService.danger('Erreur lors de la suppression du fournisseur.');
        }
      });
    }
  }

  addProvider(): void {
    this.router.navigate(['providers/add']);
  }

  get form() {
    return this.providerForm.controls;
  }

  searchQuery: string = '';
  filteredProviders: Provider[] = [];

  loadLogos(providers: Provider[]): void {
    providers.forEach((provider) => {
      this.providerService.getProviderLogo(provider.id).subscribe({
        next: (logoBlob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            provider.logo = reader.result as string;
          };
          reader.readAsDataURL(logoBlob);
        },
        error: () => {
          console.warn(`Logo non trouvé pour fournisseur ${provider.id}`);
        }
      });
    });
  }

  filterFournisseur(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.isSearchActive = false;
      this.loadPaginatedProviders();
      return;
    }

    this.isSearchActive = true;
    this.filteredProviders = this.allProviders.filter(provider =>
        provider.name.toLowerCase().includes(query) ||
        provider.address.toLowerCase().includes(query) ||
        provider.email.toLowerCase().includes(query) ||
        provider.telephone.toLowerCase().includes(query)
    );

    this.loadLogos(this.filteredProviders);
    this.totalItems = this.filteredProviders.length;
    this.currentPage = 1;
  }

  onPageChange(): void {
    if (!this.isSearchActive) {
      this.loadPaginatedProviders();
    }
  }
}
