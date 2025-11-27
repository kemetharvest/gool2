import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Users, Server, BarChart3 } from 'lucide-react';
import axios from 'axios';

export default function Admin() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/stats');
      return data.data;
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return <div className="skeleton h-64"></div>;
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        لوحة التحكم
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <Activity className="w-12 h-12 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">المباريات النشطة</p>
              <p className="text-3xl font-bold">{stats?.activeMatches || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <Users className="w-12 h-12 text-green-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">العملاء المتصلون</p>
              <p className="text-3xl font-bold">{stats?.connectedClients || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <Server className="w-12 h-12 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">حالة الخادم</p>
              <p className="text-3xl font-bold capitalize">{stats?.serverHealth || 'unknown'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <BarChart3 className="w-12 h-12 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">طلبات API اليوم</p>
              <p className="text-3xl font-bold">{stats?.apiRequests?.today || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-4">إحصائيات API</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">إجمالي الطلبات:</span>
              <span className="font-bold">{stats?.apiRequests?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">طلبات اليوم:</span>
              <span className="font-bold">{stats?.apiRequests?.today || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">الأخطاء:</span>
              <span className="font-bold text-red-600">{stats?.apiRequests?.errors || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-4">معلومات النظام</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">وقت التشغيل:</span>
              <span className="font-bold">{Math.floor((stats?.uptime || 0) / 60)} دقيقة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">الذاكرة المستخدمة:</span>
              <span className="font-bold">{stats?.memory?.used || 0} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">إجمالي الذاكرة:</span>
              <span className="font-bold">{stats?.memory?.total || 0} MB</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

