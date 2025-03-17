import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './cart.component';
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ShoppingCart } from '../../core/models/shoppingCart.model';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let shoppingCartService: jasmine.SpyObj<ShoppingCartService>;

  beforeEach(async () => {
    // Crear un spy object para el servicio
    const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
      'getShoppingCarts',
      'calculateCartTotal',
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ShoppingCartComponent], // Importar el componente y HttpClientTestingModule
      providers: [
        { provide: ShoppingCartService, useValue: shoppingCartServiceSpy }, // Proveer el servicio mockeado
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    shoppingCartService = TestBed.inject(
      ShoppingCartService
    ) as jasmine.SpyObj<ShoppingCartService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los carritos al inicializar', () => {
    const mockCarts: ShoppingCart[] = [
      { id: 1, clientId: 1, cartItems: [] },
      { id: 2, clientId: 2, cartItems: [] },
    ];

    // Simular la respuesta del servicio
    shoppingCartService.getShoppingCarts.and.returnValue(of(mockCarts));

    // Llamar a ngOnInit manualmente
    component.ngOnInit();

    // Verificar que los carritos se cargaron correctamente
    expect(component.shoppingCarts).toEqual(mockCarts);
    expect(shoppingCartService.getShoppingCarts).toHaveBeenCalled();
  });

  it('debería manejar errores al cargar los carritos', () => {
    // Simular un error en el servicio
    shoppingCartService.getShoppingCarts.and.returnValue(
      throwError('Error al cargar los carritos')
    );

    // Llamar a ngOnInit manualmente
    component.ngOnInit();

    // Verificar que se manejó el error correctamente
    expect(component.errorMessage).toBe(
      'Error al cargar los carritos. Inténtalo de nuevo más tarde.'
    );
  });

  it('debería calcular el total de un carrito', () => {
    const mockTotal = 100;
    const cartId = 1;

    // Simular la respuesta del servicio
    shoppingCartService.calculateCartTotal.and.returnValue(of(mockTotal));

    // Llamar al método calculateTotal
    component.calculateTotal(cartId);

    // Verificar que el total se calculó correctamente
    expect(component.cartTotals[cartId]).toBe(mockTotal);
    expect(shoppingCartService.calculateCartTotal).toHaveBeenCalledWith(cartId);
  });

  it('debería mostrar los ítems del carrito en el HTML', () => {
    const mockCarts: ShoppingCart[] = [
      {
        id: 1,
        clientId: 1,
        cartItems: [
          { id: 1, productId: 101, quantity: 2, unitPrice: 50, shoppingCartId: 1 },
        ],
      },
    ];

    // Simular la respuesta del servicio
    shoppingCartService.getShoppingCarts.and.returnValue(of(mockCarts));

    // Llamar a ngOnInit manualmente
    component.ngOnInit();
    fixture.detectChanges(); // Actualizar la vista

    // Verificar que los ítems se muestren en el HTML
    const compiled = fixture.nativeElement;
    const itemsList = compiled.querySelector('ul');
    expect(itemsList).toBeTruthy();
    expect(itemsList.textContent).toContain('Producto ID: 101');
    expect(itemsList.textContent).toContain('Cantidad: 2');
    expect(itemsList.textContent).toContain('Precio: 50');
  });
});