import React from 'react';
import { CheckCircle, Package, Clock, MapPin, Truck } from 'lucide-react';

const stages = {
  store_pickup: [
    'order_received',
    'being_prepared', 
    'ready_for_pickup',
    'picked_up'
  ],
  local_delivery: [
    'order_received',
    'being_prepared',
    'out_for_delivery',
    'delivered'
  ],
  extended_bay_area: [
    'order_received',
    'being_prepared',
    'out_for_delivery',
    'delivered'
  ],
  california_shipping: [
    'order_received',
    'being_prepared',
    'shipped',
    'delivered'
  ],
  nationwide: [
    'order_received',
    'being_prepared',
    'shipped',
    'delivered'
  ],
};

const stageLabels = {
  order_received: 'Order Received',
  being_prepared: 'Being Prepared',
  ready_for_pickup: 'Ready for Pickup',
  picked_up: 'Picked Up',
  out_for_delivery: 'Out for Delivery',
  shipped: 'Shipped',
  delivered: 'Delivered'
};

const getStageIcon = (stage: string) => {
    switch (stage) {
        case 'order_received': return <CheckCircle size={20} />;
        case 'being_prepared': return <Package size={20} />;
        case 'ready_for_pickup': return <MapPin size={20} />;
        case 'picked_up': return <CheckCircle size={20} />;
        case 'out_for_delivery': return <Clock size={20} />;
        case 'shipped': return <Truck size={20} />;
        case 'delivered': return <MapPin size={20} />;
        default: return <CheckCircle size={20} />;
    }
}

const mapStatusToStage = (status: string, fulfillmentMethod: string) => {
    // Map backend statuses to simple tracker internal stages
    if (status === 'pending' || status === 'paid') return 'order_received';
    if (status === 'processing') return 'being_prepared';
    if (status === 'fulfilled') {
        if (fulfillmentMethod === 'store_pickup') return 'picked_up';
        return 'delivered';
    }
    return status; // for 'shipped', 'out_for_delivery', 'ready_for_pickup' etc.
};

export const OrderTrackingTimeline = ({ 
  fulfillmentMethod = 'local_delivery', 
  statusHistory = [],
  currentStatus = 'pending',
  trackingNumber = '',
  carrier = ''
}: { 
  fulfillmentMethod?: string, 
  statusHistory: any[],
  currentStatus: string,
  trackingNumber?: string,
  carrier?: string
}) => {
  
  // Use a fallback if fulfillment missing
  const methodStages = stages[fulfillmentMethod as keyof typeof stages] || stages.local_delivery;
  
  const mappedCurrentStage = mapStatusToStage(currentStatus, fulfillmentMethod);
  let currentStageIndex = methodStages.indexOf(mappedCurrentStage);
  
  // If status is fulfilled, push it to the end
  if (currentStatus === 'fulfilled') {
      currentStageIndex = methodStages.length - 1;
  }

  // Handle case where status doesn't exactly match expected stages
  if (currentStageIndex === -1 && statusHistory.length > 0) {
      // Find the furthest stage in history
      const mappedHistory = statusHistory.map(h => mapStatusToStage(h.status, fulfillmentMethod));
      for (let i = methodStages.length - 1; i >= 0; i--) {
          if (mappedHistory.includes(methodStages[i])) {
              currentStageIndex = i;
              break;
          }
      }
      if (currentStageIndex === -1) currentStageIndex = 0;
  } else if (currentStageIndex === -1) {
      currentStageIndex = 0;
  }

  const getHistoryForStage = (stage: string) => {
      // Find the last mention of this stage equivalent
      const historyReversed = [...statusHistory].reverse();
      for (const item of historyReversed) {
          if (mapStatusToStage(item.status, fulfillmentMethod) === stage) {
              return item;
          }
      }
      // Try to map fulfilled depending on endpoint
      if (stage === 'delivered' || stage === 'picked_up') {
          return historyReversed.find(item => item.status === 'fulfilled');
      }
      return null;
  };

  return (
    <div className="py-6 w-full">
      <div className="relative">
        <div className="absolute top-6 left-6 md:top-1/2 md:-translate-y-1/2 md:left-0 h-full w-1 md:w-full md:h-1 bg-[#FDF3DC] rounded-full overflow-hidden">
             {/* Progress bar logic (Desktop horizontal, mobile vertical handled by flex-col below) */}
            <div 
               className="bg-[#C97D0A] h-full md:h-full transition-all duration-1000 ease-in-out hidden md:block" 
               style={{ width: `${(Math.max(0, currentStageIndex) / (methodStages.length - 1)) * 100}%` }}
            ></div>
            <div 
               className="bg-[#C97D0A] w-full transition-all duration-1000 ease-in-out md:hidden block absolute top-0" 
               style={{ height: `${(Math.max(0, currentStageIndex) / (methodStages.length - 1)) * 100}%` }}
            ></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-start gap-8 md:gap-4 px-0 md:px-0 ml-0">
          {methodStages.map((stageItem, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const historyEvent = getHistoryForStage(stageItem);
            
            return (
              <div key={stageItem} className="flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto md:flex-1 relative">
                {/* Connecting line is handled by the absolute bg above */}
                
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm
                    border-4 transition-all duration-500
                    ${isCompleted 
                        ? 'bg-[#C97D0A] text-white border-white' 
                        : 'bg-white text-gray-400 border-gray-100'
                    }
                    ${isCurrent ? 'ring-4 ring-[#C97D0A]/30 relative' : ''}
                `}>
                  {isCurrent && (
                     <div className="absolute w-full h-full rounded-full bg-[#C97D0A]/30 animate-ping"></div>
                  )}
                  {getStageIcon(stageItem)}
                </div>

                <div className="flex flex-col md:items-center text-left md:text-center w-full">
                  <span className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                     {stageLabels[stageItem as keyof typeof stageLabels]}
                  </span>
                  
                  {isCompleted && historyEvent && (
                      <span className="text-xs text-gray-500 mt-1">
                          {new Date(historyEvent.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {' '}·{' '}
                          {new Date(historyEvent.timestamp).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                      </span>
                  )}
                  
                  {!isCompleted && (
                      <span className="text-xs text-transparent select-none mt-1 hidden md:block">0:00</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {trackingNumber && (
          <div className="mt-8 p-4 bg-[#FDF3DC]/50 rounded-xl border border-[#C97D0A]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                 <p className="text-sm font-bold text-gray-900">Shipped with {carrier}</p>
                 <p className="text-sm font-mono text-gray-600 mt-1">Tracking Number: <span className="font-bold">{trackingNumber}</span></p>
              </div>
              <a 
                 href={`https://parcelsapp.com/en/tracking/${trackingNumber}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-[#C97D0A] hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                  Track Package
              </a>
          </div>
      )}
    </div>
  );
};
