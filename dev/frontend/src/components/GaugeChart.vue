<template>
  <div class="gauge-container">
    <!-- Conteneur de la jauge -->
    <svg width="150" height="100" viewBox="0 0 200 130">
      <!-- Arc de fond (demi-cercle) -->
      <path
        d="M20 100 A 80 80 0 0 1 180 100"
        stroke="#EEEEEE"
        stroke-width="12"
        fill="none"
      />

      <!-- Arc coloré avec couleur dynamique -->
      <path
        d="M20 100 A 80 80 0 0 1 180 100"
        :stroke="gaugeColor"
        stroke-width="12"
        fill="none"
        :stroke-dasharray="dashArray"
      />

      <!-- Valeur minimale (0) -->
      <text x="15" y="120" font-size="12" fill="#666666">{{ min }}</text>

      <!-- Valeur maximale (100) -->
      <text x="170" y="120" font-size="12" fill="#666666">{{ max }}</text>

      <!-- Valeur actuelle au centre avec couleur dynamique -->
      <text
        class="show-value"
        x="100"
        y="100"
        font-size="24"
        :fill="gaugeColor"
        text-anchor="middle"
        font-weight="bold"
      >
        {{ value }}
      </text>
    </svg>

    <!-- Label de la jauge -->
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
      // Calcule la longueur de l'arc visible en fonction de la valeur actuelle
      const range = this.max - this.min;
      const percentage = Math.min(Math.max((this.value - this.min) / range, 0), 1);

      // Calcule la longueur totale de l'arc (π × rayon)
      const fullArcLength = Math.PI * 80;

      // Calcule la longueur visible en fonction du pourcentage
      const visibleLength = percentage * fullArcLength;

      // Retourne la valeur de stroke-dasharray : longueur visible suivie de la longueur totale
      return `${visibleLength} ${fullArcLength}`;
    },
    gaugeColor() {
      // Définit la couleur de la jauge en fonction de la valeur actuelle
      const value = this.value;

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
};
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
