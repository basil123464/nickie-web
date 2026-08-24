import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  writeBatch,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order, Review, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const REVIEWS_COLLECTION = 'reviews';
const USERS_COLLECTION = 'users';

let isSeeding = false;
let hasSeeded = false;

/**
 * Ensures initial catalog products are seeded into Firestore if the collection is empty.
 */
export async function seedProductsIfEmpty(): Promise<void> {
  if (hasSeeded || isSeeding) return;
  isSeeding = true;

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      console.log('⚡ Initializing & Seeding catalog into Firebase Firestore...');
      // Batch write initial products
      const batch = writeBatch(db);
      for (const product of INITIAL_PRODUCTS) {
        const prodDoc = doc(db, PRODUCTS_COLLECTION, String(product.id));
        batch.set(prodDoc, {
          ...product,
          updatedAt: new Date().toISOString()
        });
      }
      await batch.commit();
      console.log('✅ Successfully seeded all products to Firestore!');
    }
    hasSeeded = true;
  } catch (error) {
    console.warn('Note on Firestore catalog sync:', error);
  } finally {
    isSeeding = false;
  }
}

/**
 * Subscribes to real-time updates of the product inventory.
 * Triggers callback immediately when Firestore data is updated.
 */
export function subscribeToProducts(
  onProductsUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  // Trigger seeding in background
  seedProductsIfEmpty();

  const productsRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    productsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: Number(data.id) || docSnap.id,
            name: data.name,
            category: data.category,
            price: Number(data.price),
            originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
            desc: data.desc,
            details: data.details || [],
            colors: data.colors || [{ name: 'Default', hex: '#000000' }],
            sizes: data.sizes || ['S', 'M', 'L', 'XL'],
            images: data.images && data.images.length > 0 ? data.images : [data.image],
            image: data.image,
            stock: Number(data.stock ?? 10),
            rating: Number(data.rating ?? 5.0),
            reviewsCount: Number(data.reviewsCount ?? 0),
            featured: Boolean(data.featured),
            isNewDrop: Boolean(data.isNewDrop),
            tags: data.tags || []
          } as Product);
        });
        onProductsUpdate(items);
      } else {
        // If snapshot is empty, fallback to local initial products and seed
        onProductsUpdate(INITIAL_PRODUCTS);
        seedProductsIfEmpty();
      }
    },
    (err) => {
      console.warn('Firestore products listener fallback:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch products from Firestore once.
 */
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    await seedProductsIfEmpty();
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return INITIAL_PRODUCTS;
    }

    const items: Product[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: Number(data.id) || docSnap.id,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        desc: data.desc,
        details: data.details || [],
        colors: data.colors || [{ name: 'Default', hex: '#000000' }],
        sizes: data.sizes || ['S', 'M', 'L', 'XL'],
        images: data.images && data.images.length > 0 ? data.images : [data.image],
        image: data.image,
        stock: Number(data.stock ?? 10),
        rating: Number(data.rating ?? 5.0),
        reviewsCount: Number(data.reviewsCount ?? 0),
        featured: Boolean(data.featured),
        isNewDrop: Boolean(data.isNewDrop),
        tags: data.tags || []
      } as Product);
    });

    return items;
  } catch (err) {
    console.warn('Error reading from Firestore, returning local data:', err);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Adds or updates a product in Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<Product> {
  try {
    const prodDoc = doc(db, PRODUCTS_COLLECTION, String(product.id));
    await setDoc(prodDoc, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return product;
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    return product;
  }
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProductFromFirestore(productId: number | string): Promise<boolean> {
  try {
    const prodDoc = doc(db, PRODUCTS_COLLECTION, String(productId));
    await deleteDoc(prodDoc);
    return true;
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    return false;
  }
}

/**
 * Saves a newly placed customer order to Firestore.
 */
export async function saveOrderToFirestore(order: Order): Promise<Order> {
  try {
    const orderDoc = doc(db, ORDERS_COLLECTION, order.id || `ord-${Date.now()}`);
    await setDoc(orderDoc, {
      ...order,
      createdAt: order.createdAt || new Date().toISOString()
    }, { merge: true });
    return order;
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
    return order;
  }
}

/**
 * Real-time listener for orders.
 */
export function subscribeToOrders(
  onOrdersUpdate: (orders: Order[]) => void
): Unsubscribe {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    ordersRef,
    (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onOrdersUpdate(items);
    },
    (err) => {
      console.warn('Orders subscription error:', err);
    }
  );
}

/**
 * Update order status in Firestore.
 */
export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    const orderDoc = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDoc, {
      status,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Failed to update order status in Firestore:', err);
    return false;
  }
}

/**
 * Look up order by tracking code.
 */
export async function getOrderByTrackingCodeFromFirestore(code: string): Promise<Order | null> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, where('trackingCode', '==', code.toUpperCase().trim()));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const first = snapshot.docs[0];
      return { id: first.id, ...first.data() } as Order;
    }
    return null;
  } catch (err) {
    console.warn('Tracking lookup from Firestore failed:', err);
    return null;
  }
}

/**
 * Save review to Firestore.
 */
export async function saveReviewToFirestore(review: Review): Promise<Review> {
  try {
    const reviewDoc = doc(db, REVIEWS_COLLECTION, review.id || `rev-${Date.now()}`);
    await setDoc(reviewDoc, review, { merge: true });
    return review;
  } catch (err) {
    console.error('Failed to save review to Firestore:', err);
    return review;
  }
}
