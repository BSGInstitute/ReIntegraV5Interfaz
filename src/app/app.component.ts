import { UserService } from './shared/services/user.service';
import { Component, OnInit, Renderer2  } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IntegraService } from '@shared/services/integra.service';
import { UrlService } from '@shared/services/url.service';
import { constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  isSandbox = !environment.production;

  constructor(
    private router: Router,
    private titleService: Title,
    private userService: UserService,
    private renderer: Renderer2,
    private urlService: UrlService,
    private _integraService: IntegraService,
    private _userService: UserService
  ) {}
  localIp: string;
  modulosUser: {
    url: string;
    idModulo: number;
    nombreModulo: string;
  }[] = [];
  ngOnInit() {
    if (localStorage.getItem('userData')) {
      this.userService.setUserData(
        JSON.parse(localStorage.getItem('userData'))
      );
    }
    this.userService.moduloUsuario$.subscribe({
      next: (resp) => {
        if (resp != null) {
          this.setHeader();
        }
      },
    });
    this.ClicInteraccionMenu();
    this.ClicInteraccionButton();
    this.ClicInteraccionSelect();
    this.ClicInteraccionMultiSelect();
    this.ClicInteraccionCheckBox();
    this.ClicInteraccionRadioButton();
    this.ClicInteraccionTextNumber()
    this.ClicInteraccionTab();
  }
  setHeader() {
    try {
      this.modulosUser = this.userService.getModulosUser();
      if(this.router.url != '/'){
        let urlSplit = this.router.url.slice(1).split('/');
        if (urlSplit.length == 2) {
          let item = this.modulosUser.find(
            (x) => x.url == `/${urlSplit[0]}/${urlSplit[1]}`
          );
          if (item != null) {
            if (item.nombreModulo != null) {
              this.titleService.setTitle(item.nombreModulo);
            } else {
              this.titleService.setTitle(urlSplit[2]);
            }
          }
        } else if (urlSplit.length == 1) {
          if (urlSplit[0].includes('IniciarSesion')) {
            this.titleService.setTitle('Iniciar Sesion');
          } else {
            this.titleService.setTitle(urlSplit[0]);
          }
        }
      }else {
        this.titleService.setTitle('Home Page');
      }
    } catch (error) {
      this.titleService.setTitle('IntegraV5')
    }
  }
  ClicInteraccionMenu() {
    this.renderer.listen('document', 'click', (event: Event) => {
        let target = event.target as HTMLElement;

        // Verifica si el objetivo es un elemento de menú dentro de un contenedor específico
        if (target.tagName === 'SPAN' && target.parentElement?.tagName === 'LI' && target.closest('.k-drawer-items')) {
            const elementType = 'Menu';
            let elementName = 'SinNombre';

            // Captura el nombre del elemento de menú
            const labelText = target.innerText.trim();
            if (labelText) {
                elementName = labelText;
            }

            // Construye el registro de interacción del menú
            this.registrarInteraccion(elementType, elementName, '');
        }
    });
  }

  //Interacción de Botones
  ClicInteraccionButton() {
    this.renderer.listen('document', 'click', (event: Event) => {
        let target = event.target as HTMLElement;

        // Recorre hacia arriba en el árbol DOM para encontrar el elemento botón si el objetivo inicial no es un botón
        while (target && target.tagName !== 'BUTTON') {
            target = target.parentElement as HTMLElement;
        }

        // Verifica si el objetivo es un botón
        if (target) {
            const tagName = target.tagName;

            // Inicializa el tipo de elemento y el nombre
            let elementType = 'OTHER';
            let elementName = 'SinNombre';

            // Captura todos los posibles atributos
            const titleAttr = target.getAttribute('title');
            const DataTitleAttr = target.getAttribute('data-title');
            const nameAttr = target.getAttribute('name');
            const idAttr = target.getAttribute('id');
            const ngbtooltipAttr = target.getAttribute('ngbtooltip');
            const ariaLabelAttr = target.getAttribute('aria-label');

            // Asigna el nombre del elemento basado en los atributos
            elementName = titleAttr || DataTitleAttr || nameAttr || idAttr || ngbtooltipAttr || ariaLabelAttr || 'SinNombre';

            // Verifica si el elemento es un botón y el aria-label no es 'Select'
            if (tagName === 'BUTTON' && ariaLabelAttr !== 'Select') {
                elementType = 'Button';

                // Obtener el texto del botón si existe y no está vacío
                const buttonText = target.innerText.trim();
                if (buttonText) {
                    elementName = buttonText;
                } else if (elementName === 'SinNombre') {
                    elementName = titleAttr || DataTitleAttr || nameAttr || idAttr || ngbtooltipAttr || ariaLabelAttr || 'SinNombre';
                }
                this.registrarInteraccion(elementType, elementName, '');
            }
        }
    });
  }
  ClicInteraccionRadioButton() {
    this.renderer.listen('document', 'click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName;
      let elementType = 'OTHER';
      let elementName = target.getAttribute('name') || target.getAttribute('id') || 'Unnamed';
      if (tagName === 'INPUT' && target.getAttribute('type') === 'radio') {
        elementType = 'Radio Button';
        // Priorizar la búsqueda del label asociado
        let label = target.closest('label');
        if (!label) {
          const id = target.getAttribute('id');
          if (id) {
            label = document.querySelector(`label[for="${id}"]`);
          }
        }
        if (!label) {
          label = target.parentElement?.querySelector('label');
        }
        if (label) {
          elementName = label.textContent.trim();
        } else {
          elementName = target.getAttribute('name') || target.getAttribute('id') || 'Unnamed';
        }
        this.registrarInteraccion(elementType, elementName, '');
      }
    });
  }
  ClicInteraccionCheckBox() {
    this.renderer.listen('document', 'click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName;
      let elementType = 'OTHER';
      let elementName = target.getAttribute('name') || target.getAttribute('id') || target.getAttribute('formcontrolname') || 'Unnamed';
      let isChecked = false;

      // Si el elemento es un input de tipo checkbox
      if (tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
        elementType = 'Checkbox';
        // isChecked = (target as HTMLInputElement).getAttribute('aria-checked') === 'true';
        isChecked = (target as HTMLInputElement).checked;
        elementName = this.ObtenerLabelCheckbox(target) || elementName;
      }
      // Si el elemento tiene una clase asociada con un checkbox de Angular Material
      else if (target.classList.contains('mat-checkbox') || target.closest('.mat-checkbox')) {
        elementType = 'Checkbox';
        const checkboxInput = target.querySelector('input[type="checkbox"]') as HTMLInputElement;
        if (checkboxInput) {
          elementName = checkboxInput.getAttribute('name') || checkboxInput.getAttribute('id') || checkboxInput.getAttribute('formcontrolname') || elementName;
          isChecked = checkboxInput.getAttribute('aria-checked') === 'true';
          isChecked=!isChecked;
          elementName = this.ObtenerLabelCheckbox(checkboxInput) || elementName;
        }
      }

      if (elementType === 'Checkbox') {
        this.registrarInteraccion(elementType, elementName, isChecked.toString());
      }
    });
  }
  ObtenerLabelCheckbox(checkbox: HTMLElement): string | null {
    // Buscar el elemento label asociado usando el atributo 'for'
    let label = checkbox.closest('label');
    if (label) {
      return label.textContent.trim();
    }
    // Si no se encuentra un label inmediato, buscar en el DOM ascendente
    let parent = checkbox.parentElement;
    while (parent) {
      if (parent.tagName === 'LABEL') {
        return parent.textContent.trim();
      }
      parent = parent.parentElement;
    }
    // Si no se encuentra un label asociado, buscar el label que apunte al input por 'for'
    const id = checkbox.getAttribute('id');
    if (id) {
      label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return label.textContent.trim();
      }
    }
    return null;
  }

  ClicInteraccionTextNumber() {
    let blurListener: Function | null = null;

    // Helper function to find the closest label in the DOM hierarchy
    const findClosestLabel = (element: HTMLElement): HTMLElement | null => {
        // Traverse up the DOM tree to find the nearest label
        let parent = element.parentElement;
        while (parent) {
            // Check if the current parent element contains a label
            const label = parent.querySelector('label');
            if (label) {
                return label;
            }
            parent = parent.parentElement;
        }

        // If no label found in the ancestors, return null
        return null;
    };

    // Listener de clic
    this.renderer.listen('document', 'click', (event) => {
        const target = event.target as HTMLElement;

        // Check if the target is a button inside a number input spinner
        if (target.closest('button') && target.closest('button')!.type === 'button') {
            return; // Ignore button clicks inside number input spinners
        }

        const tagName = target.tagName;
        let elementType = 'OTHER';
        let elementName = 'Unnamed';
        const isCustomMultiSelect = (element: HTMLElement) => {
            return element.getAttribute('role') === 'combobox' &&
                   element.getAttribute('aria-haspopup') === 'listbox' &&
                   element.hasAttribute('aria-expanded');
        };

        if (tagName === 'INPUT' && !isCustomMultiSelect(target)) {
            const inputType = target.getAttribute('type');
            const role = target.getAttribute('role');
            if ((inputType !== 'radio' && inputType !== 'checkbox')) {
                if (role === 'spinbutton' || inputType === 'number') {
                    elementType = 'Number Input';
                } else {
                    elementType = 'Text Input';
                }

                let label: HTMLElement | null = null;
                const id = target.getAttribute('id');

                // Verificar si el id sigue el patrón específico (GUID)
                const idPattern = /^[a-f0-9\-]{36}$/;
                if (id && idPattern.test(id)) {
                    // Buscar el label más cercano en el DOM
                    label = findClosestLabel(target);
                }

                if (!label && id) {
                    label = document.querySelector(`label[for="${id}"]`);
                }

                if (label) {
                    elementName = label.textContent?.trim() || 'Unnamed';
                } else {
                    elementName = target.getAttribute('name') || id || 'Unnamed';
                }

                const contenido = (target as HTMLInputElement).value;
                this.registrarInteraccion(elementType, elementName, contenido);

                // Eliminar el listener de blur anterior
                if (blurListener) {
                    blurListener();
                    blurListener = null;
                }

                // Agregar un nuevo listener de blur
                blurListener = this.renderer.listen(target, 'blur', (blurEvent) => {
                    const currentContenido = (blurEvent.target as HTMLInputElement).value;
                    this.registrarInteraccion(elementType, elementName, currentContenido);
                });
            }
        }
    });
  }

  ClicInteraccionSelect() {
    this.renderer.listen('document', 'click', (event) => {
      const target = event.target as HTMLElement;
      let elementType = 'OTHER';
      let elementName = target.getAttribute('name') || target.getAttribute('id') || target.getAttribute('formcontrolname') || 'Unnamed';
      let selectedValue = '';

      // Función auxiliar para buscar hacia arriba en el DOM
      function findParentElementByTagName(el: HTMLElement, tagName: string): HTMLElement | null {
        while (el && el.tagName !== 'BODY') {
          if (el.tagName === tagName.toUpperCase()) {
            return el;
          }
          el = el.parentElement;
        }
        return null;
      }

      // Función auxiliar para obtener el texto del label asociado
      function getLabelForElement(el: HTMLElement): string {
        let label = '';
        while (el && el.tagName !== 'BODY') {
          const parentDiv = el.parentElement;
          if (parentDiv) {
            const labelElement = parentDiv.querySelector('label.k-label') as HTMLElement;
            if (labelElement) {
              label = labelElement.innerText.trim();
              break;
            }
          }
          el = el.parentElement as HTMLElement;
        }
        return label;
      }

      // Función auxiliar para encontrar un elemento con una clase específica
      function findChildElementByClass(el: HTMLElement, className: string): HTMLElement | null {
        if (el) {
          const child = el.querySelector(`.${className}`) as HTMLElement;
          if (child) {
            return child;
          }
        }
        return null;
      }

      // Buscar hacia arriba para encontrar un kendo-dropdownlist
      const dropdownElement = findParentElementByTagName(target, 'kendo-dropdownlist');
      if (dropdownElement) {
        elementType = 'Select';
        const spanElement = findChildElementByClass(dropdownElement, 'k-input-value-text');
        if (spanElement) {
          selectedValue = spanElement.textContent || '';
        }
        elementName = getLabelForElement(dropdownElement) || elementName;
      }

      if (elementType === 'Select') {
        setTimeout(() => {
          // Guardar el valor seleccionado
          const selectedValueFinal = selectedValue;

          // Aplica el efecto blur al contenedor deseado
          const container = document.querySelector('.blur-container');
          if (container) {
            container.classList.add('blur-effect');
            // Remueve el efecto después de un tiempo
            setTimeout(() => {
              container.classList.remove('blur-effect');
            }, 1000); // Duración del efecto blur en milisegundos
          }

          // Registro de interacción con el valor seleccionado
          this.registrarInteraccion(elementType, elementName, selectedValueFinal);
        }, 0);
      }
    });
    }
    ClicInteraccionMultiSelect() {
      let blurListener: Function | null = null;

      const selectedValues: { [key: string]: string } = {};
      this.renderer.listen('document', 'click', (event) => {
          const target = event.target as HTMLElement;
          const tagName = target.tagName;
          let elementType = 'OTHER';
          let elementName = target.getAttribute('name') || target.getAttribute('id') || 'Unnamed';

          // Función para determinar si el input es un multi-select basado en atributos
          const isCustomMultiSelect = (element: HTMLElement) => {
              return element.getAttribute('role') === 'combobox' &&
                  element.getAttribute('aria-haspopup') === 'listbox' &&
                  element.getAttribute('aria-expanded') === 'true';
          };

          // Función para encontrar el label más cercano
          const getClosestLabel = (element: HTMLElement): string => {
              let label = element.closest('label');
              if (label) {
                  return label.textContent?.trim() || 'Unnamed';
              }
              const id = element.getAttribute('id');
              if (id) {
                  label = document.querySelector(`label[for="${id}"]`);
                  if (label) {
                      return label.textContent?.trim() || 'Unnamed';
                  }
              }
              let parent = element.parentElement;
              while (parent) {
                  const labels = parent.getElementsByTagName('label');
                  if (labels.length > 0) {
                      return labels[0].textContent?.trim() || 'Unnamed';
                  }
                  parent = parent.parentElement;
              }
              return 'Unnamed';
          };

          if (tagName === 'SELECT') {
              if (target.hasAttribute('multiple')) {
                  elementType = 'Multi-Select';
                  elementName = getClosestLabel(target);
                  target.addEventListener('blur', (blurEvent) => {
                      const selectedOptions = (target as HTMLSelectElement).selectedOptions;
                      selectedValues[elementName] = Array.from(selectedOptions).map(option => option.value).join(', ');
                      this.registrarInteraccion(elementType, elementName, selectedValues[elementName]);

                      // Eliminar los valores seleccionados un segundo después del blur
                      setTimeout(() => {
                          delete selectedValues[elementName];
                      }, 1000);
                  });
              } else {
                  elementType = 'Select';
                  elementName = getClosestLabel(target);
                  target.addEventListener('blur', (blurEvent) => {
                      const selectedValue = (target as HTMLSelectElement).value;
                      selectedValues[elementName] = selectedValue;
                      this.registrarInteraccion(elementType, elementName, selectedValues[elementName]);

                      // Eliminar los valores seleccionados un segundo después del blur
                      setTimeout(() => {
                          delete selectedValues[elementName];
                      }, 1000);
                  });
              }
          } else if (tagName === 'INPUT' && isCustomMultiSelect(target)) {
              elementType = 'Multi-Select';
              elementName = getClosestLabel(target);

              // Ajusta este selector para que busque solo los elementos dentro del multi-select actual
              let selector = `.k-chip[aria-hidden="false"]:not(.processed)`;

              var selectedDivs = document.querySelectorAll(selector);
              selectedValues[elementName] = Array.from(selectedDivs).map((div) => {
                  const label = (div as HTMLElement).querySelector('.k-chip-label');
                  return label ? label.textContent?.trim() || '' : '';
              }).join(', ');
              this.registrarInteraccion(elementType, elementName, selectedValues[elementName]);

              // Marcar los elementos seleccionados como procesados para evitar que se seleccionen nuevamente
              selectedDivs.forEach((div) => {
                  div.classList.add('processed');
              });
              if (blurListener) {
                blurListener();
                blurListener = null;
              }
              blurListener=this.renderer.listen(target, 'blur', (blurEvent) => {
                  var selectedDivs = document.querySelectorAll(selector);
                  selectedValues[elementName] = Array.from(selectedDivs).map((div) => {
                      const label = (div as HTMLElement).querySelector('.k-chip-label');
                      return label ? label.textContent?.trim() || '' : '';
                  }).join(', ');
                  this.registrarInteraccion(elementType, elementName, selectedValues[elementName]);

                  // Eliminar los valores seleccionados un segundo después del blur
                  setTimeout(() => {
                      delete selectedValues[elementName];
                  }, 1000);
              });
          }
      });
  }
  ClicInteraccionTab() {
    const selectedTab: { [key: string]: string } = {};
    const tabList = document.querySelector('ul[role="tablist"]');

    if (!tabList) {
        return;
    }

    tabList.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;

        const tab = target.closest('li[role="tab"]');

        if (tab) {
            // Buscar el texto dentro del span con clase 'k-link ng-star-inserted'
            const tabNameElement = tab.querySelector('.k-link.ng-star-inserted .ng-star-inserted');
            const tabName = tabNameElement ? tabNameElement.textContent?.trim() || 'Unnamed' : 'Unnamed';
            const tabIndex = tab.getAttribute('ng-reflect-index') || '0';

            selectedTab[tabIndex] = tabName;
            this.registrarInteraccion('Tab', tabName, tabIndex);

            // Eliminar el valor seleccionado un segundo después del clic
            setTimeout(() => {
                delete selectedTab[tabIndex];
            }, 1000);
        }
    });
  }
  // Método para registrar la interacción
  registrarInteraccion(elementType: string, elementName: string, contenido: string) {
    var EnlaceActual = this.urlService.getCurrentUrl()
    if (!EnlaceActual.includes('IniciarSesion')) {
      // Si la URL no contiene "IniciarSesion", ejecuta la función
      const urlSegments = EnlaceActual.split('/');

      // Obtén el último segmento de la URL
      const segmento1 = urlSegments[urlSegments.length - 2];
      const segmento2 = urlSegments[urlSegments.length - 1];
      var segmento = ''
      var NombreModulo='';
      if(segmento1!=''&&segmento2!=''){
        segmento = `${segmento1}/${segmento2}`;

        this._integraService
          .obtenerPorIdCodigo(
          constApiGestionPersonal.ModuloSistemaObtenerNombreUrlModulos,
          encodeURIComponent(segmento)
        )
        .subscribe({
          next: (x:any) => {
            if(x.body.nombreModulo!=null){
              NombreModulo=x.body.nombreModulo
            }
          },
          complete:()=>{
            const registroInteraccionModulo = {
              urlAnterior: this.urlService.getPreviousUrl(),
              urlActual: this.urlService.getCurrentUrl(),
              ipPublica: this._userService.ipPublica,
              ipLocal: 'IpLocal',
              direccionMac: 'DireccionMac',
              controlTipo: elementType,
              controlNombre: elementName,
              contenido: contenido,
              nombreModulo: NombreModulo,
            };
            this._integraService
              .insertar(constApiGlobal.InteraccionModuloInsertar, registroInteraccionModulo)
              .subscribe({
                next: (x:any) => {
                },
              });
          }
        })
      }
      else{
        const registroInteraccionModulo = {
          urlAnterior: this.urlService.getPreviousUrl(),
          urlActual: this.urlService.getCurrentUrl(),
          ipPublica: this._userService.ipPublica,
          ipLocal: 'IpLocal',
          direccionMac: 'DireccionMac',
          controlTipo: elementType,
          controlNombre: elementName,
          contenido: contenido,
          nombreModulo: '',
        };
        this._integraService
          .insertar(constApiGlobal.InteraccionModuloInsertar, registroInteraccionModulo)
          .subscribe({
            next: (x:any) => {
            },
          });
      }

    }

  }
}
