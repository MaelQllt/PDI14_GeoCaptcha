<template>
    <div class="gauge-container">
      <svg width="150" height="100" viewBox="0 0 200 130">
        <!-- Background arc (semi-circle) -->
        <path
          d="M20 100 A 80 80 0 0 1 180 100"
          stroke="#EEEEEE"
          stroke-width="12"
          fill="none"
        />
        
        <!-- Colored arc with dynamic color -->
        <path
          d="M20 100 A 80 80 0 0 1 180 100"
          :stroke="gaugeColor"
          stroke-width="12"
          fill="none"
          :stroke-dasharray="dashArray"
        />
        
        <!-- Min value (0) -->
        <text x="15" y="120" font-size="12" fill="#666666">{{ min }}</text>
        
        <!-- Max value (100) -->
        <text x="170" y="120" font-size="12" fill="#666666">{{ max }}</text>
        
        <!-- Current value in the middle with dynamic color -->
        <text class="show-value" x="100" y="100" font-size="24" :fill="gaugeColor" text-anchor="middle" font-weight="bold">{{ value }}</text>
      </svg>
      <div class="gauge-label">{{ label }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GaugeChart',
    props: {
      value: {
        type: Number,
        default: 59
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      label: {
        type: String,
        default: 'OT a notifier'
      }
    },
    computed: {
      dashArray() {
        const range = this.max - this.min;
        const percentage = Math.min(Math.max((this.value - this.min) / range, 0), 1);
        
        // Calculate full arc length (π × radius)
        const fullArcLength = Math.PI * 80;
        
        // Calculate visible length based on percentage
        const visibleLength = percentage * fullArcLength;
        
        // Return stroke-dasharray value: visible length followed by the full length
        return `${visibleLength} ${fullArcLength}`;
      },
      gaugeColor() {
        const value = this.value;
        
        // Définir les plages de couleurs
        if (value < 60) {
          return `rgb(255, 0, 0)`;
        } else if (value < 75) {
          return `rgb(255, 140, 0)`;
        } else if (value < 85) {
          return `rgb(255, 200, 0)`;
        } else {
          return `rgb(73, 204, 144)`;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .gauge-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    font-family: Arial, sans-serif;
  }
  
  .gauge-label {
    margin-top: 5px;
    color: #666666;
    font-size: 14px;
  }

  .show-value {
    font-size: 50px;
    font-weight: bold;
  }
  </style>