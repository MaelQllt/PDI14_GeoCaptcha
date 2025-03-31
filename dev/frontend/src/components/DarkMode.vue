<template>
    <div class="switch-theme-form-group">
    <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
            <div class="fr-toggle">
                <button
                    @click="toggleTheme"
                    class="fr-display-button fr-background-default--grey fr-btn fr-icon-theme-fill fr-btn--secondary fixed-theme-btn"
                    aria-controls="fr-theme-modal" 
                    data-fr-opened="false"
                >
                </button>
            </div>
        </div>
    </fieldset>
    </div>
</template>

<script>
export default {

    methods: {
        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute("data-fr-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-fr-theme", newTheme);
            document.documentElement.style.colorScheme = newTheme;

            localStorage.setItem("scheme", newTheme);
        }
        },
    
    mounted() {
        const themeSystem = "system",
            themeDark = "dark",
            defaultTheme = "dark",
            attrTheme = "data-fr-theme",
            attrScheme = "data-fr-scheme";

        const applyDarkTheme = () => {
            document.documentElement.setAttribute(attrTheme, defaultTheme);
            document.documentElement.style.colorScheme = "dark";
        };

        const checkSystemPreference = () => {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                applyDarkTheme();
            }
        };

        const storedTheme = localStorage.getItem("scheme") || "";
        const currentScheme = document.documentElement.getAttribute(attrScheme);

        switch (true) {
            case storedTheme === themeDark:
                applyDarkTheme();
                break;
            case storedTheme === themeSystem:
                checkSystemPreference();
                break;
            case currentScheme === themeDark:
                applyDarkTheme();
                break;
            case currentScheme === themeSystem:
                checkSystemPreference();
                break;
        }
    }
};
</script>

<style scoped>
.fixed-theme-btn {
    position: fixed;
    right: 30px;      
    bottom: 30px;     
    z-index: 9999; 
    border-radius: 8px; 
    background-color: #f0f0f0; 
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
}
</style>