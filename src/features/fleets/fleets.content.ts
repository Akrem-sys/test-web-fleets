import { t, type Dictionary } from "intlayer";

/** Fleets page dictionary — locales are declared per leaf via t({ en, fr }). */
const fleetsContent = {
	key: "fleets",
	content: {
		createButton: t({
			en: "Create a fleet",
			fr: "Créer une flotte",
		}),
		companiesWord: t({
			en: "companies",
			fr: "entreprises",
		}),
		cardMenuAriaLabel: t({
			en: "Fleet settings",
			fr: "Réglages de la flotte",
		}),
		emptyDescription: t({
			en: "Add a description in the fleet settings",
			fr: "Renseignez une description dans les paramètres de la flotte",
		}),
		loadingMore: t({
			en: "Loading more fleets",
			fr: "Chargement de flottes supplémentaires",
		}),
	},
} satisfies Dictionary;

export default fleetsContent;
