import {terms} from "./terms";
import {nav} from "./nav";
import {home} from "./home";
import {listings} from "./listings";
import {auth} from "./auth";
import {footer} from "./footer";
import {sell} from "./sell";
import {profile} from "./profile";
import {collection} from "./collection";

export const translations = {
    "en": {
        ...nav.en,
        ...footer.en,
        ...terms.en,
        ...home.en,
        ...listings.en,
        ...auth.en,
        ...sell.en,
        ...profile.en,
        ...collection.en,

        // Machine details
        viewDetails: "View Details",
        contactSeller: "Contact Seller",
        addToWishlist: "Add to Wishlist",
        removeFromWishlist: "Remove from Wishlist",
        loading: "Loading...",
        error: "Error",
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",
        back: "Back",
    },

    "fr": {
        ...nav.fr,
        ...footer.fr,
        ...terms.fr,
        ...home.fr,
        ...listings.fr,
        ...auth.fr,
        ...sell.fr,
        ...profile.fr,
        ...collection.fr,
        // Machine details
        viewDetails: "Voir Détails",
        contactSeller: "Contacter Vendeur",
        addToWishlist: "Ajouter aux Favoris",
        removeFromWishlist: "Retirer des Favoris",
        // Common
        loading: "Chargement...",
        error: "Erreur",
        save: "Sauvegarder",
        cancel: "Annuler",
        submit: "Soumettre",
        back: "Retour",
    }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
