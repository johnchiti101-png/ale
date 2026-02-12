 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, PanInfo, AnimatePresence, useMotionValue, animate } from 'framer-motion';
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
type PanelState = 'collapsed' | 'expanded';

const PROMO_TEXT = '30% promo applied';
const PROMO_ACTIVE = true;
const PANEL_COLLAPSED = 0;
const PANEL_EXPANDED = -350;

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
  const [selectedModeId, setSelectedModeId] = useState<'motorbike' | 'car' | 'bicycle'>('car');
  const [panelState, setPanelState] = useState<PanelState>('collapsed');
  const [profileToggle, setProfileToggle] = useState<'personal' | 'business'>('personal');

  // ✅ Added motion value for smooth sliding
  const y = useMotionValue(PANEL_COLLAPSED);

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

  useEffect(() => {
    if (selectedFilter === 'standard') setSelectedModeId('car');
    else if (selectedFilter === 'faster') setSelectedModeId('motorbike');
    else if (selectedFilter === 'cheaper') setSelectedModeId('bicycle');
  }, [selectedFilter]);

  const getSortedModes = (): DeliveryMode[] => {
    let sorted = [...deliveryModes];
    if (selectedFilter === 'faster') sorted.sort((a, b) => parseInt(a.time) - parseInt(b.time));
    else if (selectedFilter === 'cheaper') sorted.sort((a, b) => a.deliveryFee - b.deliveryFee);
    return sorted;
  };

  const sortedModes = getSortedModes();

  // ✅ Updated drag end logic (smooth spring)
  const handlePanelDragEnd = (event: any, info: PanInfo) => {
    const shouldExpand = info.offset.y < -120;
    const finalState: PanelState = shouldExpand ? 'expanded' : 'collapsed';
    const finalY = shouldExpand ? PANEL_EXPANDED : PANEL_COLLAPSED;

    setPanelState(finalState);

    animate(y, finalY, {
      type: 'spring',
      damping: 30,
      stiffness: 260
    });
  };

  const handleClose = () => navigate('/foodies-route');
  const handleAddStop = () => navigate('/foodies-route');
  const handleAddressClick = () => navigate('/foodies-route');

  const handleSelectMode = () => {
    if (selectedMode) {
      setDeliveryMode(selectedMode.id, selectedMode.deliveryFee);
      navigate('/food-confirm-order');
    }
  };

  const handleCashClick = () => console.log('Cash payment clicked');
  const handleScheduleClick = () => console.log('Schedule clicked');

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

      {/* Main Sliding Panel */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20"
        drag="y"
        dragConstraints={{ top: PANEL_EXPANDED, bottom: PANEL_COLLAPSED }}
        dragElastic={0.1}
        onDragEnd={handlePanelDragEnd}
        style={{
          y,
          height: 'calc(100vh - 100px)',
          touchAction: 'pan-x'
        }}
      >

        {PROMO_ACTIVE && (
          <motion.div
            className="bg-indigo-600 text-white w-full px-4 py-3 flex items-center justify-center gap-2 rounded-t-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span>✓</span>
            <span className="font-medium text-sm">{PROMO_TEXT}</span>
            <ChevronDown size={16} />
          </motion.div>
        )}

        <div className="w-full pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing touch-none">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-32 overflow-y-auto flex-1">
          <AnimatePresence>
            {panelState === 'expanded' && (
              <motion.div
                className="flex gap-3 mb-4 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={() => setSelectedFilter('standard')}>Standard</button>
                <button onClick={() => setSelectedFilter('faster')}>⚡ Faster</button>
                <button onClick={() => setSelectedFilter('cheaper')}>💰 Cheaper</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
