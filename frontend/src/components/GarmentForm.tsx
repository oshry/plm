import { useState, useEffect } from 'react';
import { garmentsApi, materialsApi, attributesApi } from '../api/garments';
import { Garment, Material, Attribute, LifecycleState } from '../types';

interface GarmentFormProps {
  garment?: Garment;
  onSave: () => void;
  onCancel: () => void;
}

export function GarmentForm({ garment, onSave, onCancel }: GarmentFormProps) {
  const [name, setName] = useState(garment?.name || '');
  const [category, setCategory] = useState(garment?.category || '');
  const [lifecycleState, setLifecycleState] = useState(
    garment?.lifecycle_state || LifecycleState.CONCEPT
  );
  const [baseDesignId, setBaseDesignId] = useState<string>(
    garment?.base_design_id?.toString() || ''
  );
  const [changeNote, setChangeNote] = useState(garment?.change_note || '');
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<
    Array<{ id: number; percentage: number }>
  >([]);

  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [materials, attributes] = await Promise.all([
        materialsApi.getAll(),
        attributesApi.getAll(),
      ]);
      setAllMaterials(materials);
      setAllAttributes(attributes);
    } catch (err) {
      console.error('Failed to load options:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (selectedAttributes.length > 0) {
        const validation = await attributesApi.validate(selectedAttributes);
        if (!validation.valid) {
          setError(
            `Incompatible attributes: ${validation.conflicts
              ?.map((c) => `${c.attr1} ↔ ${c.attr2}`)
              .join(', ')}`
          );
          setLoading(false);
          return;
        }
      }

      if (garment) {
        await garmentsApi.update(garment.id, {
          name,
          category,
          lifecycle_state: lifecycleState,
          change_note: changeNote || undefined,
        });
      } else {
        const newGarment = await garmentsApi.create({
          name,
          category,
          lifecycle_state: lifecycleState,
          base_design_id: baseDesignId ? parseInt(baseDesignId) : undefined,
          change_note: changeNote || undefined,
          attributes: selectedAttributes,
        });

        for (const material of selectedMaterials) {
          await garmentsApi.addMaterial(newGarment.id, material.id, material.percentage);
        }
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save garment');
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = () => {
    setSelectedMaterials([...selectedMaterials, { id: 0, percentage: 0 }]);
  };

  const updateMaterial = (index: number, field: 'id' | 'percentage', value: number) => {
    const updated = [...selectedMaterials];
    updated[index][field] = value;
    setSelectedMaterials(updated);
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const toggleAttribute = (attrId: number) => {
    setSelectedAttributes((prev) =>
      prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId]
    );
  };

  const totalPercentage = selectedMaterials.reduce((sum, m) => sum + m.percentage, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {garment ? 'Edit Garment' : 'New Garment'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Classic T-Shirt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Tops, Bottoms, Outerwear"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lifecycle State
          </label>
          <select
            value={lifecycleState}
            onChange={(e) => setLifecycleState(e.target.value as LifecycleState)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.values(LifecycleState).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {!garment && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Design ID (for variations)
              </label>
              <input
                type="number"
                value={baseDesignId}
                onChange={(e) => setBaseDesignId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty for new design"
              />
            </div>

            {baseDesignId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Note
                </label>
                <textarea
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what changed in this variation"
                />
              </div>
            )}
          </>
        )}

        {!garment && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials
              </label>
              <div className="space-y-2">
                {selectedMaterials.map((material, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={material.id}
                      onChange={(e) => updateMaterial(index, 'id', parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={0}>Select material</option>
                      {allMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={material.percentage}
                      onChange={(e) =>
                        updateMaterial(index, 'percentage', parseFloat(e.target.value))
                      }
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMaterial}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Material
                </button>
                {selectedMaterials.length > 0 && (
                  <p
                    className={`text-sm ${
                      Math.abs(totalPercentage - 100) < 0.01
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}
                  >
                    Total: {totalPercentage.toFixed(2)}%
                    {Math.abs(totalPercentage - 100) >= 0.01 && ' (should be 100%)'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attributes
              </label>
              <div className="flex flex-wrap gap-2">
                {allAttributes.map((attr) => (
                  <button
                    key={attr.id}
                    type="button"
                    onClick={() => toggleAttribute(attr.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedAttributes.includes(attr.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {attr.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Saving...' : garment ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
