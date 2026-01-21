import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { myappDB } from '../../infra/db/pool';
import { executeQuery } from '../../infra/db/query';
import { Supplier, GarmentSupplier, SupplierStatus } from '../../domain/types';

export class SupplierService {
  async getAll(): Promise<Supplier[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM suppliers ORDER BY name'
    );
    return rows as Supplier[];
  }

  async getById(id: number): Promise<Supplier | null> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Supplier) : null;
  }

  async create(data: {
    name: string;
    contact_email?: string;
  }): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'INSERT INTO suppliers (name, contact_email) VALUES (?, ?)',
      [data.name, data.contact_email || null]
    );
    return result.insertId;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'DELETE FROM suppliers WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async addToGarment(
    garmentId: number,
    supplierId: number,
    status: SupplierStatus = SupplierStatus.OFFERED
  ): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `INSERT INTO garment_suppliers (garment_id, supplier_id, status)
       VALUES (?, ?, ?)`,
      [garmentId, supplierId, status]
    );
    return result.insertId;
  }

  async getGarmentSuppliers(garmentId: number): Promise<any[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      `SELECT 
        gs.id,
        gs.status,
        gs.created_at,
        gs.updated_at,
        s.id as supplier_id,
        s.name as supplier_name,
        s.contact_email
       FROM garment_suppliers gs
       JOIN suppliers s ON gs.supplier_id = s.id
       WHERE gs.garment_id = ?
       ORDER BY gs.created_at DESC`,
      [garmentId]
    );
    return rows;
  }

  async updateSupplierStatus(
    garmentSupplierId: number,
    status: SupplierStatus
  ): Promise<boolean> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      'UPDATE garment_suppliers SET status = ? WHERE id = ?',
      [status, garmentSupplierId]
    );
    return result.affectedRows > 0;
  }

  async addOffer(data: {
    garment_supplier_id: number;
    price: number;
    currency?: string;
    lead_time_days: number;
  }): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `INSERT INTO supplier_offers (garment_supplier_id, price, currency, lead_time_days)
       VALUES (?, ?, ?, ?)`,
      [
        data.garment_supplier_id,
        data.price,
        data.currency || 'USD',
        data.lead_time_days,
      ]
    );
    return result.insertId;
  }

  async getOffers(garmentSupplierId: number): Promise<any[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      `SELECT * FROM supplier_offers 
       WHERE garment_supplier_id = ?
       ORDER BY created_at DESC`,
      [garmentSupplierId]
    );
    return rows;
  }

  async addSampleSet(data: {
    garment_supplier_id: number;
    notes?: string;
  }): Promise<number> {
    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `INSERT INTO sample_sets (garment_supplier_id, notes)
       VALUES (?, ?)`,
      [data.garment_supplier_id, data.notes || null]
    );
    return result.insertId;
  }

  async updateSampleStatus(
    sampleId: number,
    status: string,
    notes?: string
  ): Promise<boolean> {
    const updates = ['status = ?'];
    const values: any[] = [status];

    if (status === 'RECEIVED' || status === 'PASSED' || status === 'FAILED') {
      updates.push('received_at = CURRENT_TIMESTAMP');
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    values.push(sampleId);

    const [result] = await executeQuery<ResultSetHeader>(
      myappDB,
      `UPDATE sample_sets SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async getSamples(garmentSupplierId: number): Promise<any[]> {
    const [rows] = await executeQuery<RowDataPacket[]>(
      myappDB,
      `SELECT * FROM sample_sets 
       WHERE garment_supplier_id = ?
       ORDER BY id DESC`,
      [garmentSupplierId]
    );
    return rows;
  }
}
