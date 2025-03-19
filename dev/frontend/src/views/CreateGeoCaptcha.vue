<template>
  <div class="generation">
    <h1 class="fr-h1">Créez vos GéoCaptchas</h1>
    <form @submit.prevent="createGeoCaptcha">
      <div class="fr-input-group">
        <!--<label-choix class="fr-label" for="difficulty">Difficulté :</label-choix>
        <select id="difficulty" v-model="difficulty" class="fr-select">
          <option value="easy">Facile</option>
          <option value="medium">Moyenne</option>
          <option value="hard">Difficile</option>
        </select>-->
        <fieldset class="fr-fieldset" id="radio" aria-labelledby="radio-legend radio-messages">
          <label-choix class="fr-fieldset__legend--regular fr-fieldset__legend" id="radio-legend">
            Choix de la zone géographique :
          </label-choix>
          <div class="fr-fieldset__element">
            <div class="fr-radio-group">
              <input value="1" type="radio" id="radio-1" name="radio" @click = "closeDepartement" checked :disabled="isSuccess">
              <label class="fr-label" for="radio-1">
                  Aléatoire
              </label>
            </div>
          </div>
          <div class="fr-fieldset__element">
            <div class="fr-radio-group">
              <input value="2" type="radio" id="radio-2" name="radio" @click ="openDepartement" :disabled="isSuccess">
              <label class="fr-label" for="radio-2">
                  Département
              </label>
            </div>
          </div>
          <div class="fr-messages-group" id="radio-messages" aria-live="polite">
          </div>
        </fieldset>
        <p v-if ="!isDepartement">Le GéoCaptcha sera généré avec une localisation aléatoire en France.</p>
        <p v-if ="isDepartement">Le GéoCaptcha sera généré dans le département de France que vous aurez choisi.</p>
          <select id="departement" v-model="selectedDepartement" class="fr-select" :class="{ hidden: !isDepartement }">
            <option value="" disabled selected>Choisissez votre département</option>
            <option v-for="dept in availableDepartements" :key="dept.numero" :value="dept.nom">
              {{ dept.nom }} ({{ dept.numero }})
            </option>
          </select>

          <div v-if="isSuccess" id="alert-1068" class="fr-alert fr-alert--success">
            <h3 class="fr-alert__title">Succès de la création</h3>
            <p v-if ="isDepartement">{{ successMessage }}</p>
            <p v-else>GéoCaptcha créé avec une localisation aléatoire en France.</p>
          </div> 
          
      </div>
      
      <button type="button" class="fr-btn" @click="openModal">Générer</button>

      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content" @click.stop>
          <div class="fr-container fr-container--fluid fr-container-md">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div class="fr-modal__body">
                  <div class="fr-modal__content">
                    <h1 id="modal-overlay-title" class="fr-modal__title">
                      Vous avez généré ce GéoCaptcha :
                    </h1>
                    <img src="../assets/logo.png" alt="geocaptcha">
                    </div>
                    <div class="fr-modal__footer">
                      <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                        <button type="button" id="button-6047" class="fr-btn fr-icon-checkbox-circle-line fr-btn--icon-left" @click ="handleConserver">Conserver</button>
                        <button type="button" id="button-6048" class="fr-btn" @click="closeModal">Supprimer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      difficulty: 'easy',
      selectedDepartement: "",
      departements: [],
      isModalOpen: false, // Ajout pour gérer l'affichage de la modale
      isDepartement: false,
      isSuccess: false,
      successMessage: "",
    };
  },

  computed: {
    availableDepartements() {
      return this.departements.filter(dept => dept.disponibilite === "Disponible");
    }
  },

  mounted() {
    fetch("http://localhost:3002/departements") 
      .then(response => response.json())
      .then(data => {
        this.departements = data;
      })
      .catch(error => console.error("Erreur lors du chargement des départements:", error));
  },
  
  methods: {
    createGeoCaptcha() {
    this.successMessage = `GéoCaptcha du département ${this.selectedDepartement} créé avec succès!`;
    this.isSuccess = true;
      setTimeout(() => {
      this.isSuccess = false;
      }, 3000);
    },

    openModal() {
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden'
      
    },

    closeModal() {
      this.isModalOpen = false;
      document.body.style.overflow = 'auto';
    },

    openDepartement(){
      this.isDepartement = true;
    },

    closeDepartement(){
      this.isDepartement = false;
    },

    handleConserver() {
      this.closeModal();
      this.createGeoCaptcha();
    }

  }
}
</script>

<style scoped>
.generation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: left;
  margin-left: 8em;
  margin-right: 8em;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.fr-btn {
  margin-top: 20px;
  align-self: center;
  background-color: #7fc04b;
}

.fr-btn:hover {
  background-color: #68a532;
}

.fr-input:focus,
.fr-select:focus {
  outline: 2px solid #7fc04b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}




.fr-modal__content img {
  object-fit: contain;
}
.modal-content {
  padding: 1em;
}


#button-6048 {
  background-color: #f44336;
  color: white;
}

#button-6048:hover {
  background-color: #da190b;
}

label-choix {
  margin-top: 20px;
}

.hidden {
  visibility: hidden;
  opacity: 0;
}

p {
  width: 95%;
}

.fr-input-group {
  min-width: 300px;
  max-width: 500px;
  width: 100%; /* Il prendra toute la place dispo mais restera dans les limites */
}

#alert-1068 {
  margin-top:1em;
}

</style>