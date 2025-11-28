
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Manual, NewsItem, FeedbackItem, ManualCategory } from '../types';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyB-gOKzbpoE9AZo2NVjJYmdeupjbrWWK7U",
  authDomain: "moscato-c178a.firebaseapp.com",
  projectId: "moscato-c178a",
  storageBucket: "moscato-c178a.firebasestorage.app",
  messagingSenderId: "814979149684",
  appId: "1:814979149684:web:e55135fc457791ccaf4621",
  measurementId: "G-H7615W5F0M"
};

// Check if Firebase is configured (keys are not empty)
const isFirebaseConfigured = firebaseConfig.apiKey !== "";

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Conectado a Firebase Cloud (Moscato Neumáticos)");
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
  }
} else {
  console.log("Firebase no configurado. Usando LocalStorage (Modo Offline/Local).");
}

// --- LOCAL STORAGE KEYS ---
const STORAGE_KEYS = {
  MANUALS: 'moscato_portal_manuals_v1',
  NEWS: 'moscato_portal_news_v1',
  FEEDBACK: 'moscato_portal_feedback_v1'
};

// --- INITIAL DATA FALLBACK ---
const INITIAL_MANUALS: Manual[] = [
  {
    id: '1',
    title: 'Reparación de Ruedas (Pinchadura Sin Cámara)',
    category: ManualCategory.TALLER,
    description: 'Procedimiento estándar para reparación de neumáticos sin cámara.',
    lastUpdated: '20/05/2024',
    textContent: 'Contenido del manual disponible una vez cargado en el sistema...' 
  }
];

// --- HELPERS ---
function getLocal<T>(key: string, defaultData: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

function setLocal(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Helper to handle and log Firebase errors friendly
const handleFirebaseError = (e: any, context: string) => {
  console.error(`Error en ${context}:`, e);
  
  // Detectar si la API no está habilitada
  if (e.message?.includes('Cloud Firestore API') || e.code === 'permission-denied') {
    console.warn(`
      🚨 ATENCIÓN: La base de datos no está habilitada en Firebase Console.
      
      PASOS PARA SOLUCIONAR:
      1. Entra a https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore
      2. Haz clic en "Crear base de datos"
      3. Selecciona "Modo de prueba" (Test mode) y Habilitar.
    `);
  }
};

// --- STORAGE SERVICE ---
export const storageService = {
  
  // --- MANUALS ---
  async getManuals(): Promise<Manual[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "manuals"));
        const querySnapshot = await getDocs(q);
        const manuals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manual));
        // If empty, we might want initial data, but usually empty array is correct for cloud
        return manuals.length > 0 ? manuals : getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
      } catch (e) {
        handleFirebaseError(e, 'getManuals');
        return getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
      }
    }
    return getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
  },

  async addManual(manual: Manual): Promise<Manual> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = manual; 
        const docRef = await addDoc(collection(db, "manuals"), data);
        return { ...manual, id: docRef.id };
      } catch (e) {
        handleFirebaseError(e, 'addManual');
      }
    }
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
    const updated = [manual, ...current];
    setLocal(STORAGE_KEYS.MANUALS, updated);
    return manual;
  },

  async deleteManual(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "manuals", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteManual'); }
    }
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, []);
    setLocal(STORAGE_KEYS.MANUALS, current.filter(m => m.id !== id));
  },

  // --- NEWS ---
  async getNews(): Promise<NewsItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "news"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      } catch (e) { handleFirebaseError(e, 'getNews'); }
    }
    return getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
  },

  async addNews(item: NewsItem): Promise<NewsItem> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, "news"), data);
        return { ...item, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addNews'); }
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, [item, ...current]);
    return item;
  },

  async deleteNews(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "news", id));
        return;
      } catch (e) { handleFirebaseError(e, 'deleteNews'); }
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, current.filter(n => n.id !== id));
  },

  // --- FEEDBACK / MESSAGES ---
  async getFeedback(): Promise<FeedbackItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackItem));
      } catch (e) {
        handleFirebaseError(e, 'getFeedback');
      }
    }
    return getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
  },

  async addFeedback(item: FeedbackItem): Promise<FeedbackItem> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, "feedback"), data);
        return { ...item, id: docRef.id };
      } catch (e) {
        handleFirebaseError(e, 'addFeedback');
      }
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, [item, ...current]);
    return item;
  },

  async deleteFeedback(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "feedback", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteFeedback'); }
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, current.filter(f => f.id !== id));
  },

  // --- HELPERS ---
  getLocal,
  setLocal
};
