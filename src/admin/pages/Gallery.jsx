// src/admin/pages/Gallery.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import GalleryModal from '../components/GalleryModal.jsx';

const Gallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'upload', 'edit'
  const [currentImage, setCurrentImage] = useState(null);

  // Sample categories
  const categories = [
    'All',
    'Venues',
    'Decorations',
    'Bridal',
    'Groom',
    'Ceremony',
    'Reception',
    'Cakes',
    'Invitations'
  ];

  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const sampleImages = [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Luxury Wedding Venue',
        description: 'Elegant wedding decoration',
        category: 'Venues',
        location: 'Addis Ababa',
        date: '2024-01-15',
        uploadedAt: '2023-06-15',
        size: '2.4 MB',
        dimensions: '1200x800'
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Floral Arrangements',
        description: 'Beautiful flower arrangements',
        category: 'Decorations',
        location: 'Addis Ababa',
        date: '2024-02-20',
        uploadedAt: '2023-06-10',
        size: '1.8 MB',
        dimensions: '1000x1500'
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1544700086-2c1045cf06e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Bridal Portrait',
        description: 'Beautiful bride portrait',
        category: 'Bridal',
        location: 'Addis Ababa',
        date: '2024-03-10',
        uploadedAt: '2023-06-05',
        size: '3.2 MB',
        dimensions: '800x1200'
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1519657337289-0776531fdf7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Wedding Cake',
        description: 'Elegant wedding cake',
        category: 'Cakes',
        location: 'Addis Ababa',
        date: '2024-03-15',
        uploadedAt: '2023-05-28',
        size: '2.1 MB',
        dimensions: '1200x900'
      },
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Ceremony Setup',
        description: 'Beautiful ceremony setup',
        category: 'Ceremony',
        location: 'Addis Ababa',
        date: '2024-04-05',
        uploadedAt: '2023-05-20',
        size: '2.7 MB',
        dimensions: '1500x1000'
      },
      {
        id: 6,
        url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Table Settings',
        description: 'Elegant table settings',
        category: 'Reception',
        location: 'Addis Ababa',
        date: '2024-04-10',
        uploadedAt: '2023-05-15',
        size: '2.0 MB',
        dimensions: '1100x800'
      },
      {
        id: 7,
        url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Groom Preparation',
        description: 'Groom getting ready',
        category: 'Groom',
        location: 'Addis Ababa',
        date: '2024-04-15',
        uploadedAt: '2023-05-10',
        size: '2.5 MB',
        dimensions: '900x1200'
      },
      {
        id: 8,
        url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Elegant Invitations',
        description: 'Beautiful wedding invitations',
        category: 'Invitations',
        location: 'Addis Ababa',
        date: '2024-05-01',
        uploadedAt: '2023-05-05',
        size: '1.5 MB',
        dimensions: '800x800'
      },
      {
        id: 9,
        url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Outdoor Ceremony',
        description: 'Beautiful outdoor ceremony',
        category: 'Ceremony',
        location: 'Addis Ababa',
        date: '2024-05-10',
        uploadedAt: '2023-04-28',
        size: '3.0 MB',
        dimensions: '1600x900'
      }
    ];
    setImages(sampleImages);
    setFilteredImages(sampleImages);
  }, []);

  // Filter images based on category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleImageUpload = (formData) => {
    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newImage = {
        id: images.length + 1,
        url: formData.imageFile ? URL.createObjectURL(formData.imageFile) : 'https://via.placeholder.com/800x600',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        uploadedAt: new Date().toISOString().split('T')[0],
        size: formData.imageFile ? `${(formData.imageFile.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown',
        dimensions: 'Unknown'
      };
      
      setImages([...images, newImage]);
      setUploading(false);
      setModalOpen(false);
      alert(t('image_uploaded'));
    }, 1500);
  };

  const handleImageUpdate = (formData) => {
    const updatedImages = images.map(img => {
      if (img.id === currentImage.id) {
        return {
          ...img,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          date: formData.date
        };
      }
      return img;
    });
    
    setImages(updatedImages);
    setModalOpen(false);
    setCurrentImage(null);
    alert(t('image_updated'));
  };

  const openModal = (mode, image = null) => {
    setModalMode(mode);
    setCurrentImage(image);
    setModalOpen(true);
  };

  const handleImageSelect = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imageId => imageId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(t('confirm_delete_images', { count: selectedImages.length }))) {
      setImages(images.filter(image => !selectedImages.includes(image.id)));
      setSelectedImages([]);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {t('gallery')}
        </h2>
        <div className="flex space-x-2">
          {selectedImages.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
            >
              {t('delete_selected')} ({selectedImages.length})
            </button>
          )}
          <button
            onClick={() => openModal('upload')}
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            {t('upload_gallery')}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Stats */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('total_images')}
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {images.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('selected_images')}
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {selectedImages.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('current_category')}
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {selectedCategory}
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('last_upload')}
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {images.length > 0 ? new Date(images[0].uploadedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      {filteredImages.length === 0 ? (
        <div className="w-full p-12 text-center bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('no_images_found')}</p>
          <button
            onClick={() => openModal('upload')}
            className="mt-4 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            {t('upload_gallery')}
          </button>
        </div>
      ) : (
        <>
          {/* Masonry Grid */}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {filteredImages.map(image => (
              <div key={image.id} className="mb-4 break-inside-avoid">
                <div className={`relative overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 group ${
                  selectedImages.includes(image.id) ? 'ring-2 ring-purple-500' : ''
                }`}>
                  {/* Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => handleImageSelect(image.id)}
                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                    </label>
                  </div>
                  
                  {/* Image */}
                  <div 
                    className="relative cursor-pointer" 
                    onClick={() => openModal('view', image)}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15.5v-11a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {image.title}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                        {image.category}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{image.uploadedAt}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{image.size}</span>
                      <span>{image.dimensions}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex border-t border-gray-100 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">
                    <button
                      onClick={() => openModal('view', image)}
                      className="flex-1 py-2 px-3 text-xs font-medium text-center text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {t('view')}
                    </button>
                    <button
                      onClick={() => openModal('edit', image)}
                      className="flex-1 py-2 px-3 text-xs font-medium text-center text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-700"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t('confirm_delete_image'))) {
                          setImages(images.filter(img => img.id !== image.id));
                        }
                      }}
                      className="flex-1 py-2 px-3 text-xs font-medium text-center text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <GalleryModal
          mode={modalMode}
          image={currentImage}
          categories={categories.filter(cat => cat !== 'All')}
          onClose={() => {
            setModalOpen(false);
            setCurrentImage(null);
          }}
          onUpload={handleImageUpload}
          onUpdate={handleImageUpdate}
          uploading={uploading}
        />
      )}
    </div>
  );
};

export default Gallery;