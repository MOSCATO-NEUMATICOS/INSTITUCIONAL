
import React, { useState } from 'react';
import { Supplier } from '../../types';
import { Tag, Edit2, Trash2, Percent, TrendingUp, Plus, X } from 'lucide-react';

interface AdminSuppliersProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
}

export const AdminSuppliers: React.FC<AdminSuppliersProps> = ({ suppliers, onAddSupplier, onUpdateSupplier, onDeleteSupplier }) => {
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ name: '', discountChain: '', margin: 40, marginBase: 'cost', addIva: true });
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  const handleEditSupplier = (supplier: Supplier) => {
    setNewSupplier({ ...supplier });
    setEditingSupplierId(supplier.id);
  };

  const cancelEditSupplier = () => {
    setNewSupplier({ name: '', discountChain: '', margin: 40, marginBase: 'cost', addIva: true });
    setEditingSupplierId(null);
  };

  const submitSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.discountChain) return;

    const supplierData: Supplier = {
      id: editingSupplierId || Date.now().toString(),
      name: newSupplier.name!,
      discountChain: newSupplier.discountChain!,
      margin: newSupplier.margin || 40,
      marginBase: newSupplier.marginBase || 'cost',
      addIva: newSupplier.addIva
    };

    if (editingSupplierId) {
      onUpdateSupplier(supplierData);
      cancelEditSupplier();
    } else {
      onAddSupplier(supplierData);
      setNewSupplier({ name: '', discountChain: '', margin: 40, marginBase: 'cost', addIva: true });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        {/* Suppliers List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-fit">
        <div className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
            <h4 className="font-bold text-sm flex items-center"><Tag className="w-4 h-4 mr-2" /> Proveedores Configurados</h4>
        </div>
        <div className="divide-y divide-gray-200">
            {suppliers && suppliers.length > 0 ? (
            suppliers.map(sup => (
                <div key={sup.id} className="p-4 hover:bg-gray-50 flex justify-between items-center group">
                <div>
                    <span className="block font-bold text-gray-900">{sup.name}</span>
                    <div className="flex flex-col gap-1 mt-1">
                    <span className="flex items-center text-xs text-gray-500"><Percent className="w-3 h-3 mr-1" /> Desc: {sup.discountChain}</span>
                    <span className="flex items-center text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 mr-1" /> 
                        Margen: {sup.margin}% ({sup.marginBase === 'list' ? 'sobre Lista' : 'sobre Costo'})
                    </span>
                    {sup.addIva && (
                        <span className="flex items-center text-xs text-green-600 font-bold">
                        <Plus className="w-3 h-3 mr-1" /> Suma IVA (21%)
                        </span>
                    )}
                    </div>
                </div>
                <div className="flex space-x-1">
                    <button onClick={() => handleEditSupplier(sup)} className="text-gray-400 hover:text-orange-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity" title="Editar">
                    <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeleteSupplier(sup.id)} className="text-gray-400 hover:text-red-600 p-2" title="Eliminar">
                    <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                </div>
            ))
            ) : (
            <div className="p-6 text-center text-gray-500 text-sm">No hay proveedores cargados.</div>
            )}
        </div>
        </div>

        {/* Add/Edit Supplier Form */}
        <div className={`bg-gray-50 p-6 rounded-lg border h-fit transition-colors ${editingSupplierId ? 'border-orange-400 ring-4 ring-orange-50' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
            <span className="flex items-center">
            {editingSupplierId ? <Edit2 className="w-5 h-5 mr-2 text-orange-500" /> : <Plus className="w-5 h-5 mr-2" />}
            {editingSupplierId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
            </span>
            {editingSupplierId && (
            <button onClick={cancelEditSupplier} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            )}
        </h3>
        <form onSubmit={submitSupplier} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Proveedor</label>
            <input
                type="text"
                required
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                placeholder="Ej: Corven"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">Cadena de Descuentos (Habitual)</label>
            <input
                type="text"
                required
                value={newSupplier.discountChain}
                onChange={(e) => setNewSupplier({...newSupplier, discountChain: e.target.value})}
                placeholder="Ej: 35+10+5"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Ingrese los descuentos separados por "+" o espacios.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Margen Sugerido (%)</label>
                <input
                type="number"
                required
                value={newSupplier.margin}
                onChange={(e) => setNewSupplier({...newSupplier, margin: parseFloat(e.target.value)})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Base del Margen</label>
                <select
                value={newSupplier.marginBase || 'cost'}
                onChange={(e) => setNewSupplier({...newSupplier, marginBase: e.target.value as 'cost' | 'list'})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                >
                <option value="cost">Sobre Costo</option>
                <option value="list">Sobre Lista</option>
                </select>
            </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                type="checkbox" 
                checked={newSupplier.addIva || false}
                onChange={(e) => setNewSupplier({...newSupplier, addIva: e.target.checked})}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">El precio de lista es SIN IVA (Sumar 21%)</span>
            </label>
            </div>
            
            <div className="flex space-x-3">
            {editingSupplierId && (
                <button 
                type="button" 
                onClick={cancelEditSupplier}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                Cancelar
                </button>
            )}
            <button 
                type="submit" 
                className={`flex-1 text-white font-bold py-2 rounded-md transition-colors flex items-center justify-center ${
                editingSupplierId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {editingSupplierId ? 'Actualizar' : 'Guardar Proveedor'}
            </button>
            </div>
        </form>
        </div>
    </div>
  );
};
