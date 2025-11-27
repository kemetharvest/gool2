import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['news', id],
    queryFn: () => apiService.getNewsArticle(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="skeleton h-96"></div>;
  }

  if (!article) {
    return <div className="text-center py-12">المقال غير موجود</div>;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <img
        src={article.image || 'https://via.placeholder.com/800x400'}
        alt={article.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400';
        }}
      />
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <div className="flex items-center space-x-4 space-x-reverse mb-8 text-gray-500 dark:text-gray-400">
        <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA', { dateStyle: 'full' })}</span>
        <span>•</span>
        <span>{article.source}</span>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">{article.description}</p>
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </motion.article>
  );
}

