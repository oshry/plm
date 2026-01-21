import { useState } from 'react';
import { GarmentList } from './components/GarmentList';
import { GarmentDetail } from './components/GarmentDetail';
import { GarmentForm } from './components/GarmentForm';
import { Garment } from './types';

type View = 'list' | 'detail' | 'create' | 'edit';

function App() {
  const [view, setView] = useState<View>('list');
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);

  const handleSelectGarment = (garment: Garment) => {
    setSelectedGarment(garment);
    setView('detail');
  };

  const handleCreateNew = () => {
    setSelectedGarment(null);
    setView('create');
  };

  const handleEdit = (garment: Garment) => {
    setSelectedGarment(garment);
    setView('edit');
  };

  const handleSave = () => {
    setView('list');
    setSelectedGarment(null);
  };

  const handleCancel = () => {
    setView(selectedGarment ? 'detail' : 'list');
  };

  const handleBack = () => {
    setView('list');
    setSelectedGarment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fashion PLM</h1>
              <p className="text-gray-600 text-sm mt-1">Product Lifecycle Management System</p>
            </div>
            {view !== 'list' && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to List
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && (
          <GarmentList onSelectGarment={handleSelectGarment} onCreateNew={handleCreateNew} />
        )}

        {view === 'detail' && selectedGarment && (
          <GarmentDetail
            garmentId={selectedGarment.id}
            onBack={handleBack}
            onEdit={handleEdit}
          />
        )}

        {(view === 'create' || view === 'edit') && (
          <GarmentForm
            garment={view === 'edit' ? selectedGarment || undefined : undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Fashion PLM System - Built with React, TypeScript, Node.js, and MySQL
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
