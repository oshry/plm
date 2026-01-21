import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { myappDB } from '../db/pool';
import { executeQuery } from '../db/query';
import { Material } from '../types';

export class MaterialService {
  async getAll(): Promise<Material[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM materials ORDER BY name'
    );
    return rows as Material[];
  }

  async getById(id: number): Promise<Material | null> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM materials WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Material) : null;
  }

  async create(name: string): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'INSERT INTO materials (name) VALUES (?)',
      [name]
    );
    return result.insertId;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'DELETE FROM materials WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
