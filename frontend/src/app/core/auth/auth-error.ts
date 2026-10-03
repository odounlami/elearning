import { HttpErrorResponse } from '@angular/common/http';

type AuthContext = 'login' | 'register';

interface ValidationDetails {
  fieldErrors?: Record<string, string[]>;
  formErrors?: string[];
}

interface ApiErrorBody {
  error?: string;
  details?: ValidationDetails;
}

export function getAuthErrorMessage(error: unknown, context: AuthContext): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
  }

  if (error.status === 0) {
    return 'Impossible de joindre le serveur. Vérifiez que l’API est démarrée puis réessayez.';
  }

  const body = error.error as ApiErrorBody | null | undefined;

  switch (body?.error) {
    case 'INVALID_CREDENTIALS':
      return 'Email ou mot de passe incorrect.';

    case 'EMAIL_ALREADY_EXISTS':
      return 'Cette adresse email est déjà utilisée.';

    case 'INVALID_INPUT':
      return getValidationMessage(body.details, context);

    case 'INTERNAL_SERVER_ERROR':
      return 'Le serveur rencontre un problème. Réessayez dans quelques instants.';

    case 'TOO_MANY_REQUESTS':
      return 'Trop de tentatives. Attendez quelques instants avant de réessayer.';

    default:
      if (error.status === 400) {
        return context === 'register'
          ? 'Les informations saisies sont invalides. Vérifiez les champs.'
          : 'Les informations de connexion sont invalides.';
      }

      if (error.status === 401) {
        return context === 'login'
          ? 'Email ou mot de passe incorrect.'
          : 'Votre session n’est pas autorisée.';
      }

      if (error.status === 409) {
        return 'Cette adresse email est déjà utilisée.';
      }

      if (error.status === 429) {
        return 'Trop de tentatives. Attendez quelques instants avant de réessayer.';
      }

      if (error.status >= 500) {
        return 'Le serveur rencontre un problème. Réessayez dans quelques instants.';
      }

      return 'Une erreur est survenue. Veuillez réessayer.';
  }
}

function getValidationMessage(
  details: ValidationDetails | undefined,
  context: AuthContext,
): string {
  const fieldErrors = details?.fieldErrors ?? {};

  if (fieldErrors.email?.length) {
    return 'Veuillez saisir une adresse email valide.';
  }

  if (fieldErrors.name?.length) {
    return 'Le nom doit contenir au moins 2 caractères.';
  }

  if (fieldErrors.password?.length) {
    return context === 'register'
      ? 'Le mot de passe doit contenir au moins 8 caractères.'
      : 'Veuillez saisir votre mot de passe.';
  }

  if (details?.formErrors?.length) {
    return details.formErrors[0];
  }

  return context === 'register'
    ? 'Vérifiez les informations saisies.'
    : 'Vérifiez votre adresse email et votre mot de passe.';
}
