import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InterceptFormService, InterceptFormGroup } from './intercept-form.service';
import { IIntercept } from '../intercept.model';
import { InterceptService } from '../service/intercept.service';

@Component({
  standalone: true,
  selector: 'jhi-intercept-update',
  templateUrl: './intercept-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InterceptUpdateComponent implements OnInit {
  isSaving = false;
  intercept: IIntercept | null = null;

  editForm: InterceptFormGroup = this.interceptFormService.createInterceptFormGroup();

  constructor(
    protected interceptService: InterceptService,
    protected interceptFormService: InterceptFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intercept }) => {
      this.intercept = intercept;
      if (intercept) {
        this.updateForm(intercept);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const intercept = this.interceptFormService.getIntercept(this.editForm);
    if (intercept.id !== null) {
      this.subscribeToSaveResponse(this.interceptService.update(intercept));
    } else {
      this.subscribeToSaveResponse(this.interceptService.create(intercept));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIntercept>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(intercept: IIntercept): void {
    this.intercept = intercept;
    this.interceptFormService.resetForm(this.editForm, intercept);
  }
}
