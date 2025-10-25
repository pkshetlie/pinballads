export type SettingsDto = {
    notification: {
        email: boolean,
        sms: boolean,
        push: boolean,
    },
    searchPreferences: {
        city: string,
        location: string,
        price: string,
    }
}
