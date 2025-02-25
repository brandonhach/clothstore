import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  /**
   * We can subscribe to this BehaviorSubject and retrieve the new values & update the UI.
   * BehaviorSubject (from RxJS lib) holds & emit most recent value to subscribers.
   * Kinda like useState or context in React where it holds the state of a property.
   * For this, cart is a Behavior Subject of type Cart with initial value of [] which is a Cart.items property
   */
  cart = new BehaviorSubject<Cart>(this.getCartFromStorage());

  constructor() {}

  private getCartFromStorage(): Cart {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  }

  private updateStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /**
   * Add an item to cart.
   * Using the spread operator to add items based on update state.
   * Emits items
   * @param item
   */
  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemsInCart = items.find((_item) => _item.id === item.id);

    if (itemsInCart) {
      itemsInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this.updateStorage({ items });
    // console.log(this.cart.value);
  }

  cancelCartItem(item: CartItem): void {
    const items = this.cart.value.items.filter((_item) => _item.id !== item.id);
    this.cart.next({ items });
    this.updateStorage({ items });
  }

  clearCart(): void {
    this.cart.next({ items: [] });
  }

  getTotal(): number {
    const items = [...this.cart.value.items];
    return items
      .map((item) => item.product.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }
}
