import { Material } from "../../domain/types";
import { executeQuery } from '../db/query';
import { myappDB } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class MaterialRepository {
  async findAll(): Promise<Material[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM materials ORDER BY name'
    );
    return rows as Material[];
  }

  async findById(id: number): Promise<Material | null> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM materials WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Material) : null;
  }

  async create(name: string): Promise<number> {
    try {
      const [result] = await executeQuery<ResultSetHeader>(
        myappDB,
        'INSERT INTO materials (name) VALUES (?)',
        [name]
      );
      return result.insertId;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error(`Material with name '${name}' already exists`);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await executeQuery<ResultSetHeader>(
        myappDB,
        'DELETE FROM materials WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('Cannot delete material that is used by garments');
      }
      throw error;
    }
  }
}
