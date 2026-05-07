import { TemplateRef, Type } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface ModalOptions {
  size?: ModalSize;
  scrollable?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  disableClose?: boolean;
  data?: any;
  title?: string;
  showFooter?: boolean;
}

export interface ModalContent {
  template?: TemplateRef<any>;
  component?: Type<any>;
}
