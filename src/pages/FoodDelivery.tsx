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

  useEffect(() => {
    if (selectedFilter === 'standard') {
      setSelectedModeId('car');
    } else if (selectedFilter === 'faster') {
      setSelectedModeId('motorbike');
    } else if (selectedFilter === 'cheaper') {
      setSelectedModeId('bicycle');
    }
  }, [selectedFilter]);

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

  const handlePanelDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -120) {
      setPanelState('expanded');
    } else {
      setPanelState('collapsed');
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
      {/* The rest of your JSX remains exactly the same as provided */}
    </div>
  );
}
