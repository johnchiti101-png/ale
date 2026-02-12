import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
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
  const [profileToggle, setProfileToggle] = useState<'personal' | 'business'>('personal');

  // ✅ NEW SNAP-BASED PANEL SYSTEM (No more fidgeting)
  const COLLAPSED = 0;
  const EXPANDED = -420;
  const [panelPosition, setPanelPosition] = useState(COLLAPSED);
  const isExpanded = panelPosition === EXPANDED;

  const deliveryModes: DeliveryMode[] = [
    {
      id: 'motorbike',
      label: 'Motorbike',
      time: '2 min',
      description: 'Fast delivery',
      deliveryFee: 40,
      icon: '🏍️'
    },
    {
      id: 'car',
      label: 'Car',
      time: '20 min',
      description: 'Standard delivery',
      deliveryFee: 60,
      icon: '🚗'
    },
    {
      id: 'bicycle',
      label: 'Bicycle',
      time: '20 min',
      description: 'Eco-friendly delivery',
      deliveryFee: 25,
      icon: '🚴'
    }
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
    const stopsText = stops.length > 0 ? ` +${stops.length} stop${stops.length > 1 ? 's' : ''}` : '';
    return `${mainAddress}${stopsText}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-hidden">

      {/* MAP BACKGROUND (UNCHANGED) */}
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

      {/* TOP HEADER (UNCHANGED) */}
      <motion.div
        className="absolute top-4 left-4 right-4 z-30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
          <button onClick={handleClose}>
            <X size={20} />
          </button>

          <button onClick={handleAddressClick} className="flex-1 text-left overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {getAddressDisplay()}
              </span>
              <span>→</span>
              <span className="text-sm font-medium">
                Delivery ({totalItemCount} item{totalItemCount !== 1 ? 's' : ''})
              </span>
            </div>
          </button>

          <button onClick={handleAddStop}>
            <Plus size={20} />
          </button>
        </div>
      </motion.div>

      {/* SLIDING PANEL */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20 overflow-hidden"
        drag="y"
        dragConstraints={{ top: EXPANDED, bottom: COLLAPSED }}
        dragElastic={0.1}
        onDragEnd={(event, info) => {
          if (info.offset.y < -100) {
            setPanelPosition(EXPANDED);
          } else {
            setPanelPosition(COLLAPSED);
          }
        }}
        animate={{ y: panelPosition }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{ height: 'calc(100vh - 100px)' }}
      >

        {/* ✅ SECTION 1 — PROMO STRIP (STRUCTURAL, NOT BANNER) */}
        {PROMO_ACTIVE && (
          <div className="bg-indigo-600 text-white text-center py-3 text-sm font-medium">
            ✓ {PROMO_TEXT}
          </div>
        )}

        {/* ✅ SECTION 2 — HANDLE */}
        <div className="py-3 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* CONTENT AREA */}
        <div className="px-4 pb-32 overflow-y-auto">

          {/* ✅ SECTION 3 — FILTERS (ONLY WHEN EXPANDED) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex gap-3 mb-4"
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
            )}
          </AnimatePresence>

          {/* DELIVERY MODES (UNCHANGED LOGIC) */}
          <div className="space-y-3 mb-6">
            {sortedModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedModeId(mode.id)}
                className={`w-full p-4 rounded-2xl ${
                  selectedModeId === mode.id
                    ? 'bg-green-50 border-2 border-green-600'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{mode.label}</h3>
                    <div>{mode.time} 🍔{totalItemCount}</div>
                    <p>{mode.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">R {foodSubtotal + mode.deliveryFee}</div>
                    <div>R {mode.deliveryFee}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ✅ PRICE BREAKDOWN (ONLY WHEN EXPANDED) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-4 border-t"
              >
                <div className="flex justify-between">
                  <span>Food subtotal</span>
                  <span>R {foodSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span>R {deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R {total}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* BOTTOM FIXED PANEL (UNCHANGED) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30 px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={handleCashClick}>Cash</button>
          <button onClick={handleScheduleClick}>
            <Calendar size={20} />
          </button>
        </div>

        <button
          onClick={handleSelectMode}
          className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold"
        >
          Select {selectedMode?.label}
        </button>
      </div>

    </div>
  );
}
