import { t, type Dictionary } from "intlayer";

/** Fleet creation dictionary — locales are declared per leaf via t({ en, fr }). */
const fleetCreationContent = {
	key: "fleet-creation",
	content: {
		returnLabel: t({
			en: "Return",
			fr: "Retour",
		}),
		helpLabel: t({
			en: "Help",
			fr: "Aide",
		}),
		breadcrumbRoot: t({
			en: "Your directory",
			fr: "Votre répertoire",
		}),
		breadcrumbAriaLabel: t({
			en: "Breadcrumb",
			fr: "Fil d'ariane",
		}),
		breadcrumbFallback: t({
			en: "Untitled",
			fr: "Sans titre",
		}),
		previewTypeLabel: t({
			en: "Fleet",
			fr: "Flotte",
		}),
		previewTitlePlaceholder: t({
			en: "Title",
			fr: "Titre",
		}),
		previewDescriptionPlaceholder: t({
			en: "Description",
			fr: "Description",
		}),
		heading: t({
			en: "Create your fleet",
			fr: "Créez votre flotte",
		}),
		subtitle: t({
			en: "Start by defining the profile of your future fleet",
			fr: "Commencez par définir le profil de votre future flotte",
		}),
		nameLabel: t({
			en: "Fleet name",
			fr: "Nom de la flotte",
		}),
		namePlaceholder: t({
			en: "Enter a name",
			fr: "Renseignez un nom",
		}),
		colorLabel: t({
			en: "Color",
			fr: "Couleur",
		}),
		colorAriaLabel: t({
			en: "Select the fleet color",
			fr: "Sélectionner la couleur de la flotte",
		}),
		descriptionLabel: t({
			en: "Description",
			fr: "Description",
		}),
		descriptionPlaceholder: t({
			en: "Enter a description of the fleet",
			fr: "Inscrivez une description sur le sujet de la flotte",
		}),
		cancel: t({
			en: "Cancel",
			fr: "Annuler",
		}),
		submit: t({
			en: "Create a fleet",
			fr: "Créer la flotte",
		}),
		/** Validation feedback — mapped 1:1 from the zodResolver/server errors. */
		errors: {
			titleRequired: t({
				en: "Title is required",
				fr: "Le titre est requis",
			}),
			titleTooLong: t({
				en: "100 characters or fewer",
				fr: "100 caractères maximum",
			}),
			descriptionTooLong: t({
				en: "160 characters or fewer",
				fr: "160 caractères maximum",
			}),
			colorInvalid: t({
				en: "Invalid color",
				fr: "Couleur invalide",
			}),
			submitFailed: t({
				en: "Creation failed, please try again",
				fr: "La création a échoué, réessayez",
			}),
		},
	},
} satisfies Dictionary;

export default fleetCreationContent;
