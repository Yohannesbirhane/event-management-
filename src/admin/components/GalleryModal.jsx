// src/admin/pages/GalleryModal.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GalleryModal = ({ mode, image, categories, onClose, onUpload, onUpdate, uploading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: mode === 'edit' ? image?.title || '' : '',
    description: mode === 'edit' ? image?.description || '' : '',
    category: mode === 'edit' ? image?.category || '' : '',
    location: mode === 'edit' ? image?.location || '' : '',
    date: mode === 'edit' ? image?.date || '' : '',
    imageFile: null
  });

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'upload') {
      onUpload(formData);
    } else if (mode === 'edit') {
      onUpdate(formData);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'view':
        return t('view_image');
      case 'upload':
        return t('upload_gallery');
      case 'edit':
        return t('edit_image');
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-75">
      <div className={`relative w-full mx-auto my-6 ${mode === 'view' ? 'max-w-4xl' : 'max-w-md'}`}>
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none dark:bg-gray-800 focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-solid rounded-t border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {getTitle()}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-300 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          {mode === 'view' ? (
            <div className="relative p-6 flex-auto">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="md:w-1/3 md:pl-6 mt-4 md:mt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('title')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('description')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('category')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.category}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('location')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('date')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.date}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('uploaded')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.uploadedAt}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('size')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.size}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dimensions')}</h4>
                      <p className="text-gray-800 dark:text-gray-200">{image.dimensions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="relative p-6 flex-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('title')} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('description')}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('category')} *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">{t('select_category')}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('location')}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('date')}
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {mode === 'upload' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('image')} *
                      </label>
                      <input
                        type="file"
                        name="imageFile"
                        onChange={handleFormChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        accept="image/*"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-gray-300 dark:border-gray-700">
                <button
                  className="px-6 py-2 mb-1 mr-4 text-sm font-bold text-gray-800 uppercase transition-all duration-150 ease-linear bg-transparent border border-gray-300 rounded outline-none dark:text-gray-200 dark:border-gray-600 hover:shadow-lg focus:outline-none"
                  type="button"
                  onClick={onClose}
                >
                  {mode === 'view' ? t('close') : t('cancel')}
                </button>
                {mode !== 'view' && (
                  <button
                    className="px-6 py-2 mb-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-purple-600 rounded shadow outline-none hover:bg-purple-700 hover:shadow-lg focus:outline-none"
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? t('uploading') : (mode === 'upload' ? t('upload') : t('save_changes'))}
                  </button>
                )}
                {mode === 'view' && (
                  <button
                    className="px-6 py-2 mb-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-purple-600 rounded shadow outline-none hover:bg-purple-700 hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={() => {
                      onClose();
                      // This would typically be handled by the parent component
                    }}
                  >
                    {t('edit')}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;