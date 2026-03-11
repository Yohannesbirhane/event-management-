import { useState, useCallback } from 'react'
import { useTranslation } from '../../node_modules/react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share2,
  Heart,
  Clock,
  MapPin,
  Calendar,
  Filter,
  Grid,
  List,
  Play,
  Expand,
  Users,
  Mic,
  Music,
  Camera
} from 'lucide-react'

const UltimateGallery = () => {
  const { t, i18n } = useTranslation()
  const isAmharic = i18n.language === 'am'
  const [selectedImage, setSelectedImage] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [favorites, setFavorites] = useState(new Set())
  const [sortBy, setSortBy] = useState('date')

  const categories = [
    { id: 'all', name: isAmharic ? 'ሁሉም' : 'All', icon: <Grid size={18} /> },
    { id: 'corporate', name: isAmharic ? 'የቢዝነስ' : 'Corporate', icon: <Users size={18} /> },
    { id: 'cultural', name: isAmharic ? 'ባህል' : 'Cultural', icon: <Heart size={18} /> },
    { id: 'conferences', name: isAmharic ? 'ስብሰባ' : 'Conferences', icon: <Mic size={18} /> },
    { id: 'decor', name: isAmharic ? 'ዲኮሬሽን' : 'Decoration', icon: <MapPin size={18} /> },
    { id: 'entertainment', name: isAmharic ? 'ዝናብ' : 'Entertainment', icon: <Music size={18} /> },
    { id: 'photography', name: isAmharic ? 'ፎቶግራፍ' : 'Photography', icon: <Camera size={18} /> }
  ]

  const galleryItems = [
    {
      id: 1,
      image: "public/bread.png",
      title: "Traditional Ethiopian Celebration",
      description: "Beautiful traditional ceremony with cultural attire and customs",
      category: "cultural",
      date: "2024-03-15",
      location: "Addis Ababa",
      amharicTitle: "ባህላዊ የኢትዮጵያ በዓል",
      amharicDescription: "ውብ ባህላዊ ሥነ ሥርዓት ከባህላዊ ልብስ እና ልምድ",
      tags: ["Cultural", "Traditional", "Ceremony"]
    },
    {
      id: 2,
      image: "public/dance.png",
      title: "Corporate Gala Dinner",
      description: "Elegant corporate event with contemporary design elements",
      category: "corporate",
      date: "2024-02-20",
      location: "Addis Ababa",
      amharicTitle: "የቢዝነስ ጋላ ድራማ",
      amharicDescription: "ዓምደኛ የቢዝነስ ፕሮግራም ከዘመናዊ ዲዛይን አካላት",
      tags: ["Corporate", "Gala", "Elegant"]
    },
    {
      id: 3,
      image: "public/food.png",
      title: "Event Decorations",
      description: "Authentic Ethiopian cultural decorations and arrangements",
      category: "decor",
      date: "2024-01-10",
      location: "Addis Ababa",
      amharicTitle: "የፕሮግራም ዲኮሬሽን",
      amharicDescription: "እውነተኛ የኢትዮጵያ ባህላዊ ዲኮሬሽን እና አቀማመጥ",
      tags: ["Decor", "Cultural", "Traditional"]
    },
    {
      id: 4,
      image: "public/givern.png",
      title: "Gourmet Catering Service",
      description: "Exquisite Ethiopian cuisine presentation and service",
      category: "entertainment",
      date: "2024-04-05",
      location: "Addis Ababa",
      amharicTitle: "ልዩ ምግብ አቅራቢ አገልግሎት",
      amharicDescription: "የሚያማምር የኢትዮጵያ ምግብ አቀራረብ እና አገልግሎት",
      tags: ["Catering", "Food", "Presentation"]
    },
    {
      id: 5,
      image: "public/cult.png",
      title: "Cultural Performances",
      description: "Traditional music and dance performances",
      category: "cultural",
      date: "2024-03-28",
      location: "Addis Ababa",
      amharicTitle: "ባህላዊ ሥራዎች",
      amharicDescription: "ባህላዊ ሙዚቃ እና ዳንስ ሥራዎች",
      tags: ["Cultural", "Performance", "Music"]
    },
    {
      id: 6,
      image: "public/muse.png",
      title: "Traditional Attire Showcase",
      description: "Gorgeous traditional Ethiopian event attire",
      category: "cultural",
      date: "2024-02-14",
      location: "Addis Ababa",
      amharicTitle: "ባህላዊ ልብስ ማሳያ",
      amharicDescription: "ዓምደኛ ባህላዊ የኢትዮጵያ የፕሮግራም ልብስ",
      tags: ["Traditional", "Attire", "Cultural"]
    },
    {
      id: 7,
      image: "public/couple1.png",
      title: "Conference Setup",
      description: "Professional conference design with elegant touches",
      category: "conferences",
      date: "2024-01-30",
      location: "Addis Ababa",
      amharicTitle: "የስብሰባ አዘጋጅ",
      amharicDescription: "ባለሙያ የስብሰባ ዲዛይን ከዓምደኛ ነጸብራቅ",
      tags: ["Conference", "Design", "Professional"]
    },
    {
      id: 8,
      image: "public/flour.png",
      title: "Floral Arrangements",
      description: "Beautiful floral decorations and centerpieces",
      category: "decor",
      date: "2024-04-12",
      location: "Addis Ababa",
      amharicTitle: "የፍሬ አቀማመጥ",
      amharicDescription: "ውብ የፍሬ ዲኮሬሽን እና ማዕከላዊ ቁራጮች",
      tags: ["Decor", "Floral", "Arrangements"]
    },
    {
      id: 9,
      image: "public/couple3.png",
      title: "Traditional Ceremony",
      description: "Authentic Ethiopian cultural ceremony rituals",
      category: "cultural",
      date: "2024-03-08",
      location: "Addis Ababa",
      amharicTitle: "ባህላዊ ሥነ ሥርዓት",
      amharicDescription: "እውነተኛ የኢትዮጵያ ባህላዊ ሥነ ሥርዓት ሥርዓተ ትውፊት",
      tags: ["Cultural", "Ceremony", "Traditional"]
    },
    {
      id: 10,
      image: "public/product.png",
      title: "Product Launch Event",
      description: "Modern product launch with interactive elements",
      category: "corporate",
      date: "2024-05-10",
      location: "Addis Ababa",
      amharicTitle: "የምርት ማስነሻ ፕሮግራም",
      amharicDescription: "ዘመናዊ የምርት ማስነሻ ከተግባራዊ አካላት",
      tags: ["Corporate", "Product Launch", "Modern"]
    },
    {
      id: 11,
      image: "public/music.png",
      title: "Music Festival Setup",
      description: "Large-scale music festival production and design",
      category: "entertainment",
      date: "2024-06-15",
      location: "Addis Ababa",
      amharicTitle: "የሙዚቃ በዓል አዘጋጅ",
      amharicDescription: "የትልቅ ደረጃ የሙዚቃ በዓል ምርት እና ዲዛይን",
      tags: ["Entertainment", "Music", "Festival"]
    },
    {
      id: 12,
      image: "public/photo.png",
      title: "Professional Photography",
      description: "High-quality event photography services",
      category: "photography",
      date: "2024-07-20",
      location: "Addis Ababa",
      amharicTitle: "ባለሙያ ፎቶግራፍ",
      amharicDescription: "�ጥራት ያለው የፕሮግራም ፎቶግራፍ አገልግሎት",
      tags: ["Photography", "Professional", "Quality"]
    }
  ]

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory)

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date)
    }
    return a.title.localeCompare(b.title)
  })

  const openLightbox = useCallback((image, index) => {
    setSelectedImage(image)
    setLightboxIndex(index)
    setZoomLevel(1)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
    setZoomLevel(1)
    document.body.style.overflow = 'unset'
  }, [])

  const navigateLightbox = useCallback((direction) => {
    let newIndex
    if (direction === 'next') {
      newIndex = (lightboxIndex + 1) % filteredItems.length
    } else {
      newIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
    }
    setLightboxIndex(newIndex)
    setSelectedImage(filteredItems[newIndex])
    setZoomLevel(1)
  }, [lightboxIndex, filteredItems])

  const handleKeyDown = useCallback((e) => {
    if (selectedImage) {
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowRight':
          navigateLightbox('next')
          break
        case 'ArrowLeft':
          navigateLightbox('prev')
          break
        case '+':
        case '=':
          setZoomLevel(prev => Math.min(prev + 0.25, 3))
          break
        case '-':
          setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
          break
        default:
          break
      }
    }
  }, [selectedImage, closeLightbox, navigateLightbox])

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }, [])

  const downloadImage = useCallback(async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${imageName}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }, [])

  const shareImage = useCallback(async (imageUrl, title) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: imageUrl,
        })
      } catch (error) {
        console.error('Sharing failed:', error)
      }
    } else {
      navigator.clipboard.writeText(imageUrl).then(() => {
        alert('Image link copied to clipboard!')
      })
    }
  }, [])

  useState(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 font-display">
            {isAmharic ? 'የፕሮግራም ፎቶ ማከማቻ' : 'Event Gallery'}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            {isAmharic 
              ? 'ከተለያዩ የፕሮግራም ሥነ ሥርዓቶቻችን የተወሰዱ ፎቶዎች' 
              : 'Photos from our various events and celebrations'}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4"
        >
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-black shadow-lg'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">{isAmharic ? 'በቀን' : 'By Date'}</option>
              <option value="name">{isAmharic ? 'በስም' : 'By Name'}</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
          }
        >
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Image Container */}
              <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full h-64'}`}>
                <img
                  src={item.image}
                  alt={isAmharic ? item.amharicTitle : item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                  onClick={() => openLightbox(item, index)}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => openLightbox(item, index)}
                      className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                    >
                      <Expand size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                      className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        size={20} 
                        className={favorites.has(item.id) ? 'text-red-500 fill-red-500' : ''}
                      />
                    </button>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(cat => cat.id === item.category)?.name}
                </div>
              </div>

              {/* Content */}
              <div className={`p-6 bg-white dark:bg-neutral-800 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  {isAmharic ? item.amharicTitle : item.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  {isAmharic ? item.amharicDescription : item.description}
                </p>
                
                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {item.location}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <div className="relative max-w-6xl w-full max-h-full">
                {/* Navigation Buttons */}
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-400 transition-colors z-10 bg-black/50 p-3 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateLightbox('prev')
                  }}
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-400 transition-colors z-10 bg-black/50 p-3 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateLightbox('next')
                  }}
                >
                  <ChevronRight size={32} />
                </button>

                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-white hover:text-primary-400 transition-colors z-10 bg-black/50 p-3 rounded-full"
                  onClick={closeLightbox}
                >
                  <X size={24} />
                </button>

                {/* Image with Zoom */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full h-full flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    src={selectedImage.image}
                    alt={isAmharic ? selectedImage.amharicTitle : selectedImage.title}
                    className="max-w-full max-h-full object-contain"
                    style={{ scale: zoomLevel }}
                    drag
                    dragConstraints={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    }}
                  />
                </motion.div>

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 rounded-lg p-4 flex items-center space-x-4">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                    className="text-white hover:text-primary-400 transition-colors p-2"
                  >
                    <ZoomOut size={20} />
                  </button>
                  
                  <span className="text-white text-sm">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                    className="text-white hover:text-primary-400 transition-colors p-2"
                  >
                    <ZoomIn size={20} />
                  </button>
                  
                  <button
                    onClick={() => downloadImage(selectedImage.image, selectedImage.title)}
                    className="text-white hover:text-primary-400 transition-colors p-2"
                  >
                    <Download size={20} />
                  </button>
                  
                  <button
                    onClick={() => shareImage(selectedImage.image, selectedImage.title)}
                    className="text-white hover:text-primary-400 transition-colors p-2"
                  >
                    <Share2 size={20} />
                  </button>
                  
                  <button
                    onClick={() => toggleFavorite(selectedImage.id)}
                    className="text-white hover:text-primary-400 transition-colors p-2"
                  >
                    <Heart 
                      size={20} 
                      className={favorites.has(selectedImage.id) ? 'text-red-500 fill-red-500' : ''}
                    />
                  </button>
                </div>

                {/* Info Panel */}
                <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-4 max-w-md">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {isAmharic ? selectedImage.amharicTitle : selectedImage.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {isAmharic ? selectedImage.amharicDescription : selectedImage.description}
                  </p>
                  <div className="text-gray-400 text-xs">
                    <div className="flex items-center mb-1">
                      <Calendar size={14} className="mr-2" />
                      {new Date(selectedImage.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      {selectedImage.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UltimateGallery