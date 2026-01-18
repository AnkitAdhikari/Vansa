import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAppContext } from '@/contexts/AppContext';

export interface Product {
  id: string;
  name: string;
  category: 'Kitchen' | 'Bathroom' | 'Groceries';
  quantityPercent: number;
  status: 'inStock' | 'low' | 'out' | 'needed';
  addedBy: string;
  groupId: string;
  updatedAt: Date;
}

export const useProducts = (groupId?: string) => {
  const { user } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products for the group
  useEffect(() => {
    if (!groupId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'products'), where('groupId', '==', groupId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Product, 'id'>;
        productsData.push({ id: doc.id, ...data });
      });
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });
    return unsubscribe;
  }, [groupId]);

  // Add product
  const addProduct = async (productData: Omit<Product, 'id' | 'addedBy' | 'groupId' | 'updatedAt'>) => {
    if (!user || !groupId) return;
    setError(null);
    try {
      await addDoc(collection(db, 'products'), {
        ...productData,
        addedBy: user.uid,
        groupId,
        updatedAt: new Date(),
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Edit product
  const editProduct = async (productId: string, updates: Partial<Omit<Product, 'id' | 'addedBy' | 'groupId'>>) => {
    if (!user) return;
    setError(null);
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    setError(null);
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
  };
};