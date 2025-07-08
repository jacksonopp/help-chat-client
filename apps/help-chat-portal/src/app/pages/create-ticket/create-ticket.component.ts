import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '@helpchat/services';
import { Category, CreateTicketRequest, TicketPriority } from '@helpchat/types';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    ProgressSpinnerModule,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Create New Support Ticket
        </h1>

        @if (isLoading()) {
        <p-progressSpinner />
        } @else {
        <form
          [formGroup]="ticketForm"
          (ngSubmit)="onSubmit()"
          class="space-y-6"
        >
          <!-- Title Field -->
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Ticket Title *
            </label>
            <input
              id="title"
              type="text"
              formControlName="title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of your issue"
              [class.border-red-500]="
                titleControl.invalid && titleControl.touched
              "
            />
            @if (titleControl.invalid && titleControl.touched) {
            <p class="text-red-500 text-sm mt-1">
              @if (titleControl.errors?.['required']) { Title is required } @if
              (titleControl.errors?.['maxlength']) { Title must be less than 255
              characters }
            </p>
            }
          </div>

          <!-- Priority Field -->
          <div>
            <label
              for="priority"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Priority *
            </label>
            <p-select
              id="priority"
              formControlName="priority"
              [options]="priorityOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Select priority level"
              class="w-full"
              [class.border-red-500]="
                priorityControl.invalid && priorityControl.touched
              "
            />
            @if (priorityControl.invalid && priorityControl.touched) {
            <p class="text-red-500 text-sm mt-1">Priority is required</p>
            }
          </div>

          <!-- Category Field -->
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <p-select
              id="category"
              formControlName="category_id"
              [options]="categories()"
              optionLabel="name"
              optionValue="id"
              placeholder="Select a category (optional)"
              class="w-full"
            />
          </div>

          <!-- Due Date Field -->
          <div>
            <label
              for="dueDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Due Date
            </label>
            <p-datepicker
              id="dueDate"
              formControlName="due_date"
              placeholder="Select due date (optional)"
              class="w-full"
              [showIcon]="true"
              dateFormat="yy-mm-dd"
            />
          </div>

          <!-- Description Field -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              formControlName="description"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide detailed information about your issue..."
              [class.border-red-500]="
                descriptionControl.invalid && descriptionControl.touched
              "
            ></textarea>
            @if (descriptionControl.invalid && descriptionControl.touched) {
            <p class="text-red-500 text-sm mt-1">
              @if (descriptionControl.errors?.['required']) { Description is
              required } @if (descriptionControl.errors?.['minlength']) {
              Description must be at least 1 character long }
            </p>
            }
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="ticketForm.invalid || isSubmitting()"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSubmitting()) { Creating... } @else { Create Ticket }
            </button>
          </div>
        </form>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTicketComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);

  // Signals
  isLoading = signal(false);
  isSubmitting = signal(false);
  categories = signal<Category[]>([]);

  // Form
  ticketForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.minLength(1)]],
    priority: ['', Validators.required],
    category_id: [''],
    due_date: [''],
  });

  // Computed values
  priorityOptions = computed(() => [
    { label: 'Low', value: TicketPriority.LOW },
    { label: 'Medium', value: TicketPriority.MEDIUM },
    { label: 'High', value: TicketPriority.HIGH },
    { label: 'Critical', value: TicketPriority.CRITICAL },
  ]);

  // Form controls for easy access
  get titleControl() {
    return this.ticketForm.get('title')!;
  }
  get descriptionControl() {
    return this.ticketForm.get('description')!;
  }
  get priorityControl() {
    return this.ticketForm.get('priority')!;
  }

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.isLoading.set(true);
    this.ticketService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories.filter((cat) => cat.is_active));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.ticketForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.ticketForm.value;

    // Format due date if provided
    if (formValue.due_date) {
      formValue.due_date = this.formatDate(formValue.due_date);
    }

    const ticketData: CreateTicketRequest = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      category_id: formValue.category_id || undefined,
      due_date: formValue.due_date || undefined,
    };

    this.ticketService.createTicket(ticketData).subscribe({
      next: (ticket) => {
        this.isSubmitting.set(false);
        // Navigate to the ticket detail page
        this.router.navigate(['/tickets', ticket.id]);
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        this.isSubmitting.set(false);
        // TODO: Show error message to user
      },
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
