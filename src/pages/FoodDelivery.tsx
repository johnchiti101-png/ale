 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, PanInfo } from 'framer-motion';
import { X, Plus, Calendar, User, Briefcase, ChevronDown } from 'lucide-react';
import { useFoodOrderSession } from '../contexts/FoodOrderSession';

interface DeliveryMode {
  id: 'motorbike' | 'car' | 'bicycle';
  label: string;
  time: string;
  description: string;
  deliveryFee: number;
  icon: string;
}

type FilterTab = 'standard' | 'faster' | 'cheaper';

const PROMO_TEXT = '30% promo applied';
const PROMO_ACTIVE = true;

export function FoodDelivery() {
  const navigate = useNavigate();
  const {
    getCurrentLocationFoods,
    setDeliveryMode,
    cartItems,
    deliveryLocation,
    stops
  } = useFoodOrderSession();

  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('standard');
  const [selectedModeId, setSelectedModeId] = useState<'motorbike' | 'car' | 'bicycle'>('motorbike');
  const [panelY, setPanelY] = useState(0);
  const [profileToggle, setProfileToggle] = useState<'personal' | 'business'>('personal');

  const deliveryModes: DeliveryMode[] = [
    { id: 'motorbike', label: 'Motorbike', time: '2 min', description: 'Fast delivery', deliveryFee: 40, icon: '🏍️' },
    { id: 'car', label: 'Car', time: '20 min', description: 'Standard delivery', deliveryFee: 60, icon: '🚗' },
    { id: 'bicycle', label: 'Bicycle', time: '20 min', description: 'Eco-friendly delivery', deliveryFee: 25, icon: '🚴' }
  ];

  const currentLocationFoods = getCurrentLocationFoods();
  const totalItemCount = currentLocationFoods.length;
  const foodSubtotal = currentLocationFoods.reduce((sum, item) => sum + item.price, 0);
  const selectedMode = deliveryModes.find(m => m.id === selectedModeId);
  const deliveryFee = selectedMode?.deliveryFee || 0;
  const total = foodSubtotal + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems.length, navigate]);

  const getSortedModes = (): DeliveryMode[] => {
    let sorted = [...deliveryModes];
    if (selectedFilter === 'faster') {
      sorted.sort((a, b) => parseInt(a.time) - parseInt(b.time));
    } else if (selectedFilter === 'cheaper') {
      sorted.sort((a, b) => a.deliveryFee - b.deliveryFee);
    }
    return sorted;
  };

  const sortedModes = getSortedModes();

  const handlePanelDrag = (event: any, info: PanInfo) => {
    setPanelY(info.offset.y);
  };

  const handlePanelDragEnd = (event: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity > 300 || offset > 80) {
      setPanelY(0);
    } else if (velocity < -300 || offset < -80) {
      setPanelY(-350);
    } else {
      setPanelY(0);
    }
  };

  const handleClose = () => {
    navigate('/foodies-route');
  };

  const handleAddStop = () => {
    navigate('/foodies-route');
  };

  const handleAddressClick = () => {
    navigate('/foodies-route');
  };

  const handleSelectMode = () => {
    if (selectedMode) {
      setDeliveryMode(selectedMode.id, selectedMode.deliveryFee);
      navigate('/food-confirm-order');
    }
  };

  const handleCashClick = () => {
    console.log('Cash payment clicked');
  };

  const handleScheduleClick = () => {
    console.log('Schedule clicked');
  };

  const getAddressDisplay = () => {
    const mainAddress = deliveryLocation || 'Current Location';
    const stopsText =
      stops.length > 0
        ? ` +${stops.length} stop${stops.length > 1 ? 's' : ''}`
        : '';
    return `${mainAddress}${stopsText}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-hidden">

      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-100">
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full">
            <defs>
              <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
            <path
              d="M 200 400 Q 250 300 300 200"
              stroke="#4f46e5"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Top Fixed Header */}
      <motion.div
        className="absolute top-4 left-4 right-4 z-30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-700" />
          </button>

          <button onClick={handleAddressClick} className="flex-1 text-left overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {getAddressDisplay()}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-sm font-medium text-gray-700 truncate">
                Delivery ({totalItemCount} item{totalItemCount !== 1 ? 's' : ''})
              </span>
            </div>
          </button>

          <button onClick={handleAddStop} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
            <Plus size={20} className="text-gray-700" />
          </button>
        </div>
      </motion.div>

      {/* Main Sliding Panel */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20"
        drag="y"
        dragConstraints={{ top: -350, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handlePanelDrag}
        onDragEnd={handlePanelDragEnd}
        animate={{ y: panelY }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{ height: 'calc(100vh - 100px)', touchAction: 'pan-x' }}
      >

        {/* ✅ PROMO STRIP MOVED TO VERY TOP OF PANEL */}
        {PROMO_ACTIVE && (
          <motion.div
            className="bg-indigo-600 text-white py-3 text-center font-medium text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            ✓ {PROMO_TEXT}
          </motion.div>
        )}

        {/* Drag Handle */}
        <div className="w-full pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing touch-none">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable Content Area */}
        <div
          className="px-4 pb-32 overflow-y-auto flex-1"
          style={{ height: 'calc(100% - 120px)' }}
        >

          {/* EVERYTHING BELOW REMAINS EXACTLY THE SAME */}

          {/* Filter Buttons */}
          <motion.div
            className="flex gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button onClick={() => setSelectedFilter('standard')}>
              Standard
            </button>
            <button onClick={() => setSelectedFilter('faster')}>
              ⚡ Faster
            </button>
            <button onClick={() => setSelectedFilter('cheaper')}>
              💰 Cheaper
            </button>
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom Fixed Action Panel (UNCHANGED) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-4 py-3">
        <motion.button
          onClick={handleSelectMode}
          className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold text-base hover:bg-green-700 transition-colors shadow-lg"
          whileTap={{ scale: 0.98 }}
        >
          Select {selectedMode?.label}
        </motion.button>
      </div>

    </div>
  );
}
