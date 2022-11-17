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
        <contact-card
            v-for="c in filteredContacts"
            :key="c.id"
            :firstName='c.firstName'
            :lastName='c.lastName'
            :jobTitle='c.jobTitle'
            :email='c.email'
            :company='c.company'
            :country='c.country'
            :phone='c.phone'
            :id='c.id'
            @show-info="open"
            @remove="removeContact"
            @edit="edit"/>
      </div>
    </div>
  </div>
</template>

<script>
import {faker} from '@faker-js/faker';
import {mapActions, mapState} from "pinia";
import {useContactsStore} from "@/stores/Contacts";
import {VueFinalModal} from 'vue-final-modal'
import Multiselect from 'vue-multiselect'
import {useVuelidate} from '@vuelidate/core'
import {required, email} from '@vuelidate/validators'
import ContactCard from "@/components/ContactCard";

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
  components: {ContactCard, VueFinalModal, Multiselect},
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
    open(payload) {
      payload.ref.classList.toggle('down')
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

.contacts {
  display: flex;
  flex-direction: column;
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

.error {
  font-weight: 700;
  font-size: 12px;
  color: #d50a00;
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
