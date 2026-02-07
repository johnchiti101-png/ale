import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Bike, Car, Clock } from 'lucide-react';
import { useFoodOrderSession } from '../contexts/FoodOrderSession';
import { useFoodPayment } from '../contexts/FoodPaymentContext';

export function FoodWaitingDriver() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryLocation, getCurrentLocationFoods, selectedDeliveryMode } = useFoodOrderSession();
  const { capturePayment } = useFoodPayment();
  const [driverFound, setDriverFound] = useState(false);
  const [driverInfo, setDriverInfo] = useState<any>(null);

  const deliveryOrderId = (location.state as any)?.deliveryOrderId;

  const currentLocationFoods = getCurrentLocationFoods();
  const foodSubtotal = currentLocationFoods.reduce((sum, item) => sum + item.price, 0);

  const getDeliveryModeLabel = () => {
    switch (selectedDeliveryMode) {
      case 'motorbike':
        return 'Waiting for cyclist…';
      case 'bicycle':
        return 'Waiting for cyclist…';
      case 'car':
        return 'Waiting for driver…';
      default:
        return 'Waiting for driver…';
    }
  };

  const getDeliveryIcon = () => {
    switch (selectedDeliveryMode) {
      case 'motorbike':
        return <Bike size={32} className="text-green-600" />;
      case 'car':
        return <Car size={32} className="text-green-600" />;
      case 'bicycle':
        return <span className="text-4xl">🚴</span>;
      default:
        return <Bike size={32} className="text-green-600" />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockDriver = {
        id: `driver_${Date.now()}`,
        name: selectedDeliveryMode === 'car' ? 'John Driver' : 'Bicycle Courier',
        rating: 4.8,
        vehicle: selectedDeliveryMode === 'car' ? 'Toyota Vitz' : 'Fixed Gear Bike',
        plate: selectedDeliveryMode === 'car' ? 'KBA 123AB' : 'N/A',
        photo: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
      };
      setDriverInfo(mockDriver);
      setDriverFound(true);
      capturePayment();
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedDeliveryMode, capturePayment]);

  const handleCancel = () => {
    navigate('/');
  };

  const handleDriverFound = () => {
    navigate('/food-driver-coming', { state: { deliveryOrderId, driverInfo } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-screen bg-gray-50"
    >
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-100 p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleCancel}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-900">Food Delivery</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 mt-20">
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-8"
          >
            {getDeliveryIcon()}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{getDeliveryModeLabel()}</h2>

          {!driverFound ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex gap-1 mt-4"
            >
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 w-full max-w-md"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-500">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={driverInfo.photo}
                    alt={driverInfo.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{driverInfo.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">⭐⭐⭐⭐⭐</div>
                      <span className="text-sm text-gray-600">{driverInfo.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3">
                    <Car size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{driverInfo.vehicle}</span>
                  </div>
                  <div className="text-sm text-gray-600">Plate: {driverInfo.plate}</div>
                </div>

                <motion.button
                  onClick={handleDriverFound}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-20">
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {currentLocationFoods.map((food) => (
                <div key={food.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{food.name}</span>
                  <span className="font-medium text-gray-900">K{food.price}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                <span>Total:</span>
                <span>R {foodSubtotal + 80}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <MapPin size={20} className="text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Delivery to</p>
              <p className="text-sm text-gray-600">{deliveryLocation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-56" />
    </motion.div>
  );
}
