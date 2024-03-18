import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
const materialModules = [MatListModule, MatButton];

@NgModule({
  declarations: [],
  imports: materialModules,
  exports: materialModules,
})
export class MaterialModule {}
