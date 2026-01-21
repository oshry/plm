import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { myappDB } from '../../infra/db/pool';
import { executeQuery, transactionQuery } from '../../infra/db/query';
import { withTransaction } from '../../infra/db/transaction';
import { Garment, LifecycleState } from '../../domain/types';

export class GarmentService {
  async getAll(): Promise<Garment[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM garments ORDER BY created_at DESC'
    );
    return rows as Garment[];
  }

  async getById(id: number): Promise<Garment | null> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM garments WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Garment) : null;
  }

  async create(data: {
    name: string;
    category: string;
    lifecycle_state?: LifecycleState;
    base_design_id?: number;
    change_note?: string;
  }): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `INSERT INTO garments (name, category, lifecycle_state, base_design_id, change_note)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.category,
        data.lifecycle_state || LifecycleState.CONCEPT,
        data.base_design_id || null,
        data.change_note || null,
      ]
    );
    return result.insertId;
  }

  async update(
    id: number,
    data: {
      name?: string;
      category?: string;
      lifecycle_state?: LifecycleState;
      change_note?: string;
    }
  ): Promise<boolean> {
    // Validate material percentages for APPROVED or MASS_PRODUCTION states
    if (
      data.lifecycle_state === LifecycleState.APPROVED ||
      data.lifecycle_state === LifecycleState.MASS_PRODUCTION
    ) {
      const [rows] = await executeQuery<RowDataPacket[]>(
        myappDB,
        'SELECT SUM(percentage) as total FROM garment_materials WHERE garment_id = ?',
        [id]
      );

      const total = (rows[0] as any)?.total || 0;
      if (total !== 100) {
        throw new Error(
          `Cannot transition to ${data.lifecycle_state}: material percentages must sum to 100% (current: ${total}%)`
        );
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.lifecycle_state !== undefined) {
      updates.push('lifecycle_state = ?');
      values.push(data.lifecycle_state);
    }
    if (data.change_note !== undefined) {
      updates.push('change_note = ?');
      values.push(data.change_note);
    }

    if (updates.length === 0) return false;

    values.push(id);

    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `UPDATE garments SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    const garment = await this.getById(id);
    
    if (!garment) {
      return { success: false, message: 'Garment not found' };
    }

    if (garment.lifecycle_state === LifecycleState.MASS_PRODUCTION) {
      return {
        success: false,
        message: 'Cannot delete garments in mass production',
      };
    }

    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'DELETE FROM garments WHERE id = ?',
      [id]
    );

    return { success: result.affectedRows > 0 };
  }

  async addMaterial(
    garmentId: number,
    materialId: number,
    percentage: number
  ): Promise<boolean> {
    if (percentage <= 0 || percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }

    return withTransaction(myappDB, async (conn) => {
      // Check current total percentage
      const [existing] = await transactionQuery<RowDataPacket[]>(
        conn,
        `SELECT SUM(percentage) as total
         FROM garment_materials
         WHERE garment_id = ? AND material_id != ?`,
        [garmentId, materialId]
      );

      const currentTotal = (existing[0] as any)?.total || 0;
      const newTotal = currentTotal + percentage;

      if (newTotal > 100) {
        throw new Error(`Total material percentage would exceed 100% (current: ${currentTotal}%, adding: ${percentage}%)`);
      }

      const [result] = await transactionQuery<ResultSetHeader>(
        conn,
        `INSERT INTO garment_materials (garment_id, material_id, percentage)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE percentage = ?`,
        [garmentId, materialId, percentage, percentage]
      );

      return result.affectedRows > 0;
    });
  }

  async getMaterials(garmentId: number): Promise<any[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      `SELECT m.id, m.name, gm.percentage
       FROM garment_materials gm
       JOIN materials m ON gm.material_id = m.id
       WHERE gm.garment_id = ?`,
      [garmentId]
    );
    return rows;
  }

  async addAttribute(garmentId: number, attributeId: number): Promise<boolean> {
    return withTransaction(myappDB, async (conn) => {
      // Check for incompatibilities within the transaction
      const [existingAttrs] = await transactionQuery<RowDataPacket[]>(
        conn,
        'SELECT attribute_id FROM garment_attributes WHERE garment_id = ?',
        [garmentId]
      );

      const existingIds = existingAttrs.map((row: any) => row.attribute_id);
      const allIds = [...existingIds, attributeId];

      // Check incompatibilities
      if (allIds.length > 1) {
        const [conflicts] = await transactionQuery<RowDataPacket[]>(
          conn,
          `SELECT COUNT(*) as count
           FROM attribute_incompatibilities
           WHERE attribute_id_a IN (?) AND attribute_id_b IN (?)`,
          [allIds, allIds]
        );

        if ((conflicts[0] as any).count > 0) {
          throw new Error('Attribute incompatibility detected');
        }
      }

      // Insert the attribute
      const [result] = await transactionQuery<ResultSetHeader>(
        conn,
        `INSERT IGNORE INTO garment_attributes (garment_id, attribute_id)
         VALUES (?, ?)`,
        [garmentId, attributeId]
      );

      return result.affectedRows > 0;
    });
  }

  async getAttributes(garmentId: number): Promise<any[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      `SELECT a.id, a.name
       FROM garment_attributes ga
       JOIN attributes a ON ga.attribute_id = a.id
       WHERE ga.garment_id = ?`,
      [garmentId]
    );
    return rows;
  }

  async getVariations(baseDesignId: number): Promise<Garment[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM garments WHERE base_design_id = ?',
      [baseDesignId]
    );
    return rows as Garment[];
  }
}
