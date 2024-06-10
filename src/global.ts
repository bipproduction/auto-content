export const globalValue = {
    isRunning: {
        value: false,
        set(value: boolean) {
            this.value = value
        },
        get() {
            return this.value
        }
    }

}