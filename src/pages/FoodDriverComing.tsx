import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Star } from 'lucide-react';
import { useFoodOrderSession } from '../contexts/FoodOrderSession';
import { RatingModal } from '../components/RatingModal';

export function FoodDriverComing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryLocation, getCurrentLocationFoods } = useFoodOrderSession();
  const [rideStatus, setRideStatus] = useState('arrived');
  const [showRating, setShowRating] = useState(false);

  const driverInfo = (location.state as any)?.driverInfo;

  const currentLocationFoods = getCurrentLocationFoods();
  const foodSubtotal = currentLocationFoods.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRideStatus('completed');
      setShowRating(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitRating = (rating: number, feedback: string) => {
    console.log('Delivery rated:', rating, feedback);
    setShowRating(false);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-screen bg-gray-50 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 p-4 flex-1 flex flex-col justify-between">
        <div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8 mt-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {rideStatus === 'completed' ? 'Delivery Complete!' : 'Driver Coming'}
            </h1>
            <p className="text-gray-600">
              {rideStatus === 'completed'
                ? 'Your delivery has been completed'
                : `${driverInfo?.name || 'Driver'} is on the way`}
            </p>
          </motion.div>

          {rideStatus !== 'completed' && driverInfo && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-lg mx-4 mb-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={driverInfo.photo}
                  alt={driverInfo.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-xl">{driverInfo.name}</h2>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">⭐</div>
                    <span className="text-sm font-semibold text-gray-700">{driverInfo.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-sm">{driverInfo.vehicle}</span>
                </div>
                <div className="text-sm text-gray-600">Plate: {driverInfo.plate}</div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Phone size={18} />
                  Call
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                >
                  <MessageCircle size={18} />
                  Message
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mx-4 space-y-3 mb-8">
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Items Being Delivered</h3>
            <div className="space-y-2">
              {currentLocationFoods.map((food) => (
                <div key={food.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{food.name}</span>
                  <span className="font-medium text-gray-900">K{food.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-start gap-3">
            <MapPin size={20} className="text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Delivery Location</p>
              <p className="text-sm text-gray-600">{deliveryLocation}</p>
            </div>
          </div>
        </div>
      </div>

      {showRating && (
        <RatingModal
          isOpen={showRating}
          onClose={() => setShowRating(false)}
          driverName={driverInfo?.name || 'Driver'}
          driverPhoto={driverInfo?.photo}
          onSubmitRating={handleSubmitRating}
        />
      )}
    </motion.div>
  );
}
