<template>
  <footer class="footer">
    <!-- Partie haute : Nous contacter et accès rapide Git -->
    <section class="footer-top">
      <div class="fr-container">
        <div class="footer-contact">
          <!-- Titre "Nous contacter" -->
          <h2 class="footer-title">Nous contacter</h2>

          <!-- Phrase sous le titre -->
          <p class="footer-text">
            Pour toute question ou demande d'information, vous pouvez contacter les personnes suivantes :
          </p>

          <!-- Les adresses mails sur la même ligne -->
          <div class="contact-list">
            <a href="mailto:clement.rathana@ensg.eu">clement.rathana@ensg.eu</a>
            <a href="mailto:ibrahima.fofana@ensg.eu">ibrahima.fofana@ensg.eu</a>
            <a href="mailto:diego.posado-banuls@ensg.eu">diego.posado-banuls@ensg.eu</a>
            <a href="mailto:mael.quillat@ensg.eu">mael.quillat@ensg.eu</a>
          </div>

          <!-- Lien d'accès rapide vers le GitHub -->
          <p class="footer-text">
            Accès rapide : 
            <a href="https://github.com/MaelQllt/PDI14_GeoCaptcha" target="_blank" rel="noopener noreferrer">GitHub du projet</a>
          </p>
        </div>
      </div>
    </section>

    <!-- Partie basse : Logos -->
    <section class="footer-bottom">
      <div class="fr-container logos">
        <!-- Logo République Française avec DSFR -->
        <div class="fr-logo">
          <République Française class="footer-logo" />
        </div>
        <!-- Logo de l'IGN -->
        <img src="@/assets/IGN.png" alt="Logo de l'IGN" class="footer-logo" />
        <!-- Logo de l'école -->
        <img src="@/assets/ENSG.png" alt="Logo de l'école" class="footer-logo" />
      </div>
    </section>
  </footer>
</template>

<script setup>
// Aucun script nécessaire ici
</script>

<style scoped>
/* Style général du footer */
.footer {
  background-color: #f5f5f5;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/* Partie haute du footer */
.footer-top {
  text-align: center;
  margin-bottom: 2rem;
}

/* Colonne "Nous contacter" */
.footer-contact {
  max-width: 800px;
  margin: 0 auto;
}

/* Titre "Nous contacter" */
.footer-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

/* Texte sous le titre */
.footer-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

/* Adresses mails sur la même ligne avec possibilité de wrap */
.contact-list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap; /* Permet le retour à la ligne si nécessaire */
}

.contact-list a {
  text-decoration: none;
  color: #90c149;
}

.contact-list a:hover {
  text-decoration: underline;
}

/* Partie basse du footer */
.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logos {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}

.footer-logo {
  width: 80px; /* Ajuste la taille des logos */
  height: auto;
  max-width: 100%;
}
</style>
