import { useState, useEffect } from 'react';
import { garmentsApi } from '../api/garments';
import { Garment, LifecycleState } from '../types';

interface GarmentListProps {
  onSelectGarment: (garment: Garment) => void;
  onCreateNew: () => void;
}

const lifecycleColors: Record<LifecycleState, string> = {
  [LifecycleState.CONCEPT]: 'bg-gray-100 text-gray-800',
  [LifecycleState.DESIGN]: 'bg-blue-100 text-blue-800',
  [LifecycleState.SAMPLE]: 'bg-yellow-100 text-yellow-800',
  [LifecycleState.APPROVED]: 'bg-green-100 text-green-800',
  [LifecycleState.MASS_PRODUCTION]: 'bg-purple-100 text-purple-800',
};

export function GarmentList({ onSelectGarment, onCreateNew }: GarmentListProps) {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    try {
      setLoading(true);
      const data = await garmentsApi.getAll();
      setGarments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load garments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading garments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={loadGarments}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Garments</h2>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Garment
        </button>
      </div>

      {garments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No garments yet</p>
          <button
            onClick={onCreateNew}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Create your first garment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garments.map((garment) => (
            <div
              key={garment.id}
              onClick={() => onSelectGarment(garment)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {garment.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    lifecycleColors[garment.lifecycle_state]
                  }`}
                >
                  {garment.lifecycle_state}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{garment.category}</p>
              {garment.base_design_id && (
                <p className="text-xs text-blue-600 mb-2">
                  ↳ Variation of #{garment.base_design_id}
                </p>
              )}
              <div className="text-xs text-gray-500">
                Updated: {new Date(garment.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
