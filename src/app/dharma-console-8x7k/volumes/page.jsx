'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import AdminLayout from '../dashboard/layout';

const VolumeModal = ({ volume, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: volume?.title || '',
    description: volume?.description || '',
    coverImageUrl: volume?.coverImageUrl || '',
    releaseDate: volume?.releaseDate || '',
    status: volume?.status || 'DRAFT',
    volumeNumber: volume?.volumeNumber || 1,
    totalEpisodes: volume?.totalEpisodes || 0,
    price: volume?.price || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (volume?.id) {
        await adminApi.updateVolume(volume.id, formData);
      } else {
        await adminApi.createVolume(formData);
      }
      onSave();
    } catch (err) {
      alert('Failed to save volume: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {volume ? 'Edit Volume' : 'Create Volume'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Volume Number</label>
              <input
                type="number"
                min="1"
                value={formData.volumeNumber}
                onChange={(e) => setFormData({ ...formData, volumeNumber: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Total Episodes</label>
              <input
                type="number"
                min="0"
                value={formData.totalEpisodes}
                onChange={(e) => setFormData({ ...formData, totalEpisodes: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Release Date</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Volume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminVolumesPage() {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadVolumes();
  }, []);

  const loadVolumes = async () => {
    try {
      const res = await adminApi.getVolumes();
      setVolumes(res.data.data || []);
    } catch (err) {
      console.error('Failed to load volumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (volume) => {
    setSelectedVolume(volume);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedVolume(null);
    setShowModal(true);
  };

  const handleDelete = async (volumeId) => {
    if (!confirm('Are you sure you want to delete this volume?')) return;
    
    setDeleting(volumeId);
    try {
      await adminApi.deleteVolume(volumeId);
      loadVolumes();
    } catch (err) {
      alert('Failed to delete volume: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = () => {
    setShowModal(false);
    loadVolumes();
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Volumes</h1>
            <p className="text-slate-400 mt-1">Manage your story volumes</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Volume
          </button>
        </div>

        {/* Volumes Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
          ) : volumes.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Volume</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Episodes</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Price</th>
                  <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volumes.map(volume => (
                  <tr key={volume.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {volume.coverImageUrl ? (
                          <img src={volume.coverImageUrl} alt="" className="w-12 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-16 bg-slate-700 rounded flex items-center justify-center">
                            <span className="text-slate-500">#{volume.volumeNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{volume.title}</p>
                      <p className="text-slate-400 text-sm truncate max-w-xs">{volume.description}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{volume.totalEpisodes || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        volume.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
                        volume.status === 'DRAFT' ? 'bg-yellow-500/20 text-yellow-400' :
                        volume.status === 'COMING_SOON' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {volume.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">₹{volume.price || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(volume)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition text-slate-400 hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(volume.id)}
                          disabled={deleting === volume.id}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                        >
                          {deleting === volume.id ? (
                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p>No volumes yet</p>
              <button onClick={handleCreate} className="mt-4 text-amber-400 hover:text-amber-300">
                Create your first volume
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <VolumeModal
            volume={selectedVolume}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </AdminLayout>
  );
}
