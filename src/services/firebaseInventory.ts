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
 * Ensures all catalog products and pictures are synced into Firestore with high-res images and multi-angle galleries.
 */
export async function seedProductsIfEmpty(forceSync = false): Promise<void> {
  if ((hasSeeded && !forceSync) || isSeeding) return;
  isSeeding = true;

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty || forceSync) {
      console.log('⚡ Syncing full picture catalog & inventory into Firebase Firestore...');
      const batch = writeBatch(db);
      for (const product of INITIAL_PRODUCTS) {
        const prodDoc = doc(db, PRODUCTS_COLLECTION, String(product.id));
        batch.set(prodDoc, {
          ...product,
          image: product.image,
          images: product.images && product.images.length > 0 ? product.images : [product.image],
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      await batch.commit();
      console.log(`✅ Successfully synced ${INITIAL_PRODUCTS.length} products with pictures to Firestore!`);
    } else {
      // Reconcile missing images or new products in Firestore
      const existingDocIds = new Set<string>();
      snapshot.forEach(docSnap => existingDocIds.add(docSnap.id));

      const batch = writeBatch(db);
      let needsCommit = false;

      for (const product of INITIAL_PRODUCTS) {
        const idStr = String(product.id);
        if (!existingDocIds.has(idStr)) {
          const prodDoc = doc(db, PRODUCTS_COLLECTION, idStr);
          batch.set(prodDoc, {
            ...product,
            image: product.image,
            images: product.images && product.images.length > 0 ? product.images : [product.image],
            updatedAt: new Date().toISOString()
          });
          needsCommit = true;
        }
      }

      if (needsCommit) {
        await batch.commit();
        console.log('✅ Reconciled missing products into Firestore!');
      }
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
  // Trigger seeding & sync in background
  seedProductsIfEmpty();

  const productsRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    productsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Find matching initial product for gallery fallback if needed
          const localMatch = INITIAL_PRODUCTS.find(p => String(p.id) === String(data.id || docSnap.id));
          const primaryImage = data.image || localMatch?.image || '/images/chelsea.jpeg';
          const galleryImages = (data.images && data.images.length > 0) ? data.images : (localMatch?.images || [primaryImage]);

          items.push({
            id: Number(data.id) || docSnap.id,
            name: data.name || localMatch?.name || 'Garment Drop',
            category: data.category || localMatch?.category || 'season_26_27',
            price: Number(data.price || localMatch?.price || 1500),
            originalPrice: data.originalPrice ? Number(data.originalPrice) : localMatch?.originalPrice,
            desc: data.desc || localMatch?.desc || '',
            details: data.details || localMatch?.details || [],
            colors: data.colors || localMatch?.colors || [{ name: 'Default', hex: '#000000' }],
            sizes: data.sizes || localMatch?.sizes || ['S', 'M', 'L', 'XL'],
            images: galleryImages,
            image: primaryImage,
            stock: Number(data.stock ?? localMatch?.stock ?? 10),
            rating: Number(data.rating ?? localMatch?.rating ?? 5.0),
            reviewsCount: Number(data.reviewsCount ?? localMatch?.reviewsCount ?? 0),
            featured: Boolean(data.featured ?? localMatch?.featured),
            isNewDrop: Boolean(data.isNewDrop ?? localMatch?.isNewDrop),
            tags: data.tags || localMatch?.tags || []
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
      const localMatch = INITIAL_PRODUCTS.find(p => String(p.id) === String(data.id || docSnap.id));
      const primaryImage = data.image || localMatch?.image || '/images/chelsea.jpeg';
      const galleryImages = (data.images && data.images.length > 0) ? data.images : (localMatch?.images || [primaryImage]);

      items.push({
        id: Number(data.id) || docSnap.id,
        name: data.name || localMatch?.name || 'Garment Drop',
        category: data.category || localMatch?.category || 'season_26_27',
        price: Number(data.price || localMatch?.price || 1500),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : localMatch?.originalPrice,
        desc: data.desc || localMatch?.desc || '',
        details: data.details || localMatch?.details || [],
        colors: data.colors || localMatch?.colors || [{ name: 'Default', hex: '#000000' }],
        sizes: data.sizes || localMatch?.sizes || ['S', 'M', 'L', 'XL'],
        images: galleryImages,
        image: primaryImage,
        stock: Number(data.stock ?? localMatch?.stock ?? 10),
        rating: Number(data.rating ?? localMatch?.rating ?? 5.0),
        reviewsCount: Number(data.reviewsCount ?? localMatch?.reviewsCount ?? 0),
        featured: Boolean(data.featured ?? localMatch?.featured),
        isNewDrop: Boolean(data.isNewDrop ?? localMatch?.isNewDrop),
        tags: data.tags || localMatch?.tags || []
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
      image: product.image,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
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
