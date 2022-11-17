export default function (http) {
    return {
        getContacts() {
            return new Promise((res, rej) => {
                http.get('contacts')
                    .then((data) => {
                        res(data.data)
                    })
                    .catch(err => rej(err))
            });
        },
        addContact(contact) {
            return new Promise((res, rej) => {
                http.post('contacts', contact)
                    .then((data) => {
                        res(data.data)
                    })
                    .catch(err => rej(err))
            });
        },
        deleteContact(id) {
            console.log(id)
            return new Promise((res, rej) => {
                http.delete(`contacts/${id}`)
                    .then((data) => {
                        res(data.data)
                    })
                    .catch(err => rej(err))
            });
        },
        editContact(contact) {
            return new Promise((res, rej) => {
                http.put(`contacts/${contact.id}`, contact)
                    .then((data) => {
                        res(data.data)
                    })
                    .catch(err => rej(err))
            });
        },
    }
}