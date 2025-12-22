
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, limit, updateDoc, arrayUnion, writeBatch } from 'firebase/firestore';
import { Manual, NewsItem, FeedbackItem, ManualCategory, VisitRecord, EmployeeCourse, RecommendedCourse, IpAlias, Supplier, DeviceAlias } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyB-gOKzbpoE9AZo2NVjJYmdeupjbrWWK7U",
  authDomain: "moscato-c178a.firebaseapp.com",
  projectId: "moscato-c178a",
  storageBucket: "moscato-c178a.firebasestorage.app",
  messagingSenderId: "814979149684",
  appId: "1:814979149684:web:e55135fc457791ccaf4621",
  measurementId: "G-H7615W5F0M"
};

const isFirebaseConfigured = firebaseConfig.apiKey !== "";
let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
  }
}

const STORAGE_KEYS = {
  MANUALS: 'moscato_portal_manuals_v5', 
  NEWS: 'moscato_portal_news_v2',
  FEEDBACK: 'moscato_portal_feedback_v2',
  EMPLOYEE_COURSES: 'moscato_portal_emp_courses_v1',
  RECOMMENDED_COURSES: 'moscato_portal_rec_courses_v1',
  IP_ALIASES: 'moscato_portal_ip_aliases_v1',
  DEVICE_ALIASES: 'moscato_portal_device_aliases_v1',
  SUPPLIERS: 'moscato_portal_suppliers_v1',
  DEVICE_ID: 'moscato_device_id_v1'
};

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

export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export const storageService = {
  getOrCreateDeviceId,

  // --- MANUALS ---
  async getManuals(): Promise<Manual[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "manuals"), orderBy("title", "asc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manual));
      } catch (e) { 
        console.error("Error fetching manuals from Firebase:", e);
        return getLocal(STORAGE_KEYS.MANUALS, []); 
      }
    }
    return getLocal(STORAGE_KEYS.MANUALS, []);
  },

  async addManual(manual: Manual): Promise<Manual> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = manual;
      const docRef = await addDoc(collection(db, "manuals"), data);
      return { ...manual, id: docRef.id };
    }
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, []);
    const updated = [manual, ...current];
    setLocal(STORAGE_KEYS.MANUALS, updated);
    return manual;
  },

  async deleteManual(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "manuals", id));
      } catch (e) {}
      return;
    }
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, []);
    setLocal(STORAGE_KEYS.MANUALS, current.filter(m => m.id !== id));
  },

  // --- NEWS ---
  async getNews(): Promise<NewsItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      } catch (e) { return getLocal(STORAGE_KEYS.NEWS, []); }
    }
    return getLocal(STORAGE_KEYS.NEWS, []);
  },

  async addNews(item: NewsItem): Promise<NewsItem> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = item;
      const docRef = await addDoc(collection(db, "news"), data);
      return { ...item, id: docRef.id };
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, [item, ...current]);
    return item;
  },

  async updateNews(item: NewsItem): Promise<void> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = item;
      await updateDoc(doc(db, "news", id), data);
      return;
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, current.map(n => n.id === item.id ? item : n));
  },

  async deleteNews(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "news", id));
      return;
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, current.filter(n => n.id !== id));
  },

  // --- FEEDBACK ---
  async getFeedback(): Promise<FeedbackItem[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackItem));
    }
    return getLocal(STORAGE_KEYS.FEEDBACK, []);
  },

  async addFeedback(item: FeedbackItem): Promise<FeedbackItem> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = item;
      const docRef = await addDoc(collection(db, "feedback"), data);
      return { ...item, id: docRef.id };
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, [item, ...current]);
    return item;
  },

  async updateFeedback(item: FeedbackItem): Promise<void> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = item;
      await updateDoc(doc(db, "feedback", id), data);
      return;
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, current.map(f => f.id === item.id ? item : f));
  },

  async deleteFeedback(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "feedback", id));
      return;
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, current.filter(f => f.id !== id));
  },

  // --- IP & DEVICE ALIASES ---
  async getIpAliases(): Promise<IpAlias[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "ip_aliases"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IpAlias));
    }
    return getLocal(STORAGE_KEYS.IP_ALIASES, []);
  },

  async addIpAlias(alias: IpAlias): Promise<IpAlias> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = alias;
      const docRef = await addDoc(collection(db, "ip_aliases"), data);
      return { ...alias, id: docRef.id };
    }
    const current = getLocal<IpAlias[]>(STORAGE_KEYS.IP_ALIASES, []);
    setLocal(STORAGE_KEYS.IP_ALIASES, [alias, ...current]);
    return alias;
  },

  async deleteIpAlias(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "ip_aliases", id));
      return;
    }
    const current = getLocal<IpAlias[]>(STORAGE_KEYS.IP_ALIASES, []);
    setLocal(STORAGE_KEYS.IP_ALIASES, current.filter(a => a.id !== id));
  },

  async getDeviceAliases(): Promise<DeviceAlias[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "device_aliases"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DeviceAlias));
    }
    return getLocal(STORAGE_KEYS.DEVICE_ALIASES, []);
  },

  async addDeviceAlias(alias: DeviceAlias): Promise<DeviceAlias> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = alias;
      const docRef = await addDoc(collection(db, "device_aliases"), data);
      return { ...alias, id: docRef.id };
    }
    const current = getLocal<DeviceAlias[]>(STORAGE_KEYS.DEVICE_ALIASES, []);
    setLocal(STORAGE_KEYS.DEVICE_ALIASES, [alias, ...current]);
    return alias;
  },

  async deleteDeviceAlias(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "device_aliases", id));
      return;
    }
    const current = getLocal<DeviceAlias[]>(STORAGE_KEYS.DEVICE_ALIASES, []);
    setLocal(STORAGE_KEYS.DEVICE_ALIASES, current.filter(a => a.id !== id));
  },

  // --- SUPPLIERS ---
  async getSuppliers(): Promise<Supplier[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "suppliers"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
    }
    return getLocal(STORAGE_KEYS.SUPPLIERS, []);
  },

  async addSupplier(supplier: Supplier): Promise<Supplier> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = supplier;
      const docRef = await addDoc(collection(db, "suppliers"), data);
      return { ...supplier, id: docRef.id };
    }
    const current = getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, []);
    setLocal(STORAGE_KEYS.SUPPLIERS, [supplier, ...current]);
    return supplier;
  },

  async updateSupplier(supplier: Supplier): Promise<void> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = supplier;
      await updateDoc(doc(db, "suppliers", id), data);
      return;
    }
    const current = getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, []);
    setLocal(STORAGE_KEYS.SUPPLIERS, current.map(s => s.id === supplier.id ? supplier : s));
  },

  async deleteSupplier(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "suppliers", id));
      return;
    }
    const current = getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, []);
    setLocal(STORAGE_KEYS.SUPPLIERS, current.filter(s => s.id !== id));
  },

  // --- VISIT COUNTER (ANALYTICS) ---
  async recordVisit(): Promise<string | null> {
    let ipAddress = 'Desconocido';
    let ispProvider = '';
    const deviceId = getOrCreateDeviceId();

    try {
        const response = await fetch('https://ipinfo.io/json');
        if (response.ok) {
            const data = await response.json();
            ipAddress = data.ip;
            ispProvider = data.org || ''; 
        }
    } catch (error) {}

    const visitData: Omit<VisitRecord, 'id'> = {
      timestamp: Date.now(),
      dateString: new Date().toLocaleDateString('es-AR'),
      deviceInfo: navigator.userAgent,
      deviceId: deviceId,
      ip: ipAddress,
      isp: ispProvider, 
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sectionsVisited: ['Inicio'] 
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "visits"), visitData);
        return docRef.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  async trackPageNavigation(visitId: string, pageName: string): Promise<void> {
    if (!visitId || !isFirebaseConfigured || !db) return;
    try {
      const visitRef = doc(db, "visits", visitId);
      await updateDoc(visitRef, {
        sectionsVisited: arrayUnion(pageName)
      });
    } catch (e) {}
  },

  async getVisits(): Promise<VisitRecord[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "visits"), orderBy("timestamp", "desc"), limit(1000));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisitRecord));
    }
    return [];
  },

  async clearVisits(): Promise<void> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "visits"));
      const snapshot = await getDocs(q);
      const BATCH_SIZE = 400;
      let batch = writeBatch(db);
      let count = 0;
      for (const document of snapshot.docs) {
          batch.delete(doc(db, "visits", document.id));
          count++;
          if (count >= BATCH_SIZE) {
              await batch.commit();
              batch = writeBatch(db);
              count = 0;
          }
      }
      if (count > 0) await batch.commit();
    }
  },

  async getEmployeeCourses(): Promise<EmployeeCourse[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "employee_courses"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmployeeCourse));
    }
    return getLocal(STORAGE_KEYS.EMPLOYEE_COURSES, []);
  },

  async addEmployeeCourse(course: EmployeeCourse): Promise<EmployeeCourse> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = course;
      const docRef = await addDoc(collection(db, "employee_courses"), data);
      return { ...course, id: docRef.id };
    }
    return course;
  },

  async updateEmployeeCourse(course: EmployeeCourse): Promise<void> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = course;
      await updateDoc(doc(db, "employee_courses", id), data);
    }
  },

  async deleteEmployeeCourse(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "employee_courses", id));
    }
  },

  async getRecommendedCourses(): Promise<RecommendedCourse[]> {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, "recommended_courses"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecommendedCourse));
    }
    return getLocal(STORAGE_KEYS.RECOMMENDED_COURSES, []);
  },

  async addRecommendedCourse(course: RecommendedCourse): Promise<RecommendedCourse> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = course;
      const docRef = await addDoc(collection(db, "recommended_courses"), data);
      return { ...course, id: docRef.id };
    }
    return course;
  },

  async updateRecommendedCourse(course: RecommendedCourse): Promise<void> {
    if (isFirebaseConfigured && db) {
      const { id, ...data } = course;
      await updateDoc(doc(db, "recommended_courses", id), data);
    }
  },

  async deleteRecommendedCourse(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "recommended_courses", id));
    }
  }
};
