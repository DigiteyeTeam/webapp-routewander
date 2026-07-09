export interface CartItem {
  id: string;
  routeId: string;
  routeTitle: string;
  routeImage: string;
  creatorName: string;
  guestCount: number;
  unitPrice: number;
  subtotal: number;
  listPrice?: number;
  hotelSlug?: string;
  hotelName?: string;
  addedAt: string;
}

export interface CheckoutOrderItem {
  routeId: string;
  routeTitle: string;
  guestCount: number;
  amount: number;
  listPrice?: number;
  hotelSlug?: string;
  hotelName?: string;
}
