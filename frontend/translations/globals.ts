import {terms} from "./terms";
import {nav} from "./nav";
import {home} from "./home";
import {listings} from "./listings";
import {auth} from "./auth";
import {footer} from "./footer";
import {sell} from "./sell";
import {profile} from "./profile";
import {collection} from "./collection";
import {toasts} from "./toasts";
import {privacyPolicy} from "@/translations/privacy_policy";

export const translations = {
    'en': {
        beta: {
            welcome: 'Welcome to the beta version of Crazy Pinball!',
            description1: 'Thank you for trying out our beta version. We appreciate your help in making this platform better.',
            description2: 'If you encounter any bugs or issues, please report them through:',
            gotIt: 'Got it',
        },
        ...nav.en,
        ...footer.en,
        ...toasts.en,
        ...terms.en,
        ...home.en,
        ...listings.en,
        ...auth.en,
        ...sell.en,
        ...profile.en,
        ...collection.en,
        ...privacyPolicy.en,

        // Machine details
        viewDetails: "View Details",
        contactSeller: "Contact Seller",
        addToWishlist: "Add to Wishlist",
        removeFromWishlist: "Remove from Wishlist",
        loading: "Loading...",
        error: "Error",
        save: "Save",
        viewAll: "View All",
        update: 'Update',
        cancel: "Cancel",
        submit: "Submit",
        back: "Back",
    },

    'fr': {
        beta: {
            welcome: 'Bienvenue dans la version bêta de Crazy Pinball !',
            description1: 'Merci d\'essayer notre version bêta. Nous apprécions votre aide pour améliorer cette plateforme.' ,
                description2:'Si vous rencontrez des bugs ou des problèmes, veuillez les signaler via:',

            gotIt: 'Compris',
        },
        ...nav.fr,
        ...footer.fr,
        ...toasts.en,
        ...terms.fr,
        ...home.fr,
        ...listings.fr,
        ...auth.fr,
        ...sell.fr,
        ...profile.fr,
        ...collection.fr,
        ...privacyPolicy.fr,
        // Machine details
        viewDetails: "Voir Détails",
        contactSeller: "Contacter Vendeur",
        addToWishlist: "Ajouter aux Favoris",
        removeFromWishlist: "Retirer des Favoris",
        // Common
        loading: "Chargement...",
        error: "Erreur",
        save: "Sauvegarder",
        viewAll: "Voir tout",
        cancel: "Annuler",
        submit: "Soumettre",
        back: "Retour",
        update: 'Mettre à jour'
    }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.fr
