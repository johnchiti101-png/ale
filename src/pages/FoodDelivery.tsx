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
    stops,
  } = useFoodOrderSession();

  const [selectedFilter, setSelectedFilter] =
    useState<FilterTab>('standard');
  const [selectedModeId, setSelectedModeId] =
    useState<'motorbike' | 'car' | 'bicycle'>('car');
  const [panelState, setPanelState] =
    useState<PanelState>('collapsed');
  const [profileToggle, setProfileToggle] =
    useState<'personal' | 'business'>('personal');

  const deliveryModes: DeliveryMode[] = [
    {
      id: 'motorbike',
      label: 'Motorbike',
      time: '2 min',
      description: 'Fast delivery',
      deliveryFee: 40,
      icon: '🏍️',
    },
    {
      id: 'car',
      label: 'Car',
      time: '20 min',
      description: 'Standard delivery',
      deliveryFee: 60,
      icon: '🚗',
    },
    {
      id: 'bicycle',
      label: 'Bicycle',
      time: '20 min',
      description: 'Eco-friendly delivery',
      deliveryFee: 25,
      icon: '🚴',
    },
  ];

  const currentLocationFoods = getCurrentLocationFoods();
  const totalItemCount = currentLocationFoods.length;

  const foodSubtotal = currentLocationFoods.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const selectedMode = deliveryModes.find(
    (m) => m.id === selectedModeId
  );

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
    const sorted = [...deliveryModes];

    if (selectedFilter === 'faster') {
      sorted.sort(
        (a, b) => parseInt(a.time) - parseInt(b.time)
      );
    } else if (selectedFilter === 'cheaper') {
      sorted.sort(
        (a, b) => a.deliveryFee - b.deliveryFee
      );
    }

    return sorted;
  };

  const sortedModes = getSortedModes();

  const handlePanelDragEnd = (
    event: any,
    info: PanInfo
  ) => {
    if (info.offset.y < -120) {
      setPanelState('expanded');
    } else {
      setPanelState('collapsed');
    }
  };

  const handleClose = () => navigate('/foodies-route');
  const handleAddStop = () => navigate('/foodies-route');
  const handleAddressClick = () => navigate('/foodies-route');

  const handleSelectMode = () => {
    if (selectedMode) {
      setDeliveryMode(
        selectedMode.id,
        selectedMode.deliveryFee
      );
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
    const mainAddress =
      deliveryLocation || 'Current Location';

    const stopsText =
      stops.length > 0
        ? ` +${stops.length} stop${
            stops.length > 1 ? 's' : ''
          }`
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
              <pattern
                id="map-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#map-grid)"
            />
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
    </div>
  );
}
