import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Clock } from 'lucide-react';
import { apiService } from '../services/api';

export default function News() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => apiService.getNews(),
  });

  const getNewsImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
    ];
    return images[title.length % images.length];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="text-5xl md:text-6xl font-black mb-4 gradient-text flex items-center justify-center gap-3"
        >
          <Newspaper className="w-12 h-12 text-primary-600" />
          الأخبار
        </motion.h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">آخر أخبار كرة القدم</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card skeleton h-96"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.03, y: -10 }}
            >
              <Link to={`/news/${article.id}`}>
                <div className="card card-hover overflow-hidden relative group">
                  {/* Image with overlay */}
                  <div className="relative h-64 overflow-hidden rounded-xl mb-4">
                    <motion.img
                      src={article.image || getNewsImage(article.title)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getNewsImage(article.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2 space-x-reverse">
                        <Newspaper className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">اقرأ المزيد</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse text-xs text-primary-600 font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(article.publishedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

