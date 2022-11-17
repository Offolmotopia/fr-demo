import {defineStore} from 'pinia'
import http from "@/http";

export const useContactsStore = defineStore('contacts', {
    state: () => ({
        contacts: [],
        loading: false,
    }),
    getters: () => ({
       contacts: () => this.contacts
    }),
    actions: {
        initialize() {
            this.loading = true
            return http.contact.getContacts().then((data) => {
                // pinia allows to mutate the store directly
                this.contacts = data
                this.loading = false
            }).catch((err) => {
                console.error(err)
                throw err
            })
        },
        addContact(contact) {
            return http.contact.addContact(contact).then((data) => {
                this.contacts.push(data)
            }).catch((err) => {
                console.error(err)
                throw err
            })
        },
        deleteContact(id) {
            return http.contact.deleteContact(id).then(() => {
                const idx = this.contacts.findIndex((c) => c.id == id)
                this.contacts.splice(idx, 1)
            }).catch((err) => {
                console.error(err)
                throw err
            })
        },
        editContact(id) {
            return http.contact.editContact(id).then((data) => {
                const idx = this.contacts.findIndex(c => c.id == data.id)
                this.contacts.splice(idx, 1, data)
            }).catch((err) => {
                console.error(err)
                throw err
            })
        },
    },
})