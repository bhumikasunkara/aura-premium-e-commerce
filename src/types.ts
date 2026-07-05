export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  name: string;
  avatar: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ProductVariants {
  sizes: string[];
  colors: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  variants: ProductVariants;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  trending?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface WishlistItem {
  productId: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  orderItems: OrderItem[];
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingOption: 'Standard' | 'Express';
  shippingCost: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
  discountAmount: number;
  totalAmount: number;
  date: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  expiryDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
}
