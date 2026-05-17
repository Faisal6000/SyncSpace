import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

class SqliteDatabaseService {
  private static instance: SqliteDatabaseService;
  private db: SQLiteDatabase | null = null;
  private listeners: Set<(tableName: string) => void> = new Set();

  static getInstance(): SqliteDatabaseService {
    if (!this.instance) this.instance = new SqliteDatabaseService();
    return this.instance;
  }

  async init(): Promise<void> {
    this.db = await SQLite.openDatabase({ name: 'app.db', location: 'default' });
  }

  async createTable(tableName: string, schema: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    await this.db.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`);
  }

  async insert(tableName: string, data: Record<string, any>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    await this.db.executeSql(
      `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      values,
    );
    this.listeners.forEach(cb => cb(tableName));
  }

  async query<T>(tableName: string, where?: Record<string, any>): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    let sql = `SELECT * FROM ${tableName}`;
    const params: any[] = [];
    if (where) {
      const conditions = Object.keys(where).map(key => {
        params.push(where[key]);
        return `${key} = ?`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    const [results] = await this.db.executeSql(sql, params);
    const rows: T[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      rows.push(results.rows.item(i) as T);
    }
    return rows;
  }

  async delete(tableName: string, where: Record<string, any>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    const conditions = Object.keys(where).map(key => `${key} = ?`);
    const values = Object.values(where);
    await this.db.executeSql(
      `DELETE FROM ${tableName} WHERE ${conditions.join(' AND ')}`,
      values,
    );
    this.listeners.forEach(cb => cb(tableName));
  }
}

export const sqliteDb = SqliteDatabaseService.getInstance();
