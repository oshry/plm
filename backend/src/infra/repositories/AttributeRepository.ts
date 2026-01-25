import { Attribute } from "../../domain/types";
import { executeQuery } from '../db/query';
import { myappDB } from '../db/pool';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';

export class AttributeRepository {
  async findAll(): Promise<Attribute[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM attributes ORDER BY name'
    );
    return rows as Attribute[];
  }

  async findById(id: number): Promise<Attribute | null> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM attributes WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Attribute) : null;
  }

  async create(name: string): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'INSERT INTO attributes (name) VALUES (?)',
      [name]
    );
    return result.insertId;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'DELETE FROM attributes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async addAttributeIncompatibility(
    attributeIdA: number,
    attributeIdB: number
  ): Promise<boolean> {
    const [minId, maxId] = [attributeIdA, attributeIdB].sort((a, b) => a - b);

    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `INSERT IGNORE INTO attribute_incompatibilities (attribute_id_a, attribute_id_b)
       VALUES (?, ?)`,
      [minId, maxId]
    );

    return result.affectedRows > 0;
  }

  async findIncompatibilities(attributeIds: number[]): Promise<Array<{ attr1: string; attr2: string }>> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      `SELECT 
        a1.name as attr1_name,
        a2.name as attr2_name
       FROM attribute_incompatibilities ai
       JOIN attributes a1 ON ai.attribute_id_a = a1.id
       JOIN attributes a2 ON ai.attribute_id_b = a2.id
       WHERE ai.attribute_id_a IN (?) AND ai.attribute_id_b IN (?)`,
      [attributeIds, attributeIds]
    );

    return rows.map((row: any) => ({
      attr1: row.attr1_name,
      attr2: row.attr2_name,
    }));
  }
}