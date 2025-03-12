<template>
  <div class="home">
    <h1 class="fr-h1">Bienvenue sur l'interface administrateur du GéoCaptcha</h1>
  </div>
  <main role="main" id="content">
    <div class="fr-container fr-container--fluid fr-mb-md-14v">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div class="fr-container fr-background-alt--grey fr-px-md-0 fr-pt-10v fr-pt-md-14v fr-pb-6v fr-pb-md-10v">
                    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                        <div class="fr-col-12 fr-col-md-9 fr-col-lg-8">
                            <h1 class="fr-h4">Connexion à Captchadmin Géo</h1>
                            <div>
                                <form id="login-8714">
                                    <fieldset class="fr-fieldset" id="login-8714-fieldset" aria-labelledby="login-8714-fieldset-legend login-8714-fieldset-messages">
                                        <div class="fr-fieldset__element">
                                            <fieldset class="fr-mb-n4v fr-fieldset" id="credentials" aria-labelledby="credentials-legend credentials-messages">
                                                <legend class="fr-sr-only" id="credentials-legend">
                                                    identifiants
                                                </legend>
                                                <div class="fr-fieldset__element">
                                                    <div class="fr-input-group" id="input-group-8716">
                                                        <label class="fr-label" for="username-8711">
                                                            Identifiant
                                                            <span class="fr-hint-text">Format attendu : nom@domaine.fr</span>
                                                        </label>
                                                        <input class="fr-input" autocomplete="username" aria-required="true" autocapitalize="off" autocorrect="off" aria-describedby="username-8711-messages" name="username" id="username-8711" type="text">
                                                        <div class="fr-messages-group" id="username-8711-messages" aria-live="polite">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="fr-fieldset__element">
                                                    <div class="fr-password" id="password-8712">
                                                        <label class="fr-password__label fr-label" for="password-8712-input">
                                                            Mot de passe
                                                        </label>
                                                        <div class="fr-input-wrap">
                                                            <input class="fr-password__input fr-input" autocapitalize="off" autocorrect="off" aria-describedby="password-8712-input-messages" aria-required="true" name="password" autocomplete="current-password" id="password-8712-input" type="password">
                                                        </div>
                                                        <div class="fr-messages-group" id="password-8712-input-messages" aria-live="polite">
                                                        </div>
                                                        <div class="fr-password__checkbox fr-checkbox-group fr-checkbox-group--sm">
                                                            <input aria-label="Afficher le mot de passe" id="password-8712-show" type="checkbox">
                                                            <label class="fr--password__checkbox fr-label" for="password-8712-show">
                                                                Afficher
                                                            </label>
                                                        </div>
                                                        <p>
                                                            <a href="[À MODIFIER - url de la page de récupération]" class="fr-link">Mot de passe oublié ?</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="fr-messages-group" id="credentials-messages" aria-live="polite">
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div class="fr-fieldset__element">
                                            <div class="fr-checkbox-group fr-checkbox-group--sm">
                                                <input name="remember" id="remember-8713" type="checkbox" aria-describedby="remember-8713-messages">
                                                <label class="fr-label" for="remember-8713">
                                                    Se souvenir de moi
                                                </label>
                                                <div class="fr-messages-group" id="remember-8713-messages" aria-live="polite">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fr-fieldset__element">
                                            <ul class="fr-btns-group">
                                                <li>
                                                    <button type="button" class="fr-mt-2v fr-btn">Se connecter</button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="fr-messages-group" id="login-8714-fieldset-messages" aria-live="polite">
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
</template>

<script>
export default {
  name: 'ConnexionAdmin',
}
</script>

<style scoped>
.fr-h1 {
  margin-top: 30px;
  text-align: center;
}
</style>
