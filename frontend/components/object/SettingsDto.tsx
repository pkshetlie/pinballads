import {QueryLocationResult} from "@/components/object/QueryLocationResult";

export type SettingsDto = {
    bio: string|null,
    currency:string|null
    defaultSearchDistance:number|null
    defaultSearchLocation: QueryLocationResult|null
    isEmailMessageNotificationAllowed:boolean
    isEmailNewsletterNotificationAllowed:boolean
    isEmailNotificationAllowed:boolean
    isPublicProfile:boolean
    language: string|null
    theme: string|null
}
