import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

const materialModules = [
  MatListModule,
  MatButton,
  DialogModule,
  CdkDrag,
  CdkDropList,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
];

@NgModule({
  declarations: [],
  imports: materialModules,
  exports: materialModules,
})
export class MaterialModule {}
