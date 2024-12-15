import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexDbService {
  private db: IDBDatabase | null = null;

  constructor() { 
    this.initializeDatabase();
  }

  initializeDatabase() {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      if (!this.db?.objectStoreNames.contains('MyStore')) {
        this.db?.createObjectStore('MyStore', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      console.log('Database initialized');
    };

    request.onerror = (event: any) => {
      console.error('Database error:', event.target.error);
    };
  }

  addData(data: { id: number; [key: string]: any }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction(['MyStore'], 'readwrite');
      const store = transaction.objectStore('MyStore');
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction(['MyStore'], 'readonly');
      const store = transaction.objectStore('MyStore');
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  deleteRecordById(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction(['MyStore'], 'readwrite');
      const store = transaction.objectStore('MyStore');
      const request = store.delete(id);
      request.onsuccess = () => {
        console.log(`Record with ID ${id} deleted successfully.`);
        resolve();
      };

      request.onerror = (event: any) => {
        console.error(`Error deleting record with ID ${id}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  getByID(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction(['MyStore'], 'readonly');
      const store = transaction.objectStore('MyStore');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  edit(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction(['MyStore'], 'readwrite');
      const store = transaction.objectStore('MyStore');
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }
}
