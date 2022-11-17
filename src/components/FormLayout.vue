<template>
  <div class="form">
    <vue-final-modal classes="modal-container" content-class="modal-content" v-model="modalVisible">
      <div class="modal__title p-3">
        Add contact
      </div>
      <div class="modal__content p-3">
        <form>
          <div class="mb-3">
            <label for="form__email" class="form-label">Email address</label>
            <input v-model="form.email" type="email" class="form-control"
                   :class="{'is-invalid': v$.form.email.$errors.length}" id="form__email">
            <div class="error" v-if="v$.form.email.$errors.length">field is required</div>
          </div>
          <div class="mb-3">
            <label for="form__name" class="form-label">First name</label>
            <input v-model="form.firstName" class="form-control"
                   :class="{'is-invalid': v$.form.firstName.$errors.length}" id="form__name">
            <div class="error" v-if="v$.form.firstName.$errors.length">field is required</div>
          </div>
          <div class="mb-3">
            <label for="form__lastname" class="form-label">Last name</label>
            <input v-model="form.lastName" class="form-control" :class="{'is-invalid': v$.form.lastName.$errors.length}"
                   id="form__lastname">
            <div class="error" v-if="v$.form.lastName.$errors.length">field is required</div>
          </div>
          <div class="mb-3">
            <label for="form__company" class="form-label">Company</label>
            <input v-model="form.company" class="form-control" :class="{'is-invalid': v$.form.company.$errors.length}"
                   id="form__company">
            <div class="error" v-if="v$.form.company.$errors.length">field is required</div>
          </div>
          <div class="mb-3">
            <label for="form__jobtitle" class="form-label">Job title</label>
            <input v-model="form.jobTitle" class="form-control" :class="{'is-invalid': v$.form.jobTitle.$errors.length}"
                   id="form__jobtitle">
            <div class="error" v-if="v$.form.jobTitle.$errors.length">field is required</div>
          </div>
          <div class="mb-3">
            <label for="form__country" class="form-label">Country</label>
            <multiselect :options="countryOptions" v-model="form.country"
                         :class="{'is-invalid': v$.form.country.$errors.length}"></multiselect>
            <div class="error" v-if="v$.form.country.$errors.length">field is required</div>
          </div>
          <div class="mb-3">
            <label for="form__phone" class="form-label">Phone number</label>
            <input v-model="form.phone" class="form-control" :class="{'is-invalid': v$.form.phone.$errors.length}"
                   id="form__phone">
            <div class="error" v-if="v$.form.phone.$errors.length">field is required</div>
          </div>
        </form>
      </div>
      <div class="modal__footer p-3">
        <div class="button-group">
          <div class="btn btn-primary" @click="save">save</div>
          <div class="btn btn-secondary" @click="modalVisible = false">cancel</div>
        </div>
      </div>
    </vue-final-modal>
    <div class="row pb-3">
      <div class="col">
        <div style="display:flex;justify-content:flex-start;align-items:center;height:100%;font-weight:700;">
          Contacts
        </div>
      </div>
      <div class="col">
        <div style="display:flex;justify-content:flex-end;align-items:center;">
          <div class="btn btn-primary" @click="edit()">Add</div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <input type="text" v-model="search" class="search" placeholder="Start typing name, email or phone number">
    </div>
    <div class="row pb-3">
      {{ filteredContacts.length }} contacts found
    </div>
    <!--  TODO skeleton components while loading  -->
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="row" v-else>
      <div class="contacts">
        <div class="contact" v-for="c in filteredContacts" :key="c.id">
          <div class="contact__data">
            <svg class="contact__collapse bi bi-chevron-right"
                 :ref="'contact-' + c.id"
                 @click="open(c.id)"
                 data-bs-toggle="collapse"
                 :data-bs-target="'#contact-' + c.id"
                 xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            <div class="contact__info">
              <div class="contact__name">{{ c.firstName + ' ' + c.lastName }}</div>
              <div class="contact__position">{{ c.jobTitle }}</div>
              <div class="contact__company">{{ 'at ' + c.company }}</div>

              <div class="collapse" :id="'contact-' + c.id">
                <hr>
                <div class="contact__country">{{ 'location: ' + c.country }}</div>
                <div class="contact__email">{{ c.email }}</div>
                <div class="contact__number">{{ c.phone }}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="contact__controls dropdown" style="position: relative;">
              <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                      aria-expanded="false"></button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a class="dropdown-item" href="#" @click="removeContact(c.id)">delete</a></li>
                <li><a class="dropdown-item" href="#" @click="edit(c.id)">edit</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {faker} from '@faker-js/faker';
import {mapActions, mapState} from "pinia";
import {useContactsStore} from "@/stores/Contacts";
import {VueFinalModal} from 'vue-final-modal'
import Multiselect from 'vue-multiselect'
import {useVuelidate} from '@vuelidate/core'
import {required, email} from '@vuelidate/validators'

export default {
  setup() {
    return {v$: useVuelidate()}
  },
  validations() {
    return {
      form: {
        firstName: {required},
        lastName: {required},
        email: {required, email},
        jobTitle: {required},
        company: {required},
        country: {required},
        phone: {required},
      }
    }
  },
  name: "FormLayout",
  // eslint-disable-next-line vue/no-unused-components
  components: {VueFinalModal, Multiselect},
  data: () => ({
    form: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      email: '',
      company: '',
      country: '',
      phone: '',
    },
    countryOptions: ['Zimbabwe', 'New Zealand', 'Cambodia'],
    editMode: false,
    modalVisible: false,
    openedContacts: [],
    search: '',
  }),
  computed: {
    ...mapState(useContactsStore, ['contacts', 'loading']),
    filteredContacts() {
      const filter = (contact, input) => {
        const lowercaseInput = input.toLowerCase()
        const filteredPhone = contact.phone.replace(/\D/g, '');

        return (contact.firstName.toLowerCase().includes(lowercaseInput)
            || contact.lastName.toLowerCase().includes(lowercaseInput)
            || filteredPhone.includes(input)
            || contact.email.includes(input))
      }
      return this.contacts.filter(c => filter(c, this.search))
    }
  },
  created() {

  },
  methods: {
    ...mapActions(useContactsStore, ['addContact', 'deleteContact', 'editContact']),
    openModal() {
      this.modalVisible = true
    },
    open(id) {
      this.$refs[`contact-${id}`][0].classList.toggle('down')
    },
    async save() {
      const isFormCorrect = await this.v$.$validate()
      if (isFormCorrect) {
        this.modalVisible = false
        if (this.editMode) {
          this.editContact(this.form).then(() => {
            this.$toast.open('Success!');
          })
        } else {
          this.addContact(this.form).then(() => {
            this.$toast.open('Success!');
          })
        }
      } else {
        // TODO not valid
      }
    },
    edit(id) {
      if (id) {
        this.editMode = true
        this.form = {...this.contacts.find(el => el.id == id)}
        console.log(this.form)
      } else {
        this.editMode = false
        this.form = {
          firstName: faker.name.firstName(), // '',
          lastName: faker.name.lastName(), // '',
          email: faker.internet.email(), // '',
          phone: faker.phone.number(), // '',
          jobTitle: faker.name.jobTitle(), // '',
          company: faker.company.name(), // '',
          country: faker.address.country(), // '',
        }
      }
      this.openModal()
    },
    removeContact(id) {
      this.deleteContact(id).then(() => {
        this.$toast.open('Success!');
      })
    },
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>

.form {

}

.contacts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.contact__data {
  display: flex;
  gap: 10px;
}

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: auto;
}

::v-deep .multiselect {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

::v-deep .multiselect__tags {
  border: none;
}

::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.down {
  transform: rotate(90deg);
}

.contact__controls {
  display: flex;
  gap: 16px;
}

.circle {
  border-radius: 50%;
  width: 38px;
  height: 38px;
  padding: 5px;
}

.error {
  font-weight: 700;
  font-size: 12px;
  color: #d50a00;
}

.toast {

}

.modal__footer {
  display: flex;
  justify-content: flex-end;
}

.button-group {
  display: flex;
  gap: 18px;
}
</style>
