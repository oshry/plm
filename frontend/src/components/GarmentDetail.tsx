import { useState, useEffect } from 'react';
import { garmentsApi, suppliersApi } from '../api/garments';
import { Garment, LifecycleState, GarmentSupplier } from '../types';

interface GarmentDetailProps {
  garmentId: number;
  onBack: () => void;
  onEdit: (garment: Garment) => void;
}

const lifecycleStates = [
  LifecycleState.CONCEPT,
  LifecycleState.DESIGN,
  LifecycleState.SAMPLE,
  LifecycleState.APPROVED,
  LifecycleState.MASS_PRODUCTION,
];

export function GarmentDetail({ garmentId, onBack, onEdit }: GarmentDetailProps) {
  const [garment, setGarment] = useState<Garment | null>(null);
  const [suppliers, setSuppliers] = useState<GarmentSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGarment();
    loadSuppliers();
  }, [garmentId]);

  const loadGarment = async () => {
    try {
      setLoading(true);
      const data = await garmentsApi.getById(garmentId);
      setGarment(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load garment');
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await suppliersApi.getGarmentSuppliers(garmentId);
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this garment?')) return;

    try {
      await garmentsApi.delete(garmentId);
      onBack();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete garment');
    }
  };

  const handleLifecycleChange = async (newState: LifecycleState) => {
    if (!garment) return;

    try {
      await garmentsApi.update(garmentId, { lifecycle_state: newState });
      loadGarment();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update lifecycle state');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !garment) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'Garment not found'}</p>
        <button onClick={onBack} className="mt-2 text-blue-600 hover:text-blue-800 underline">
          ← Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(garment)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{garment.name}</h1>
        <p className="text-gray-600 mb-4">{garment.category}</p>

        {garment.base_design_id && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Variation of:</strong> Garment #{garment.base_design_id}
            </p>
            {garment.change_note && (
              <p className="text-sm text-blue-700 mt-1">
                <strong>Changes:</strong> {garment.change_note}
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lifecycle State
          </label>
          <select
            value={garment.lifecycle_state}
            onChange={(e) => handleLifecycleChange(e.target.value as LifecycleState)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifecycleStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Materials</h3>
            {garment.materials && garment.materials.length > 0 ? (
              <ul className="space-y-2">
                {garment.materials.map((material) => (
                  <li key={material.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{material.name}</span>
                    <span className="text-gray-500 text-sm">{material.percentage}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No materials added</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Attributes</h3>
            {garment.attributes && garment.attributes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {garment.attributes.map((attr) => (
                  <span
                    key={attr.id}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {attr.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No attributes added</p>
            )}
          </div>
        </div>

        {suppliers.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Suppliers</h3>
            <div className="space-y-2">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{supplier.supplier_name}</p>
                    {supplier.contact_email && (
                      <p className="text-sm text-gray-600">{supplier.contact_email}</p>
                    )}
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {supplier.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {garment.variations && garment.variations.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Design Variations</h3>
            <div className="space-y-2">
              {garment.variations.map((variation) => (
                <div key={variation.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{variation.name}</p>
                  {variation.change_note && (
                    <p className="text-sm text-gray-600 mt-1">{variation.change_note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Created: {new Date(garment.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(garment.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
