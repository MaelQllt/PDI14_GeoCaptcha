<template>
  <div class="home">
  <div class="geo-captcha">
    <div class="fr-container fr-container--fluid fr-mb-md-14v">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div class="fr-container fr-background-alt--grey fr-px-md-0 fr-pt-10v fr-pt-md-14v fr-pb-6v fr-pb-md-10v">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-9 fr-col-lg-8"> 
                <label class="fr-label label_param" for="select-hint">
                  <span class="fr-h4">Paramètres de génération</span> 
                  <span class="fr-hint-text">En choisissant Zone Géographique vous pourrez obtenir un GéoCaptcha spécifique à un département.</span>
                </label>
                <fieldset class="fr-segmented">
                  <div class="fr-segmented__elements">
                    <div class="fr-segmented__element">
                      <input value="1" v-model="selectedOption" checked type="radio" id="segmented-2073-2" name="segmented-2073">
                      <label class="fr-icon-road-map-line fr-label" for="segmented-2073-2">
                        Zone Géographique précise
                      </label>
                    </div>
                    <div class="fr-segmented__element">
                      <input value="2" v-model="selectedOption" type="radio" id="segmented-2073-1" name="segmented-2073">
                      <label class="fr-icon-question-line fr-label" for="segmented-2073-1">
                        Aléatoire
                      </label>
                    </div>
                  </div>
                </fieldset>
                <div v-if="selectedOption === '1'">
                  <div class="fr-select-group">
                    <label class="fr-label" for="select">Choix du département:</label>
                    <select class="fr-select" id="select" name="select" v-model="selectedDepartement">
                      <option value="" selected disabled hidden>Sélectionner un département</option>
                      <option v-for="departement in departements" :key="departement.nom" :value="departement.nom">
                        {{ departement.code }} - {{ departement.nom }}
                      </option>
                    </select>
                    <div class="fr-messages-group" id="select-messages" aria-live="polite"></div>
                    <div class="btn_generer"><button @click="openModal_dep" type="button" class="fr-btn">Générer</button></div>   
                  </div>

                  <div v-if="showSuccess" id="alert-1068" class="fr-alert fr-alert--success success_gc">
                    <h3 class="fr-alert__title">Le GéoCaptcha a bien été accepté</h3>
                    <p>Votre action a été enregistrée avec succès.</p>
                  </div>
                  <div v-if="showError" id="alert-1070" class="fr-alert fr-alert--error error_alert">
                    <h4 class="fr-alert__title">Aucun département sélectionné</h4>
                    <p>Veuillez sélectionner un département avant de générer un GéoCaptcha.</p>
                  </div>
                </div>

                <div v-if="showModal_dep" class="modal-overlay">
                  <div class="fr-container fr-container--fluid fr-container-md">
                    <div class="fr-grid-row fr-grid-row--center">
                        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                            <div class="fr-modal__body">
                                <div class="fr-modal__header">
                                    <button @click="closeModal" aria-controls="modal-6053" title="Fermer" type="button" id="button-6054" class="fr-btn--close fr-btn">Fermer</button>
                                </div>
                                <div class="fr-modal__content">
                                    <h1 id="modal-6053-title" class="fr-modal__title">
                                        <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                                        GéoCaptcha généré
                                    </h1>
                                    <p>Voici un GéoCaptcha correspondant à la zone géographique choisi {{ selectedDepartement }}: </p>
                                    <img src="../assets/GeoCaptcha.png" alt="GéoCaptcha" class="geo-img">
                                </div>
                                <div class="fr-modal__footer">
                                    <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                                        <button @click="successAction" type="button" id="button-6047" class="accept-btn fr-btn fr-icon-checkbox-circle-line fr-btn--icon-left">Accepter</button>
                                        <button @click="closeModal" type="button" id="button-6048" class="refuse-btn fr-btn fr-icon-close-circle-line fr-btn--icon-left fr-btn--tertiary">Refuser</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedOption === '2'">
                  <div class="fr-select-group">En cliquant ci-dessous un GéoCaptcha aléatoire vous sera généré automatiquement:</div>
                  <div class="btn_generer"><button @click="openModal_ale" type="button" class="fr-btn">Générer</button></div>    
                  <div v-if="showSuccess_ale" id="alert-1068" class="fr-alert fr-alert--success success_gc">
                    <h3 class="fr-alert__title">Le GéoCaptcha a bien été accepté</h3>
                    <p>Votre action a été enregistrée avec succès.</p>
                  </div>              
                </div>

                <div v-if="showModal_ale" class="modal-overlay_ale">
                  <div class="fr-container fr-container--fluid fr-container-md">
                    <div class="fr-grid-row fr-grid-row--center">
                        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                            <div class="fr-modal__body">
                                <div class="fr-modal__header">
                                    <button @click="closeModal" aria-controls="modal-6053" title="Fermer" type="button" id="button-6054" class="fr-btn--close fr-btn">Fermer</button>
                                </div>
                                <div class="fr-modal__content">
                                    <h1 id="modal-6053-title" class="fr-modal__title">
                                        <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                                        GéoCaptcha généré
                                    </h1>
                                    <p>Voici un GéoCaptcha généré aléatoirement: </p>
                                    <img src="../assets/GeoCaptcha.png" alt="GéoCaptcha" class="geo-img">
                                </div>
                                <div class="fr-modal__footer">
                                    <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                                        <button @click="successAction_ale" type="button" id="button-6047" class="accept-btn fr-btn fr-icon-checkbox-circle-line fr-btn--icon-left">Accepter</button>
                                        <button @click="closeModal" type="button" id="button-6048" class="refuse-btn fr-btn fr-icon-close-circle-line fr-btn--icon-left fr-btn--tertiary">Refuser</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div>
  </div>
</div>
</template>

<script>

import axios from "axios";

export default {
  data() {
    return {
      selectedOption: "1",
      selectedDepartement: "",
      departements: [], 
      showModal_dep: false,
      showModal_ale: false,
      showError: false, 
      showSuccess: false,
      showSuccess_ale: false,
    };
  },

  mounted() {
    this.fetchDepartements();
  },

  methods: {

    async fetchDepartements() {
      try {
        const response = await axios.get("https://geo.api.gouv.fr/departements");
        this.departements = response.data; 
      } catch (error) {
        console.error("Erreur lors de la récupération des départements :", error);
      }
    },

    openModal_dep() {
      if (this.selectedDepartement) {
        this.showModal_dep = true; 
        this.showError = false;
      } else {
        this.showError = true;
      }
    },

    openModal_ale() {
        this.showModal_ale = true; 
    },

    closeModal() {
      this.showModal_dep = false;
      this.showModal_ale = false;
    },

    successAction() {
      this.showSuccess = true;
      setTimeout(() => {
      this.showSuccess = false;
      }, 3000);
    this.showModal_dep = false;
    this.showModal_ale = false;
    },

  successAction_ale() {
    this.showSuccess_ale = true; 
    this.showModal_dep = false;
    this.showModal_ale = false;
  },

  }
}
</script>

<style scoped>

.home {
  margin-top: 170px;
}
.fr-h1 {
  margin-top: 30px;
  text-align: center;
}

.label_param{
  text-align: center;
  margin-bottom: 20px;
}

.fr-select-group {
  margin-top: 20px;
}

.btn_generer {
  text-align: right;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* S'assurer que la modale est au-dessus des autres éléments */
}

.modal-overlay_ale {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* S'assurer que la modale est au-dessus des autres éléments */
}

.error_alert {
  margin-top: 20px;
}

.success_gc{
  margin-top: 20px;
}
.geo-img{
  display: block;
  margin: 0 auto;
}

.accept-btn{
  outline: 2px solid rgb(0,0,145);
}

.accept-btn:hover{
  outline: 2px solid rgb(18,18,255);
}

.refuse-btn{
  color: rgb(225,0,15);
  outline: 2px solid rgb(225,0,15);
}

.refuse-btn{
  color: rgb(255,41,47);
  outline: 2px solid rgb(255,41,47);
}


</style>