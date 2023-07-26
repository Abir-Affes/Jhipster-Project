import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TerminalFormService, TerminalFormGroup } from './terminal-form.service';
import { ITerminal } from '../terminal.model';
import { TerminalService } from '../service/terminal.service';

@Component({
  standalone: true,
  selector: 'jhi-terminal-update',
  templateUrl: './terminal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TerminalUpdateComponent implements OnInit {
  isSaving = false;
  terminal: ITerminal | null = null;

  editForm: TerminalFormGroup = this.terminalFormService.createTerminalFormGroup();

  constructor(
    protected terminalService: TerminalService,
    protected terminalFormService: TerminalFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ terminal }) => {
      this.terminal = terminal;
      if (terminal) {
        this.updateForm(terminal);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const terminal = this.terminalFormService.getTerminal(this.editForm);
    if (terminal.id !== null) {
      this.subscribeToSaveResponse(this.terminalService.update(terminal));
    } else {
      this.subscribeToSaveResponse(this.terminalService.create(terminal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITerminal>>): void {
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

  protected updateForm(terminal: ITerminal): void {
    this.terminal = terminal;
    this.terminalFormService.resetForm(this.editForm, terminal);
  }
}
